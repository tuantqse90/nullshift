/* ==============================
   READING LIST / BOOKMARKS
   ============================== */
const Bookmarks = (function() {
  const STORAGE_KEY = 'ns_bookmarks';
  let styleInjected = false;

  function injectStyles() {
    if (styleInjected) return;
    styleInjected = true;
    const style = document.createElement('style');
    style.textContent = `
      .bookmark-btn {
        background: none;
        border: 1px solid var(--border-color);
        color: var(--color-text-dim);
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        padding: 4px 8px;
        cursor: pointer;
        border-radius: var(--radius-sm);
        transition: all var(--transition-fast);
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }
      .bookmark-btn:hover {
        border-color: var(--color-warning);
        color: var(--color-warning);
      }
      .bookmark-btn.saved {
        border-color: var(--color-warning);
        color: var(--color-warning);
      }
      .reading-list-btn {
        position: fixed;
        bottom: var(--space-xl);
        left: calc(var(--space-xl) + 70px);
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        color: var(--color-warning);
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        padding: var(--space-xs) var(--space-sm);
        cursor: pointer;
        border-radius: var(--radius-md);
        z-index: 50;
        transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
      }
      .reading-list-btn:hover {
        border-color: var(--color-warning);
        box-shadow: var(--glow-warning);
      }
      .reading-list-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.85);
        z-index: 350;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        pointer-events: none;
        transition: opacity var(--transition-base);
      }
      .reading-list-overlay.active {
        opacity: 1;
        pointer-events: auto;
      }
      .reading-list-modal {
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        width: 500px;
        max-width: 90vw;
        max-height: 70vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      .reading-list-header {
        padding: var(--space-md);
        border-bottom: 1px solid var(--border-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-family: var(--font-mono);
      }
      .reading-list-header h3 {
        font-size: var(--text-base);
        margin: 0;
      }
      .reading-list-close {
        background: none;
        border: none;
        color: var(--color-text-dim);
        font-family: var(--font-mono);
        cursor: pointer;
        transition: color var(--transition-fast);
      }
      .reading-list-close:hover { color: var(--color-primary); }
      .reading-list-body {
        flex: 1;
        overflow-y: auto;
        padding: var(--space-sm);
      }
      .reading-list-item {
        display: flex;
        align-items: center;
        gap: var(--space-sm);
        padding: var(--space-sm) var(--space-md);
        border-bottom: 1px solid rgba(51,51,51,0.3);
        font-family: var(--font-mono);
        font-size: var(--text-sm);
        transition: background var(--transition-fast);
      }
      .reading-list-item:hover { background: var(--bg-secondary); }
      .reading-list-item a {
        flex: 1;
        color: var(--color-text);
        transition: color var(--transition-fast);
      }
      .reading-list-item a:hover { color: var(--color-primary); }
      .reading-list-type {
        font-size: var(--text-xs);
        color: var(--color-text-dim);
        text-transform: uppercase;
        min-width: 50px;
      }
      .reading-list-remove {
        background: none;
        border: none;
        color: var(--color-text-dim);
        cursor: pointer;
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        transition: color var(--transition-fast);
      }
      .reading-list-remove:hover { color: var(--color-accent); }
      .reading-list-empty {
        padding: var(--space-2xl);
        text-align: center;
        font-family: var(--font-mono);
        color: var(--color-text-dim);
      }
    `;
    document.head.appendChild(style);
  }

  function getAll() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (e) { return []; }
  }

  function save(items) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {}
  }

  function isBookmarked(id) {
    return getAll().some(b => b.id === id);
  }

  function toggle(id, title, type, url) {
    const items = getAll();
    const idx = items.findIndex(b => b.id === id);
    if (idx >= 0) {
      items.splice(idx, 1);
      save(items);
      if (typeof Toast !== 'undefined') Toast.info('Removed from reading list');
      return false;
    } else {
      items.push({ id, title, type, url, added: Date.now() });
      save(items);
      if (typeof Toast !== 'undefined') Toast.success('Added to reading list');
      return true;
    }
  }

  function createBookmarkButton(id, title, type, url) {
    injectStyles();
    const btn = document.createElement('button');
    btn.className = 'bookmark-btn' + (isBookmarked(id) ? ' saved' : '');
    btn.innerHTML = isBookmarked(id) ? '&#9733; Saved' : '&#9734; Save';
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const saved = toggle(id, title, type, url);
      btn.classList.toggle('saved', saved);
      btn.innerHTML = saved ? '&#9733; Saved' : '&#9734; Save';
      updateListBtn();
    });
    return btn;
  }

  function updateListBtn() {
    const btn = document.querySelector('.reading-list-btn');
    if (btn) {
      const count = getAll().length;
      btn.textContent = '> Reading List (' + count + ')';
    }
  }

  function createListButton() {
    injectStyles();
    const btn = document.createElement('button');
    btn.className = 'reading-list-btn';
    const count = getAll().length;
    btn.textContent = '> Reading List (' + count + ')';
    btn.addEventListener('click', showList);
    document.body.appendChild(btn);
  }

  function showList() {
    let overlay = document.getElementById('reading-list-overlay');
    if (overlay) {
      overlay.classList.add('active');
      renderList();
      return;
    }

    overlay = document.createElement('div');
    overlay.id = 'reading-list-overlay';
    overlay.className = 'reading-list-overlay active';
    overlay.innerHTML = `
      <div class="reading-list-modal">
        <div class="reading-list-header">
          <h3>> Reading List</h3>
          <button class="reading-list-close">[x]</button>
        </div>
        <div class="reading-list-body"></div>
      </div>
    `;
    document.body.appendChild(overlay);

    overlay.querySelector('.reading-list-close').addEventListener('click', hideList);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) hideList();
    });
    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        hideList();
      }
    });

    renderList();
  }

  function hideList() {
    const overlay = document.getElementById('reading-list-overlay');
    if (overlay) overlay.classList.remove('active');
  }

  function renderList() {
    const overlay = document.getElementById('reading-list-overlay');
    if (!overlay) return;
    const body = overlay.querySelector('.reading-list-body');
    const items = getAll().reverse();

    if (items.length === 0) {
      body.innerHTML = '<div class="reading-list-empty">> No items saved yet.<br>Use the &#9734; button on blog posts and projects.</div>';
      return;
    }

    body.innerHTML = items.map(item => `
      <div class="reading-list-item">
        <span class="reading-list-type">${item.type}</span>
        <a href="${item.url}">${item.title}</a>
        <button class="reading-list-remove" data-id="${item.id}">[x]</button>
      </div>
    `).join('');

    body.querySelectorAll('.reading-list-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const items = getAll().filter(b => b.id !== id);
        save(items);
        renderList();
        updateListBtn();
        // Update any visible bookmark buttons
        document.querySelectorAll('.bookmark-btn[data-bookmark-id="' + id + '"]').forEach(b => {
          b.classList.remove('saved');
          b.innerHTML = '&#9734; Save';
        });
      });
    });
  }

  function init() {
    injectStyles();
    createListButton();
  }

  return { init, createBookmarkButton, toggle, isBookmarked, getAll };
})();

Bookmarks.init();
