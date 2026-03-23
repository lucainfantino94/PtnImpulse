/* ============================================
   PTN IMPULSE — SCRIPT.JS
   Animations & Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ----------------------------------------
  // HEADER SCROLL EFFECT
  // ----------------------------------------
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // ----------------------------------------
  // HAMBURGER MENU
  // ----------------------------------------
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
      });
    });
  }

  // ----------------------------------------
  // SCROLL REVEAL
  // ----------------------------------------
  const revealElements = document.querySelectorAll(
    '.ba-card, .step-card, .faq-item, .contact-inner, .section-header, .footer-inner'
  );

  revealElements.forEach(el => el.classList.add('scroll-reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ----------------------------------------
  // FAQ ACCORDION
  // ----------------------------------------
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      faqItems.forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      // Open clicked if was closed
      if (!isOpen) {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ----------------------------------------
  // CONTACT FORM
  // ----------------------------------------
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const required = form.querySelectorAll('[required]');
      let valid = true;

      required.forEach(field => {
        field.style.borderColor = '';
        if (!field.value.trim()) {
          field.style.borderColor = 'rgba(255,255,255,0.6)';
          valid = false;
        }
      });

      if (!valid) return;

      // Simulate submit (no backend yet)
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.querySelector('span').textContent = 'Envoi en cours...';

      setTimeout(() => {
        form.reset();
        submitBtn.style.display = 'none';
        formSuccess.classList.add('visible');
      }, 1200);
    });
  }

  // ----------------------------------------
  // SMOOTH ANCHOR SCROLL (offset for header)
  // ----------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ----------------------------------------
  // COUNTER ANIMATION (stats)
  // ----------------------------------------
  function animateCounter(el, target, suffix = '') {
    const duration = 1500;
    const start = performance.now();
    const isFloat = target % 1 !== 0;

    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = isFloat
        ? (eased * target).toFixed(1)
        : Math.floor(eased * target);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statNums = entry.target.querySelectorAll('.stat-num');
        statNums.forEach(num => {
          const text = num.textContent;
          if (text.includes('+')) {
            const val = parseInt(text.replace('+', ''));
            num.textContent = '+0';
            setTimeout(() => animateCounter(num, val, '+'), 100);
            // Fix — restore "+" prefix
            setTimeout(() => {
              const finalVal = parseInt(num.textContent);
              num.textContent = '+' + finalVal;
            }, 1650);
          } else if (text.includes('%')) {
            const val = parseInt(text.replace('%', ''));
            num.textContent = '0%';
            setTimeout(() => {
              let current = 0;
              const step = () => {
                if (current < val) {
                  current++;
                  num.textContent = current + '%';
                  setTimeout(step, 1500 / val);
                }
              };
              step();
            }, 100);
          }
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsObserver.observe(heroStats);

});
