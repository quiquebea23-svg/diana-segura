// ============================================
// DIANA SEGURA · v3 PREMIUM JS
// ============================================

// ---- LOADER ----
const loader = document.getElementById('loader');
const loaderProgress = document.getElementById('loaderProgress');
const loaderPct = document.getElementById('loaderPct');

let progress = 0;
const loaderInterval = setInterval(() => {
  progress += Math.random() * 18;
  if (progress >= 100) {
    progress = 100;
    clearInterval(loaderInterval);
    loaderProgress.style.width = '100%';
    loaderPct.textContent = '100%';
    setTimeout(() => {
      loader.classList.add('out');
      document.body.style.overflow = '';
      initReveal();
    }, 400);
  }
  loaderProgress.style.width = Math.min(progress, 100) + '%';
  loaderPct.textContent = Math.round(Math.min(progress, 100)) + '%';
}, 80);

document.body.style.overflow = 'hidden';

// ---- CUSTOM CURSOR ----
const cursorEl = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
const cursorDot = document.getElementById('cursorDot');

let mx = 0, my = 0, rx = 0, ry = 0;

if (window.matchMedia('(hover: hover)').matches) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursorDot.style.left = mx + 'px';
    cursorDot.style.top  = my + 'px';
    cursorEl.style.left  = mx + 'px';
    cursorEl.style.top   = my + 'px';
  });

  function animCursor() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top  = ry + 'px';
    requestAnimationFrame(animCursor);
  }
  animCursor();

  // Hover states
  document.querySelectorAll('[data-hover-cursor], .pf-img').forEach(el => {
    el.addEventListener('mouseenter', () => cursorEl.classList.add('on-img'));
    el.addEventListener('mouseleave', () => cursorEl.classList.remove('on-img'));
  });

  document.querySelectorAll('a, button, .pf-filter, .svc-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursorEl.classList.add('on-link'));
    el.addEventListener('mouseleave', () => cursorEl.classList.remove('on-link'));
  });
}

// ---- NAV SCROLL ----
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ---- BURGER ----
const burger = document.getElementById('burger');
const mobMenu = document.getElementById('mobMenu');

burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  mobMenu.classList.toggle('open');
  document.body.style.overflow = mobMenu.classList.contains('open') ? 'hidden' : '';
});

document.querySelectorAll('.mm-link').forEach(l => {
  l.addEventListener('click', () => {
    burger.classList.remove('open');
    mobMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ---- SMOOTH SCROLL ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 80;
    window.scrollTo({ top: target.getBoundingClientRect().top + scrollY - offset, behavior: 'smooth' });
  });
});

// ---- REVEAL ON SCROLL ----
function initReveal() {
  const revealEls = document.querySelectorAll('[data-reveal]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        // Stagger siblings
        const siblings = Array.from(e.target.parentElement.querySelectorAll('[data-reveal]'));
        const idx = siblings.indexOf(e.target);
        setTimeout(() => {
          e.target.classList.add('vis');
        }, Math.min(idx * 80, 400));
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => observer.observe(el));
}

// ---- PORTFOLIO FILTER ----
const filters = document.querySelectorAll('.pf-filter');
const pfItems = document.querySelectorAll('.pf-item');

filters.forEach(btn => {
  btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.filter;
    pfItems.forEach(item => {
      const show = cat === 'all' || item.dataset.cat === cat;
      if (show) {
        item.classList.remove('hide');
        item.style.position = '';
      } else {
        item.classList.add('hide');
        setTimeout(() => {
          if (item.classList.contains('hide')) item.style.position = 'absolute';
        }, 400);
      }
    });
  });
});

// ---- LIGHTBOX ----
const lightbox = document.getElementById('lightbox');
const lbContent = document.getElementById('lbContent');
const lbCaption = document.getElementById('lbCaption');
let lbImages = [];
let lbIndex = 0;

function openLightbox(imgEl, cat) {
  // Collect all visible images
  lbImages = Array.from(document.querySelectorAll('.pf-item:not(.hide) .pf-img img'));
  lbIndex = lbImages.indexOf(imgEl);
  if (lbIndex === -1) lbIndex = 0;
  showLbImage();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function showLbImage() {
  if (lbImages.length === 0) return;
  const img = lbImages[lbIndex];
  lbContent.innerHTML = `<img src="${img.src}" alt="${img.alt || ''}"/>`;
  lbCaption.textContent = img.alt || '';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function lbPrev(e) {
  e.stopPropagation();
  lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length;
  showLbImage();
}

function lbNext(e) {
  e.stopPropagation();
  lbIndex = (lbIndex + 1) % lbImages.length;
  showLbImage();
}

// Click on portfolio items
document.querySelectorAll('.pf-img').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    if (img) {
      const cat = item.closest('.pf-item')?.dataset.cat || '';
      openLightbox(img, cat);
    }
    // If no real image (placeholder), just open the lightbox with placeholder
    else {
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  });
});

// Keyboard navigation
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') lbPrev({ stopPropagation: () => {} });
  if (e.key === 'ArrowRight') lbNext({ stopPropagation: () => {} });
});

// ---- FAQ ----
function toggleFaq(btn) {
  const answer = btn.nextElementSibling;
  const isOpen = answer.classList.contains('open');
  // Close all
  document.querySelectorAll('.faq-a.open').forEach(a => {
    a.classList.remove('open');
    a.previousElementSibling.classList.remove('open');
  });
  if (!isOpen) {
    answer.classList.add('open');
    btn.classList.add('open');
  }
}

// ---- FORM ----
function handleSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('cfSubmit');
  const txt = document.getElementById('cfBtnTxt');
  const ok  = document.getElementById('cfSuccess');
  btn.disabled = true;
  txt.textContent = 'Enviando...';
  // Replace with real endpoint (Formspree, Netlify Forms, etc.)
  // fetch('https://formspree.io/f/YOUR_ID', { method:'POST', body: new FormData(e.target) })
  setTimeout(() => {
    btn.style.display = 'none';
    ok.style.display = 'block';
    document.getElementById('ctForm').reset();
  }, 1200);
}

// ---- COUNT ANIMATION ----
function animCount(el) {
  const raw = el.dataset.count;
  const isDec = el.hasAttribute('data-dec');
  const target = parseFloat(raw);
  const duration = 2000;
  const start = performance.now();
  const run = now => {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    const val = target * ease;
    el.textContent = isDec ? val.toFixed(1).replace('.', ',') : Math.round(val);
    if (t < 1) requestAnimationFrame(run);
  };
  requestAnimationFrame(run);
}

const countObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animCount(e.target);
      countObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => countObserver.observe(el));

// ---- PARALLAX HERO ----
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const heroMedia = document.querySelector('.hero-media');
      if (heroMedia && scrollY < window.innerHeight) {
        heroMedia.style.transform = `translateY(${scrollY * 0.3}px)`;
      }
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

// ---- LAZY LOAD IMAGES ----
if ('IntersectionObserver' in window) {
  const lazyImages = document.querySelectorAll('img[data-src]');
  const imgObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const img = e.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        img.classList.add('loaded');
        imgObserver.unobserve(img);
      }
    });
  }, { rootMargin: '200px 0px' });
  lazyImages.forEach(img => imgObserver.observe(img));
}

// ---- STAGGER SERVICE CARDS ----
document.querySelectorAll('.svc-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.08}s`;
});
