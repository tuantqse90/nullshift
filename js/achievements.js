/* ==============================
   ACHIEVEMENTS / BADGES SYSTEM
   ============================== */
const Achievements = (function() {
  'use strict';

  const STORAGE_KEY = 'ns_achievements';
  const PAGES_KEY = 'ns_pages_visited';

  const MAIN_PAGES = ['/', '/index', '/services', '/products', '/projects', '/agents', '/blog'];

  const badges = [
    { id: 'first-visit', name: 'First Visit', desc: 'Welcome to NullShift', icon: '>' },
    { id: 'explorer', name: 'Explorer', desc: 'Visit all main pages', icon: '*' },
    { id: 'deep-diver', name: 'Deep Diver', desc: 'Visit the docs page', icon: '#' },
    { id: 'time-traveler', name: 'Time Traveler', desc: 'Visit the changelog page', icon: '~' },
    { id: 'hacker', name: 'Hacker', desc: 'Open the interactive terminal', icon: '$' },
    { id: 'snake-charmer', name: 'Snake Charmer', desc: 'Play the Snake game', icon: '@' },
    { id: 'searcher', name: 'Searcher', desc: 'Use the global search', icon: '/' },
    { id: 'keyboard-ninja', name: 'Keyboard Ninja', desc: 'Use a keyboard shortcut', icon: '^' },
    { id: 'night-owl', name: 'Night Owl', desc: 'Visit between 12am-5am', icon: '%' },
    { id: 'command-master', name: 'Command Master', desc: 'Use the command palette', icon: '!' }
  ];

  let unlocked = [];
  let counterEl = null;
  let panelEl = null;

  /* ---------- Core ---------- */

  function init() {
    load();
    injectStyles();
    createCounter();
    trackPageVisit();
    checkAutoAchievements();
    setupListeners();
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      unlocked = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(unlocked)) unlocked = [];
    } catch (e) {
      unlocked = [];
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(unlocked));
    } catch (e) { /* storage full or unavailable */ }
  }

  function unlock(id) {
    if (unlocked.includes(id)) return;

    const badge = badges.find(function(b) { return b.id === id; });
    if (!badge) return;

    unlocked.push(id);
    save();
    updateCounter();

    /* Toast notification */
    const msg = 'Badge Unlocked: ' + badge.name;
    if (typeof Toast !== 'undefined' && typeof Toast.success === 'function') {
      Toast.success(msg);
    }

    /* If badge panel is open, re-render it */
    if (panelEl && panelEl.classList.contains('active')) {
      renderPanelBadges();
    }
  }

  /* ---------- Page Visit Tracking ---------- */

  function trackPageVisit() {
    let visited;
    try {
      visited = JSON.parse(localStorage.getItem(PAGES_KEY) || '[]');
      if (!Array.isArray(visited)) visited = [];
    } catch (e) {
      visited = [];
    }

    const currentPath = window.location.pathname
      .replace(/\.html$/, '')
      .replace(/\/$/, '') || '/';

    if (!visited.includes(currentPath)) {
      visited.push(currentPath);
      try {
        localStorage.setItem(PAGES_KEY, JSON.stringify(visited));
      } catch (e) { /* storage full */ }
    }
  }

  /* ---------- Auto Achievements ---------- */

  function checkAutoAchievements() {
    /* First Visit — always unlocked on load */
    unlock('first-visit');

    /* Night Owl — 12am to 5am local time */
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 5) {
      unlock('night-owl');
    }

    /* Explorer — all 6 main pages visited */
    let visited;
    try {
      visited = JSON.parse(localStorage.getItem(PAGES_KEY) || '[]');
    } catch (e) {
      visited = [];
    }
    const allVisited = MAIN_PAGES.every(function(page) {
      return visited.includes(page);
    });
    if (allVisited) {
      unlock('explorer');
    }

    /* Deep Diver — docs page */
    const currentPath = window.location.pathname
      .replace(/\.html$/, '')
      .replace(/\/$/, '') || '/';
    if (currentPath === '/docs') {
      unlock('deep-diver');
    }

    /* Time Traveler — changelog page */
    if (currentPath === '/changelog') {
      unlock('time-traveler');
    }
  }

  /* ---------- Listeners ---------- */

  function setupListeners() {
    /* Terminal: watch for 'active' class via MutationObserver */
    const terminalContainer = document.querySelector('.interactive-terminal, #interactive-terminal, [data-terminal]');
    if (terminalContainer) {
      observeActiveClass(terminalContainer, function() {
        unlock('hacker');
      });
    } else {
      /* Terminal might be created later, watch the body for it */
      const bodyObserver = new MutationObserver(function(mutations) {
        for (let i = 0; i < mutations.length; i++) {
          const added = mutations[i].addedNodes;
          for (let j = 0; j < added.length; j++) {
            const node = added[j];
            if (node.nodeType !== 1) continue;
            const term = node.classList && (
              node.classList.contains('interactive-terminal') ||
              node.id === 'interactive-terminal' ||
              node.hasAttribute('data-terminal')
            ) ? node : node.querySelector && node.querySelector('.interactive-terminal, #interactive-terminal, [data-terminal]');
            if (term) {
              observeActiveClass(term, function() {
                unlock('hacker');
              });
              bodyObserver.disconnect();
              return;
            }
          }
        }
      });
      bodyObserver.observe(document.body, { childList: true, subtree: true });
    }

    /* Search overlay: watch for 'active' class */
    const searchOverlay = document.querySelector('.search-overlay, #global-search');
    if (searchOverlay) {
      observeActiveClass(searchOverlay, function() {
        unlock('searcher');
      });
    } else {
      const searchBodyObs = new MutationObserver(function(mutations) {
        for (let i = 0; i < mutations.length; i++) {
          const added = mutations[i].addedNodes;
          for (let j = 0; j < added.length; j++) {
            const node = added[j];
            if (node.nodeType !== 1) continue;
            const el = node.classList && (
              node.classList.contains('search-overlay') ||
              node.id === 'global-search'
            ) ? node : node.querySelector && node.querySelector('.search-overlay, #global-search');
            if (el) {
              observeActiveClass(el, function() {
                unlock('searcher');
              });
              searchBodyObs.disconnect();
              return;
            }
          }
        }
      });
      searchBodyObs.observe(document.body, { childList: true, subtree: true });
    }

    /* Custom events */
    document.addEventListener('snake-started', function() {
      unlock('snake-charmer');
    });

    document.addEventListener('shortcut-used', function() {
      unlock('keyboard-ninja');
    });

    document.addEventListener('command-palette-used', function() {
      unlock('command-master');
    });
  }

  /**
   * Watch for an element gaining the 'active' class.
   * Calls callback once when the class is first observed.
   */
  function observeActiveClass(el, callback) {
    /* If already active, fire immediately */
    if (el.classList.contains('active')) {
      callback();
      return;
    }

    let fired = false;
    const observer = new MutationObserver(function(mutations) {
      if (fired) return;
      for (let i = 0; i < mutations.length; i++) {
        if (mutations[i].attributeName === 'class' && el.classList.contains('active')) {
          fired = true;
          callback();
          observer.disconnect();
          return;
        }
      }
    });
    observer.observe(el, { attributes: true, attributeFilter: ['class'] });
  }

  /* ---------- Counter Element ---------- */

  function createCounter() {
    counterEl = document.createElement('div');
    counterEl.className = 'ns-achievements-counter';
    counterEl.setAttribute('aria-label', 'Achievements');
    counterEl.setAttribute('role', 'button');
    counterEl.setAttribute('tabindex', '0');
    updateCounter();

    counterEl.addEventListener('click', function() {
      togglePanel();
    });
    counterEl.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        togglePanel();
      }
    });

    document.body.appendChild(counterEl);
  }

  function updateCounter() {
    if (!counterEl) return;
    counterEl.textContent = '> ' + unlocked.length + '/' + badges.length;
  }

  /* ---------- Badge Panel ---------- */

  function togglePanel() {
    if (!panelEl) {
      createPanel();
    }

    if (panelEl.classList.contains('active')) {
      panelEl.classList.remove('active');
    } else {
      renderPanelBadges();
      panelEl.classList.add('active');
    }
  }

  function createPanel() {
    panelEl = document.createElement('div');
    panelEl.className = 'ns-achievements-overlay';

    panelEl.innerHTML =
      '<div class="ns-achievements-panel">' +
        '<div class="ns-achievements-header">' +
          '<span class="ns-achievements-title">> Achievements</span>' +
          '<button class="ns-achievements-close" aria-label="Close achievements panel">[x]</button>' +
        '</div>' +
        '<div class="ns-achievements-list"></div>' +
      '</div>';

    panelEl.addEventListener('click', function(e) {
      if (e.target === panelEl || e.target.classList.contains('ns-achievements-close')) {
        panelEl.classList.remove('active');
      }
    });

    panelEl.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        panelEl.classList.remove('active');
      }
    });

    document.body.appendChild(panelEl);
  }

  function renderPanelBadges() {
    if (!panelEl) return;

    const listEl = panelEl.querySelector('.ns-achievements-list');
    let html = '';

    for (let i = 0; i < badges.length; i++) {
      const badge = badges[i];
      const isUnlocked = unlocked.includes(badge.id);
      const cls = isUnlocked ? 'ns-badge ns-badge--unlocked' : 'ns-badge ns-badge--locked';

      html +=
        '<div class="' + cls + '">' +
          '<span class="ns-badge-icon">' + badge.icon + '</span>' +
          '<div class="ns-badge-info">' +
            '<span class="ns-badge-name">' + badge.name + '</span>' +
            '<span class="ns-badge-desc">' + (isUnlocked ? badge.desc : '???') + '</span>' +
          '</div>' +
        '</div>';
    }

    listEl.innerHTML = html;
  }

  /* ---------- Injected Styles ---------- */

  function injectStyles() {
    const style = document.createElement('style');
    style.setAttribute('data-achievements', '');
    style.textContent =
      /* Counter */
      '.ns-achievements-counter {' +
        'position: fixed;' +
        'bottom: var(--space-xl, 2rem);' +
        'left: var(--space-xl, 2rem);' +
        'background: var(--bg-card, #1a1a1a);' +
        'border: 1px solid var(--border-color, #333333);' +
        'border-radius: var(--radius-md, 8px);' +
        'padding: var(--space-xs, 0.25rem) var(--space-sm, 0.5rem);' +
        'font-family: var(--font-mono, monospace);' +
        'font-size: var(--text-xs, 0.75rem);' +
        'color: var(--color-primary, #00ff41);' +
        'cursor: pointer;' +
        'z-index: 50;' +
        'transition: border-color var(--transition-fast, 150ms ease), box-shadow var(--transition-fast, 150ms ease);' +
        'user-select: none;' +
      '}' +
      '.ns-achievements-counter:hover {' +
        'border-color: var(--color-primary, #00ff41);' +
        'box-shadow: var(--glow-primary, 0 0 20px rgba(0,255,65,0.3));' +
      '}' +

      /* Overlay */
      '.ns-achievements-overlay {' +
        'position: fixed;' +
        'inset: 0;' +
        'background: var(--bg-overlay, rgba(0,0,0,0.85));' +
        'display: flex;' +
        'align-items: center;' +
        'justify-content: center;' +
        'z-index: var(--z-modal, 300);' +
        'opacity: 0;' +
        'visibility: hidden;' +
        'transition: opacity var(--transition-base, 300ms ease), visibility var(--transition-base, 300ms ease);' +
      '}' +
      '.ns-achievements-overlay.active {' +
        'opacity: 1;' +
        'visibility: visible;' +
      '}' +

      /* Panel */
      '.ns-achievements-panel {' +
        'background: var(--bg-card, #1a1a1a);' +
        'border: 1px solid var(--border-color, #333333);' +
        'border-radius: var(--radius-md, 8px);' +
        'width: 100%;' +
        'max-width: 400px;' +
        'max-height: 80vh;' +
        'overflow-y: auto;' +
        'margin: var(--space-md, 1rem);' +
        'transform: translateY(20px);' +
        'transition: transform var(--transition-base, 300ms ease);' +
      '}' +
      '.ns-achievements-overlay.active .ns-achievements-panel {' +
        'transform: translateY(0);' +
      '}' +

      /* Header */
      '.ns-achievements-header {' +
        'display: flex;' +
        'align-items: center;' +
        'justify-content: space-between;' +
        'padding: var(--space-md, 1rem) var(--space-lg, 1.5rem);' +
        'border-bottom: 1px solid var(--border-color, #333333);' +
      '}' +
      '.ns-achievements-title {' +
        'font-family: var(--font-mono, monospace);' +
        'font-size: var(--text-sm, 0.875rem);' +
        'color: var(--color-primary, #00ff41);' +
        'font-weight: 600;' +
      '}' +
      '.ns-achievements-close {' +
        'background: none;' +
        'border: none;' +
        'color: var(--color-text-dim, #888888);' +
        'font-family: var(--font-mono, monospace);' +
        'font-size: var(--text-sm, 0.875rem);' +
        'cursor: pointer;' +
        'padding: var(--space-xs, 0.25rem);' +
        'transition: color var(--transition-fast, 150ms ease);' +
      '}' +
      '.ns-achievements-close:hover {' +
        'color: var(--color-primary, #00ff41);' +
      '}' +

      /* List */
      '.ns-achievements-list {' +
        'padding: var(--space-sm, 0.5rem) var(--space-lg, 1.5rem) var(--space-lg, 1.5rem);' +
      '}' +

      /* Badge row */
      '.ns-badge {' +
        'display: flex;' +
        'align-items: center;' +
        'gap: var(--space-sm, 0.5rem);' +
        'padding: var(--space-sm, 0.5rem) 0;' +
        'border-bottom: 1px solid var(--border-color, #333333);' +
        'transition: opacity var(--transition-fast, 150ms ease);' +
      '}' +
      '.ns-badge:last-child {' +
        'border-bottom: none;' +
      '}' +

      /* Badge icon */
      '.ns-badge-icon {' +
        'flex-shrink: 0;' +
        'width: 2rem;' +
        'height: 2rem;' +
        'display: flex;' +
        'align-items: center;' +
        'justify-content: center;' +
        'font-family: var(--font-mono, monospace);' +
        'font-size: var(--text-lg, 1.125rem);' +
        'font-weight: 700;' +
        'border: 1px solid var(--border-color, #333333);' +
        'border-radius: var(--radius-sm, 4px);' +
        'background: var(--bg-primary, #0a0a0a);' +
      '}' +

      /* Badge info */
      '.ns-badge-info {' +
        'display: flex;' +
        'flex-direction: column;' +
        'gap: 2px;' +
        'min-width: 0;' +
      '}' +
      '.ns-badge-name {' +
        'font-family: var(--font-mono, monospace);' +
        'font-size: var(--text-sm, 0.875rem);' +
        'font-weight: 600;' +
        'white-space: nowrap;' +
        'overflow: hidden;' +
        'text-overflow: ellipsis;' +
      '}' +
      '.ns-badge-desc {' +
        'font-family: var(--font-mono, monospace);' +
        'font-size: var(--text-xs, 0.75rem);' +
        'white-space: nowrap;' +
        'overflow: hidden;' +
        'text-overflow: ellipsis;' +
      '}' +

      /* Unlocked state */
      '.ns-badge--unlocked {' +
        'opacity: 1;' +
      '}' +
      '.ns-badge--unlocked .ns-badge-icon {' +
        'color: var(--color-primary, #00ff41);' +
        'border-color: var(--color-primary, #00ff41);' +
        'box-shadow: var(--glow-primary, 0 0 20px rgba(0,255,65,0.3));' +
      '}' +
      '.ns-badge--unlocked .ns-badge-name {' +
        'color: var(--color-primary, #00ff41);' +
      '}' +
      '.ns-badge--unlocked .ns-badge-desc {' +
        'color: var(--color-text-dim, #888888);' +
      '}' +

      /* Locked state */
      '.ns-badge--locked {' +
        'opacity: 0.3;' +
      '}' +
      '.ns-badge--locked .ns-badge-icon {' +
        'color: var(--color-text-dim, #888888);' +
      '}' +
      '.ns-badge--locked .ns-badge-name {' +
        'color: var(--color-text-dim, #888888);' +
      '}' +
      '.ns-badge--locked .ns-badge-desc {' +
        'color: var(--color-text-dim, #888888);' +
      '}';

    document.head.appendChild(style);
  }

  return { init: init, unlock: unlock };
})();

/* Initialize when DOM is ready */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    Achievements.init();
  });
} else {
  Achievements.init();
}
