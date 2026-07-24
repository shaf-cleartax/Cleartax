// THREE is loaded globally via assets/js/three.min.js (classic script, not a
// module) so this file can run when the page is opened directly (file://),
// where ES module scripts are blocked from loading local files.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ===================================================================
   THREE.JS — hero dot field. A regular grid of dots rendered with an
   orthographic camera mapped 1:1 to CSS pixels. Each dot eases toward
   an offset pulled softly in the cursor's direction whenever the
   cursor is within range, and eases back to its rest position once
   the cursor moves away — a gentle "attraction", not a snap.
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
  let W = heroEl.clientWidth;
  let H = heroEl.clientHeight;
  const camera = new THREE.OrthographicCamera(0, W, 0, H, -10, 10);
  camera.position.z = 10;

  const SPACING = 34;
  const RADIUS_PX = 170;      // px influence radius around the cursor
  const MAX_PULL = 30;        // px a dot can be pulled toward the cursor
  const EASE = 0.09;          // per-frame easing toward target (softness)

  const BASE_COLOR = new THREE.Color(0x4a4470);
  const HOT_COLOR = new THREE.Color(0xc8f006);

  let cols, rows, count;
  let rest = [];
  let current = [];
  let geometry, points, material, texture;

  function buildGrid() {
    cols = Math.ceil(W / SPACING) + 1;
    rows = Math.ceil(H / SPACING) + 1;
    count = cols * rows;
    rest = new Array(count);
    current = new Array(count);
    let i = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * SPACING;
        const y = r * SPACING;
        rest[i] = [x, y];
        current[i] = [x, y];
        i++;
      }
    }
  }
  buildGrid();

  function dotTexture() {
    const s = 64;
    const cnv = document.createElement('canvas');
    cnv.width = cnv.height = s;
    const ctx = cnv.getContext('2d');
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.6, 'rgba(255,255,255,0.9)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
    return new THREE.CanvasTexture(cnv);
  }
  texture = dotTexture();

  function buildPoints() {
    if (points) {
      scene.remove(points);
      geometry.dispose();
    }
    geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = current[i][0];
      positions[i * 3 + 1] = current[i][1];
      positions[i * 3 + 2] = 0;
      colors[i * 3] = BASE_COLOR.r;
      colors[i * 3 + 1] = BASE_COLOR.g;
      colors[i * 3 + 2] = BASE_COLOR.b;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.attributes.position.setUsage(THREE.DynamicDrawUsage);
    geometry.attributes.color.setUsage(THREE.DynamicDrawUsage);
    material = new THREE.PointsMaterial({
      size: 4.4, map: texture, transparent: true, opacity: 0.85,
      vertexColors: true, depthWrite: false, sizeAttenuation: false,
    });
    points = new THREE.Points(geometry, material);
    scene.add(points);
  }
  buildPoints();

  let mouse = { x: -9999, y: -9999, active: false };
  function setMouseFromEvent(clientX, clientY) {
    const rect = heroEl.getBoundingClientRect();
    mouse.x = clientX - rect.left;
    mouse.y = clientY - rect.top;
    mouse.active = mouse.x >= 0 && mouse.x <= W && mouse.y >= 0 && mouse.y <= H;
  }
  window.addEventListener('mousemove', (e) => setMouseFromEvent(e.clientX, e.clientY), { passive: true });
  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) setMouseFromEvent(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
  window.addEventListener('mouseleave', () => { mouse.active = false; });
  window.addEventListener('touchend', () => { mouse.active = false; });

  function resize() {
    W = heroEl.clientWidth;
    H = heroEl.clientHeight;
    renderer.setSize(W, H, false);
    camera.right = W;
    camera.bottom = H;
    camera.updateProjectionMatrix();
    buildGrid();
    buildPoints();
  }
  resize();
  window.addEventListener('resize', resize);

  let scrollFade = 1;
  window.addEventListener('scroll', () => {
    const p = Math.min(window.scrollY / window.innerHeight, 1);
    scrollFade = 1 - p * 0.7;
  }, { passive: true });

  const posAttr = () => geometry.attributes.position;
  const colAttr = () => geometry.attributes.color;

  function frame() {
    requestAnimationFrame(frame);
    const pos = posAttr().array;
    const col = colAttr().array;

    for (let i = 0; i < count; i++) {
      const rx = rest[i][0], ry = rest[i][1];
      let tx = rx, ty = ry, pull = 0;

      if (mouse.active) {
        const dx = mouse.x - rx;
        const dy = mouse.y - ry;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < RADIUS_PX) {
          pull = Math.pow(1 - dist / RADIUS_PX, 2);
          const nx = dist > 0.001 ? dx / dist : 0;
          const ny = dist > 0.001 ? dy / dist : 0;
          tx = rx + nx * MAX_PULL * pull;
          ty = ry + ny * MAX_PULL * pull;
        }
      }

      const cx = current[i][0] + (tx - current[i][0]) * EASE;
      const cy = current[i][1] + (ty - current[i][1]) * EASE;
      current[i][0] = cx;
      current[i][1] = cy;
      pos[i * 3] = cx;
      pos[i * 3 + 1] = cy;

      const r = BASE_COLOR.r + (HOT_COLOR.r - BASE_COLOR.r) * pull;
      const g = BASE_COLOR.g + (HOT_COLOR.g - BASE_COLOR.g) * pull;
      const b = BASE_COLOR.b + (HOT_COLOR.b - BASE_COLOR.b) * pull;
      col[i * 3] = r; col[i * 3 + 1] = g; col[i * 3 + 2] = b;
    }
    posAttr().needsUpdate = true;
    colAttr().needsUpdate = true;
    material.opacity = 0.85 * scrollFade;
    renderer.render(scene, camera);
  }

  if (!reduceMotion) frame(); else renderer.render(scene, camera);
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
    .to('.hero-sub.reveal-up, .hero-form.reveal-up, .hero-pills.reveal-up', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12 }, 0.55);

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

  gsap.utils.toArray('.step-card').forEach((el, i) => {
    gsap.fromTo(el, { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: (i % 5) * 0.07,
      scrollTrigger: { trigger: el, start: 'top 90%' },
    });
  });

  gsap.to('.mini-chart span', {
    scaleY: 1, duration: 0.9, ease: 'power3.out', stagger: 0.06,
    scrollTrigger: { trigger: '.mini-chart', start: 'top 85%' },
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

  const badges = ['GDPR compliant', 'ISO 27001 certified', 'SWIFT accredited', 'SOC 2 compliant', 'Accredited by ZATCA, FTA, LHDN, MDEC, VAT', 'Open Peppol Access Point'];
  const complianceTrack = document.getElementById('complianceTrack');
  if (complianceTrack) {
    const html = badges.map((name) => `<span class="badge-chip">${name}</span>`).join('');
    complianceTrack.innerHTML = html + html;
    complianceTrack.style.setProperty('--marquee-duration', '30s');
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
