/* ==============================
   NAVBAR
   ============================== */
const navToggle = document.querySelector('.nav-toggle');
const mobileNav = document.querySelector('.mobile-nav');

if (navToggle && mobileNav) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ==============================
   ACTIVE PAGE HIGHLIGHT
   ============================== */
const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'index';

document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
  const href = link.getAttribute('href').replace('.html', '').replace('./', '').replace('/', '');
  const linkPage = href === '' ? 'index' : href;
  if (linkPage === currentPage) {
    link.classList.add('active');
  }
});

/* ==============================
   SCROLL ANIMATIONS
   ============================== */
const scrollElements = document.querySelectorAll('.scroll-fade');

if (scrollElements.length > 0) {
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        scrollObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  scrollElements.forEach(el => scrollObserver.observe(el));
}

/* ==============================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ============================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ==============================
   SCROLL EFFECTS (combined handler)
   ============================== */
const scrollTopBtn = document.querySelector('.scroll-top');
const navbar = document.querySelector('.navbar');

if (scrollTopBtn || navbar) {
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', y > 400);
        if (navbar) navbar.style.borderBottomColor = y > 50 ? 'rgba(0, 255, 65, 0.15)' : '';
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ==============================
   PAGE TRANSITIONS
   ============================== */
document.body.classList.add('page-loaded');

document.querySelectorAll('a[href$=".html"], .nav-links a, .mobile-nav a').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;

    e.preventDefault();
    document.body.classList.add('page-exit');

    setTimeout(() => {
      window.location.href = href;
    }, 300);
  });
});

/* ==============================
   SERVICE WORKER REGISTRATION
   ============================== */
/* ==============================
   LAZY LOADING IMAGES
   ============================== */
document.querySelectorAll('img[data-src]').forEach(img => {
  img.classList.add('lazy');
});

const lazyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        img.classList.remove('lazy');
        img.classList.add('lazy-loaded');
      }
      lazyObserver.unobserve(img);
    }
  });
}, { rootMargin: '200px' });

document.querySelectorAll('img[data-src]').forEach(img => lazyObserver.observe(img));

/* ==============================
   SERVICE WORKER REGISTRATION
   ============================== */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
