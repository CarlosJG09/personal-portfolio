/* ============================================================
   script.js — Portfolio JS
   Jhon Gabriel M. Carlos
   Features: nav scroll, mobile menu, scroll reveal,
             skill bar animation, form validation
   ============================================================ */

// ── Footer Year ────────────────────────────────────────────
document.getElementById('footerYear').textContent = new Date().getFullYear();

// ── Nav Scroll ─────────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ── Mobile Menu ────────────────────────────────────────────
const hamburger     = document.getElementById('hamburger');
const mobileOverlay = document.getElementById('mobileOverlay');
const overlayClose  = document.getElementById('overlayClose');
const overlayLinks  = document.querySelectorAll('.overlay-link');

function openMenu()  { mobileOverlay.classList.add('open');  document.body.style.overflow = 'hidden'; }
function closeMenu() { mobileOverlay.classList.remove('open'); document.body.style.overflow = ''; }

hamburger.addEventListener('click', openMenu);
overlayClose.addEventListener('click', closeMenu);
overlayLinks.forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

// ── Scroll Reveal ──────────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');

// Immediately show all elements above the fold on load
function revealVisible() {
  revealEls.forEach((el, i) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 100) {
      setTimeout(() => el.classList.add('visible'), i * 60);
    }
  });
}

// Run on load
window.addEventListener('load', revealVisible);
revealVisible();

// Also observe for scroll-triggered reveals
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const parent   = entry.target.parentElement;
      const siblings = Array.from(parent.querySelectorAll('.reveal:not(.visible)'));
      const idx      = siblings.indexOf(entry.target);
      setTimeout(() => entry.target.classList.add('visible'), Math.min(idx * 90, 350));
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));
} else {
  // Fallback: just show everything
  revealEls.forEach(el => el.classList.add('visible'));
}

// ── Skill Bars ─────────────────────────────────────────────
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.skill-fill').forEach(fill => {
      const w = fill.getAttribute('data-w');
      requestAnimationFrame(() => { fill.style.width = w + '%'; });
    });
    skillObserver.unobserve(entry.target);
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skills-wrapper').forEach(el => skillObserver.observe(el));

// ── Active Nav Link ────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => {
      const active = link.getAttribute('href') === '#' + entry.target.id;
      link.style.color = active ? 'var(--accent)' : '';
    });
  });
}, { threshold: 0.45 });

sections.forEach(s => sectionObserver.observe(s));

// ── Contact Form Validation ────────────────────────────────
const form       = document.getElementById('contactForm');
const nameInput  = document.getElementById('fname');
const emailInput = document.getElementById('femail');
const msgInput   = document.getElementById('fmsg');
const nameErr    = document.getElementById('fnameErr');
const emailErr   = document.getElementById('femailErr');
const msgErr     = document.getElementById('fmsgErr');
const successMsg = document.getElementById('formSuccess');

const isValidEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

function setErr(input, el, msg) {
  input.classList.add('error');
  el.textContent = msg;
  return false;
}
function clearErr(input, el) {
  input.classList.remove('error');
  el.textContent = '';
}

[nameInput, emailInput, msgInput].forEach(inp => {
  inp.addEventListener('input', () => inp.classList.remove('error'));
});

form.addEventListener('submit', e => {
  e.preventDefault();
  let valid = true;

  const name  = nameInput.value.trim();
  const email = emailInput.value.trim();
  const msg   = msgInput.value.trim();

  if (!name || name.length < 2) {
    valid = setErr(nameInput, nameErr, 'Please enter your full name.');
  } else { clearErr(nameInput, nameErr); }

  if (!email) {
    valid = setErr(emailInput, emailErr, 'Please enter your email address.');
  } else if (!isValidEmail(email)) {
    valid = setErr(emailInput, emailErr, 'Please enter a valid email address.');
  } else { clearErr(emailInput, emailErr); }

  if (!msg || msg.length < 10) {
    valid = setErr(msgInput, msgErr, 'Message must be at least 10 characters.');
  } else { clearErr(msgInput, msgErr); }

  if (!valid) return;

  // Simulate sending
  const btn = form.querySelector('.form-btn');
  btn.textContent = 'Sending...';
  btn.disabled = true;

  setTimeout(() => {
    form.reset();
    successMsg.classList.add('show');
    btn.textContent = 'Send Message →';
    btn.disabled = false;
    setTimeout(() => successMsg.classList.remove('show'), 5000);
  }, 1200);
});