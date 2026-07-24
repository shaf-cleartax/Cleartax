function initGsap() {
  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray('.reveal-up').forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%' },
    });
  });
}

function safe(fn, label) {
  try { fn(); } catch (err) { console.error(`[main.js] ${label} failed:`, err); }
}

document.addEventListener('DOMContentLoaded', () => {
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
