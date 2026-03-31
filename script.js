/* ===================================================================
   THREADED MEMORIES – Main JavaScript
   Handles: Navigation, Scroll effects, Form validation, Interactions
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // -----------------------------------------------
  // 1. MOBILE NAVIGATION TOGGLE
  // -----------------------------------------------
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  }

  // -----------------------------------------------
  // 2. NAVBAR SCROLL EFFECT
  // -----------------------------------------------
  const siteHeader = document.getElementById('site-header');

  if (siteHeader) {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Run on load
  }

  // -----------------------------------------------
  // 3. CONTACT FORM VALIDATION
  // -----------------------------------------------
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const formStatus = document.getElementById('form-status');

    // Validate a single field
    function validateField(input, errorEl, rules) {
      const value = input.value.trim();
      let errorMessage = '';

      if (rules.required && value === '') {
        errorMessage = rules.requiredMsg || 'This field is required.';
      } else if (rules.email && value !== '' && !isValidEmail(value)) {
        errorMessage = 'Please enter a valid email address.';
      } else if (rules.minLength && value.length < rules.minLength) {
        errorMessage = `Must be at least ${rules.minLength} characters.`;
      }

      if (errorMessage) {
        input.classList.add('error');
        input.classList.remove('success');
        errorEl.textContent = errorMessage;
        return false;
      } else {
        input.classList.remove('error');
        if (value !== '') input.classList.add('success');
        errorEl.textContent = '';
        return true;
      }
    }

    function isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Real-time validation on blur
    if (nameInput && nameError) {
      nameInput.addEventListener('blur', () => {
        validateField(nameInput, nameError, {
          required: true,
          requiredMsg: 'Please enter your name.',
          minLength: 2
        });
      });
    }

    if (emailInput && emailError) {
      emailInput.addEventListener('blur', () => {
        validateField(emailInput, emailError, {
          required: true,
          requiredMsg: 'Please enter your email address.',
          email: true
        });
      });
    }

    // Form submission
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Validate all required fields
      const isNameValid = validateField(nameInput, nameError, {
        required: true,
        requiredMsg: 'Please enter your name.',
        minLength: 2
      });

      const isEmailValid = validateField(emailInput, emailError, {
        required: true,
        requiredMsg: 'Please enter your email address.',
        email: true
      });

      // Show status
      if (isNameValid && isEmailValid) {
        showFormStatus('success', '✨ Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.');
        contactForm.reset();

        // Remove success styles
        contactForm.querySelectorAll('.form-input').forEach(input => {
          input.classList.remove('success', 'error');
        });
      } else {
        showFormStatus('error', 'Please fill in all required fields correctly.');
      }
    });

    function showFormStatus(type, message) {
      formStatus.textContent = message;
      formStatus.className = 'form-status show ' + type;

      // Auto-hide after 6 seconds
      setTimeout(() => {
        formStatus.classList.remove('show');
      }, 6000);
    }
  }

  // -----------------------------------------------
  // 4. SCROLL-REVEAL ANIMATIONS
  // -----------------------------------------------
  const revealElements = document.querySelectorAll(
    '.feature-card, .showcase-card, .testimonial-card, .value-card, ' +
    '.stat-card, .team-card, .service-card, .process-step, .faq-card'
  );

  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    // Set initial state
    revealElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Stagger the animation based on sibling index
          const siblings = entry.target.parentElement.children;
          const siblingIndex = Array.from(siblings).indexOf(entry.target);

          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, siblingIndex * 100);

          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // -----------------------------------------------
  // 5. BUTTON INTERACTION FEEDBACK
  // -----------------------------------------------
  const allButtons = document.querySelectorAll('.btn');

  allButtons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      // Create ripple effect
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: rippleEffect 0.6s ease-out;
        pointer-events: none;
      `;

      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Add ripple keyframes
  if (!document.getElementById('ripple-styles')) {
    const style = document.createElement('style');
    style.id = 'ripple-styles';
    style.textContent = `
      @keyframes rippleEffect {
        to { transform: scale(4); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  // -----------------------------------------------
  // 6. COUNTER ANIMATION (About Page Stats)
  // -----------------------------------------------
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');

  if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count'), 10);
          animateCounter(el, target);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));
  }

  function animateCounter(element, target) {
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      const current = Math.floor(eased * target);

      element.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target.toLocaleString();
      }
    }

    requestAnimationFrame(update);
  }

});
