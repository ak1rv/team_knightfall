/* =============================================
   Team Knightfall — script.js
   ============================================= */

'use strict';

// ---------- Navbar scroll behaviour ----------
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ---------- Mobile menu toggle ----------
const toggle   = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');

toggle.addEventListener('click', () => {
  const open = toggle.classList.toggle('open');
  mobileMenu.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', open);
});

// Close mobile menu when a link is clicked
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    toggle.classList.remove('open');
    mobileMenu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  });
});

// Close menu on resize
window.addEventListener('resize', () => {
  if (window.innerWidth > 700) {
    toggle.classList.remove('open');
    mobileMenu.classList.remove('open');
  }
}, { passive: true });

// ---------- Active nav link on scroll ----------
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => observer.observe(s));

// ---------- Scroll-in animations ----------
const fadeEls = document.querySelectorAll('.fade-in-up');
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

fadeEls.forEach(el => fadeObserver.observe(el));

// ---------- Chess board art ----------
(function buildBoard() {
  const board = document.getElementById('chessBoard');
  if (!board) return;

  // Sparse piece map: [row][col] = emoji
  const pieces = {
    0: { 0:'♜', 2:'♝', 4:'♛', 6:'♞', 7:'♜' },
    1: { 1:'♟', 3:'♟', 5:'♟', 7:'♟' },
    3: { 3:'♙', 5:'♙' },
    4: { 2:'♟', 4:'♙', 6:'♞' },
    6: { 0:'♙', 2:'♗', 4:'♕', 6:'♙' },
    7: { 0:'♖', 2:'♘', 4:'♔', 7:'♖' },
  };
  const goldCells = new Set(['3,2','4,5','5,3','2,6']);

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const cell = document.createElement('div');
      const key = r + ',' + c;
      let cls = 'cell ';
      if (goldCells.has(key)) cls += 'gold-sq';
      else if ((r + c) % 2 === 0) cls += 'light';
      else cls += 'dark-sq';
      cell.className = cls;
      const piece = pieces[r] && pieces[r][c];
      if (piece) {
        cell.textContent = piece;
        cell.setAttribute('aria-label', 'chess piece');
      }
      board.appendChild(cell);
    }
  }
})();

// ---------- Contact form validation ----------
(function initForm() {
  const form      = document.getElementById('contactForm');
  if (!form) return;
  const msgBox    = document.getElementById('formMessage');

  function getVal(id) { return document.getElementById(id).value.trim(); }
  function showErr(id, msg) {
    const input = document.getElementById(id);
    const err   = document.getElementById(id + 'Error');
    input.classList.add('error');
    err.textContent = msg;
    err.classList.add('show');
    return false;
  }
  function clearErr(id) {
    const input = document.getElementById(id);
    const err   = document.getElementById(id + 'Error');
    input.classList.remove('error');
    err.classList.remove('show');
  }

  // Inline clearing
  ['contactName','contactEmail','contactSubject','contactMessage'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => clearErr(id));
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    msgBox.className = 'form-message';
    msgBox.textContent = '';

    let valid = true;
    const name    = getVal('contactName');
    const email   = getVal('contactEmail');
    const subject = getVal('contactSubject');
    const message = getVal('contactMessage');

    if (!name)    valid = showErr('contactName',    'Please enter your name.');
    else clearErr('contactName');

    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email)         { if(valid) showErr('contactEmail', 'Please enter your email.'); valid = false; }
    else if (!emailRx.test(email)) { if(valid||!name) showErr('contactEmail', 'Please enter a valid email.'); clearErr('contactEmail'); showErr('contactEmail', 'Please enter a valid email.'); valid = false; }
    else clearErr('contactEmail');

    if (!subject) { if(valid) showErr('contactSubject', 'Please enter a subject.'); valid = false; }
    else clearErr('contactSubject');

    if (!message || message.length < 10) {
      if(valid) showErr('contactMessage', 'Message must be at least 10 characters.');
      valid = false;
    } else clearErr('contactMessage');

    if (!valid) return;

    // Inform the user this is a static site
    msgBox.className = 'form-message error-msg';
    msgBox.innerHTML = '<strong>Note:</strong> This is a static website. To enable message delivery, the contact form needs to be connected to a backend service (e.g. Formspree, EmailJS, or a custom API). Your message has not been sent — please reach out directly using the contact details above once they are available.';
    msgBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
})();
