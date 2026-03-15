/* ========================================
   TABLE WORTH V2 — APP.JS
   All functionality in one organized file
   ======================================== */

(function () {
  'use strict';

  // ========== 1. PRELOADER ==========
  const preloader = document.getElementById('preloader');
  function exitPreloader() {
    if (preloader) preloader.classList.add('hidden');
    setTimeout(() => {
      // Trigger hero animations
      document.querySelectorAll('.reveal-up').forEach(el => {
        const delay = parseInt(el.dataset.delay || 0, 10);
        setTimeout(() => el.classList.add('show'), delay);
      });
    }, 300);
    // Counter animation for hero stats
    setTimeout(() => {
      document.querySelectorAll('.hero-stats-col .stat-number[data-count]').forEach(el => {
        animateCounter(el, parseInt(el.dataset.count, 10), el.dataset.suffix || '', 1800);
      });
    }, 1600);
  }
  setTimeout(exitPreloader, 2200);

  function animateCounter(el, target, suffix, duration) {
    const startTime = performance.now();
    function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }
    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      el.textContent = Math.round(easeOutQuart(progress) * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ========== 2. CUSTOM CURSOR (Glow + Trail) ==========
  const cursorGlow = document.getElementById('cursor-glow');
  const cursorTrail = document.getElementById('cursor-trail');

  if (cursorGlow && cursorTrail && window.innerWidth >= 768 && !('ontouchstart' in window)) {
    let mx = -100, my = -100, gx = -100, gy = -100;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursorTrail.style.left = mx + 'px';
      cursorTrail.style.top = my + 'px';
    });

    function animateCursor() {
      gx += (mx - gx) * 0.15;
      gy += (my - gy) * 0.15;
      cursorGlow.style.left = gx + 'px';
      cursorGlow.style.top = gy + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover interactive elements
    const interactiveEls = document.querySelectorAll('a, button, .btn-fill, .btn-outline, .btn-submit, .svc-card, .phi-card, .m-card, .why-item, input, select, textarea');
    interactiveEls.forEach(el => {
      el.addEventListener('mouseenter', () => cursorGlow.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursorGlow.classList.remove('hover'));
    });

    document.addEventListener('mouseleave', () => {
      cursorGlow.style.opacity = '0'; cursorTrail.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursorGlow.style.opacity = '1'; cursorTrail.style.opacity = '1';
    });
  }

  // ========== 3. NAVBAR ==========
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const allNavLinks = document.querySelectorAll('.nav-link, .mobile-link');
  const sections = document.querySelectorAll('section[id]');

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  if (navToggle && mobileOverlay) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      mobileOverlay.classList.toggle('open');
      document.body.style.overflow = mobileOverlay.classList.contains('open') ? 'hidden' : '';
    });

    mobileOverlay.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        mobileOverlay.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Smooth scroll
  allNavLinks.forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Active nav tracking
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-50% 0px -50% 0px', threshold: 0 });
  sections.forEach(s => navObserver.observe(s));

  // ========== 4. SCROLL REVEAL ==========
  const scrollRevealEls = document.querySelectorAll('.scroll-reveal');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay || 0;
        el.style.transitionDelay = delay + 'ms';
        el.classList.add('visible');
        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.12 });
  scrollRevealEls.forEach(el => revealObserver.observe(el));

  // ========== 5. SCROLL PROGRESS ==========
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = (window.scrollY / h * 100) + '%';
    }, { passive: true });
  }

  // ========== 6. BACK TO TOP ==========
  const btt = document.getElementById('back-to-top');
  if (btt) {
    window.addEventListener('scroll', () => {
      btt.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ========== 7. HERO SCROLL CUE ==========
  const scrollCue = document.querySelector('.hero-scroll-cue');
  if (scrollCue) {
    scrollCue.addEventListener('click', () => {
      const about = document.getElementById('about');
      if (about) about.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ========== 8. HERO PARALLAX ==========
  const heroWrapper = document.querySelector('.hero-wrapper');
  if (heroWrapper) {
    window.addEventListener('scroll', () => {
      const sy = window.scrollY;
      if (sy < window.innerHeight) {
        heroWrapper.style.transform = `translateY(${sy * 0.2}px)`;
        heroWrapper.style.opacity = 1 - sy / (window.innerHeight * 0.9);
      }
    }, { passive: true });
  }

  // ========== 9. MENU FILTERING ==========
  const menuBtns = document.querySelectorAll('.mf-btn');
  const menuCards = document.querySelectorAll('.m-card');

  menuBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      menuBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      menuCards.forEach(card => {
        const cat = card.dataset.category;
        if (filter === 'all' || cat === filter) {
          card.classList.remove('hidden');
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px) scale(0.95)';
          setTimeout(() => card.classList.add('hidden'), 400);
        }
      });
    });
  });

  // ========== 10. 3D MODEL MODAL ==========
  const modal = document.getElementById('model-modal');
  if (modal) {
    const backdrop = modal.querySelector('.mm-backdrop');
    const closeBtn = modal.querySelector('.mm-close');
    const viewer = document.getElementById('main-model-viewer');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');

    menuCards.forEach(card => {
      card.addEventListener('click', () => {
        viewer.src = card.dataset.model;
        modalTitle.textContent = card.dataset.title;
        modalDesc.textContent = card.dataset.desc;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeModal = () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => { if (!modal.classList.contains('active')) viewer.src = ''; }, 500);
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });

    // Close modal when clicking inquiry CTA
    const mmCta = modal.querySelector('.mm-cta');
    if (mmCta) mmCta.addEventListener('click', closeModal);
  }

  // ========== 11. CONTACT FORM ==========
  const form = document.getElementById('contact-form');
  if (form) {
    const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
    const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
    const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';

    if (typeof emailjs !== 'undefined') emailjs.init(EMAILJS_PUBLIC_KEY);

    const submitBtn = document.getElementById('submit-btn');
    const fields = {
      name: form.querySelector('#f-name'),
      email: form.querySelector('#f-email'),
      phone: form.querySelector('#f-phone'),
      company: form.querySelector('#f-company'),
      service: form.querySelector('#f-service'),
      message: form.querySelector('#f-message'),
    };

    // Float label for select
    if (fields.service) {
      fields.service.addEventListener('change', function () {
        this.closest('.form-field').classList.toggle('has-value', this.value !== '');
      });
    }

    function validateField(name, value) {
      switch (name) {
        case 'name': return value.trim().length >= 2 ? '' : 'Please enter your full name';
        case 'email': return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Please enter a valid email';
        case 'phone': return /^[\+]?[\d\s\-]{8,15}$/.test(value.trim()) ? '' : 'Please enter a valid phone number';
        case 'company': return value.trim().length >= 2 ? '' : 'Please enter your company name';
        case 'service': return value ? '' : 'Please select a service';
        case 'message': return value.trim().length >= 10 ? '' : 'Message must be at least 10 characters';
        default: return '';
      }
    }

    function showError(name, msg) {
      const group = fields[name]?.closest('.form-field');
      if (!group) return;
      const err = group.querySelector('.field-error');
      if (err) err.textContent = msg;
      group.classList.add('error');
    }

    function clearError(name) {
      fields[name]?.closest('.form-field')?.classList.remove('error');
    }

    Object.entries(fields).forEach(([name, el]) => {
      if (!el) return;
      el.addEventListener('input', () => clearError(name));
      el.addEventListener('change', () => clearError(name));
    });

    function showToast(message, type) {
      document.querySelectorAll('.toast').forEach(t => t.remove());
      const toast = document.createElement('div');
      toast.className = `toast ${type}`;
      toast.textContent = message;
      document.body.appendChild(toast);
      requestAnimationFrame(() => toast.classList.add('show'));
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
      }, 5000);
    }

    form.addEventListener('submit', async e => {
      e.preventDefault();
      let hasErrors = false;

      Object.entries(fields).forEach(([name, el]) => {
        if (!el) return;
        const err = validateField(name, el.value);
        if (err) { showError(name, err); hasErrors = true; }
        else clearError(name);
      });

      if (hasErrors) return;
      submitBtn.classList.add('loading');

      try {
        if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
          await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form);
        } else {
          await new Promise(r => setTimeout(r, 1500));
          console.log('EmailJS not configured. Form data:', Object.fromEntries(
            Object.entries(fields).map(([k, el]) => [k, el?.value])
          ));
        }
        submitBtn.classList.remove('loading');
        submitBtn.classList.add('success');
        submitBtn.querySelector('.sb-text').textContent = '✓ Message Sent!';
        showToast("Message sent! We'll get back to you within 24 hours.", 'success');
        setTimeout(() => {
          form.reset();
          submitBtn.classList.remove('success');
          submitBtn.querySelector('.sb-text').textContent = 'Send Message →';
          document.querySelectorAll('.form-field.has-value').forEach(g => g.classList.remove('has-value'));
        }, 3000);
      } catch (error) {
        submitBtn.classList.remove('loading');
        showToast("Oops! Something went wrong. Please try emailing us directly.", 'error');
        console.error('Email error:', error);
      }
    });
  }

  // ========== 12. BUTTON RIPPLE ==========
  document.querySelectorAll('.btn-fill, .btn-outline, .btn-submit').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position:absolute; border-radius:50%; pointer-events:none;
        background:rgba(255,255,255,0.3);
        animation: rippleAnim 0.6s ease-out forwards;
      `;
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Add ripple keyframes
  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = '@keyframes rippleAnim { from { transform: scale(0); opacity: 1; } to { transform: scale(2.5); opacity: 0; } }';
  document.head.appendChild(rippleStyle);

  // ========== 13. WHY-US TILT ==========
  if (window.innerWidth >= 768) {
    document.querySelectorAll('.why-item').forEach(item => {
      item.addEventListener('mousemove', e => {
        const r = item.getBoundingClientRect();
        const rx = ((e.clientY - r.top - r.height / 2) / (r.height / 2)) * -4;
        const ry = ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 4;
        item.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateX(6px)`;
      });
      item.addEventListener('mouseleave', () => {
        item.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateX(0)';
      });
    });
  }

  // ========== 14. TESTIMONIAL WORD REVEAL ==========
  const testiText = document.querySelector('.testi-text');
  if (testiText) {
    const words = testiText.textContent.trim().split(/\s+/);
    testiText.innerHTML = words.map(w => `<span class="tw" style="opacity:0;transition:opacity 0.3s">${w}</span>`).join(' ');
    const wordSpans = testiText.querySelectorAll('.tw');
    const testiObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          wordSpans.forEach((s, i) => setTimeout(() => s.style.opacity = '1', i * 40));
          testiObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    testiObs.observe(testiText);
  }

})();
