// THREE is loaded globally via assets/js/three.min.js (classic script, not a
// module) so this file can run when the page is opened directly (file://),
// where ES module scripts are blocked from loading local files.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ===================================================================
   THREE.JS — hero "global e-invoicing network" scene
=================================================================== */
function initHero() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const heroEl = document.getElementById('hero');
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch (err) {
    canvas.style.display = 'none';
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 9);

  const group = new THREE.Group();
  scene.add(group);

  const RADIUS = 3.1;
  const NODE_COUNT = 140;
  const nodePositions = [];

  const nodeGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(NODE_COUNT * 3);
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < NODE_COUNT; i++) {
    const y = 1 - (i / (NODE_COUNT - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;
    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;
    const v = new THREE.Vector3(x, y, z).multiplyScalar(RADIUS);
    positions[i * 3] = v.x;
    positions[i * 3 + 1] = v.y;
    positions[i * 3 + 2] = v.z;
    nodePositions.push(v);
  }
  nodeGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const nodeMat = new THREE.PointsMaterial({
    color: 0xada1ff, size: 0.055, transparent: true, opacity: 0.85, sizeAttenuation: true,
  });
  const nodePoints = new THREE.Points(nodeGeo, nodeMat);
  group.add(nodePoints);

  const shellGeo = new THREE.IcosahedronGeometry(RADIUS, 3);
  const shellMat = new THREE.MeshBasicMaterial({ color: 0x5446ff, wireframe: true, transparent: true, opacity: 0.06 });
  group.add(new THREE.Mesh(shellGeo, shellMat));

  const ARC_COUNT = 26;
  const arcLines = [];
  function makeArc() {
    const a = nodePositions[Math.floor(Math.random() * NODE_COUNT)];
    const b = nodePositions[Math.floor(Math.random() * NODE_COUNT)];
    const mid = a.clone().add(b).multiplyScalar(0.5);
    mid.setLength(RADIUS * 1.55);
    const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
    const pts = curve.getPoints(40);
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({ color: 0xc8f006, transparent: true, opacity: 0 });
    const line = new THREE.Line(geo, mat);
    line.userData = { life: 0, speed: 0.006 + Math.random() * 0.006, delay: Math.random() * 200 };
    return line;
  }
  for (let i = 0; i < ARC_COUNT; i++) {
    const line = makeArc();
    group.add(line);
    arcLines.push(line);
  }

  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambient);

  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5);
    mouseY = (e.clientY / window.innerHeight - 0.5);
  });

  function resize() {
    const w = heroEl.clientWidth;
    const h = heroEl.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  let scrollFade = 1;
  window.addEventListener('scroll', () => {
    const p = Math.min(window.scrollY / window.innerHeight, 1);
    scrollFade = 1 - p * 0.6;
    group.position.y = -p * 1.2;
  }, { passive: true });

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const dt = clock.getDelta();

    group.rotation.y += dt * 0.06;
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, mouseY * 0.25, 0.04);
    group.rotation.y += mouseX * 0.0006;

    arcLines.forEach((line) => {
      const ud = line.userData;
      if (ud.delay > 0) { ud.delay -= 1; return; }
      ud.life += ud.speed;
      if (ud.life > 1.6) {
        const fresh = makeArc();
        line.geometry.dispose();
        line.geometry = fresh.geometry;
        ud.life = 0;
        ud.speed = fresh.userData.speed;
      }
      const t = ud.life;
      line.material.opacity = Math.max(0, Math.sin(Math.min(t, 1) * Math.PI)) * 0.55 * scrollFade;
    });

    nodeMat.opacity = 0.85 * scrollFade;
    shellMat.opacity = 0.06 * scrollFade;

    renderer.render(scene, camera);
  }
  if (!reduceMotion) animate(); else { resize(); renderer.render(scene, camera); }
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
