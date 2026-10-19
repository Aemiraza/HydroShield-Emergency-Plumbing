/**
 * HydroShield 24/7 Emergency Plumbing - Interactive Application Logic
 * High-Trust, High-Conversion Dallas Emergency Service Experience
 */

document.addEventListener('DOMContentLoaded', () => {
  initUrgencySelector();
  initIssueChips();
  initPhoneFormatter();
  initQuoteForm();
  initFaqAccordion();
  initReviewFilters();
  initTriageModal();
  initLiveDispatchActivity();
  initNavScroll();
  initServiceCardButtons();
});

/* --------------------------------------------------------------------------
   1. Urgency Level Selector
   -------------------------------------------------------------------------- */
function initUrgencySelector() {
  const urgencyButtons = document.querySelectorAll('.urgency-btn');
  const urgencyInput = document.getElementById('urgency-level');
  const etaText = document.getElementById('calc-eta');

  if (!urgencyButtons.length) return;

  urgencyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      urgencyButtons.forEach(b => {
        b.classList.remove('selected');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('selected');
      btn.setAttribute('aria-checked', 'true');

      const level = btn.getAttribute('data-level');
      if (urgencyInput) urgencyInput.value = level;

      // Update dynamic arrival time estimate
      if (etaText) {
        if (level === 'emergency') {
          etaText.textContent = '18 - 30 Minutes (Immediate Dispatch)';
          etaText.style.color = '#ef4444';
        } else if (level === 'urgent') {
          etaText.textContent = 'Within 1 - 2 Hours';
          etaText.style.color = '#f59e0b';
        } else {
          etaText.textContent = 'Today (Flexible Window)';
          etaText.style.color = '#0284c7';
        }
      }
    });
  });
}

/* --------------------------------------------------------------------------
   2. Issue Quick-Select Chips
   -------------------------------------------------------------------------- */
function initIssueChips() {
  const chips = document.querySelectorAll('.issue-chip');
  const issueInput = document.getElementById('issue-description');

  if (!chips.length || !issueInput) return;

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('active');
      const activeChips = Array.from(document.querySelectorAll('.issue-chip.active'))
        .map(c => c.getAttribute('data-issue'));

      if (activeChips.length > 0) {
        const prefix = 'Issues selected: ' + activeChips.join(', ');
        const existingCustom = issueInput.value.replace(/Issues selected: [^.\n]+(\.\s*)?/i, '').trim();
        issueInput.value = existingCustom ? `${prefix}. ${existingCustom}` : prefix;
      }
    });
  });
}

/* --------------------------------------------------------------------------
   3. Phone Number Auto-Formatter (US Format)
   -------------------------------------------------------------------------- */
function initPhoneFormatter() {
  const phoneInputs = document.querySelectorAll('input[type="tel"]');

  phoneInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      const cleaned = e.target.value.replace(/\D/g, '').substring(0, 10);
      const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
      if (match) {
        let formatted = '';
        if (match[1]) formatted = `(${match[1]}`;
        if (match[1].length === 3) formatted += ') ';
        if (match[2]) formatted += match[2];
        if (match[2].length === 3) formatted += '-';
        if (match[3]) formatted += match[3];
        e.target.value = formatted;
      }
    });
  });
}

/* --------------------------------------------------------------------------
   4. Instant Quote & Rapid Dispatch Form Submission Simulation
   -------------------------------------------------------------------------- */
function initQuoteForm() {
  const form = document.getElementById('emergency-dispatch-form');
  const modal = document.getElementById('dispatch-modal');

  if (!form || !modal) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('cust-name').value.trim();
    const phone = document.getElementById('cust-phone').value.trim();
    const address = document.getElementById('cust-address').value.trim();
    const issue = document.getElementById('issue-description').value.trim() || 'Plumbing Emergency';

    const rawDigits = phone.replace(/\D/g, '');
    if (rawDigits.length < 10) {
      alert('Please enter a valid 10-digit emergency contact phone number.');
      document.getElementById('cust-phone').focus();
      return;
    }

    if (!address) {
      alert('Please provide your Dallas/DFW service address so our mobile unit can calculate ETA.');
      document.getElementById('cust-address').focus();
      return;
    }

    // Trigger simulation modal
    showDispatchSimulation(name, phone, address, issue);
  });
}

function showDispatchSimulation(name, phone, address, issue) {
  const modal = document.getElementById('dispatch-modal');
  const modalBody = document.getElementById('dispatch-modal-content');
  if (!modal || !modalBody) return;

  modal.classList.add('active');

  // Step 1: Matching Animation
  modalBody.innerHTML = `
    <div class="dispatch-sim-box">
      <div class="dispatch-radar">
        <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
      </div>
      <h3 style="font-size:1.35rem; font-weight:800; color:#0f172a; margin-bottom:0.5rem;">Connecting to DFW Dispatch Grid...</h3>
      <p style="font-size:0.9rem; color:#64748b; margin-bottom:1rem;">Locating nearest master plumber van with parts for <strong>${issue}</strong>.</p>
      <div style="background:#f1f5f9; height:8px; border-radius:99px; overflow:hidden; width:80%; margin:0 auto 1.5rem;">
        <div id="sim-progress-bar" style="background:#ef4444; height:100%; width:15%; transition:width 1.2s ease;"></div>
      </div>
    </div>
  `;

  const bar = document.getElementById('sim-progress-bar');
  setTimeout(() => { if (bar) bar.style.width = '65%'; }, 400);

  // Step 2: Confirmed Match (after 1.6s)
  setTimeout(() => {
    modalBody.innerHTML = `
      <div style="text-align:center; padding:1rem 0;">
        <div style="width:68px; height:68px; background:#dcfce7; border:2px solid #22c55e; border-radius:50%; margin:0 auto 1rem; display:flex; align-items:center; justify-content:center; color:#16a34a;">
          <svg style="width:36px; height:36px; fill:currentColor;" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
        </div>
        <h3 style="font-size:1.45rem; font-weight:800; color:#0f172a; margin-bottom:0.35rem;">Emergency Unit Dispatched!</h3>
        <p style="font-size:0.92rem; color:#334155; margin-bottom:1.5rem;">Priority ticket generated for <strong>${name || 'Resident'}</strong> at <strong>${address}</strong>.</p>
        
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:1.25rem; text-align:left; margin-bottom:1.5rem; display:flex; gap:1rem; align-items:center;">
          <img src="assets/images/master-plumber.jpg" alt="Assigned Plumber" width="64" height="64" style="width:64px; height:64px; border-radius:50%; object-fit:cover; border:2px solid #0284c7; flex-shrink:0;">
          <div>
            <div style="display:inline-block; background:#dcfce7; color:#16a34a; font-size:0.72rem; font-weight:800; padding:2px 8px; border-radius:99px; margin-bottom:4px;">DISPATCH EN ROUTE</div>
            <h4 style="font-size:1.05rem; font-weight:800; color:#0f172a;">Tech Mateo R. (Master Plumber)</h4>
            <p style="font-size:0.82rem; color:#64748b;">Van #07 • TX Lic #M-41982 • ETA: <strong style="color:#dc2626;">~22 Minutes</strong></p>
          </div>
        </div>

        <div style="background:#fff1f2; border:1px solid #fecdd3; border-radius:10px; padding:1rem; text-align:left; font-size:0.86rem; color:#9f1239; margin-bottom:1.25rem;">
          <strong>📞 Live Dispatcher Confirmation:</strong><br>
          Our head dispatcher is phoning <strong>${phone}</strong> within 60 seconds to confirm gate codes and give you exact live GPS tracking.
        </div>

        <a href="tel:+15558492900" style="display:block; width:100%; background:#dc2626; color:#ffffff; font-weight:800; padding:0.95rem; border-radius:10px; text-decoration:none; font-size:1.1rem; box-shadow:0 8px 20px rgba(220,38,38,0.35);">
          CALL DISPATCH DIRECT: (555) 849-2900
        </a>

        <button type="button" class="btn-dismiss-modal" id="close-sim-btn">
          Got It, Close Window
        </button>
      </div>
    `;

    // Attach handler to dismiss button inside modal
    const closeBtn = document.getElementById('close-sim-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
      });
    }
  }, 1600);
}

/* --------------------------------------------------------------------------
   5. Emergency Triage Modal (Water Shut-Off Guide)
   -------------------------------------------------------------------------- */
function initTriageModal() {
  const triageBtn = document.getElementById('open-triage-modal');
  const modal = document.getElementById('triage-modal');
  const closeBtns = document.querySelectorAll('.close-modal-trigger');

  if (triageBtn && modal) {
    triageBtn.addEventListener('click', () => {
      modal.classList.add('active');
    });
  }

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    });
  });

  // Close on outside overlay click
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      e.target.classList.remove('active');
    }
  });

  // Close on ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    }
  });
}

/* --------------------------------------------------------------------------
   6. FAQ Accordion Toggle
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');

  items.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      items.forEach(i => {
        i.classList.remove('active');
        const btn = i.querySelector('.faq-question');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   7. Customer Review Filter Tabs
   -------------------------------------------------------------------------- */
function initReviewFilters() {
  const filterPills = document.querySelectorAll('.review-pill');
  const reviewCards = document.querySelectorAll('.review-card');

  if (!filterPills.length || !reviewCards.length) return;

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => {
        p.classList.remove('active');
        p.setAttribute('aria-selected', 'false');
      });
      pill.classList.add('active');
      pill.setAttribute('aria-selected', 'true');

      const filter = pill.getAttribute('data-filter');

      reviewCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   8. Live Dispatch Activity Simulation Ticker
   -------------------------------------------------------------------------- */
function initLiveDispatchActivity() {
  const statusElement = document.getElementById('live-recent-dispatch');
  if (!statusElement) return;

  const mockDispatches = [
    { city: 'Preston Hollow, Dallas', tech: 'Mateo R.', issue: 'Burst Pipe', mins: 4 },
    { city: 'Lakewood, Dallas', tech: 'Marcus T.', issue: 'Water Heater Failure', mins: 11 },
    { city: 'Plano, TX', tech: 'David S.', issue: 'Main Line Sewer Backup', mins: 18 },
    { city: 'Highland Park, Dallas', tech: 'Mateo R.', issue: 'Slab Leak Diagnostic', mins: 25 },
    { city: 'Uptown Dallas', tech: 'Marcus T.', issue: 'Emergency Drain Jetting', mins: 32 }
  ];

  let currentIndex = 0;

  setInterval(() => {
    currentIndex = (currentIndex + 1) % mockDispatches.length;
    const item = mockDispatches[currentIndex];
    statusElement.style.opacity = '0';
    setTimeout(() => {
      statusElement.innerHTML = `<strong>Recent Dispatch:</strong> ${item.tech} assigned to ${item.city} for ${item.issue} (${item.mins}m ago)`;
      statusElement.style.opacity = '1';
    }, 300);
  }, 7000);
}

/* --------------------------------------------------------------------------
   9. Sticky Navigation Scrolling Elevation
   -------------------------------------------------------------------------- */
function initNavScroll() {
  const nav = document.querySelector('.main-nav-wrapper');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.style.background = 'rgba(15, 23, 42, 0.98)';
      nav.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.4)';
    } else {
      nav.style.background = 'rgba(15, 23, 42, 0.94)';
      nav.style.boxShadow = 'var(--shadow-navy)';
    }
  });
}

/* --------------------------------------------------------------------------
   10. Service Card "Emergency Fix Now" Buttons
   -------------------------------------------------------------------------- */
function initServiceCardButtons() {
  const actionButtons = document.querySelectorAll('.btn-service-action');
  const quoteSection = document.getElementById('instant-estimate');
  const issueInput = document.getElementById('issue-description');
  const urgencyButtons = document.querySelectorAll('.urgency-btn');
  const urgencyInput = document.getElementById('urgency-level');

  const serviceToChipMap = {
    'Leak Detection': 'Slab Leak',
    'Water Heater Repair': 'Water Heater Leak',
    'Drain Cleaning': 'Sewer / Drain Backup',
    'Emergency Pipe Fixes': 'Burst Pipe'
  };

  actionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const serviceName = btn.getAttribute('data-service') || '';
      if (issueInput && serviceName) {
        issueInput.value = `Emergency request for: ${serviceName}`;
      }

      // Auto-activate corresponding chip
      const targetChipName = serviceToChipMap[serviceName];
      if (targetChipName) {
        document.querySelectorAll('.issue-chip').forEach(c => {
          if (c.getAttribute('data-issue') === targetChipName) {
            c.classList.add('active');
          }
        });
      }

      // Ensure emergency urgency is highlighted
      urgencyButtons.forEach(b => {
        if (b.getAttribute('data-level') === 'emergency') {
          b.classList.add('selected');
          b.setAttribute('aria-checked', 'true');
        } else {
          b.classList.remove('selected');
          b.setAttribute('aria-checked', 'false');
        }
      });
      if (urgencyInput) urgencyInput.value = 'emergency';

      if (quoteSection) {
        quoteSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}
