/* ==============================
   NOTIFICATION CENTER
   ============================== */
const NotificationCenter = (function() {
  const STORAGE_KEY = 'ns_notifications';
  let panel = null;
  let bellBtn = null;
  let badge = null;
  let styleInjected = false;

  function injectStyles() {
    if (styleInjected) return;
    styleInjected = true;
    const style = document.createElement('style');
    style.textContent = `
      .notif-bell {
        background: none;
        border: none;
        color: var(--color-text-dim);
        cursor: pointer;
        position: relative;
        padding: 4px;
        display: flex;
        align-items: center;
        transition: color var(--transition-fast);
      }
      .notif-bell:hover { color: var(--color-primary); }
      .notif-badge {
        position: absolute;
        top: -2px;
        right: -4px;
        background: var(--color-accent);
        color: var(--color-text-bright);
        font-family: var(--font-mono);
        font-size: 9px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        display: none;
      }
      .notif-badge.has-unread { display: flex; }
      .notif-panel {
        position: fixed;
        top: var(--nav-height);
        right: var(--space-lg);
        width: 360px;
        max-height: 500px;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        z-index: 250;
        display: none;
        flex-direction: column;
        box-shadow: var(--shadow-card);
      }
      .notif-panel.active { display: flex; }
      .notif-header {
        padding: var(--space-sm) var(--space-md);
        border-bottom: 1px solid var(--border-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-family: var(--font-mono);
        font-size: var(--text-sm);
        color: var(--color-text-dim);
      }
      .notif-clear {
        background: none;
        border: none;
        color: var(--color-text-dim);
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        cursor: pointer;
        transition: color var(--transition-fast);
      }
      .notif-clear:hover { color: var(--color-accent); }
      .notif-list {
        flex: 1;
        overflow-y: auto;
        max-height: 440px;
      }
      .notif-item {
        padding: var(--space-sm) var(--space-md);
        border-bottom: 1px solid rgba(51,51,51,0.3);
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        display: flex;
        gap: var(--space-sm);
        align-items: flex-start;
        transition: background var(--transition-fast);
      }
      .notif-item:hover { background: var(--bg-secondary); }
      .notif-item.unread { border-left: 2px solid var(--color-primary); }
      .notif-icon {
        flex-shrink: 0;
        width: 20px;
        text-align: center;
        color: var(--color-primary);
      }
      .notif-icon.success { color: var(--color-primary); }
      .notif-icon.warning { color: var(--color-warning); }
      .notif-icon.info { color: var(--color-secondary); }
      .notif-icon.achievement { color: var(--color-accent); }
      .notif-content { flex: 1; }
      .notif-text { color: var(--color-text); line-height: 1.4; }
      .notif-time { color: var(--color-text-dim); margin-top: 2px; }
      .notif-empty {
        padding: var(--space-2xl) var(--space-md);
        text-align: center;
        font-family: var(--font-mono);
        font-size: var(--text-sm);
        color: var(--color-text-dim);
      }
      @media (max-width: 768px) {
        .notif-panel { right: var(--space-sm); left: var(--space-sm); width: auto; }
      }
    `;
    document.head.appendChild(style);
  }

  function getNotifications() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (e) { return []; }
  }

  function saveNotifications(items) {
    try {
      // Keep last 50
      if (items.length > 50) items = items.slice(-50);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {}
  }

  function add(text, type) {
    const items = getNotifications();
    items.push({
      text: text,
      type: type || 'info',
      time: Date.now(),
      read: false
    });
    saveNotifications(items);
    updateBadge();
  }

  function markAllRead() {
    const items = getNotifications().map(n => ({ ...n, read: true }));
    saveNotifications(items);
    updateBadge();
  }

  function clearAll() {
    saveNotifications([]);
    updateBadge();
    if (panel) renderList();
  }

  function updateBadge() {
    if (!badge) return;
    const unread = getNotifications().filter(n => !n.read).length;
    badge.textContent = unread > 9 ? '9+' : unread;
    badge.classList.toggle('has-unread', unread > 0);
  }

  function formatTime(ts) {
    const diff = Date.now() - ts;
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
    if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
    return new Date(ts).toLocaleDateString();
  }

  function renderList() {
    if (!panel) return;
    const list = panel.querySelector('.notif-list');
    const items = getNotifications().reverse();

    if (items.length === 0) {
      list.innerHTML = '<div class="notif-empty">> No notifications yet</div>';
      return;
    }

    const icons = { success: '>', warning: '!', info: '~', achievement: '*' };
    list.innerHTML = items.map(n => `
      <div class="notif-item ${n.read ? '' : 'unread'}">
        <span class="notif-icon ${n.type}">${icons[n.type] || '~'}</span>
        <div class="notif-content">
          <div class="notif-text">${n.text}</div>
          <div class="notif-time">${formatTime(n.time)}</div>
        </div>
      </div>
    `).join('');
  }

  function createBell() {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    bellBtn = document.createElement('button');
    bellBtn.className = 'notif-bell';
    bellBtn.setAttribute('aria-label', 'Notifications');
    bellBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
      <span class="notif-badge"></span>
    `;
    badge = bellBtn.querySelector('.notif-badge');

    // Insert before search button
    const searchBtn = navLinks.querySelector('.nav-search-btn');
    if (searchBtn) {
      navLinks.insertBefore(bellBtn, searchBtn);
    } else {
      navLinks.appendChild(bellBtn);
    }

    bellBtn.addEventListener('click', toggle);
    updateBadge();
  }

  function createPanel() {
    if (panel) return;
    panel = document.createElement('div');
    panel.className = 'notif-panel';
    panel.innerHTML = `
      <div class="notif-header">
        <span>Notifications</span>
        <button class="notif-clear">[clear]</button>
      </div>
      <div class="notif-list"></div>
    `;
    document.body.appendChild(panel);

    panel.querySelector('.notif-clear').addEventListener('click', clearAll);
  }

  function toggle() {
    injectStyles();
    createPanel();
    panel.classList.toggle('active');
    if (panel.classList.contains('active')) {
      renderList();
      markAllRead();
    }
  }

  function init() {
    injectStyles();
    createBell();

    // Intercept Toast calls to also log notifications
    if (typeof Toast !== 'undefined') {
      const origSuccess = Toast.success;
      const origWarning = Toast.warning;
      const origError = Toast.error;
      const origInfo = Toast.info;

      Toast.success = function(msg) { add(msg, 'success'); return origSuccess.call(this, msg); };
      Toast.warning = function(msg) { add(msg, 'warning'); return origWarning.call(this, msg); };
      Toast.error = function(msg) { add(msg, 'warning'); return origError.call(this, msg); };
      Toast.info = function(msg) { add(msg, 'info'); return origInfo.call(this, msg); };
    }

    // Listen for achievement unlocks
    document.addEventListener('achievement-unlocked', (e) => {
      add('Badge unlocked: ' + (e.detail || 'New achievement!'), 'achievement');
    });
  }

  return { init, add, toggle };
})();

NotificationCenter.init();
