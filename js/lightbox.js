/* ==============================
   LIGHTBOX — Project Showcase
   ============================== */
const Lightbox = (function() {
  let overlay = null;
  let images = [];
  let currentIndex = 0;
  let styleInjected = false;

  function injectStyles() {
    if (styleInjected) return;
    styleInjected = true;
    const style = document.createElement('style');
    style.textContent = `
      .lightbox-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.95);
        z-index: 500;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        pointer-events: none;
        transition: opacity var(--transition-base);
      }
      .lightbox-overlay.active {
        opacity: 1;
        pointer-events: auto;
      }
      .lightbox-content {
        position: relative;
        max-width: 90vw;
        max-height: 85vh;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .lightbox-img {
        max-width: 100%;
        max-height: 85vh;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        object-fit: contain;
      }
      .lightbox-close {
        position: absolute;
        top: -40px;
        right: 0;
        background: none;
        border: 1px solid var(--border-color);
        color: var(--color-text);
        font-family: var(--font-mono);
        font-size: var(--text-sm);
        padding: var(--space-xs) var(--space-sm);
        cursor: pointer;
        border-radius: var(--radius-sm);
        transition: border-color var(--transition-fast), color var(--transition-fast);
      }
      .lightbox-close:hover {
        border-color: var(--color-primary);
        color: var(--color-primary);
      }
      .lightbox-nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        color: var(--color-primary);
        font-family: var(--font-mono);
        font-size: var(--text-xl);
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-radius: var(--radius-sm);
        transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
      }
      .lightbox-nav:hover {
        border-color: var(--color-primary);
        box-shadow: var(--glow-primary);
      }
      .lightbox-prev { left: -60px; }
      .lightbox-next { right: -60px; }
      .lightbox-counter {
        position: absolute;
        bottom: -35px;
        left: 50%;
        transform: translateX(-50%);
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        color: var(--color-text-dim);
      }
      .lightbox-caption {
        position: absolute;
        bottom: -35px;
        left: 0;
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        color: var(--color-text-dim);
      }
      @media (max-width: 768px) {
        .lightbox-prev { left: var(--space-sm); }
        .lightbox-next { right: var(--space-sm); }
        .lightbox-nav { width: 36px; height: 36px; font-size: var(--text-base); }
      }
      .project-thumbnail {
        cursor: pointer;
        transition: transform var(--transition-fast), box-shadow var(--transition-fast);
      }
      .project-thumbnail:hover {
        transform: scale(1.02);
        box-shadow: var(--glow-primary);
      }
    `;
    document.head.appendChild(style);
  }

  function create() {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = `
      <div class="lightbox-content">
        <button class="lightbox-close" aria-label="Close">[x]</button>
        <button class="lightbox-nav lightbox-prev" aria-label="Previous">&lt;</button>
        <img class="lightbox-img" src="" alt="">
        <button class="lightbox-nav lightbox-next" aria-label="Next">&gt;</button>
        <span class="lightbox-counter"></span>
      </div>
    `;
    document.body.appendChild(overlay);

    overlay.querySelector('.lightbox-close').addEventListener('click', close);
    overlay.querySelector('.lightbox-prev').addEventListener('click', prev);
    overlay.querySelector('.lightbox-next').addEventListener('click', next);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });

    // Touch swipe support
    let touchStartX = 0;
    overlay.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    overlay.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? next() : prev();
      }
    });
  }

  function open(imgArray, startIndex) {
    injectStyles();
    create();
    images = imgArray;
    currentIndex = startIndex || 0;
    show();
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    document.addEventListener('keydown', handleKeys);
  }

  function close() {
    if (!overlay) return;
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleKeys);
  }

  function show() {
    if (!overlay || images.length === 0) return;
    const img = overlay.querySelector('.lightbox-img');
    const counter = overlay.querySelector('.lightbox-counter');
    img.src = images[currentIndex].src;
    img.alt = images[currentIndex].alt || '';
    counter.textContent = `${currentIndex + 1} / ${images.length}`;

    overlay.querySelector('.lightbox-prev').style.display = images.length <= 1 ? 'none' : '';
    overlay.querySelector('.lightbox-next').style.display = images.length <= 1 ? 'none' : '';
  }

  function next() {
    currentIndex = (currentIndex + 1) % images.length;
    show();
  }

  function prev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    show();
  }

  function handleKeys(e) {
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  }

  // Auto-bind to project cards with thumbnails
  function bindToCards() {
    injectStyles();
    document.querySelectorAll('.gradient-placeholder').forEach(placeholder => {
      placeholder.classList.add('project-thumbnail');
      placeholder.setAttribute('role', 'button');
      placeholder.setAttribute('tabindex', '0');
      placeholder.setAttribute('aria-label', 'View project screenshot');

      placeholder.addEventListener('click', () => {
        const allPlaceholders = Array.from(document.querySelectorAll('.gradient-placeholder'));
        const imgs = allPlaceholders.map((el, i) => {
          const pillar = el.dataset.pillar || 'privacy';
          const card = el.closest('.hacker-card');
          const name = card ? card.querySelector('.card-title')?.textContent : `Project ${i + 1}`;
          return {
            src: generatePlaceholderSVG(pillar, name),
            alt: name
          };
        });
        const idx = allPlaceholders.indexOf(placeholder);
        open(imgs, idx);
      });

      placeholder.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          placeholder.click();
        }
      });
    });
  }

  function generatePlaceholderSVG(pillar, name) {
    const colors = {
      privacy: '#00ff41',
      ai: '#00ffff',
      blockchain: '#ff0080',
      zk: '#a855f7'
    };
    const color = colors[pillar] || colors.privacy;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
      <rect width="800" height="450" fill="#0a0a0a"/>
      <rect x="1" y="1" width="798" height="448" fill="none" stroke="${color}" stroke-width="1" opacity="0.3"/>
      <line x1="0" y1="225" x2="800" y2="225" stroke="${color}" opacity="0.1"/>
      <line x1="400" y1="0" x2="400" y2="450" stroke="${color}" opacity="0.1"/>
      <text x="400" y="210" text-anchor="middle" font-family="monospace" font-size="14" fill="${color}" opacity="0.6">[SCREENSHOT]</text>
      <text x="400" y="240" text-anchor="middle" font-family="monospace" font-size="18" fill="${color}">${name}</text>
      <text x="400" y="270" text-anchor="middle" font-family="monospace" font-size="12" fill="${color}" opacity="0.4">${pillar.toUpperCase()}</text>
    </svg>`;
    return 'data:image/svg+xml,' + encodeURIComponent(svg);
  }

  return { open, close, bindToCards };
})();
