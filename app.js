document.addEventListener('DOMContentLoaded', () => {
  const data = window.RobaImages || {};

  /* ── RENDER PROJECT TILES per category ── */
  function corners() {
    return '<span class="g-corner tl"></span><span class="g-corner tr"></span><span class="g-corner bl"></span><span class="g-corner br"></span>';
  }

  function renderTiles() {
    document.querySelectorAll('[data-cat]').forEach(host => {
      const cat = host.dataset.cat;
      const entry = data[cat];
      if (!entry || !entry.projects.length) return;
      const isArchief = host.classList.contains('archief-grid');
      const isProjScroll = host.classList.contains('projecten-scroll');

      entry.projects.forEach((p, i) => {
        if (isArchief) {
          const item = document.createElement('div');
          item.className = 'arch-item';
          item.dataset.cat = cat; item.dataset.idx = i;
          const year = (p.title.match(/(19|20)\d{2}/) || [''])[0];
          item.innerHTML = `
            <div class="g-fill"><img src="${p.cover}" loading="lazy" alt=""></div>
            <div class="arch-year">${year || ''}</div>
          `;
          host.appendChild(item);
          return;
        }

        const item = document.createElement('div');
        item.className = 'g-item';
        if (!isProjScroll) {
          if (i % 7 === 0) item.classList.add('tall');
          else if (i % 5 === 4) item.classList.add('wide');
        }
        item.dataset.cat = cat; item.dataset.idx = i;
        item.innerHTML = `
          <div class="g-fill g-tall"><img src="${p.cover}" loading="lazy" alt=""></div>
          ${corners()}
          <div class="tile-label">
            <span class="tile-title">${p.title}</span>
            <span class="tile-count">${p.photos.length}</span>
          </div>
        `;
        host.appendChild(item);
      });
    });
  }
  renderTiles();

  /* ── HERO FILMSTRIP: 10 random project covers ── */
  function renderHeroStrip() {
    const strip = document.getElementById('hero-strip');
    if (!strip) return;
    const more = strip.querySelector('.strip-more');
    const all = [];
    Object.entries(data).forEach(([cat, entry]) => {
      if (cat === 'archief') return; // archive is intentionally muted; keep it out of the showcase
      entry.projects.forEach((p, idx) => all.push({ cat, idx, project: p }));
    });
    // Fisher-Yates shuffle, take 10
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }
    const picks = all.slice(0, 10);
    picks.forEach(({ cat, idx, project }) => {
      const a = document.createElement('a');
      a.className = 'strip-thumb';
      a.href = '#' + cat;
      a.dataset.cat = cat; a.dataset.idx = idx;
      a.innerHTML = `
        <div class="strip-thumb-inner"><img src="${project.cover}" loading="lazy" alt=""></div>
        <div class="strip-thumb-label">${project.title}</div>
      `;
      strip.insertBefore(a, more);
    });
  }
  renderHeroStrip();

  /* ── HERO PARALLAX (mouse) — keep, it's subtle and improves desktop feel ── */
  if (!matchMedia('(pointer: coarse)').matches) {
    const heroPx = document.getElementById('hero-parallax');
    const heroLight = document.getElementById('hero-light');
    const strip = document.getElementById('hero-strip');
    document.addEventListener('mousemove', e => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      if (heroPx) heroPx.style.transform = `translate(${nx * 12}px, ${ny * 8}px)`;
      if (heroLight) heroLight.style.background =
        `radial-gradient(ellipse 60% 50% at ${60 + nx*10}% ${40 + ny*8}%, rgba(180,20,20,0.14) 0%, transparent 70%)`;
      if (strip) strip.style.transform = `translateX(${(nx/2) * -18}px)`;
    });
  }

  /* ── NAV SOLID ON SCROLL ── */
  const nav = document.getElementById('main-nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('solid', window.scrollY > 80);
  });

  /* ── HAMBURGER ── */
  const toggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const open = document.body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navLinks.addEventListener('click', e => {
      if (e.target.tagName === 'A') {
        document.body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── MOBILE ACCORDION: collapse sections so the page is scannable ── */
  const collapsibleIds = ['verbouw','renovatie','badkamers','huisliften','velux','overkappingen','projecten'];
  const mq = matchMedia('(max-width: 720px)');
  function applyAccordion(on) {
    collapsibleIds.forEach(id => {
      const sec = document.getElementById(id);
      if (!sec) return;
      const header = sec.querySelector('.section-header');
      if (!header) return;
      if (on) {
        sec.classList.add('collapsible');
        // Set --cover from first project of this category for the photo-backed bar
        const entry = data[id];
        if (entry && entry.projects && entry.projects[0] && entry.projects[0].cover) {
          header.style.setProperty('--cover', `url('${entry.projects[0].cover}')`);
        }
        if (!header.dataset.accBound) {
          header.dataset.accBound = '1';
          header.setAttribute('role', 'button');
          header.setAttribute('tabindex', '0');
          if (!header.querySelector('.acc-chevron')) {
            const ch = document.createElement('span');
            ch.className = 'acc-chevron';
            ch.setAttribute('aria-hidden', 'true');
            header.appendChild(ch);
          }
          const handler = () => sec.classList.toggle('expanded');
          header.addEventListener('click', handler);
          header.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); }
          });
        }
      } else {
        sec.classList.remove('collapsible', 'expanded');
      }
    });
  }
  applyAccordion(mq.matches);
  mq.addEventListener('change', e => applyAccordion(e.matches));

  /* ── MOBILE MARQUEE: slow auto-scrolling strip of covers under hero ── */
  function renderMobileMarquee() {
    if (document.querySelector('.mobile-marquee')) return;
    const hero = document.getElementById('hero');
    if (!hero) return;
    const all = [];
    Object.entries(data).forEach(([cat, entry]) => {
      if (cat === 'archief') return;
      entry.projects.forEach(p => { if (p.cover) all.push(p.cover); });
    });
    if (!all.length) return;
    // Shuffle, take 14
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }
    const picks = all.slice(0, 14);
    // Duplicate for seamless loop
    const doubled = [...picks, ...picks];
    const wrap = document.createElement('div');
    wrap.className = 'mobile-marquee';
    wrap.innerHTML = `<div class="marquee-track">${
      doubled.map(src => `<div class="marquee-thumb"><img src="${src}" loading="lazy" alt=""></div>`).join('')
    }</div>`;
    hero.parentNode.insertBefore(wrap, hero.nextSibling);
  }
  renderMobileMarquee();

  // If user taps a nav link, expand the target section on mobile
  document.querySelectorAll('#nav-links a[href^="#"]').forEach(a => {
    a.addEventListener('click', () => {
      if (!mq.matches) return;
      const id = a.getAttribute('href').slice(1);
      const sec = document.getElementById(id);
      if (sec && sec.classList.contains('collapsible')) sec.classList.add('expanded');
    });
  });

  /* ── SCROLL REVEALS ── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
  }, { threshold: 0.08 });
  revealEls.forEach(el => obs.observe(el));

  /* ── DRAG SCROLL for Projecten ── */
  const ps = document.getElementById('proj-scroll');
  if (ps) {
    let isDragging = false, didDrag = false, startX, scrollLeft;
    ps.addEventListener('mousedown', e => {
      isDragging = true; didDrag = false;
      startX = e.pageX - ps.offsetLeft; scrollLeft = ps.scrollLeft;
      ps.style.cursor = 'grabbing';
    });
    document.addEventListener('mouseup', () => { isDragging = false; ps.style.cursor = ''; });
    ps.addEventListener('mousemove', e => {
      if (!isDragging) return;
      const x = e.pageX - ps.offsetLeft;
      const dx = x - startX;
      if (Math.abs(dx) > 4) didDrag = true;
      ps.scrollLeft = scrollLeft - dx * 1.2;
    });
    ps.addEventListener('click', e => {
      if (didDrag) { e.stopPropagation(); e.preventDefault(); didDrag = false; }
    }, true);
  }

  /* ── LIGHTBOX ── */
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbTitle = document.getElementById('lb-title');
  const lbCounter = document.getElementById('lb-counter');
  let lbPhotos = [];
  let lbIdx = 0;
  let lbProjectTitle = '';

  function lbRender() {
    if (!lbPhotos.length) return;
    lbImg.src = lbPhotos[lbIdx];
    lbTitle.textContent = lbProjectTitle;
    lbCounter.textContent = `${lbIdx + 1} / ${lbPhotos.length}`;
  }
  function lbOpen(cat, idx) {
    const proj = data[cat] && data[cat].projects[idx];
    if (!proj) return;
    lbPhotos = proj.photos;
    lbProjectTitle = proj.title;
    lbIdx = 0;
    lbRender();
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lb-open');
  }
  function lbClose() {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lb-open');
  }
  function lbStep(d) {
    if (!lbPhotos.length) return;
    lbIdx = (lbIdx + d + lbPhotos.length) % lbPhotos.length;
    lbRender();
  }

  document.addEventListener('click', e => {
    const tile = e.target.closest('[data-cat][data-idx]');
    if (!tile) return;
    if (!tile.classList.contains('g-item') &&
        !tile.classList.contains('arch-item') &&
        !tile.classList.contains('strip-thumb')) return;
    e.preventDefault();
    lbOpen(tile.dataset.cat, parseInt(tile.dataset.idx, 10));
  });
  document.getElementById('lb-close').addEventListener('click', lbClose);
  document.getElementById('lb-prev').addEventListener('click', () => lbStep(-1));
  document.getElementById('lb-next').addEventListener('click', () => lbStep(1));
  lb.addEventListener('click', e => { if (e.target === lb || e.target.classList.contains('lb-stage')) lbClose(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') lbClose();
    else if (e.key === 'ArrowRight') lbStep(1);
    else if (e.key === 'ArrowLeft') lbStep(-1);
  });

  let tStartX = 0, tStartY = 0;
  lb.addEventListener('touchstart', e => {
    tStartX = e.touches[0].clientX; tStartY = e.touches[0].clientY;
  }, { passive: true });
  lb.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - tStartX;
    const dy = e.changedTouches[0].clientY - tStartY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) lbStep(dx < 0 ? 1 : -1);
  });
});
