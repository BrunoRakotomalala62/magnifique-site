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

  // Contact form feedback
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const button = form.querySelector('button[type="submit"]');

      if (input && input.checkValidity()) {
        const originalText = button.textContent;
        button.textContent = 'Merci ! 🎉';
        button.disabled = true;
        input.value = '';

        setTimeout(() => {
          button.textContent = originalText;
          button.disabled = false;
        }, 2500);
      } else {
        input?.reportValidity();
      }
    });
  }
});
