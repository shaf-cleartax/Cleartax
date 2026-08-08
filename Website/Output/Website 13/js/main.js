function initGsap() {
  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray('.reveal-up').forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 92%' },
    });
  });
}

/* Scroll-spy: highlight the sidebar link matching the section in view */
function initScrollSpy() {
  const sections = Array.from(document.querySelectorAll('.ds-section'));
  const links = Array.from(document.querySelectorAll('.sidebar-nav a, .sidebar-logo'));
  if (!sections.length || !links.length) return;

  const setActive = (id) => {
    links.forEach((a) => a.classList.toggle('is-active', a.dataset.nav === id));
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  sections.forEach((s) => observer.observe(s));
  setActive(sections[0].id);
}

function initSidebarToggle() {
  const toggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  if (!toggle || !sidebar) return;
  toggle.addEventListener('click', () => sidebar.classList.toggle('is-open'));
  sidebar.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => sidebar.classList.remove('is-open')));
}

/* ===================================================================
   Applications lightbox — page through each application gallery.
   GALLERIES is defined inline in index.html (image paths per category).
=================================================================== */
let currentGallery = null;
let currentIndex = 0;
let lastFocused = null;

function renderSlide() {
  const imgs = window.GALLERIES && window.GALLERIES[currentGallery];
  if (!imgs || !imgs.length) return;
  document.getElementById('lightboxImg').src = imgs[currentIndex];
  document.getElementById('lightboxCounter').textContent =
    `${currentIndex + 1} / ${imgs.length}`;
}

function openGallery(name) {
  if (!window.GALLERIES || !window.GALLERIES[name]) return;
  currentGallery = name;
  currentIndex = 0;
  lastFocused = document.activeElement;
  renderSlide();
  const lb = document.getElementById('lightbox');
  lb.classList.add('is-open');
  lb.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  document.getElementById('lightboxClose').focus();
}

function closeGallery() {
  const lb = document.getElementById('lightbox');
  lb.classList.remove('is-open');
  lb.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastFocused) lastFocused.focus();
}

function step(delta) {
  const imgs = window.GALLERIES && window.GALLERIES[currentGallery];
  if (!imgs) return;
  currentIndex = (currentIndex + delta + imgs.length) % imgs.length;
  renderSlide();
}

function initLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  document.getElementById('lightboxClose').addEventListener('click', closeGallery);
  document.getElementById('lightboxPrev').addEventListener('click', () => step(-1));
  document.getElementById('lightboxNext').addEventListener('click', () => step(1));
  // click the backdrop (but not the image/controls) to dismiss
  lb.addEventListener('click', (e) => { if (e.target === lb) closeGallery(); });
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeGallery();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
}

function safe(fn, label) {
  try { fn(); } catch (err) { console.error(`[main.js] ${label} failed:`, err); }
}

document.addEventListener('DOMContentLoaded', () => {
  safe(initScrollSpy, 'initScrollSpy');
  safe(initSidebarToggle, 'initSidebarToggle');
  safe(initLightbox, 'initLightbox');
  if (window.gsap && window.ScrollTrigger) {
    safe(initGsap, 'initGsap');
  } else {
    forceReveal();
  }
  setTimeout(forceReveal, 4000);
});

function forceReveal() {
  const isTweening = window.gsap ? window.gsap.isTweening.bind(window.gsap) : () => false;
  document.querySelectorAll('.reveal-up').forEach((el) => {
    if (parseFloat(getComputedStyle(el).opacity) < 1 && !isTweening(el)) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    }
  });
}
