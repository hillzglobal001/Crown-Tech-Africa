'use strict';

/* ==========================================================
   Crown Tech Africa
   Shared Site Script
   Used across all pages
========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================
     Mobile Navigation
  ========================================================== */

  const burger = document.querySelector('.burger');
  const navMenu = document.querySelector('.nav-menu');

  if (burger && navMenu) {
    burger.addEventListener('click', () => {
      navMenu.classList.toggle('open');

      const expanded = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', !expanded);
    });
  }

  /* ==========================================================
     Get a Free Quote Form
     (Netlify Forms)
  ========================================================== */

  const quoteForm = document.getElementById('quoteForm');

  if (quoteForm) {

    const quoteSubmitBtn = document.getElementById('quoteSubmitBtn');
    const quoteSuccess = document.getElementById('quoteSuccess');
    const quoteReturnBtn = document.getElementById('quoteReturnBtn');

    function encodeFormData(form) {
      return new URLSearchParams(new FormData(form)).toString();
    }

    quoteForm.addEventListener('submit', function (e) {

      e.preventDefault();

      if (!quoteForm.checkValidity()) {
        quoteForm.reportValidity();
        return;
      }

      quoteSubmitBtn.disabled = true;
      quoteSubmitBtn.textContent = 'Sending...';

      fetch('/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: encodeFormData(quoteForm)
      })

      .then(() => {

        quoteForm.style.display = 'none';
        quoteSuccess.classList.add('visible');
        quoteForm.reset();

      })

      .catch(() => {

        alert(
          'Something went wrong. Please try again or contact us directly via WhatsApp or email.'
        );

      })

      .finally(() => {

        quoteSubmitBtn.disabled = false;
        quoteSubmitBtn.textContent = 'Get My Free Quote';

      });

    });

    if (quoteReturnBtn) {

      quoteReturnBtn.addEventListener('click', () => {

        quoteSuccess.classList.remove('visible');
        quoteForm.style.display = '';

        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });

      });

    }

  }

  /* ==========================================================
     Newsletter Signup
  ========================================================== */

  const newsletterForm = document.getElementById('newsletterForm');

  if (newsletterForm) {

    newsletterForm.addEventListener('submit', function (e) {

      e.preventDefault();

      const email = document.getElementById('newsletterEmail').value;

      const subject = encodeURIComponent('Newsletter Signup');

      const body = encodeURIComponent(
        `Please add this email to the Crown Tech Africa newsletter:\n\n${email}`
      );

      window.location.href =
        `mailto:hello@crowntechafrica.com?subject=${subject}&body=${body}`;

    });

  }

  /* ==========================================================
     Theme Toggle
  ========================================================== */

  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');

  const sunIcon =
    '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>';

  const moonIcon =
    '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>';

  function safeGet(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function safeSet(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      console.warn('Local storage unavailable.');
    }
  }

  function applyTheme(isLight) {

    document.body.classList.toggle('light-mode', isLight);

    if (themeIcon) {
      themeIcon.innerHTML = isLight ? moonIcon : sunIcon;
    }

  }

  applyTheme(safeGet('crownTechTheme') === 'light');

  if (themeToggle) {

    themeToggle.addEventListener('click', () => {

      const isLight =
        !document.body.classList.contains('light-mode');

      applyTheme(isLight);

      safeSet(
        'crownTechTheme',
        isLight ? 'light' : 'dark'
      );

    });

  }

  /* ==========================================================
     Works Filter Tabs
  ========================================================== */

  const filterTabs = document.querySelectorAll('.filter-tab');

  if (filterTabs.length > 0) {

    filterTabs.forEach(tab => {

      tab.addEventListener('click', () => {

        filterTabs.forEach(item =>
          item.classList.remove('active')
        );

        tab.classList.add('active');

      });

    });

  }

  console.log('✅ Crown Tech Africa script loaded successfully.');

});
