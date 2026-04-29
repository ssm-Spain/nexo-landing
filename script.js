/* =============================================
   NEXO Vegas Altas — script.js
   ============================================= */

/* ── Navbar scroll effect ── */
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

/* ── Mobile menu ── */
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });
}

/* ── Active nav link ── */
(function markActive() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

/* ── Scroll animations (IntersectionObserver) ── */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

document.querySelectorAll('.fade-up').forEach(el => io.observe(el));

/* ── Contact form validation ── */
const form = document.getElementById('contact-form');
if (form) {
  const rules = {
    nombre:   { required: true, label: 'nombre' },
    empresa:  { required: true, label: 'empresa' },
    telefono: { required: true, pattern: /^[+\d\s\-()]{7,}$/, label: 'teléfono válido' },
    email:    { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, label: 'email válido' },
    mensaje:  { required: true, minLen: 20, label: 'mensaje (mín. 20 caracteres)' },
  };

  function getGroup(name) {
    const input = form.elements[name];
    return input ? input.closest('.form-group') : null;
  }

  function validateField(name) {
    const rule  = rules[name];
    const group = getGroup(name);
    if (!group) return true;
    const input = form.elements[name];
    const val   = input.value.trim();
    let ok = true;
    let msg = '';

    if (rule.required && !val)               { ok = false; msg = `Por favor, introduce tu ${rule.label}.`; }
    else if (rule.pattern && !rule.pattern.test(val)) { ok = false; msg = `Introduce un ${rule.label}.`; }
    else if (rule.minLen && val.length < rule.minLen)  { ok = false; msg = `El ${rule.label}.`; }

    group.classList.toggle('has-error', !ok);
    const errEl = group.querySelector('.error-msg');
    if (errEl) errEl.textContent = msg;
    return ok;
  }

  Object.keys(rules).forEach(name => {
    const input = form.elements[name];
    if (input) {
      input.addEventListener('blur', () => validateField(name));
      input.addEventListener('input', () => {
        if (getGroup(name).classList.contains('has-error')) validateField(name);
      });
    }
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const valid = Object.keys(rules).map(validateField).every(Boolean);
    if (!valid) {
      form.querySelector('.form-group.has-error input, .form-group.has-error textarea')?.focus();
      return;
    }
    /* Simulate success (no backend in static version) */
    form.style.opacity = '0';
    form.style.transition = 'opacity .3s';
    setTimeout(() => {
      form.style.display = 'none';
      const success = document.getElementById('form-success');
      if (success) { success.style.display = 'block'; }
    }, 300);
  });
}

/* ── Smooth anchor scrolling ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
