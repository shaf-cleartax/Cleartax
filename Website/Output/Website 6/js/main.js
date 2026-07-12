/* ===================================================================
   GSAP — scroll storytelling. No Three.js and no pinned horizontal
   timeline in this build: Cohere's own docs favor rule-separated
   research-table lists over decorative card carousels for exactly
   this kind of roadmap content, so the mandate timeline is a plain
   vertical list instead.
=================================================================== */
function initGsap() {
  gsap.registerPlugin(ScrollTrigger);

  gsap.to('#scrollProgress', {
    width: '100%', ease: 'none',
    scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true },
  });

  const heroTl = gsap.timeline({ delay: 0.2 });
  heroTl
    .to('.hero-badge .reveal-line', { y: '0%', duration: 0.7, ease: 'power3.out' })
    .to('.hero-title .reveal-line', { y: '0%', duration: 0.9, ease: 'power4.out', stagger: 0.1 }, 0.12)
    .to('.hero-sub.reveal-up, .hero-actions.reveal-up', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1 }, 0.5)
    .to('.hero-media.reveal-up', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 0.55);

  gsap.utils.toArray('.reveal-up').forEach((el) => {
    if (el.closest('.hero')) return;
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%' },
    });
  });

  gsap.utils.toArray('.rt-row:not(.rt-row--head)').forEach((el, i) => {
    gsap.fromTo(el, { opacity: 0, y: 20 }, {
      opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: (i % 6) * 0.04,
      scrollTrigger: { trigger: el, start: 'top 92%' },
    });
  });

  document.querySelectorAll('.stat-num').forEach((el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const obj = { val: 0 };
    ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter: () => gsap.to(obj, {
        val: target, duration: 1.4, ease: 'power2.out',
        onUpdate: () => { el.textContent = obj.val.toFixed(decimals); },
      }),
    });
  });
}

/* ===================================================================
   Marquees — logos + compliance badges (duplicated for seamless loop).
   Rendered as text/pill chips, not <img>: the real logo/badge image
   files for these sections aren't available, and inventing placeholder
   graphics for real certifications/customer marks isn't appropriate.
=================================================================== */
function buildMarquees() {
  const proofNames = ['ACME Corp', 'Nova Retail', 'Orbit Logistics', 'Vertex Foods', 'Halcyon Group', 'Meridian Tech', 'Solace Energy', 'Anchor Freight'];
  const proofTrack = document.getElementById('proofTrack');
  if (proofTrack) {
    const html = proofNames.map((n) => `<span class="m-item">${n}</span>`).join('');
    proofTrack.innerHTML = html + html;
    proofTrack.style.setProperty('--marquee-duration', '36s');
  }

  const badges = ['GDPR', 'ISO 27001', 'VAPT', 'AICPA SOC', 'ZATCA', 'FTA', 'Peppol', 'IATA'];
  const complianceTrack = document.getElementById('complianceTrack');
  if (complianceTrack) {
    const html = badges.map((name) => `<span class="pill-outline">${name}</span>`).join('');
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
   Announcement bar dismiss + nav scroll shadow
=================================================================== */
function initAnnouncement() {
  const bar = document.getElementById('announcement');
  const close = document.getElementById('announcementClose');
  if (!bar || !close) return;
  close.addEventListener('click', () => {
    bar.style.display = 'none';
    document.body.classList.add('announcement-dismissed');
  });
}

function initNavScroll() {
  const nav = document.getElementById('siteNav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 40);
  }, { passive: true });
}

/* ===================================================================
   Mobile nav toggle (simple)
=================================================================== */
function initNavBurger() {
  const burger = document.getElementById('navBurger');
  const links = document.querySelector('.nav-links');
  if (!burger || !links) return;
  burger.addEventListener('click', () => {
    const open = links.style.display === 'flex';
    links.style.display = open ? 'none' : 'flex';
    links.style.cssText += 'position:absolute;top:100%;left:0;right:0;flex-direction:column;background:#fff;padding:16px 24px;gap:14px;border-bottom:1px solid #d9d9dd;';
    links.querySelectorAll('a').forEach((a) => (a.style.color = '#212121'));
  });
}

function safe(fn, label) {
  try { fn(); } catch (err) { console.error(`[main.js] ${label} failed:`, err); }
}

document.addEventListener('DOMContentLoaded', () => {
  safe(buildMarquees, 'buildMarquees');
  safe(initFaq, 'initFaq');
  safe(initNavBurger, 'initNavBurger');
  safe(initAnnouncement, 'initAnnouncement');
  safe(initNavScroll, 'initNavScroll');
  if (window.gsap && window.ScrollTrigger) {
    safe(initGsap, 'initGsap');
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
