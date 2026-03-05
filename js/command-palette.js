/* ==============================
   COMMAND PALETTE (VS Code-style)
   Ctrl+K / Cmd+K to open
   ============================== */
const CommandPalette = (function() {
  let overlay = null;
  let input = null;
  let list = null;
  let isOpen = false;
  let selectedIndex = 0;

  const commands = [
    // Navigation
    { icon: '~', label: 'Go to Home', shortcut: 'g h', action: () => { window.location.href = 'index.html'; } },
    { icon: '>', label: 'Go to Services', shortcut: 'g s', action: () => { window.location.href = 'services.html'; } },
    { icon: '#', label: 'Go to Products', shortcut: 'g p', action: () => { window.location.href = 'products.html'; } },
    { icon: '%', label: 'Go to Projects', shortcut: 'g r', action: () => { window.location.href = 'projects.html'; } },
    { icon: '@', label: 'Go to Agents', shortcut: 'g a', action: () => { window.location.href = 'agents.html'; } },
    { icon: '*', label: 'Go to Blog', shortcut: 'g b', action: () => { window.location.href = 'blog.html'; } },
    { icon: '?', label: 'Go to Docs', shortcut: '', action: () => { window.location.href = 'docs.html'; } },
    { icon: '+', label: 'Go to Changelog', shortcut: '', action: () => { window.location.href = 'changelog.html'; } },
    { icon: '/', label: 'Go to Editor', shortcut: '', action: () => { window.location.href = 'editor.html'; } },
    { icon: '^', label: 'Go to Analytics', shortcut: '', action: () => { window.location.href = 'analytics.html'; } },

    // Actions
    { icon: '/', label: 'Open Search', shortcut: '/', action: () => { if (typeof GlobalSearch !== 'undefined') GlobalSearch.open(); } },
    { icon: '?', label: 'Show Keyboard Shortcuts', shortcut: '?', action: () => { document.dispatchEvent(new KeyboardEvent('keydown', { key: '?', bubbles: true })); } },
    { icon: '^', label: 'Scroll to Top', shortcut: '', action: () => { window.scrollTo({ top: 0, behavior: 'smooth' }); } },
    {
      icon: '$',
      label: 'Toggle Terminal',
      shortcut: '',
      action: () => {
        const termContainer = document.getElementById('interactive-terminal');
        const termTrigger = document.getElementById('terminal-trigger');
        if (termTrigger) {
          termTrigger.click();
        } else if (termContainer) {
          termContainer.classList.toggle('active');
        }
      }
    },

    // External
    { icon: '&', label: 'View on GitHub', shortcut: '', action: () => { window.open('https://github.com/nullshift', '_blank', 'noopener,noreferrer'); } },
    { icon: 'x', label: 'Follow on X', shortcut: '', action: () => { window.open('https://x.com/nullshift', '_blank', 'noopener,noreferrer'); } }
  ];

  function injectStyles() {
    if (document.getElementById('cmd-palette-styles')) return;

    const style = document.createElement('style');
    style.id = 'cmd-palette-styles';
    style.textContent = `
      .cmd-palette-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.8);
        z-index: 400;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        padding-top: 20vh;
        opacity: 0;
        visibility: hidden;
        transition: opacity var(--transition-fast, 150ms ease), visibility var(--transition-fast, 150ms ease);
      }

      .cmd-palette-overlay.active {
        opacity: 1;
        visibility: visible;
      }

      .cmd-palette-modal {
        width: 500px;
        max-width: 90vw;
        max-height: 60vh;
        background: var(--bg-card, #1a1a1a);
        border: 1px solid var(--border-color, #333333);
        border-radius: var(--radius-md, 8px);
        overflow: hidden;
        box-shadow: 0 16px 48px rgba(0, 0, 0, 0.6);
        transform: translateY(-10px) scale(0.98);
        transition: transform var(--transition-fast, 150ms ease);
      }

      .cmd-palette-overlay.active .cmd-palette-modal {
        transform: translateY(0) scale(1);
      }

      .cmd-palette-input {
        width: 100%;
        padding: var(--space-md, 1rem);
        background: var(--bg-primary, #0a0a0a);
        border: none;
        border-bottom: 1px solid var(--border-color, #333333);
        color: var(--color-text, #e0e0e0);
        font-family: var(--font-mono, 'JetBrains Mono', monospace);
        font-size: var(--text-base, 1rem);
        outline: none;
        box-sizing: border-box;
      }

      .cmd-palette-input::placeholder {
        color: var(--color-text-dim, #888888);
      }

      .cmd-palette-list {
        max-height: calc(60vh - 50px);
        overflow-y: auto;
        padding: var(--space-xs, 0.25rem) 0;
      }

      .cmd-palette-list::-webkit-scrollbar {
        width: 4px;
      }

      .cmd-palette-list::-webkit-scrollbar-track {
        background: transparent;
      }

      .cmd-palette-list::-webkit-scrollbar-thumb {
        background: var(--border-color, #333333);
        border-radius: 2px;
      }

      .cmd-palette-item {
        display: flex;
        align-items: center;
        padding: var(--space-sm, 0.5rem) var(--space-md, 1rem);
        cursor: pointer;
        gap: var(--space-sm, 0.5rem);
        font-family: var(--font-mono, 'JetBrains Mono', monospace);
        font-size: var(--text-sm, 0.875rem);
        color: var(--color-text, #e0e0e0);
        border-left: 2px solid transparent;
        transition: background var(--transition-fast, 150ms ease), border-color var(--transition-fast, 150ms ease);
      }

      .cmd-palette-item:hover,
      .cmd-palette-item.selected {
        background: var(--bg-card-hover, #222222);
        border-left: 2px solid var(--color-primary, #00ff41);
      }

      .cmd-palette-item .cmd-icon {
        width: 24px;
        text-align: center;
        color: var(--color-primary, #00ff41);
        flex-shrink: 0;
      }

      .cmd-palette-item .cmd-label {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .cmd-palette-item .cmd-shortcut {
        margin-left: auto;
        color: var(--color-text-dim, #888888);
        font-size: var(--text-xs, 0.75rem);
        flex-shrink: 0;
      }

      .cmd-palette-empty {
        padding: var(--space-lg, 1.5rem);
        text-align: center;
        color: var(--color-text-dim, #888888);
        font-family: var(--font-mono, 'JetBrains Mono', monospace);
        font-size: var(--text-sm, 0.875rem);
      }
    `;
    document.head.appendChild(style);
  }

  function createOverlay() {
    overlay = document.createElement('div');
    overlay.className = 'cmd-palette-overlay';
    overlay.id = 'cmd-palette';
    overlay.innerHTML = `
      <div class="cmd-palette-modal">
        <input type="text" class="cmd-palette-input" placeholder="> Type a command..." aria-label="Command palette search">
        <div class="cmd-palette-list"></div>
      </div>
    `;
    document.body.appendChild(overlay);

    input = overlay.querySelector('.cmd-palette-input');
    list = overlay.querySelector('.cmd-palette-list');

    // Close when clicking overlay background
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });

    // Filter as user types
    input.addEventListener('input', () => {
      selectedIndex = 0;
      render(input.value.trim());
    });

    // Keyboard navigation within the palette
    input.addEventListener('keydown', (e) => {
      const items = list.querySelectorAll('.cmd-palette-item');
      const count = items.length;

      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (count > 0) {
          selectedIndex = (selectedIndex + 1) % count;
          updateSelection(items);
        }
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (count > 0) {
          selectedIndex = (selectedIndex - 1 + count) % count;
          updateSelection(items);
        }
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        if (count > 0 && items[selectedIndex]) {
          executeCommand(selectedIndex, input.value.trim());
        }
        return;
      }
    });
  }

  function updateSelection(items) {
    items.forEach((item, i) => {
      item.classList.toggle('selected', i === selectedIndex);
    });

    // Scroll selected item into view
    const selected = items[selectedIndex];
    if (selected) {
      selected.scrollIntoView({ block: 'nearest' });
    }
  }

  function fuzzyMatch(query, text) {
    if (!query) return true;

    const lowerQuery = query.toLowerCase();
    const lowerText = text.toLowerCase();

    // Exact substring match gets priority
    if (lowerText.includes(lowerQuery)) return true;

    // Fuzzy: all query chars appear in order within text
    let qi = 0;
    for (let ti = 0; ti < lowerText.length && qi < lowerQuery.length; ti++) {
      if (lowerText[ti] === lowerQuery[qi]) {
        qi++;
      }
    }
    return qi === lowerQuery.length;
  }

  function fuzzyScore(query, text) {
    if (!query) return 0;

    const lowerQuery = query.toLowerCase();
    const lowerText = text.toLowerCase();

    // Exact match at start
    if (lowerText.startsWith(lowerQuery)) return 3;

    // Substring match
    if (lowerText.includes(lowerQuery)) return 2;

    // Fuzzy match
    return 1;
  }

  function getFilteredCommands(filter) {
    if (!filter) return commands;

    const matched = commands.filter(cmd => fuzzyMatch(filter, cmd.label));

    // Sort by relevance score (higher is better)
    matched.sort((a, b) => fuzzyScore(filter, b.label) - fuzzyScore(filter, a.label));

    return matched;
  }

  function render(filter) {
    const filtered = getFilteredCommands(filter || '');

    if (filtered.length === 0) {
      list.innerHTML = '<div class="cmd-palette-empty">> No commands found.</div>';
      return;
    }

    list.innerHTML = filtered.map((cmd, i) => {
      const selectedClass = i === selectedIndex ? ' selected' : '';
      const shortcutHtml = cmd.shortcut ? `<span class="cmd-shortcut">${escapeHtml(cmd.shortcut)}</span>` : '';
      return `<div class="cmd-palette-item${selectedClass}" data-index="${i}">
        <span class="cmd-icon">${escapeHtml(cmd.icon)}</span>
        <span class="cmd-label">${escapeHtml(cmd.label)}</span>
        ${shortcutHtml}
      </div>`;
    }).join('');

    // Click handler for each item
    const items = list.querySelectorAll('.cmd-palette-item');
    items.forEach((item, i) => {
      item.addEventListener('click', () => {
        selectedIndex = i;
        executeCommand(i, filter || '');
      });
      item.addEventListener('mouseenter', () => {
        selectedIndex = i;
        updateSelection(items);
      });
    });
  }

  function executeCommand(index, filter) {
    const filtered = getFilteredCommands(filter);
    if (index >= 0 && index < filtered.length) {
      const cmd = filtered[index];
      close();
      cmd.action();
      document.dispatchEvent(new CustomEvent('command-palette-used'));
    }
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function open() {
    if (isOpen) return;
    isOpen = true;
    selectedIndex = 0;
    overlay.classList.add('active');
    input.value = '';
    render('');
    requestAnimationFrame(() => input.focus());
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    overlay.classList.remove('active');
    input.value = '';
  }

  function toggle() {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }

  function init() {
    injectStyles();
    createOverlay();
  }

  // Listen for Ctrl+K / Cmd+K
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      toggle();
    }
  });

  return { init, open, close };
})();

document.addEventListener('DOMContentLoaded', () => {
  CommandPalette.init();
});
