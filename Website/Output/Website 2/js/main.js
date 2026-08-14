// THREE is loaded globally via assets/js/three.min.js (classic script, not a
// module) so this file can run when the page is opened directly (file://),
// where ES module scripts are blocked from loading local files.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ===================================================================
   THREE.JS — hero "ring sphere"

   A sphere described only by its latitude rings: N hairline circles whose
   radius follows sin(phi) and whose height follows cos(phi), so the stack
   reads as a globe without any surface or longitude lines. Each ring gets
   its own dash pattern and a slightly different drift speed, which gives
   the woven, hand-hatched shimmer. Scrolling drives an "unwind" that pulls
   the rings apart along the tilted axis, so the sphere stretches into a
   spiral as the hero leaves the viewport.
=================================================================== */
function initHero() {
  const canvas = document.getElementById('heroCanvas');
  const heroEl = document.getElementById('hero');
  if (!canvas || !heroEl) return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch (err) {
    canvas.style.display = 'none';
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0, 10);

  const group = new THREE.Group();
  scene.add(group);

  const RING_COUNT = 30;
  const RADIUS = 2.2;
  const SEGMENTS = 220;

  // one shared unit circle in the XZ plane; rings differ by scale + height,
  // so dash lengths scale with the ring and larger rings read looser
  const ringGeo = (() => {
    const pts = [];
    for (let i = 0; i <= SEGMENTS; i++) {
      const a = (i / SEGMENTS) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a), 0, Math.sin(a)));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  })();

  // palette pulled from the page's own tokens
  const INK = 0xE9E1FF;
  const ACCENT = 0xBB33FF;
  const DEEP = 0xC9ADFF;

  const rings = [];
  for (let i = 0; i < RING_COUNT; i++) {
    const t = (i + 0.5) / RING_COUNT;
    const phi = t * Math.PI;
    const r = Math.sin(phi) * RADIUS;
    const y = Math.cos(phi) * RADIUS;

    // a few rings pick up the violet accent, the rest stay near-white
    const isAccent = i % 7 === 3;
    const color = isAccent ? ACCENT : (i % 3 === 0 ? DEEP : INK);

    const mat = new THREE.LineDashedMaterial({
      color,
      transparent: true,
      opacity: isAccent ? 0.55 : 0.13 + Math.sin(phi) * 0.22,
      dashSize: 0.04 + (i % 5) * 0.03,
      gapSize: 0.02 + (i % 4) * 0.035,
      linewidth: 1,
    });

    const line = new THREE.Line(ringGeo, mat);
    line.computeLineDistances();
    line.scale.set(r, 1, r);
    line.position.y = y;
    // each ring drifts at its own rate — this is what makes the surface shimmer
    line.userData = {
      baseY: y,
      baseR: r,
      spin: (i % 2 ? 1 : -1) * (0.05 + (i % 6) * 0.012),
      phase: i * 0.37,
      baseOpacity: mat.opacity,
    };
    group.add(line);
    rings.push(line);
  }

  // slanted axis, so it reads as a tilted globe rather than a flat stack
  group.rotation.z = -0.42;
  group.rotation.x = 0.16;

  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX / window.innerWidth - 0.5;
    mouseY = e.clientY / window.innerHeight - 0.5;
  }, { passive: true });

  // dimmed when the sphere has to sit behind the copy instead of beside it
  let dim = 1;

  function resize() {
    const w = heroEl.clientWidth;
    const h = heroEl.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.z = w < 760 ? 13.5 : 10;
    camera.updateProjectionMatrix();

    // keep it out of the headline: parked in the right half when there's room,
    // centred behind the copy (and much fainter) when there isn't
    if (w >= 1180) { group.position.x = 3.0; dim = 1; }
    else if (w >= 900) { group.position.x = 2.3; dim = 0.9; }
    else if (w >= 760) { group.position.x = 1.6; dim = 0.7; }
    else { group.position.x = 0; dim = 0.4; }
  }
  resize();
  window.addEventListener('resize', resize);

  // scroll drives the unwind: 0 = tight sphere, 1 = stretched spiral
  let unwind = 0;
  let scrollFade = 1;
  window.addEventListener('scroll', () => {
    const p = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1);
    unwind = p;
    scrollFade = 1 - p * 0.75;
  }, { passive: true });

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.05);
    const time = clock.elapsedTime;

    group.rotation.y += dt * 0.13;
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, 0.16 + mouseY * 0.22, 0.04);
    group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, -0.42 + mouseX * 0.16, 0.04);

    const mid = (RING_COUNT - 1) / 2;
    rings.forEach((line, i) => {
      const d = line.userData;
      line.rotation.y += dt * d.spin;

      // pull rings apart along the axis and even out their radii, so the
      // silhouette travels from sphere towards tube as you scroll
      const spread = (i - mid) * 0.30 * unwind;
      line.position.y = d.baseY + spread;
      const rr = THREE.MathUtils.lerp(d.baseR, RADIUS * 0.72, unwind * 0.85);
      line.scale.set(rr, 1, rr);

      // gentle breathing so it never looks frozen
      const breathe = 1 + Math.sin(time * 0.6 + d.phase) * 0.06;
      line.material.opacity = d.baseOpacity * breathe * scrollFade * dim;
    });

    renderer.render(scene, camera);
  }

  if (!reduceMotion) {
    animate();
  } else {
    resize();
    renderer.render(scene, camera);
  }
}

/* ===================================================================
   GSAP — scroll storytelling
=================================================================== */
function initGsap() {
  gsap.registerPlugin(ScrollTrigger);

  gsap.to('#scrollProgress', {
    width: '100%', ease: 'none',
    scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true },
  });

  ScrollTrigger.create({
    trigger: '#hero', start: 'bottom top+=80',
    onEnter: () => document.getElementById('siteNav').classList.add('is-solid'),
    onLeaveBack: () => document.getElementById('siteNav').classList.remove('is-solid'),
  });

  const heroTl = gsap.timeline({ delay: 0.2 });
  heroTl
    .to('.hero-eyebrow .reveal-line', { y: '0%', duration: 0.8, ease: 'power3.out' })
    .to('.hero-title .reveal-line', { y: '0%', duration: 1, ease: 'power4.out', stagger: 0.12 }, 0.15)
    .to('.hero-sub.reveal-up, .hero-actions.reveal-up, .hero-pills.reveal-up', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12 }, 0.55);

  gsap.utils.toArray('.reveal-up').forEach((el) => {
    if (el.closest('.hero')) return;
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });

  gsap.utils.toArray('.bento-card').forEach((el, i) => {
    gsap.fromTo(el, { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: (i % 3) * 0.08,
      scrollTrigger: { trigger: el, start: 'top 90%' },
    });
  });

  gsap.to('.mini-chart span', {
    scaleY: 1, duration: 0.9, ease: 'power3.out', stagger: 0.06,
    scrollTrigger: { trigger: '.mini-chart', start: 'top 85%' },
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
      trigger: pin, start: 'top top+=80', end: () => '+=' + getScrollAmount(),
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

  gsap.to('.partners-visual', {
    backgroundPosition: '50% 30%',
    scrollTrigger: { trigger: '.partners', start: 'top bottom', end: 'bottom top', scrub: true },
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
    const html = badges.map((name) => `<span class="badge-chip">${name}</span>`).join('');
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
   Mobile nav toggle (simple)
=================================================================== */
function initNavBurger() {
  const burger = document.getElementById('navBurger');
  const links = document.querySelector('.nav-links');
  if (!burger || !links) return;
  burger.addEventListener('click', () => {
    const open = links.style.display === 'flex';
    links.style.display = open ? 'none' : 'flex';
    links.style.cssText += 'position:absolute;top:100%;left:0;right:0;flex-direction:column;background:#fff;padding:20px 32px;gap:18px;';
    links.querySelectorAll('a').forEach((a) => (a.style.color = 'var(--ink)'));
  });
}

function safe(fn, label) {
  try { fn(); } catch (err) { console.error(`[main.js] ${label} failed:`, err); }
}

document.addEventListener('DOMContentLoaded', () => {
  safe(initHero, 'initHero');
  safe(buildMarquees, 'buildMarquees');
  safe(initFaq, 'initFaq');
  safe(initNavBurger, 'initNavBurger');
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
