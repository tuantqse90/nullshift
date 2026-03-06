/* ==============================
   READING PROGRESS INDICATOR
   ============================== */
const ReadingProgress = (function() {
  'use strict';

  let bar = null;
  let ticking = false;

  function init() {
    // Only show on blog page when viewing a post (hash present)
    if (!window.location.pathname.includes('blog') && !document.querySelector('.blog-post-view')) return;

    bar = document.createElement('div');
    bar.className = 'reading-progress-bar';
    bar.setAttribute('role', 'progressbar');
    bar.setAttribute('aria-label', 'Reading progress');
    bar.setAttribute('aria-valuemin', '0');
    bar.setAttribute('aria-valuemax', '100');
    bar.setAttribute('aria-valuenow', '0');

    const style = document.createElement('style');
    style.textContent = `
      .reading-progress-bar {
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        width: 0%;
        background: var(--color-primary, #00ff41);
        box-shadow: 0 0 8px var(--color-primary, #00ff41), 0 0 16px rgba(0, 255, 65, 0.3);
        z-index: 10000;
        transition: width 0.1s linear;
        pointer-events: none;
      }
      .reading-progress-bar.hidden { opacity: 0; }
      @media (prefers-reduced-motion: reduce) {
        .reading-progress-bar { transition: none; box-shadow: none; }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(bar);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('hashchange', checkVisibility);
    checkVisibility();
  }

  function checkVisibility() {
    if (!bar) return;
    const postView = document.querySelector('.blog-post-view');
    const hasPost = window.location.hash && window.location.hash.length > 1;
    if (postView && hasPost && postView.style.display !== 'none') {
      bar.classList.remove('hidden');
      updateProgress();
    } else {
      bar.classList.add('hidden');
    }
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateProgress();
        ticking = false;
      });
      ticking = true;
    }
  }

  function updateProgress() {
    if (!bar) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (docHeight <= 0) return;
    const progress = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
    bar.style.width = progress + '%';
    bar.setAttribute('aria-valuenow', Math.round(progress).toString());
  }

  // Check periodically for post view changes (since blog uses JS rendering)
  const observer = new MutationObserver(() => {
    if (bar) checkVisibility();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      init();
      observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    });
  } else {
    init();
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
  }

  return { checkVisibility };
})();
