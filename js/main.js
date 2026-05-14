/* ============================================================
   DIANA SEGURA · LUXURY EDITORIAL
   JS — Clean, no cursor, no petals
   ============================================================ */
(function () {
  'use strict';

  /* ── LOADER ─────────────────────────────────────── */
  const loader   = document.getElementById('loader');
  const lFill    = document.getElementById('loaderFill');
  let prog = 0;
  const iv = setInterval(() => {
    prog += Math.random() * 14;
    if (prog >= 100) { prog = 100; clearInterval(iv); setTimeout(hideLoader, 300); }
    lFill.style.width = prog + '%';
  }, 70);
  function hideLoader() {
    loader.classList.add('out');
    setTimeout(() => loader.style.display = 'none', 750);
  }

  /* ── THEME ───────────────────────────────────────── */
  const themeBtn = document.getElementById('themeBtn');
  const body     = document.body;
  const saved    = localStorage.getItem('ds-theme');
  if (saved === 'dark') body.classList.add('dark');
  themeBtn && themeBtn.addEventListener('click', () => {
    body.classList.toggle('dark');
    localStorage.setItem('ds-theme', body.classList.contains('dark') ? 'dark' : 'light');
  });

  /* ── NAV ─────────────────────────────────────────── */
  const nav     = document.getElementById('nav');
  const burger  = document.getElementById('navBurger');
  const drawer  = document.getElementById('drawer');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });
  burger && burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    drawer.classList.toggle('open');
    body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
  });
  document.querySelectorAll('.dr-link, .dr-cta').forEach(l => l.addEventListener('click', () => {
    burger.classList.remove('open');
    drawer.classList.remove('open');
    body.style.overflow = '';
  }));

  /* ── REVEAL ON SCROLL ────────────────────────────── */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));

  /* ── SMOOTH SCROLL ───────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (!t || a.getAttribute('href') === '#') return;
      e.preventDefault();
      window.scrollTo({ top: t.getBoundingClientRect().top + window.pageYOffset - nav.offsetHeight + 1, behavior: 'smooth' });
    });
  });

  /* ── PORTFOLIO FILTERS ───────────────────────────── */
  document.querySelectorAll('.wf-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.wf-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.f;
      document.querySelectorAll('.wg-item').forEach(item => {
        item.classList.toggle('hide', f !== 'all' && item.dataset.cat !== f);
      });
    });
  });

  /* ── LIGHTBOX ────────────────────────────────────── */
  const lb    = document.getElementById('lb');
  const lbImg = document.getElementById('lbImg');
  const lbX   = document.getElementById('lbX');
  const lbP   = document.getElementById('lbP');
  const lbN   = document.getElementById('lbN');
  let lbItems = [], lbIdx = 0;

  function openLb(idx) {
    lbItems = Array.from(document.querySelectorAll('.wg-item:not(.hide)'));
    lbIdx   = idx;
    renderLb();
    lb.classList.add('open');
    body.style.overflow = 'hidden';
  }
  function renderLb() {
    const item = lbItems[lbIdx];
    if (!item) return;
    const img = item.querySelector('img');
    lbImg.innerHTML = img
      ? `<img src="${img.src.replace(/w=\d+/, 'w=1600')}" alt="${img.alt}"/>`
      : `<div style="color:rgba(255,255,255,.4);text-align:center;padding:3rem;font-family:'Playfair Display',serif;font-size:1.4rem;font-style:italic">Tu foto aquí</div>`;
  }
  function closeLb() { lb.classList.remove('open'); body.style.overflow = ''; }
  function navLb(d) { lbIdx = (lbIdx + d + lbItems.length) % lbItems.length; renderLb(); }

  document.querySelectorAll('.wg-item').forEach((item, i) => item.addEventListener('click', () => openLb(i)));
  lbX && lbX.addEventListener('click', closeLb);
  lbP && lbP.addEventListener('click', e => { e.stopPropagation(); navLb(-1); });
  lbN && lbN.addEventListener('click', e => { e.stopPropagation(); navLb(1); });
  lb && lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', e => {
    if (!lb?.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') navLb(-1);
    if (e.key === 'ArrowRight') navLb(1);
  });

  /* ── FAQ ─────────────────────────────────────────── */
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* ── BEFORE / AFTER ──────────────────────────────── */
  function initBA(handleId, beforeId) {
    const h = document.getElementById(handleId);
    const b = document.getElementById(beforeId);
    if (!h || !b) return;
    const wrap = b.closest('.ba-wrap');
    let drag = false;
    function set(cx) {
      const r   = wrap.getBoundingClientRect();
      let  pct  = Math.max(2, Math.min(98, (cx - r.left) / r.width * 100));
      h.style.left           = pct + '%';
      b.style.clipPath       = `inset(0 ${100 - pct}% 0 0)`;
    }
    h.addEventListener('mousedown',  e => { drag = true; e.preventDefault(); });
    window.addEventListener('mouseup',   () => drag = false);
    window.addEventListener('mousemove', e => drag && set(e.clientX));
    h.addEventListener('touchstart', e => { drag = true; e.preventDefault(); }, { passive: false });
    window.addEventListener('touchend',  () => drag = false);
    window.addEventListener('touchmove', e => drag && set(e.touches[0].clientX), { passive: true });
    wrap.addEventListener('click', e => set(e.clientX));
  }
  initBA('baH1', 'baB1');
  initBA('baH2', 'baB2');

  /* ── CALCULATOR ──────────────────────────────────── */
  const calcNum    = document.getElementById('calcNum');
  const calcDetail = document.getElementById('calcDetail');
  const tipoLabels = { familia:'Familia', boda:'Boda', evento:'Evento', pareja:'Pareja' };
  const durLabels  = { '1h':'1 hora', '2h':'2 horas', '4h':'4 horas', 'full':'Día completo' };
  const locLabels  = { bcn:'Barcelona', cat:'Cataluña', esp:'España', int:'Internacional' };

  document.querySelectorAll('.co-row').forEach(row => {
    row.querySelectorAll('.co-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        row.querySelectorAll('.co-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updateCalc();
      });
    });
  });
  document.querySelectorAll('.co-extra input').forEach(c => c.addEventListener('change', updateCalc));

  function updateCalc() {
    const tipo = document.querySelector('[data-group="tipo"] .co-btn.active');
    const dur  = document.querySelector('[data-group="dur"]  .co-btn.active');
    const loc  = document.querySelector('[data-group="loc"]  .co-btn.active');
    if (!tipo || !dur || !loc) return;
    let total = parseInt(tipo.dataset.p);
    if (tipo.dataset.v !== 'boda') total += parseInt(dur.dataset.p);
    total += parseInt(loc.dataset.p);
    document.querySelectorAll('.co-extra input:checked').forEach(c => total += parseInt(c.dataset.p));
    calcNum.classList.remove('bump');
    void calcNum.offsetWidth;
    calcNum.classList.add('bump');
    calcNum.textContent = total.toLocaleString('es-ES');
    let detail = tipoLabels[tipo.dataset.v];
    if (tipo.dataset.v !== 'boda') detail += ' · ' + durLabels[dur.dataset.v];
    detail += ' · ' + locLabels[loc.dataset.v];
    calcDetail.textContent = detail;
  }
  updateCalc();

  /* ── CALENDAR ────────────────────────────────────── */
  const calGrid     = document.getElementById('calGrid');
  const calMonthEl  = document.getElementById('calMonth');
  const calPrev     = document.getElementById('calPrev');
  const calNext     = document.getElementById('calNext');
  const calSelected = document.getElementById('calSelected');
  const ctFecha     = document.getElementById('ctFecha');
  const months      = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const today       = new Date(); today.setHours(0,0,0,0);
  let view          = new Date(today.getFullYear(), today.getMonth(), 1);

  function avail(d) {
    if (d < today) return 'past';
    const dow = d.getDay(), dom = d.getDate();
    if (dow === 0) return 'free';
    if (dow === 6) return dom % 3 === 0 ? 'free' : dom % 5 === 0 ? 'some' : 'busy';
    return dom % 7 === 0 ? 'busy' : dom % 4 === 0 ? 'some' : 'free';
  }
  function renderCal() {
    const y = view.getFullYear(), m = view.getMonth();
    calMonthEl.textContent = `${months[m]} ${y}`;
    let start = new Date(y, m, 1).getDay() - 1;
    if (start < 0) start = 6;
    const days = new Date(y, m + 1, 0).getDate();
    let html = '';
    for (let i = 0; i < start; i++) html += `<div class="cal-day empty"></div>`;
    for (let d = 1; d <= days; d++) {
      const dt  = new Date(y, m, d);
      const st  = avail(dt);
      const cls = ['cal-day', st, dt.getTime() === today.getTime() ? 'today' : ''].join(' ');
      html += `<div class="${cls}" data-date="${y}-${m+1}-${d}">${d}</div>`;
    }
    calGrid.innerHTML = html;
    calGrid.querySelectorAll('.cal-day:not(.empty):not(.past):not(.busy)').forEach(el => {
      el.addEventListener('click', () => {
        calGrid.querySelectorAll('.cal-day.selected').forEach(x => x.classList.remove('selected'));
        el.classList.add('selected');
        const [, y, m, d] = el.dataset.date.split('-');
        const st = avail(new Date(+y, +m - 1, +d));
        calSelected.innerHTML = `<strong>${d} de ${months[+m - 1]} de ${y}</strong> · ${st === 'free' ? '✓ Día libre' : '⚡ Pocas horas disponibles'}`;
        if (ctFecha) ctFecha.value = `${d}/${m}/${y}`;
      });
    });
  }
  renderCal();
  calPrev && calPrev.addEventListener('click', () => {
    const floor = new Date(today.getFullYear(), today.getMonth(), 1);
    const prev  = new Date(view.getFullYear(), view.getMonth() - 1, 1);
    if (prev >= floor) { view = prev; renderCal(); }
  });
  calNext && calNext.addEventListener('click', () => {
    view = new Date(view.getFullYear(), view.getMonth() + 1, 1); renderCal();
  });

  /* ── CONTACT FORM ────────────────────────────────── */
  const ctForm = document.getElementById('ctForm');
  const cfOk   = document.getElementById('cfOk');
  const cfBtn  = document.getElementById('cfSubmit');
  const cfTxt  = document.getElementById('cfTxt');
  ctForm && ctForm.addEventListener('submit', e => {
    e.preventDefault();
    cfBtn.disabled = true; cfTxt.textContent = 'Enviando...';
    setTimeout(() => {
      cfOk.classList.add('show'); ctForm.reset();
      cfTxt.textContent = 'Enviar mensaje'; cfBtn.disabled = false;
      setTimeout(() => cfOk.classList.remove('show'), 5000);
    }, 1200);
  });

  /* ── PARALLAX (subtle) ───────────────────────────── */
  const parallaxItems = document.querySelectorAll('.hv-frame');
  window.addEventListener('scroll', () => {
    const sy = window.pageYOffset;
    parallaxItems.forEach((el, i) => {
      const d = i === 0 ? 0.04 : 0.07;
      el.style.transform = `translateY(${sy * d}px)`;
    });
  }, { passive: true });

})();
