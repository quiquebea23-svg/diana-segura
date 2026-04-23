/* ============================================
   DIANA SEGURA · v4 LIGHT
   Sin cursor personalizado · cursor del sistema
   ============================================ */

(function(){
  'use strict';

  /* ========== LOADER ========== */
  const loader = document.getElementById('loader');
  const loaderProgress = document.getElementById('loaderProgress');
  const loaderPct = document.getElementById('loaderPct');
  let progress = 0;
  const loaderInterval = setInterval(()=>{
    progress += Math.random() * 12;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loaderInterval);
      setTimeout(()=>{
        loader.classList.add('out');
        setTimeout(()=>loader.style.display='none', 700);
      }, 300);
    }
    loaderProgress.style.width = progress + '%';
    loaderPct.textContent = Math.floor(progress) + '%';
  }, 80);

  /* ========== NAV SCROLL ========== */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', ()=>{
    if (window.scrollY > 50) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  });

  /* ========== BURGER / MOBILE MENU ========== */
  const burger = document.getElementById('burger');
  const mobMenu = document.getElementById('mobMenu');
  burger.addEventListener('click', ()=>{
    burger.classList.toggle('open');
    mobMenu.classList.toggle('open');
    document.body.style.overflow = mobMenu.classList.contains('open') ? 'hidden' : '';
  });
  document.querySelectorAll('.mm-link').forEach(link=>{
    link.addEventListener('click', ()=>{
      burger.classList.remove('open');
      mobMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ========== REVEAL ON SCROLL ========== */
  const revealObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {threshold:0.1, rootMargin:'0px 0px -50px 0px'});
  document.querySelectorAll('[data-reveal]').forEach(el=>revealObserver.observe(el));

  /* ========== PORTFOLIO FILTERS ========== */
  const filters = document.querySelectorAll('.pf-filter');
  const items = document.querySelectorAll('.pf-item');
  filters.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      filters.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      items.forEach(item=>{
        if (f === 'all' || item.dataset.cat === f) item.classList.remove('hide');
        else item.classList.add('hide');
      });
    });
  });

  /* ========== LIGHTBOX ========== */
  const lightbox = document.getElementById('lightbox');
  const lbContent = document.getElementById('lbContent');
  const lbCaption = document.getElementById('lbCaption');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');
  let lbIdx = 0;
  let lbItems = [];

  function openLightbox(idx){
    lbItems = Array.from(document.querySelectorAll('.pf-item:not(.hide)'));
    lbIdx = idx;
    showLb();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function showLb(){
    const item = lbItems[lbIdx];
    if (!item) return;
    const img = item.querySelector('img');
    const cat = item.dataset.cat || '';
    if (img) {
      lbContent.innerHTML = `<img src="${img.src.replace('w=600','w=1400').replace('w=900','w=1600')}" alt="${img.alt}"/>`;
    } else {
      // placeholder
      lbContent.innerHTML = `<div style="color:rgba(255,255,255,0.5);text-align:center;padding:3rem"><div style="font-size:4rem;margin-bottom:1rem">📷</div><p style="font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-style:italic">Aquí irá una foto real de Diana</p></div>`;
    }
    lbCaption.textContent = `${cat} · ${lbIdx+1} / ${lbItems.length}`;
  }
  function closeLb(){
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
  function lbNav(dir){
    lbIdx = (lbIdx + dir + lbItems.length) % lbItems.length;
    showLb();
  }
  document.querySelectorAll('.pf-item').forEach((item, i)=>{
    item.addEventListener('click', ()=>openLightbox(i));
  });
  lbClose.addEventListener('click', closeLb);
  lbPrev.addEventListener('click', (e)=>{e.stopPropagation();lbNav(-1)});
  lbNext.addEventListener('click', (e)=>{e.stopPropagation();lbNav(1)});
  lightbox.addEventListener('click', (e)=>{
    if (e.target === lightbox) closeLb();
  });
  document.addEventListener('keydown', (e)=>{
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') lbNav(-1);
    if (e.key === 'ArrowRight') lbNav(1);
  });

  /* ========== FAQ ACCORDION ========== */
  document.querySelectorAll('.faq-q').forEach(q=>{
    q.addEventListener('click', ()=>{
      const item = q.parentElement;
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i=>i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* ========== CONTACT FORM ========== */
  const ctForm = document.getElementById('ctForm');
  if (ctForm) {
    ctForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const btn = document.getElementById('cfSubmit');
      const btnTxt = document.getElementById('cfBtnTxt');
      const success = document.getElementById('cfSuccess');
      btn.disabled = true;
      btnTxt.textContent = 'Enviando...';
      // Simulación: aquí podrías integrar Formspree, EmailJS, etc.
      setTimeout(()=>{
        success.classList.add('show');
        ctForm.reset();
        btnTxt.textContent = 'Enviar mensaje';
        btn.disabled = false;
        setTimeout(()=>success.classList.remove('show'), 5000);
      }, 1200);
    });
  }

  /* ========== CALCULADORA ========== */
  const calcOpts = document.querySelectorAll('.calc-opt');
  const calcChecks = document.querySelectorAll('.calc-check input');
  const calcTotal = document.getElementById('calcTotal');
  const calcDetail = document.getElementById('calcDetail');

  // Group selection (single-choice per group)
  document.querySelectorAll('.calc-options').forEach(group=>{
    group.querySelectorAll('.calc-opt').forEach(opt=>{
      opt.addEventListener('click', ()=>{
        group.querySelectorAll('.calc-opt').forEach(o=>o.classList.remove('active'));
        opt.classList.add('active');
        updateCalc();
      });
    });
  });
  calcChecks.forEach(c=>c.addEventListener('change', updateCalc));

  function updateCalc(){
    const tipoEl = document.querySelector('[data-group="tipo"] .calc-opt.active');
    const horasEl = document.querySelector('[data-group="horas"] .calc-opt.active');
    const locEl = document.querySelector('[data-group="loc"] .calc-opt.active');
    if (!tipoEl || !horasEl || !locEl) return;

    const tipoLabels = {familia:'Familia',boda:'Boda',evento:'Evento',amor:'Sesión de pareja'};
    const horasLabels = {'1':'1 hora','2':'2 horas','4':'4 horas','8':'día completo'};
    const locLabels = {bcn:'Barcelona',cat:'Cataluña',esp:'España',int:'Internacional'};

    let total = parseInt(tipoEl.dataset.price);
    // Boda is full day already
    if (tipoEl.dataset.value !== 'boda') {
      total += parseInt(horasEl.dataset.price);
    }
    total += parseInt(locEl.dataset.price);
    calcChecks.forEach(c=>{
      if (c.checked) total += parseInt(c.dataset.price);
    });

    // animate
    calcTotal.classList.remove('bump');
    void calcTotal.offsetWidth;
    calcTotal.classList.add('bump');
    calcTotal.textContent = total.toLocaleString('es-ES');

    let detail = `${tipoLabels[tipoEl.dataset.value]}`;
    if (tipoEl.dataset.value !== 'boda') detail += ` · ${horasLabels[horasEl.dataset.value]}`;
    detail += ` · ${locLabels[locEl.dataset.value]}`;
    calcDetail.textContent = detail;
  }
  updateCalc();

  /* ========== CALENDARIO DISPONIBILIDAD ========== */
  const calGrid = document.getElementById('calGrid');
  const calMonth = document.getElementById('calMonth');
  const calPrev = document.getElementById('calPrev');
  const calNext = document.getElementById('calNext');
  const calSelected = document.getElementById('calSelected');
  const ctFecha = document.getElementById('ctFecha');

  const monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const today = new Date();
  today.setHours(0,0,0,0);
  let viewDate = new Date(today.getFullYear(), today.getMonth(), 1);

  // Disponibilidad simulada (en producción se cargaría de un backend o Google Calendar)
  // Patrón: dado un día, devuelve 'free', 'some', 'busy'
  function getAvailability(date){
    if (date < today) return 'past';
    const day = date.getDay();
    const dom = date.getDate();
    // Domingos suelen estar libres
    if (day === 0) return 'free';
    // Sábados: muchos están ocupados (bodas)
    if (day === 6) {
      if (dom % 3 === 0) return 'free';
      if (dom % 5 === 0) return 'some';
      return 'busy';
    }
    // Resto: variabilidad
    if (dom % 7 === 0) return 'busy';
    if (dom % 4 === 0) return 'some';
    return 'free';
  }

  function renderCalendar(){
    const y = viewDate.getFullYear();
    const m = viewDate.getMonth();
    calMonth.textContent = `${monthNames[m]} ${y}`;
    const firstDay = new Date(y, m, 1);
    let startDow = firstDay.getDay() - 1; // 0=Lunes
    if (startDow < 0) startDow = 6;
    const daysInMonth = new Date(y, m+1, 0).getDate();

    let html = '';
    for (let i = 0; i < startDow; i++) html += `<div class="cal-day empty"></div>`;
    for (let d = 1; d <= daysInMonth; d++){
      const dt = new Date(y, m, d);
      const isToday = dt.getTime() === today.getTime();
      const status = getAvailability(dt);
      let cls = 'cal-day';
      if (status === 'past') cls += ' past';
      else cls += ' ' + status;
      if (isToday) cls += ' today';
      html += `<div class="${cls}" data-date="${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}" data-day="${d}" data-month="${m}" data-year="${y}" data-status="${status}">${d}</div>`;
    }
    calGrid.innerHTML = html;

    calGrid.querySelectorAll('.cal-day').forEach(el=>{
      el.addEventListener('click', ()=>{
        const status = el.dataset.status;
        if (status === 'past' || status === 'busy' || el.classList.contains('empty')) return;
        calGrid.querySelectorAll('.cal-day').forEach(d=>d.classList.remove('selected'));
        el.classList.add('selected');
        const d = el.dataset.day;
        const m = parseInt(el.dataset.month);
        const y = el.dataset.year;
        const statusTxt = status === 'free' ? '✓ Día libre' : '⚡ Pocas horas disponibles';
        calSelected.innerHTML = `<strong>${d} de ${monthNames[m]} de ${y}</strong> · ${statusTxt}`;
        // autofill formulario
        if (ctFecha) ctFecha.value = `${d}/${m+1}/${y}`;
      });
    });
  }
  renderCalendar();

  calPrev.addEventListener('click', ()=>{
    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
    // No retroceder más allá del mes actual
    const monthFloor = new Date(today.getFullYear(), today.getMonth(), 1);
    if (viewDate < monthFloor) viewDate = monthFloor;
    renderCalendar();
  });
  calNext.addEventListener('click', ()=>{
    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
    renderCalendar();
  });

  /* ========== HERO STATS COUNT ANIMATION ========== */
  const counters = document.querySelectorAll('[data-count]');
  const counterObs = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const isDec = el.hasAttribute('data-dec');
        const dur = 1500;
        const start = performance.now();
        function tick(now){
          const p = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1-p, 3);
          const val = target * ease;
          el.textContent = isDec ? val.toFixed(1).replace('.', ',') : Math.floor(val);
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = isDec ? target.toString().replace('.', ',') : target;
        }
        requestAnimationFrame(tick);
        counterObs.unobserve(el);
      }
    });
  });
  counters.forEach(c=>counterObs.observe(c));

  /* ========== SMOOTH SCROLL FOR ANCHORS ========== */
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const target = document.querySelector(a.getAttribute('href'));
      if (!target || a.getAttribute('href') === '#') return;
      e.preventDefault();
      const navH = nav.offsetHeight;
      const top = target.getBoundingClientRect().top + window.pageYOffset - navH + 1;
      window.scrollTo({top, behavior:'smooth'});
    });
  });

})();

/* ============================================
   V5 NUEVAS FEATURES
   ============================================ */

/* ========== DARK MODE TOGGLE ========== */
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const savedTheme = localStorage.getItem('ds-theme') || 'light-mode';
body.classList.remove('light-mode','dark-mode');
body.classList.add(savedTheme);
if(themeToggle){
  themeToggle.addEventListener('click', ()=>{
    const isDark = body.classList.contains('dark-mode');
    body.classList.toggle('dark-mode', !isDark);
    body.classList.toggle('light-mode', isDark);
    localStorage.setItem('ds-theme', isDark ? 'light-mode' : 'dark-mode');
  });
}

/* ========== PÉTALOS ANIMADOS ========== */
(function(){
  const canvas = document.getElementById('petalsCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  function resize(){ W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  const PETAL_COUNT = 22;
  const petals = [];
  // Colores rosas suaves
  const colors = ['rgba(216,112,147,0.55)','rgba(244,194,213,0.5)','rgba(252,230,240,0.6)','rgba(200,84,120,0.4)','rgba(255,182,207,0.5)'];

  function createPetal(fromTop=false){
    return {
      x: Math.random()*W,
      y: fromTop ? -20 : Math.random()*H,
      r: Math.random()*10 + 5,
      rot: Math.random()*Math.PI*2,
      rotSpeed: (Math.random()-0.5)*0.06,
      vx: (Math.random()-0.5)*0.8,
      vy: Math.random()*1.2 + 0.4,
      color: colors[Math.floor(Math.random()*colors.length)],
      wobble: Math.random()*Math.PI*2,
      wobbleSpeed: Math.random()*0.04 + 0.01,
    };
  }
  for(let i=0;i<PETAL_COUNT;i++) petals.push(createPetal(false));

  function drawPetal(p){
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, p.r, p.r*0.55, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  }

  let paused = false;
  document.addEventListener('visibilitychange', ()=>{ paused = document.hidden; });

  function animate(){
    requestAnimationFrame(animate);
    if(paused) return;
    ctx.clearRect(0,0,W,H);
    petals.forEach(p=>{
      p.wobble += p.wobbleSpeed;
      p.x += p.vx + Math.sin(p.wobble)*0.5;
      p.y += p.vy;
      p.rot += p.rotSpeed;
      if(p.y > H + 20) Object.assign(p, createPetal(true));
      drawPetal(p);
    });
  }
  animate();
})();

/* ========== HERO VIDEO BACKGROUND ========== */
const heroBgVideo = document.getElementById('heroBgVideo');
if(heroBgVideo){
  heroBgVideo.addEventListener('error', ()=>{
    // Si el vídeo no carga, fallback limpio
    heroBgVideo.style.display = 'none';
  });
}

/* ========== PARALLAX PORTFOLIO ========== */
(function(){
  const items = document.querySelectorAll('.pf-item');
  function onScroll(){
    const scrollY = window.pageYOffset;
    items.forEach((item, i)=>{
      const rect = item.getBoundingClientRect();
      const centerOffset = (rect.top + rect.height/2) - window.innerHeight/2;
      const depth = (i%3 === 0) ? 0.06 : (i%3 === 1) ? 0.03 : 0.09;
      const img = item.querySelector('img');
      if(img){
        const ty = centerOffset * depth;
        img.style.transform = `scale(1.12) translateY(${ty}px)`;
      }
    });
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
})();

/* ========== BEFORE / AFTER SLIDER ========== */
(function(){
  function initBA(handleId, beforeId){
    const handle = document.getElementById(handleId);
    const before = document.getElementById(beforeId);
    if(!handle || !before) return;
    const wrap = before.closest('.ba-slider-wrap');
    let dragging = false;

    function setPos(clientX){
      const rect = wrap.getBoundingClientRect();
      let pct = (clientX - rect.left) / rect.width * 100;
      pct = Math.max(2, Math.min(98, pct));
      handle.style.left = pct + '%';
      before.style.clipPath = `inset(0 ${100-pct}% 0 0)`;
    }

    handle.addEventListener('mousedown', e=>{ dragging=true; e.preventDefault(); });
    window.addEventListener('mouseup', ()=>dragging=false);
    window.addEventListener('mousemove', e=>{ if(dragging) setPos(e.clientX); });

    handle.addEventListener('touchstart', e=>{ dragging=true; e.preventDefault(); },{passive:false});
    window.addEventListener('touchend', ()=>dragging=false);
    window.addEventListener('touchmove', e=>{ if(dragging) setPos(e.touches[0].clientX); },{passive:true});

    // Also allow clicking anywhere on wrap
    wrap.addEventListener('click', e=>setPos(e.clientX));
  }
  initBA('baHandle1','baBefore1');
  initBA('baHandle2','baBefore2');
})();
