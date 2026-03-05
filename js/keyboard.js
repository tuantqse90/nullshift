/* ==============================
   KEYBOARD SHORTCUTS
   ============================== */
(function() {
  let pendingKey = null;
  let pendingTimer = null;

  const shortcuts = {
    '?': showHelp,
    '/': focusSearch,
    'Escape': closeOverlays
  };

  const gotoShortcuts = {
    'h': 'index.html',
    's': 'services.html',
    'p': 'products.html',
    'r': 'projects.html',
    'a': 'agents.html',
    'b': 'blog.html'
  };

  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    const key = e.key;

    if (pendingKey === 'g') {
      clearTimeout(pendingTimer);
      pendingKey = null;
      if (gotoShortcuts[key]) {
        e.preventDefault();
        window.location.href = gotoShortcuts[key];
      }
      return;
    }

    if (key === 'g') {
      pendingKey = 'g';
      pendingTimer = setTimeout(() => { pendingKey = null; }, 800);
      return;
    }

    if (shortcuts[key]) {
      e.preventDefault();
      shortcuts[key]();
    }
  });

  function showHelp() {
    let overlay = document.getElementById('keyboard-help');
    if (overlay) {
      overlay.classList.toggle('active');
      return;
    }

    overlay = document.createElement('div');
    overlay.id = 'keyboard-help';
    overlay.className = 'keyboard-overlay active';
    overlay.innerHTML = `
      <div class="keyboard-modal">
        <div class="keyboard-header">
          <h3>Keyboard Shortcuts</h3>
          <button class="keyboard-close" aria-label="Close">[x]</button>
        </div>
        <div class="keyboard-body">
          <div class="shortcut-group">
            <h4>Navigation</h4>
            <div class="shortcut-row"><kbd>g</kbd> <kbd>h</kbd> <span>Go to Home</span></div>
            <div class="shortcut-row"><kbd>g</kbd> <kbd>s</kbd> <span>Go to Services</span></div>
            <div class="shortcut-row"><kbd>g</kbd> <kbd>p</kbd> <span>Go to Products</span></div>
            <div class="shortcut-row"><kbd>g</kbd> <kbd>r</kbd> <span>Go to Projects</span></div>
            <div class="shortcut-row"><kbd>g</kbd> <kbd>a</kbd> <span>Go to Agents</span></div>
            <div class="shortcut-row"><kbd>g</kbd> <kbd>b</kbd> <span>Go to Blog</span></div>
          </div>
          <div class="shortcut-group">
            <h4>Actions</h4>
            <div class="shortcut-row"><kbd>/</kbd> <span>Focus Search</span></div>
            <div class="shortcut-row"><kbd>?</kbd> <span>Show this help</span></div>
            <div class="shortcut-row"><kbd>Esc</kbd> <span>Close overlays</span></div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target.classList.contains('keyboard-close')) {
        overlay.classList.remove('active');
      }
    });
  }

  function focusSearch() {
    const searchInput = document.querySelector('.blog-search-input, .search-input');
    if (searchInput) {
      searchInput.focus();
    }
  }

  function closeOverlays() {
    const help = document.getElementById('keyboard-help');
    if (help) help.classList.remove('active');

    const mobileNav = document.querySelector('.mobile-nav.open');
    if (mobileNav) {
      mobileNav.classList.remove('open');
      const toggle = document.querySelector('.nav-toggle');
      if (toggle) toggle.classList.remove('open');
      document.body.style.overflow = '';
    }

    const agentPanel = document.querySelector('.agent-panel.active');
    if (agentPanel) agentPanel.classList.remove('active');
  }
})();
