/* ===================================================================
   GSAP — scroll storytelling. No Three.js: Apple's system is
   photography-first with exactly one shadow reserved for product
   imagery, so the hero "product" here is a flat dashboard mockup
   resting on the tile surface, not a particle/gradient effect.
=================================================================== */
function initGsap() {
  gsap.registerPlugin(ScrollTrigger);

  gsap.to('#scrollProgress', {
    width: '100%', ease: 'none',
    scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true },
  });

  const heroTl = gsap.timeline({ delay: 0.2 });
  heroTl
    .to('.hero-badge .reveal-line', { y: '0%', duration: 0.8, ease: 'power3.out' })
    .to('.hero-title .reveal-line', { y: '0%', duration: 1, ease: 'power4.out', stagger: 0.12 }, 0.15)
    .to('.lead.reveal-up, .tile-actions.reveal-up', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12 }, 0.55)
    .to('.product-render.reveal-up', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, 0.5);

  gsap.utils.toArray('.reveal-up').forEach((el) => {
    if (el.closest('.hero-tile')) return;
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });

  gsap.utils.toArray('.store-card').forEach((el, i) => {
    gsap.fromTo(el, { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: (i % 5) * 0.06,
      scrollTrigger: { trigger: el, start: 'top 90%' },
    });
  });

  gsap.to('.dash-bars span', {
    scaleY: 1, duration: 0.9, ease: 'power3.out', stagger: 0.06,
    scrollTrigger: { trigger: '.dash-bars', start: 'top 85%' },
  });

  document.querySelectorAll('.stat-num').forEach((el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const obj = { val: 0 };
    ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter: () => gsap.to(obj, {
        val: target, duration: 1.6, ease: 'power2.out',
        onUpdate: () => { el.textContent = obj.val.toFixed(decimals); },
      }),
    });
  });

  const track = document.getElementById('timelineTrack');
  const pin = document.getElementById('timelinePin');
  if (track && pin) {
    const getScrollAmount = () => track.scrollWidth - track.clientWidth + 64;
    ScrollTrigger.create({
      trigger: pin, start: 'top top+=96', end: () => '+=' + getScrollAmount(),
      pin: true, scrub: 1, invalidateOnRefresh: true,
      onUpdate: (self) => {
        track.scrollLeft = self.progress * getScrollAmount();
        document.getElementById('timelineFill').style.width = (self.progress * 100) + '%';
      },
    });
  }

  gsap.utils.toArray('.t-card').forEach((el, i) => {
    gsap.fromTo(el, { opacity: 0, x: 40 }, {
      opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', delay: i * 0.1,
      scrollTrigger: { trigger: '.testimonials', start: 'top 75%' },
    });
  });
}

/* ===================================================================
   Marquees — logos + compliance badges (duplicated for seamless loop).
   Rendered as text chips, not <img>: the real logo/badge image files
   for these sections aren't available, and inventing placeholder
   graphics for real certifications/customer marks isn't appropriate.
=================================================================== */
function buildMarquees() {
  const proofNames = ['ACME Corp', 'Nova Retail', 'Orbit Logistics', 'Vertex Foods', 'Halcyon Group', 'Meridian Tech', 'Solace Energy', 'Anchor Freight'];
  const proofTrack = document.getElementById('proofTrack');
  if (proofTrack) {
    const html = proofNames.map((n) => `<span class="m-item">${n}</span>`).join('');
    proofTrack.innerHTML = html + html;
    proofTrack.style.setProperty('--marquee-duration', '34s');
  }

  const badges = ['GDPR', 'ISO 27001', 'VAPT', 'AICPA SOC', 'ZATCA', 'FTA', 'Peppol', 'IATA'];
  const complianceTrack = document.getElementById('complianceTrack');
  if (complianceTrack) {
    const html = badges.map((name) => `<span class="chip-pill">${name}</span>`).join('');
    complianceTrack.innerHTML = html + html;
    complianceTrack.style.setProperty('--marquee-duration', '28s');
  }
}

/* ===================================================================
   FAQ accordion
=================================================================== */
function initFaq() {
  document.querySelectorAll('.faq-item').forEach((item) => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      document.querySelectorAll('.faq-item.is-open').forEach((openItem) => {
        if (openItem !== item) {
          openItem.classList.remove('is-open');
          gsap.to(openItem.querySelector('.faq-a'), { height: 0, duration: 0.4, ease: 'power2.inOut' });
        }
      });
      if (isOpen) {
        item.classList.remove('is-open');
        gsap.to(a, { height: 0, duration: 0.4, ease: 'power2.inOut' });
      } else {
        item.classList.add('is-open');
        gsap.set(a, { height: 'auto' });
        gsap.from(a, { height: 0, duration: 0.4, ease: 'power2.inOut' });
      }
    });
  });
}

/* ===================================================================
   Sub-nav frosted bar: adds a hairline once scrolled past the hero,
   matching Apple's flat, no-shadow elevation philosophy.
=================================================================== */
function initSubNav() {
  const subNav = document.getElementById('subNav');
  const hero = document.getElementById('hero');
  if (!subNav || !hero || !window.ScrollTrigger) return;
  ScrollTrigger.create({
    trigger: hero, start: 'bottom top+=100',
    onEnter: () => subNav.classList.add('is-scrolled'),
    onLeaveBack: () => subNav.classList.remove('is-scrolled'),
  });
}

/* ===================================================================
   Mobile nav toggle (simple)
=================================================================== */
function initNavBurger() {
  const burger = document.getElementById('navBurger');
  const links = document.querySelector('.gn-links');
  if (!burger || !links) return;
  burger.addEventListener('click', () => {
    const open = links.style.display === 'flex';
    links.style.display = open ? 'none' : 'flex';
    links.style.cssText += 'position:absolute;top:100%;left:0;right:0;flex-direction:column;background:#000;padding:16px 24px;gap:14px;';
    links.querySelectorAll('a').forEach((a) => (a.style.color = '#fff'));
  });
}

function safe(fn, label) {
  try { fn(); } catch (err) { console.error(`[main.js] ${label} failed:`, err); }
}

document.addEventListener('DOMContentLoaded', () => {
  safe(buildMarquees, 'buildMarquees');
  safe(initFaq, 'initFaq');
  safe(initNavBurger, 'initNavBurger');
  if (window.gsap && window.ScrollTrigger) {
    safe(initGsap, 'initGsap');
    safe(initSubNav, 'initSubNav');
  } else {
    forceReveal();
  }
  setTimeout(forceReveal, 4000);
});

function forceReveal() {
  const isTweening = window.gsap ? window.gsap.isTweening.bind(window.gsap) : () => false;
  document.querySelectorAll('.reveal-up, .reveal-line').forEach((el) => {
    if (parseFloat(getComputedStyle(el).opacity) < 1 && !isTweening(el)) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    }
  });
}
