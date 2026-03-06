/* ==============================
   MATRIX RAIN CUSTOMIZER
   ============================== */
const MatrixCustomizer = (function() {
  'use strict';

  const STORAGE_KEY = 'ns_matrix_config';
  const defaults = {
    speed: 1,
    density: 1,
    color: '#00ff41',
    charset: 'default'
  };

  const charsets = {
    default: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*{}[]<>~^|\\',
    binary: '01',
    katakana: '\u30A2\u30A4\u30A6\u30A8\u30AA\u30AB\u30AD\u30AF\u30B1\u30B3\u30B5\u30B7\u30B9\u30BB\u30BD\u30BF\u30C1\u30C4\u30C6\u30C8\u30CA\u30CB\u30CC\u30CD\u30CE\u30CF\u30D2\u30D5\u30D8\u30DB\u30DE\u30DF\u30E0\u30E1\u30E2',
    hex: '0123456789ABCDEF',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?~`/\\'
  };

  const colors = {
    '#00ff41': 'Matrix Green',
    '#00ffff': 'Cyan',
    '#ff0080': 'Neon Pink',
    '#a855f7': 'Purple',
    '#ffaa00': 'Amber',
    '#ffffff': 'White'
  };

  let config = { ...defaults };
  let panel = null;
  let btn = null;

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved) config = { ...defaults, ...saved };
    } catch (e) {}
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }

  function applyToMatrix() {
    // Find the MatrixRain instance on the page
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas || !canvas._matrixRain) return;

    const matrix = canvas._matrixRain;
    matrix.chars = charsets[config.charset] || charsets.default;

    // Override draw method to use custom color and speed
    const origDraw = matrix.draw.bind(matrix);
    matrix.draw = function() {
      if (!this.running) return;

      this.ctx.fillStyle = `rgba(10, 10, 10, ${0.05 / config.speed})`;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      this.ctx.fillStyle = config.color;
      this.ctx.font = `${this.fontSize}px JetBrains Mono, monospace`;

      const step = Math.max(1, Math.round(1 / config.density));
      for (let i = 0; i < this.columns.length; i++) {
        if (i % step !== 0 && config.density < 1) continue;
        const char = this.chars[Math.floor(Math.random() * this.chars.length)];
        const x = i * this.fontSize;
        const y = this.columns[i] * this.fontSize;

        this.ctx.globalAlpha = Math.random() * 0.5 + 0.3;
        this.ctx.fillText(char, x, y);
        this.ctx.globalAlpha = 1;

        if (y > this.canvas.height && Math.random() > 0.975) {
          this.columns[i] = 0;
        }
        this.columns[i] += config.speed;
      }

      this.frameId = requestAnimationFrame(() => this.draw());
    };
  }

  function createPanel() {
    if (panel) return;

    const style = document.createElement('style');
    style.textContent = `
      .matrix-customizer-btn {
        position: fixed;
        bottom: 120px;
        right: 20px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--bg-card, #1a1a1a);
        border: 1px solid var(--border-color, #333);
        color: var(--color-primary, #00ff41);
        cursor: pointer;
        z-index: 9990;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        transition: all 0.2s ease;
      }
      .matrix-customizer-btn:hover {
        border-color: var(--color-primary, #00ff41);
        box-shadow: 0 0 12px rgba(0, 255, 65, 0.3);
        transform: scale(1.1);
      }
      .matrix-customizer-panel {
        position: fixed;
        bottom: 170px;
        right: 20px;
        width: 260px;
        background: var(--bg-card, #1a1a1a);
        border: 1px solid var(--border-color, #333);
        border-radius: 8px;
        padding: 16px;
        z-index: 9991;
        display: none;
        font-family: 'JetBrains Mono', monospace;
        box-shadow: 0 4px 24px rgba(0,0,0,0.5);
      }
      .matrix-customizer-panel.open { display: block; }
      .matrix-customizer-panel h3 {
        color: var(--color-primary, #00ff41);
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 12px;
        padding-bottom: 8px;
        border-bottom: 1px solid var(--border-color, #333);
      }
      .mc-group { margin-bottom: 12px; }
      .mc-group label {
        display: block;
        font-size: 11px;
        color: var(--text-secondary, #888);
        margin-bottom: 4px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .mc-group input[type="range"] {
        width: 100%;
        accent-color: var(--color-primary, #00ff41);
        background: transparent;
        height: 4px;
      }
      .mc-group .mc-value {
        font-size: 11px;
        color: var(--color-primary, #00ff41);
        float: right;
        margin-top: -18px;
      }
      .mc-colors {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
      }
      .mc-color-btn {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 2px solid transparent;
        cursor: pointer;
        transition: all 0.2s;
      }
      .mc-color-btn:hover, .mc-color-btn.active {
        border-color: #fff;
        transform: scale(1.15);
      }
      .mc-charsets {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
      }
      .mc-charset-btn {
        padding: 4px 8px;
        font-size: 10px;
        background: var(--bg-primary, #0a0a0a);
        border: 1px solid var(--border-color, #333);
        color: var(--text-secondary, #888);
        border-radius: 4px;
        cursor: pointer;
        font-family: 'JetBrains Mono', monospace;
        transition: all 0.2s;
      }
      .mc-charset-btn:hover, .mc-charset-btn.active {
        border-color: var(--color-primary, #00ff41);
        color: var(--color-primary, #00ff41);
      }
      .mc-reset {
        width: 100%;
        padding: 6px;
        margin-top: 8px;
        background: transparent;
        border: 1px solid var(--border-color, #333);
        color: var(--text-secondary, #888);
        font-size: 10px;
        font-family: 'JetBrains Mono', monospace;
        cursor: pointer;
        border-radius: 4px;
        text-transform: uppercase;
        letter-spacing: 1px;
        transition: all 0.2s;
      }
      .mc-reset:hover {
        border-color: var(--color-accent, #ff0080);
        color: var(--color-accent, #ff0080);
      }
    `;
    document.head.appendChild(style);

    // Toggle button
    btn = document.createElement('button');
    btn.className = 'matrix-customizer-btn';
    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4"/></svg>';
    btn.title = 'Customize Matrix Rain';
    btn.addEventListener('click', toggle);

    // Panel
    panel = document.createElement('div');
    panel.className = 'matrix-customizer-panel';
    panel.innerHTML = `
      <h3>> matrix_config.sh</h3>
      <div class="mc-group">
        <label>Speed <span class="mc-value" id="mc-speed-val">${config.speed.toFixed(1)}x</span></label>
        <input type="range" id="mc-speed" min="0.3" max="3" step="0.1" value="${config.speed}">
      </div>
      <div class="mc-group">
        <label>Density <span class="mc-value" id="mc-density-val">${config.density.toFixed(1)}x</span></label>
        <input type="range" id="mc-density" min="0.3" max="2" step="0.1" value="${config.density}">
      </div>
      <div class="mc-group">
        <label>Color</label>
        <div class="mc-colors">
          ${Object.entries(colors).map(([hex, name]) =>
            `<button class="mc-color-btn ${hex === config.color ? 'active' : ''}" data-color="${hex}" style="background:${hex}" title="${name}"></button>`
          ).join('')}
        </div>
      </div>
      <div class="mc-group">
        <label>Character Set</label>
        <div class="mc-charsets">
          ${Object.keys(charsets).map(key =>
            `<button class="mc-charset-btn ${key === config.charset ? 'active' : ''}" data-charset="${key}">${key}</button>`
          ).join('')}
        </div>
      </div>
      <button class="mc-reset" id="mc-reset">> reset defaults</button>
    `;

    document.body.appendChild(btn);
    document.body.appendChild(panel);

    // Event listeners
    panel.querySelector('#mc-speed').addEventListener('input', (e) => {
      config.speed = parseFloat(e.target.value);
      panel.querySelector('#mc-speed-val').textContent = config.speed.toFixed(1) + 'x';
      save();
      applyToMatrix();
    });

    panel.querySelector('#mc-density').addEventListener('input', (e) => {
      config.density = parseFloat(e.target.value);
      panel.querySelector('#mc-density-val').textContent = config.density.toFixed(1) + 'x';
      save();
      applyToMatrix();
    });

    panel.querySelectorAll('.mc-color-btn').forEach(b => {
      b.addEventListener('click', () => {
        config.color = b.dataset.color;
        panel.querySelectorAll('.mc-color-btn').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        save();
        applyToMatrix();
      });
    });

    panel.querySelectorAll('.mc-charset-btn').forEach(b => {
      b.addEventListener('click', () => {
        config.charset = b.dataset.charset;
        panel.querySelectorAll('.mc-charset-btn').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        save();
        applyToMatrix();
      });
    });

    panel.querySelector('#mc-reset').addEventListener('click', () => {
      config = { ...defaults };
      save();
      panel.querySelector('#mc-speed').value = config.speed;
      panel.querySelector('#mc-speed-val').textContent = config.speed.toFixed(1) + 'x';
      panel.querySelector('#mc-density').value = config.density;
      panel.querySelector('#mc-density-val').textContent = config.density.toFixed(1) + 'x';
      panel.querySelectorAll('.mc-color-btn').forEach(x => x.classList.toggle('active', x.dataset.color === config.color));
      panel.querySelectorAll('.mc-charset-btn').forEach(x => x.classList.toggle('active', x.dataset.charset === config.charset));
      applyToMatrix();
      if (typeof Toast !== 'undefined') Toast.info('Matrix reset to defaults');
    });
  }

  function toggle() {
    if (!panel) return;
    panel.classList.toggle('open');
  }

  function init() {
    // Only show on homepage where matrix rain exists
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;

    load();
    createPanel();

    // Wait for MatrixRain to initialize, then store reference and apply config
    const checkMatrix = () => {
      if (canvas._matrixRain) {
        applyToMatrix();
      } else {
        requestAnimationFrame(checkMatrix);
      }
    };
    requestAnimationFrame(checkMatrix);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { toggle };
})();
