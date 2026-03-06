/* ==============================
   THEME CUSTOMIZER
   Accent color scheme switcher
   ============================== */
const ThemeCustomizer = (function () {
  const STORAGE_KEY = 'ns_theme';

  const themes = {
    green: { primary: '#00ff41', glow: '0 0 20px rgba(0,255,65,0.3)' },
    cyan: { primary: '#00ffff', glow: '0 0 20px rgba(0,255,255,0.3)' },
    pink: { primary: '#ff0080', glow: '0 0 20px rgba(255,0,128,0.3)' },
    purple: { primary: '#a855f7', glow: '0 0 20px rgba(168,85,247,0.3)' }
  };

  let currentTheme = 'green';

  /* --- Apply theme immediately (before DOM ready) --- */
  function apply(name) {
    if (!themes[name]) return;
    currentTheme = name;
    const root = document.documentElement;
    root.style.setProperty('--color-primary', themes[name].primary);
    root.style.setProperty('--glow-primary', themes[name].glow);
    try {
      localStorage.setItem(STORAGE_KEY, name);
    } catch (_) { /* storage unavailable */ }
    updateSwatches();
    updateIndicator();
  }

  /* --- Update swatch active states --- */
  function updateSwatches() {
    const swatches = document.querySelectorAll('.theme-swatch');
    swatches.forEach(function (sw) {
      if (sw.dataset.theme === currentTheme) {
        sw.classList.add('active');
      } else {
        sw.classList.remove('active');
      }
    });
  }

  /* --- Update the indicator dot color --- */
  function updateIndicator() {
    const dot = document.querySelector('.theme-indicator');
    if (dot) {
      dot.style.backgroundColor = themes[currentTheme].primary;
    }
  }

  /* --- Inject styles once --- */
  function injectStyles() {
    if (document.getElementById('theme-customizer-styles')) return;
    const style = document.createElement('style');
    style.id = 'theme-customizer-styles';
    style.textContent = [
      '.theme-btn {',
      '  background: none;',
      '  border: none;',
      '  color: var(--color-text-dim);',
      '  cursor: pointer;',
      '  padding: 4px;',
      '  display: flex;',
      '  align-items: center;',
      '  transition: color var(--transition-fast);',
      '  position: relative;',
      '}',
      '.theme-btn:hover {',
      '  color: var(--color-primary);',
      '}',
      '.theme-indicator {',
      '  width: 12px;',
      '  height: 12px;',
      '  border-radius: 50%;',
      '  border: 1.5px solid var(--color-text-dim);',
      '  transition: background-color var(--transition-fast), border-color var(--transition-fast);',
      '}',
      '.theme-btn:hover .theme-indicator {',
      '  border-color: var(--color-text-bright);',
      '}',
      '.theme-dropdown {',
      '  position: absolute;',
      '  top: 100%;',
      '  right: 0;',
      '  background: var(--bg-card);',
      '  border: 1px solid var(--border-color);',
      '  border-radius: var(--radius-md);',
      '  padding: var(--space-sm);',
      '  display: none;',
      '  gap: var(--space-xs);',
      '  z-index: 300;',
      '  margin-top: 4px;',
      '}',
      '.theme-dropdown.open {',
      '  display: flex;',
      '}',
      '.theme-swatch {',
      '  width: 24px;',
      '  height: 24px;',
      '  border-radius: 50%;',
      '  cursor: pointer;',
      '  border: 2px solid transparent;',
      '  transition: all var(--transition-fast);',
      '  padding: 0;',
      '  background: none;',
      '}',
      '.theme-swatch.active {',
      '  border-color: var(--color-text-bright);',
      '  transform: scale(1.2);',
      '}',
      '.theme-swatch:hover {',
      '  transform: scale(1.1);',
      '}',
      '.theme-swatch.active:hover {',
      '  transform: scale(1.2);',
      '}'
    ].join('\n');
    document.head.appendChild(style);
  }

  /* --- Create the dropdown with 4 swatches --- */
  function createDropdown() {
    const dropdown = document.createElement('div');
    dropdown.className = 'theme-dropdown';
    dropdown.setAttribute('role', 'menu');
    dropdown.setAttribute('aria-label', 'Theme color options');

    const themeNames = Object.keys(themes);
    themeNames.forEach(function (name) {
      const swatch = document.createElement('button');
      swatch.className = 'theme-swatch';
      if (name === currentTheme) swatch.classList.add('active');
      swatch.dataset.theme = name;
      swatch.style.backgroundColor = themes[name].primary;
      swatch.setAttribute('role', 'menuitem');
      swatch.setAttribute('aria-label', name + ' theme');
      swatch.addEventListener('click', function (e) {
        e.stopPropagation();
        apply(name);
        dropdown.classList.remove('open');
      });
      dropdown.appendChild(swatch);
    });

    return dropdown;
  }

  /* --- Create the nav button with indicator dot --- */
  function createButton() {
    const btn = document.createElement('button');
    btn.className = 'theme-btn';
    btn.setAttribute('aria-label', 'Change theme color');
    btn.setAttribute('aria-haspopup', 'true');
    btn.setAttribute('aria-expanded', 'false');

    const dot = document.createElement('span');
    dot.className = 'theme-indicator';
    dot.style.backgroundColor = themes[currentTheme].primary;
    btn.appendChild(dot);

    const dropdown = createDropdown();
    btn.appendChild(dropdown);

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = dropdown.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    /* Close dropdown when clicking outside */
    document.addEventListener('click', function () {
      dropdown.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });

    /* Close on Escape */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        dropdown.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });

    return btn;
  }

  /* --- Insert button into navbar --- */
  function mount() {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    const searchBtn = navLinks.querySelector('.nav-search-btn');
    const btn = createButton();

    if (searchBtn) {
      navLinks.insertBefore(btn, searchBtn);
    } else {
      navLinks.appendChild(btn);
    }
  }

  /* --- Initialize --- */
  function init() {
    injectStyles();

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', mount);
    } else {
      mount();
    }
  }

  /* --- Restore saved theme IMMEDIATELY (before paint) --- */
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && themes[saved]) {
      currentTheme = saved;
      document.documentElement.style.setProperty('--color-primary', themes[saved].primary);
      document.documentElement.style.setProperty('--glow-primary', themes[saved].glow);
    }
  } catch (_) { /* storage unavailable */ }

  return { init: init, apply: apply };
})();

ThemeCustomizer.init();
