/* ============================================================
   LIVEATLAS — SCRIPT.JS
   Micro-interactions, Counters, Parallax, Touch polish
   Works on top of app.js — no dependencies between them.
   ============================================================ */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    setupCounters();
    setupParallax();
    setupDestinationCards();
    setupSmoothAnchorLinks();
    setupActiveNavLink();
    setupTypewriter();
    setupTabSwitcher();
  });

  /* ============================================================
     1. ANIMATED NUMBER COUNTERS
     Add class="counter" data-target="1000" to any element.
  ============================================================ */
  function setupCounters() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el       = entry.target;
        const target   = parseFloat(el.dataset.target || 0);
        const suffix   = el.dataset.suffix || '';
        const prefix   = el.dataset.prefix || '';
        const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
        const duration = 1800;
        const start    = performance.now();

        function update(now) {
          const elapsed  = now - start;
          const progress = Math.min(elapsed / duration, 1);
          /* Ease out quart */
          const eased    = 1 - Math.pow(1 - progress, 4);
          const current  = eased * target;

          el.textContent = prefix + current.toFixed(decimals) + suffix;

          if (progress < 1) requestAnimationFrame(update);
          else el.textContent = prefix + target.toFixed(decimals) + suffix;
        }

        requestAnimationFrame(update);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach(el => io.observe(el));
  }

  /* ============================================================
     2. PARALLAX ON SCROLL
     Add class="parallax" data-speed="0.3" to any element.
     Speed 0 = no movement, 1 = full scroll speed.
  ============================================================ */
  function setupParallax() {
    const els = document.querySelectorAll('.parallax');
    if (!els.length) return;

    /* Respect reduced motion preference */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    function onScroll() {
      const scrollY = window.scrollY;
      els.forEach(el => {
        const speed  = parseFloat(el.dataset.speed || 0.2);
        const offset = scrollY * speed;
        el.style.transform = `translateY(${offset}px)`;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ============================================================
     3. DESTINATION CARD — tilt on mouse move
  ============================================================ */
  function setupDestinationCards() {
    const cards = document.querySelectorAll('.card-dest');
    if (!cards.length) return;

    /* Skip on touch devices */
    if (!window.matchMedia('(hover: hover)').matches) return;

    cards.forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect   = card.getBoundingClientRect();
        const cx     = rect.left + rect.width  / 2;
        const cy     = rect.top  + rect.height / 2;
        const dx     = (e.clientX - cx) / (rect.width  / 2);
        const dy     = (e.clientY - cy) / (rect.height / 2);
        const tiltX  = dy * -6;
        const tiltY  = dx *  6;
        card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)';
        setTimeout(() => { card.style.transition = ''; }, 500);
      });
    });
  }

  /* ============================================================
     4. SMOOTH ANCHOR LINKS with offset for fixed nav
  ============================================================ */
  function setupSmoothAnchorLinks() {
    const NAV_H = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '72'
    );

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', e => {
        const id     = anchor.getAttribute('href').slice(1);
        const target = document.getElementById(id);
        if (!target) return;

        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - NAV_H - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  /* ============================================================
     5. ACTIVE NAV LINK based on current page
  ============================================================ */
  function setupActiveNavLink() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.la-nav__links a, .la-nav__mobile a').forEach(link => {
      const href = link.getAttribute('href') || '';
      if (href === path || (path === '' && href === 'index.html')) {
        link.style.color = 'var(--cream)';
        link.style.fontWeight = '600';
      }
    });
  }

  /* ============================================================
     6. TYPEWRITER EFFECT
     Add class="typewriter" data-words='["word1","word2"]' to a span.
  ============================================================ */
  function setupTypewriter() {
    const els = document.querySelectorAll('.typewriter');
    if (!els.length) return;

    els.forEach(el => {
      let words;
      try { words = JSON.parse(el.dataset.words || '[]'); } catch { return; }
      if (!words.length) return;

      let wi   = 0;  /* word index */
      let ci   = 0;  /* char index */
      let del  = false;

      const speed     = parseInt(el.dataset.speed   || '90');
      const pauseWait = parseInt(el.dataset.pause   || '1800');
      const delSpeed  = parseInt(el.dataset.delSpeed|| '55');

      el.style.borderRight = '2px solid var(--accent)';
      el.style.paddingRight = '2px';
      el.style.animation = 'none';

      function tick() {
        const word = words[wi];

        if (!del) {
          /* Typing */
          el.textContent = word.slice(0, ci + 1);
          ci++;
          if (ci === word.length) {
            del = true;
            setTimeout(tick, pauseWait);
            return;
          }
          setTimeout(tick, speed);
        } else {
          /* Deleting */
          el.textContent = word.slice(0, ci - 1);
          ci--;
          if (ci === 0) {
            del = false;
            wi  = (wi + 1) % words.length;
            setTimeout(tick, 300);
            return;
          }
          setTimeout(tick, delSpeed);
        }
      }

      setTimeout(tick, 500);
    });
  }

  /* ============================================================
     7. TAB SWITCHER
     Usage:
       <div class="tabs">
         <button class="tab-btn active" data-tab="t1">Tab 1</button>
         <button class="tab-btn"        data-tab="t2">Tab 2</button>
       </div>
       <div id="t1" class="tab-panel active">...</div>
       <div id="t2" class="tab-panel">...</div>
  ============================================================ */
  function setupTabSwitcher() {
    const btns = document.querySelectorAll('.tab-btn');
    if (!btns.length) return;

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.tab;
        const allBtns  = btn.closest('.tabs').querySelectorAll('.tab-btn');
        const allPanels = document.querySelectorAll('.tab-panel');

        allBtns.forEach(b => b.classList.remove('active'));
        allPanels.forEach(p => {
          p.classList.remove('active');
          p.style.opacity = '0';
          p.style.transform = 'translateY(10px)';
        });

        btn.classList.add('active');
        const target = document.getElementById(targetId);
        if (target) {
          target.classList.add('active');
          requestAnimationFrame(() => {
            target.style.opacity = '1';
            target.style.transform = 'translateY(0)';
            target.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          });
        }
      });
    });
  }

  /* ============================================================
     8. TOUCH — swipe to scroll horizontal carousels
     Add class="carousel" to the wrapper.
  ============================================================ */
  (function setupCarouselSwipe() {
    const carousels = document.querySelectorAll('.carousel');
    if (!carousels.length) return;

    carousels.forEach(el => {
      let startX = 0;

      el.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
      }, { passive: true });

      el.addEventListener('touchmove', e => {
        const diff = startX - e.touches[0].clientX;
        el.scrollLeft += diff * 0.8;
        startX = e.touches[0].clientX;
      }, { passive: true });
    });
  })();

  /* ============================================================
     9. RIPPLE EFFECT on buttons
  ============================================================ */
  (function setupRipple() {
    document.querySelectorAll('.btn-primary, .btn-ghost').forEach(btn => {
      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';

      btn.addEventListener('click', e => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.style.cssText = `
          position: absolute;
          border-radius: 50%;
          transform: scale(0);
          animation: ripple-anim 0.55s linear;
          background: rgba(255,255,255,0.22);
          width: 80px; height: 80px;
          left: ${x - 40}px; top: ${y - 40}px;
          pointer-events: none;
        `;

        /* Inject keyframe once */
        if (!document.getElementById('ripple-style')) {
          const style = document.createElement('style');
          style.id = 'ripple-style';
          style.textContent = `
            @keyframes ripple-anim {
              to { transform: scale(4); opacity: 0; }
            }
          `;
          document.head.appendChild(style);
        }

        btn.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
      });
    });
  })();

  /* ============================================================
     10. FOOTER YEAR — keeps copyright current automatically
  ============================================================ */
  (function updateYear() {
    const el = document.getElementById('current-year');
    if (el) el.textContent = new Date().getFullYear();
  })();

})();
