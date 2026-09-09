document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = navMenu.querySelectorAll('.nav__link');
  const yearSpan = document.getElementById('year');
  const revealElements = document.querySelectorAll('.reveal');

  // Dynamic year in footer
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Header scroll effect
  const updateHeader = () => {
    if (window.scrollY > 40) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  };

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  // Mobile navigation toggle
  const toggleMenu = () => {
    const isOpen = navMenu.classList.toggle('nav__menu--open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
  };

  navToggle.addEventListener('click', toggleMenu);

  // Close mobile menu when clicking a link
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('nav__menu--open')) {
        toggleMenu();
      }
    });
  });

  // Scroll reveal animation
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // Contact form submission to Netlify Function back-end
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const button = form.querySelector('button[type="submit"]');
      const originalText = button.textContent;
      button.disabled = true;
      button.textContent = 'Envoi en cours...';
      if (statusEl) statusEl.textContent = '';

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name.value.trim(),
            email: form.email.value.trim(),
            message: form.message.value.trim(),
          }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          if (statusEl) {
            statusEl.textContent = result.message;
            statusEl.style.color = 'var(--color-secondary)';
          }
          form.reset();
        } else {
          throw new Error(result.message || 'Erreur lors de l’envoi.');
        }
      } catch (error) {
        if (statusEl) {
          statusEl.textContent = error.message;
          statusEl.style.color = 'var(--color-accent)';
        }
      } finally {
        button.textContent = originalText;
        button.disabled = false;
      }
    });
  }
});
