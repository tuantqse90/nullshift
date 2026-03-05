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
