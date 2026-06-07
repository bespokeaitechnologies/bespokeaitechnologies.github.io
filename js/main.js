/* ═══════════════════════════════════════════════════
   BESPOKE AI TECHNOLOGIES — Main JavaScript v4
   Cursor · GSAP · Magnetic · Tilt · Existing utils
   ═══════════════════════════════════════════════════ */

// ── Custom cursor ────────────────────────────────────
const dot  = document.createElement('div'); dot.className  = 'cursor-dot';
const ring = document.createElement('div'); ring.className = 'cursor-ring';
document.body.append(dot, ring);

let mx = 0, my = 0, rx = 0, ry = 0;
const LERP = 0.13;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top  = my + 'px';
}, { passive: true });

(function tickRing() {
  rx += (mx - rx) * LERP;
  ry += (my - ry) * LERP;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(tickRing);
})();

document.querySelectorAll('a, button, .btn, .pillar-item, .card, .mod-card, .oci-tile').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
});

// ── Dropdown hover with grace-period delay ────────────
// Pure CSS :hover loses state when crossing the gap between trigger and menu.
// JS adds a 150ms delay on close so the mouse can safely travel the gap.
document.querySelectorAll('.dropdown').forEach(dd => {
  const menu = dd.querySelector('.drop-menu');
  if (!menu) return;
  let leaveTimer;
  dd.addEventListener('mouseenter', () => {
    clearTimeout(leaveTimer);
    menu.classList.add('open');
  });
  dd.addEventListener('mouseleave', () => {
    leaveTimer = setTimeout(() => menu.classList.remove('open'), 150);
  });
});

// ── Navbar scroll state ──────────────────────────────
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 24);
}, { passive: true });

// ── Mobile nav toggle ─────────────────────────────────
const hamburger = document.querySelector('.hamburger');
const navLinks  = document.querySelector('.nav-links');

hamburger?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
navLinks?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ── Magnetic button effect ───────────────────────────
document.querySelectorAll('.btn-primary, .btn-gold').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left  - r.width  * 0.5) * 0.28;
    const y = (e.clientY - r.top   - r.height * 0.5) * 0.28;
    btn.style.transform = `translate(${x}px, ${y}px)`;
    btn.style.transition = 'transform 0.08s linear';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
    btn.style.transition = 'transform 0.55s cubic-bezier(0.34,1.56,0.64,1)';
  });
});

// ── 3D card tilt on mouse ────────────────────────────
document.querySelectorAll('.card, .mod-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `perspective(700px) rotateY(${x * 11}deg) rotateX(${-y * 11}deg) translateZ(7px)`;
    card.style.transition = 'transform 0.08s linear, border-color 0.3s, box-shadow 0.3s';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1), border-color 0.3s, box-shadow 0.3s';
  });
});

// ── GSAP hero entrance (if GSAP is loaded) ───────────
if (typeof gsap !== 'undefined') {
  const heroItems = [
    { sel: '.hero-badge',   delay: 0.30 },
    { sel: '.hero h1',      delay: 0.50 },
    { sel: '.hero-motto',   delay: 0.72 },
    { sel: '.hero-sub',     delay: 0.88 },
    { sel: '.hero-actions', delay: 1.02 },
    { sel: '.hero-stats',   delay: 1.18 },
    { sel: '.hero-right',   delay: 0.45 },
  ];
  heroItems.forEach(({ sel, delay }) => {
    const el = document.querySelector(sel);
    if (!el) return;
    const isRight = sel === '.hero-right';
    gsap.set(el, { opacity: 0, x: isRight ? 50 : 0, y: isRight ? 0 : 30 });
    gsap.to(el, { opacity: 1, x: 0, y: 0, duration: isRight ? 1.1 : 0.9, ease: 'power3.out', delay });
  });

  // Scroll-reveal for section heads
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray('.section-head').forEach(el => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        y: 40, opacity: 0, duration: 0.85, ease: 'power3.out'
      });
    });
    // Stagger steps
    gsap.utils.toArray('.steps-grid .step').forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        y: 50, opacity: 0, duration: 0.8, ease: 'power3.out', delay: i * 0.12
      });
    });
    // Stagger pillars
    gsap.utils.toArray('.pillar-item').forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        y: 30, opacity: 0, duration: 0.7, ease: 'power3.out', delay: i * 0.09
      });
    });
  }
}

// ── Typewriter effect ─────────────────────────────────
const twEl = document.getElementById('typewriter');
if (twEl) {
  const words = ['Oracle Fusion Cloud', 'Oracle Cloud Infrastructure', 'AI Consulting & Strategy', 'AI Agent Development', 'Oracle ERP Cloud', 'Generative AI Solutions', 'Digital Transformation'];
  let wi = 0, ci = 0, deleting = false;
  function type() {
    const word = words[wi];
    twEl.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);
    let delay = deleting ? 55 : 85;
    if (!deleting && ci > word.length) { delay = 2400; deleting = true; }
    else if (deleting && ci < 0) { deleting = false; wi = (wi + 1) % words.length; ci = 0; delay = 350; }
    setTimeout(type, delay);
  }
  setTimeout(type, 700);
}

// ── Animated counters ─────────────────────────────────
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const dur = 2000;
  const start = performance.now();
  function update(now) {
    const p = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = prefix + (Number.isInteger(target) ? Math.floor(target * ease) : (target * ease).toFixed(1)) + suffix;
    if (p < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ── IntersectionObserver (fallback + counter) ─────────
const io = new IntersectionObserver((entries) => {
  entries.forEach(({ isIntersecting, target }) => {
    if (!isIntersecting) return;
    if (target.classList.contains('fade-up'))  target.classList.add('visible');
    if (target.classList.contains('counter'))  animateCounter(target);
    io.unobserve(target);
  });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-up, .counter').forEach(el => io.observe(el));

// ── Bar chart animation on scroll ─────────────────────
const barObs = new IntersectionObserver(entries => {
  entries.forEach(({ isIntersecting, target }) => {
    if (!isIntersecting) return;
    target.querySelectorAll('.bar').forEach((bar, i) => {
      bar.style.animationDelay = `${i * 0.08}s`;
      bar.style.animationPlayState = 'running';
    });
  });
}, { threshold: 0.3 });

document.querySelectorAll('.bars').forEach(el => {
  el.querySelectorAll('.bar').forEach(b => b.style.animationPlayState = 'paused');
  barObs.observe(el);
});

// ── Dashboard tab switcher ─────────────────────────────
document.querySelectorAll('.lp-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    tab.closest('.lp-tabs').querySelectorAll('.lp-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// ── Live feed simulation ──────────────────────────────
const feedEl = document.querySelector('.lp-feed');
if (feedEl) {
  const events = [
    { dot: '#22c55e',    msg: 'Oracle Fusion HCM sync completed',                time: 'just now' },
    { dot: '#00e5d0',    msg: 'OCI compute instance auto-scaled',                time: '2m ago' },
    { dot: '#f5a623',    msg: 'Payroll process initiated — 1,240 employees',     time: '5m ago' },
    { dot: '#22c55e',    msg: 'Financial close automation triggered',             time: '8m ago' },
    { dot: '#ff4522',    msg: 'Security alert resolved — OCI WAF rule applied',  time: '12m ago' },
    { dot: '#00e5d0',    msg: 'OIC integration flow executed — 8,400 records',   time: '15m ago' },
  ];
  let idx = 0;
  function rotateFeed() {
    feedEl.querySelectorAll('.feed-item').forEach((item, i) => {
      const ev = events[(idx + i) % events.length];
      const dotEl  = item.querySelector('.feed-dot');
      const timeEl = item.querySelector('.feed-time');
      if (dotEl)  dotEl.style.background  = ev.dot;
      if (timeEl) timeEl.textContent = ev.time;
      const textNodes = [...item.childNodes].filter(n => n.nodeType === 3);
      if (textNodes.length) textNodes[0].textContent = ' ' + ev.msg + ' ';
    });
    idx = (idx + 1) % events.length;
  }
  setInterval(rotateFeed, 3500);
}

// ── Form handlers ──────────────────────────────────────
['contactForm', 'applyForm'].forEach(id => {
  const form = document.getElementById(id);
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const btn  = form.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = 'Sending…'; btn.disabled = true;
    fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      .then(r => {
        btn.textContent = r.ok ? 'Sent ✓' : 'Error — try again';
        btn.style.background = r.ok ? '#16a34a' : 'var(--red)';
        if (r.ok) form.reset();
      })
      .catch(() => { btn.textContent = 'Error — try again'; btn.style.background = 'var(--red)'; })
      .finally(() => setTimeout(() => { btn.textContent = orig; btn.disabled = false; btn.style.background = ''; }, 4000));
  });
});
