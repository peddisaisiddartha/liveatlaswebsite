/* ============================================================
   LIVEATLAS — APP.JS
   3D Engine: Three.js Globe + Particle Field + Scroll Camera
   This file powers the living, breathing background of the site.
   ============================================================ */

(function () {
  'use strict';

  /* ── Wait for DOM ── */
  document.addEventListener('DOMContentLoaded', init);

  /* ── Global state ── */
  const state = {
    mouse: { x: 0, y: 0, nx: 0, ny: 0 },   /* normalized -1 to 1 */
    scroll: { y: 0, progress: 0 },
    viewport: { w: window.innerWidth, h: window.innerHeight },
    ready: false,
  };

  /* ============================================================
     LOADER
  ============================================================ */
  function runLoader(onComplete) {
    const loader  = document.getElementById('la-loader');
    const bar     = document.querySelector('.la-loader__bar');
    if (!loader) { onComplete(); return; }

    let prog = 0;
    const tick = setInterval(() => {
      prog += Math.random() * 14 + 4;
      if (prog >= 100) {
        prog = 100;
        clearInterval(tick);
        bar.style.width = '100%';
        setTimeout(() => {
          loader.classList.add('hidden');
          onComplete();
        }, 500);
      }
      bar.style.width = prog + '%';
    }, 80);
  }

  /* ============================================================
     MAIN INIT
  ============================================================ */
  function init() {
    runLoader(() => {
      setupCursor();
      setupScrollTracking();
      setupIntersectionObserver();
      setupNavScroll();
      setupMobileMenu();

      /* Only boot Three.js if canvas exists */
      const canvas = document.getElementById('la-canvas');
      if (canvas && typeof THREE !== 'undefined') {
        bootThreeScene(canvas);
      } else {
        /* Fallback: animated starfield via 2D canvas */
        const fallback = document.getElementById('la-canvas-2d');
        if (fallback) bootStarfield2D(fallback);
      }

      state.ready = true;
    });
  }

  /* ============================================================
     CURSOR
  ============================================================ */
  function setupCursor() {
    const dot  = document.getElementById('la-cursor');
    const ring = document.getElementById('la-cursor-ring');
    if (!dot || !ring) return;

    let rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
      state.mouse.x = e.clientX;
      state.mouse.y = e.clientY;
      state.mouse.nx = (e.clientX / state.viewport.w) * 2 - 1;
      state.mouse.ny = -(e.clientY / state.viewport.h) * 2 + 1;
      dot.style.left = e.clientX + 'px';
      dot.style.top  = e.clientY + 'px';
    });

    /* Ring follows with lag */
    (function animRing() {
      rx += (state.mouse.x - rx) * 0.11;
      ry += (state.mouse.y - ry) * 0.11;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(animRing);
    })();

    /* Hover detection */
    const hoverEls = 'a, button, .card-feature, .card-dest, .btn-primary, .btn-ghost';
    document.querySelectorAll(hoverEls).forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    /* Also watch dynamically added elements */
    const obs = new MutationObserver(() => {
      document.querySelectorAll(hoverEls).forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
      });
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }

  /* ============================================================
     SCROLL TRACKING
  ============================================================ */
  function setupScrollTracking() {
    const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;

    window.addEventListener('scroll', () => {
      state.scroll.y        = window.scrollY;
      state.scroll.progress = window.scrollY / (maxScroll() || 1);
    }, { passive: true });

    window.addEventListener('resize', () => {
      state.viewport.w = window.innerWidth;
      state.viewport.h = window.innerHeight;
    });
  }

  /* ============================================================
     INTERSECTION OBSERVER — scroll reveals
  ============================================================ */
  function setupIntersectionObserver() {
    const classes = ['.reveal', '.reveal-left', '.reveal-right', '.reveal-scale',
                     '.card-feature', '.card-dest', '.timeline-item', '.card-stat'];

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    classes.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => io.observe(el));
    });
  }

  /* ============================================================
     NAV SCROLL EFFECT
  ============================================================ */
  function setupNavScroll() {
    const nav = document.querySelector('.la-nav');
    if (!nav) return;

    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  /* ============================================================
     MOBILE MENU
  ============================================================ */
  function setupMobileMenu() {
    const burger = document.querySelector('.la-nav__hamburger');
    const menu   = document.querySelector('.la-nav__mobile');
    if (!burger || !menu) return;

    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      menu.classList.toggle('open');
    });

    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        burger.classList.remove('open');
        menu.classList.remove('open');
      });
    });
  }

  /* ============================================================
     THREE.JS GLOBE SCENE
     Requires Three.js loaded via CDN in the HTML
  ============================================================ */
  function bootThreeScene(canvas) {
    const W = state.viewport.w;
    const H = state.viewport.h;

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    /* ── Scene & Camera ── */
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 1000);
    camera.position.set(0, 0, 5);

    /* ── Ambient + directional light ── */
    scene.add(new THREE.AmbientLight(0xffffff, 0.15));

    const sunLight = new THREE.DirectionalLight(0xE8935A, 1.8);
    sunLight.position.set(3, 2, 4);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x4466ff, 0.5);
    rimLight.position.set(-4, -1, -2);
    scene.add(rimLight);

    /* ── Globe ── */
    const globeGeo  = new THREE.SphereGeometry(1.5, 64, 64);
    const globeMat  = new THREE.MeshStandardMaterial({
      color:       0x0B1A3A,
      emissive:    0x0B1A3A,
      emissiveIntensity: 0.3,
      roughness:   0.85,
      metalness:   0.1,
      wireframe:   false,
    });
    const globe = new THREE.Mesh(globeGeo, globeMat);
    scene.add(globe);

    /* ── Globe wireframe overlay ── */
    const wireMat = new THREE.MeshBasicMaterial({
      color:       0xE8935A,
      wireframe:   true,
      transparent: true,
      opacity:     0.06,
    });
    const wire = new THREE.Mesh(new THREE.SphereGeometry(1.51, 32, 32), wireMat);
    scene.add(wire);

    /* ── Atmosphere glow ── */
    const atmGeo = new THREE.SphereGeometry(1.65, 64, 64);
    const atmMat = new THREE.MeshStandardMaterial({
      color:       0xE8935A,
      transparent: true,
      opacity:     0.04,
      side:        THREE.BackSide,
    });
    scene.add(new THREE.Mesh(atmGeo, atmMat));

    /* ── Location pins (floating dots on globe) ── */
    const pinPositions = [
      /* lat/lon → 3D for a few destination countries */
      latLonTo3D(20.5, 78.9,  1.52),   /* India */
      latLonTo3D(24.0, 53.8,  1.52),   /* UAE */
      latLonTo3D(56.0, 10.0,  1.52),   /* Denmark */
      latLonTo3D(-75.0, 0.0,  1.52),   /* Antarctica */
      latLonTo3D(35.6, 139.7, 1.52),   /* Japan */
      latLonTo3D(48.8, 2.35,  1.52),   /* France */
      latLonTo3D(-22.9, -43.2, 1.52),  /* Brazil */
      latLonTo3D(40.7, -74.0, 1.52),   /* USA */
    ];

    const pinGeo = new THREE.SphereGeometry(0.022, 8, 8);
    const pinMat = new THREE.MeshBasicMaterial({ color: 0xE8935A });
    pinPositions.forEach(pos => {
      const pin = new THREE.Mesh(pinGeo, pinMat);
      pin.position.copy(pos);
      globe.add(pin); /* add to globe so it rotates with it */
    });

    /* ── Connection arcs between pins ── */
    const arcMat = new THREE.LineBasicMaterial({
      color: 0xE8935A,
      transparent: true,
      opacity: 0.18,
    });
    const arcPairs = [[0,1],[0,2],[1,3],[0,5],[4,5],[6,7]];
    arcPairs.forEach(([a, b]) => {
      const arc = buildArc(pinPositions[a], pinPositions[b], 1.52, 0.35, 32);
      globe.add(new THREE.Line(arc, arcMat));
    });

    /* ── Particles / Stars ── */
    const particleCount = 2500;
    const partPositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r     = 8 + Math.random() * 18;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      partPositions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      partPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      partPositions[i * 3 + 2] = r * Math.cos(phi);
    }
    const partGeo = new THREE.BufferGeometry();
    partGeo.setAttribute('position', new THREE.BufferAttribute(partPositions, 3));
    const partMat = new THREE.PointsMaterial({
      color: 0xF0EBE1,
      size:  0.04,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
    });
    scene.add(new THREE.Points(partGeo, partMat));

    /* ── Orbit ring ── */
    const ringGeo = new THREE.TorusGeometry(2.1, 0.003, 4, 120);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xE8935A,
      transparent: true,
      opacity: 0.2,
    });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 2.5;
    scene.add(ring1);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(2.5, 0.002, 4, 120),
      new THREE.MeshBasicMaterial({ color: 0xE8935A, transparent: true, opacity: 0.1 })
    );
    ring2.rotation.x = Math.PI / 3.5;
    ring2.rotation.y = Math.PI / 4;
    scene.add(ring2);

    /* ── Resize handler ── */
    window.addEventListener('resize', () => {
      const w = window.innerWidth, h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });

    /* ── Animate ── */
    const clock = new THREE.Clock();

    (function animate() {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      /* Globe slow auto-rotation */
      globe.rotation.y = t * 0.06;
      wire.rotation.y  = t * 0.04;

      /* Mouse parallax on camera */
      const targetX = state.mouse.nx * 0.3;
      const targetY = state.mouse.ny * 0.2;
      camera.position.x += (targetX - camera.position.x) * 0.04;
      camera.position.y += (targetY - camera.position.y) * 0.04;
      camera.lookAt(scene.position);

      /* Scroll: push globe back and fade as user scrolls */
      const sp = state.scroll.progress;
      globe.position.z = -sp * 1.5;
      globe.scale.setScalar(1 - sp * 0.18);
      globeMat.opacity = 1 - sp * 0.6;

      /* Orbit rings gentle rotation */
      ring1.rotation.z = t * 0.12;
      ring2.rotation.z = -t * 0.08;

      /* Particles slow drift */
      partMat.opacity = 0.55 - sp * 0.35;

      renderer.render(scene, camera);
    })();
  }

  /* ============================================================
     HELPERS — 3D MATH
  ============================================================ */

  /* Convert latitude/longitude to a point on a sphere of radius r */
  function latLonTo3D(lat, lon, r) {
    const phi   = (90 - lat)  * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -r * Math.sin(phi) * Math.cos(theta),
       r * Math.cos(phi),
       r * Math.sin(phi) * Math.sin(theta)
    );
  }

  /* Build a curved arc between two 3D points on a sphere */
  function buildArc(v1, v2, radius, height, segments) {
    const points = [];
    for (let i = 0; i <= segments; i++) {
      const t      = i / segments;
      const interp = new THREE.Vector3().lerpVectors(v1, v2, t);
      /* Push outward from center to create the arc curve */
      interp.normalize().multiplyScalar(radius + height * Math.sin(Math.PI * t));
      points.push(interp);
    }
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }

  /* ============================================================
     FALLBACK — 2D Starfield (when Three.js not available)
  ============================================================ */
  function bootStarfield2D(canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, stars = [];

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function genStars(n) {
      stars = Array.from({ length: n }, () => ({
        x:     Math.random() * W,
        y:     Math.random() * H,
        r:     Math.random() * 1 + 0.2,
        a:     Math.random(),
        da:    (Math.random() - 0.5) * 0.004,
        speed: Math.random() * 0.1 + 0.02,
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      stars.forEach(s => {
        s.a += s.da;
        if (s.a < 0 || s.a > 1) s.da *= -1;
        s.y += s.speed;
        if (s.y > H) { s.y = 0; s.x = Math.random() * W; }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240,235,225,${s.a * 0.6})`;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', () => { resize(); genStars(300); });
    resize(); genStars(300); draw();
  }

})();
