// Crown Tech Africa — shared site script
// Included on every page. Every feature checks the element exists
// before wiring it up, since not every page has every element
// (e.g. only contact.html has the quote form).

// Mobile menu toggle
const burger = document.querySelector('.burger');
const navMenu = document.querySelector('.nav-menu');
if (burger && navMenu) {
  burger.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });
}

// Get a Free Quote form — real Netlify Forms submission (contact.html only)
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

    quoteSubmitBtn.setAttribute('data-loading', 'true');
    quoteSubmitBtn.disabled = true;

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encodeFormData(quoteForm)
    })
      .then(() => {
        quoteForm.style.display = 'none';
        quoteSuccess.classList.add('visible');
        quoteForm.reset();
      })
      .catch(() => {
        alert("Something went wrong sending your request — please try again, or reach us directly on WhatsApp or email.");
      })
      .finally(() => {
        quoteSubmitBtn.removeAttribute('data-loading');
        quoteSubmitBtn.disabled = false;
      });
  });

  if (quoteReturnBtn) {
    quoteReturnBtn.addEventListener('click', function () {
      quoteSuccess.classList.remove('visible');
      quoteForm.style.display = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// Newsletter signup — placeholder handler (no mailing-list service connected yet)
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('newsletterEmail').value;
    const subject = encodeURIComponent('Newsletter Signup');
    const body = encodeURIComponent('Please add this email to the growth insights list: ' + email);
    window.location.href = 'mailto:hello@crowntechafrica.com?subject=' + subject + '&body=' + body;
  });
}

// Light / dark mode toggle — present on every page
const sunIcon = '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>';
const moonIcon = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>';

function safeGet(key) {
  try { return localStorage.getItem(key); } catch (e) { return null; }
}
function safeSet(key, value) {
  try { localStorage.setItem(key, value); } catch (e) { /* storage unavailable, ignore */ }
}

const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

function applyTheme(isLight) {
  document.body.classList.toggle('light-mode', isLight);
  if (themeIcon) themeIcon.innerHTML = isLight ? moonIcon : sunIcon;
}

const savedTheme = safeGet('crownTechTheme');
applyTheme(savedTheme === 'light');

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const nowLight = !document.body.classList.contains('light-mode');
    applyTheme(nowLight);
    safeSet('crownTechTheme', nowLight ? 'light' : 'dark');
  });
}

// Works filter tabs — visual state only until real projects exist (works.html only)
document.querySelectorAll('.filter-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});
