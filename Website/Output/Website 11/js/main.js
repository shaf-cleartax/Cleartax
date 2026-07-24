/* ===================================================================
   GSAP — scroll storytelling. No Three.js in this build: the reference
   (color-test-2 - Home • Desktop - v4) has no dot-grid or spatial hero
   element, so there is nothing for a 3D canvas to render.
=================================================================== */
function initGsap() {
  gsap.registerPlugin(ScrollTrigger);

  gsap.to('#scrollProgress', {
    width: '100%', ease: 'none',
    scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true },
  });

  const heroTl = gsap.timeline({ delay: 0.15 });
  heroTl.to('.hero .reveal-up', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12 });

  gsap.utils.toArray('.reveal-up').forEach((el) => {
    if (el.closest('.hero')) return;
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });

  const track = document.getElementById('timelineTrack');
  const pin = document.getElementById('timelinePin');
  if (track && pin) {
    const getScrollAmount = () => track.scrollWidth - track.clientWidth + 96;
    ScrollTrigger.create({
      trigger: pin, start: 'top top+=100', end: () => '+=' + getScrollAmount(),
      pin: true, scrub: 1, invalidateOnRefresh: true,
      onUpdate: (self) => {
        track.scrollLeft = self.progress * getScrollAmount();
        document.getElementById('timelineFill').style.width = (self.progress * 100) + '%';
      },
    });
  }
}

/* ===================================================================
   Marquee — logo row is rendered as text chips: no real logo image
   files are available for this placeholder row, so plain labels stand
   in rather than reproducing real companies' trademarks.
=================================================================== */
function buildMarquees() {
  const proofNames = ['ACME Corp', 'Nova Retail', 'Orbit Logistics', 'Vertex Foods', 'Halcyon Group', 'Meridian Tech', 'Solace Energy', 'Anchor Freight'];
  const proofTrack = document.getElementById('proofTrack');
  if (proofTrack) {
    const html = proofNames.map((n) => `<span class="m-item">${n}</span>`).join('');
    proofTrack.innerHTML = html + html;
    proofTrack.style.setProperty('--marquee-duration', '32s');
  }
}

/* ===================================================================
   Menu overlay
=================================================================== */
function initMenu() {
  const btn = document.getElementById('menuBtn');
  const overlay = document.getElementById('menuOverlay');
  if (!btn || !overlay) return;
  btn.addEventListener('click', () => overlay.classList.toggle('is-open'));
  overlay.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => overlay.classList.remove('is-open')));
}

function safe(fn, label) {
  try { fn(); } catch (err) { console.error(`[main.js] ${label} failed:`, err); }
}

document.addEventListener('DOMContentLoaded', () => {
  safe(buildMarquees, 'buildMarquees');
  safe(initMenu, 'initMenu');
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
