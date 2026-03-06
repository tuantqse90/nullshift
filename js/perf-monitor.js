/* ==============================
   PERFORMANCE MONITOR WIDGET
   Real-time metrics in hacker-style overlay
   ============================== */
const PerfMonitor = (function() {
  'use strict';

  const STORAGE_KEY = 'ns_perf_monitor';

  /* --- State --- */
  let isOpen = false;
  let toggleBtn = null;
  let panelEl = null;
  let rafId = null;
  let domIntervalId = null;
  let uptimeIntervalId = null;

  /* FPS tracking */
  let lastFrameTime = performance.now();
  let frameCount = 0;
  let fps = 0;
  let fpsHistory = [];

  /* DOM node count (throttled) */
  let domNodeCount = 0;

  /* Page load time (measured once) */
  let pageLoadTime = null;

  /* Uptime */
  let pageOpenedAt = Date.now();

  /* Reduced motion preference */
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- Init --- */

  function init() {
    injectStyles();
    createToggleBtn();
    measurePageLoad();

    /* Restore saved state */
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'open') {
        openPanel();
      }
    } catch (e) { /* storage unavailable */ }
  }

  /* --- Page Load Metric (static, once) --- */

  function measurePageLoad() {
    /* Try modern PerformanceNavigationTiming first */
    if (performance.getEntriesByType) {
      const navEntries = performance.getEntriesByType('navigation');
      if (navEntries && navEntries.length > 0) {
        const nav = navEntries[0];
        if (nav.loadEventEnd > 0) {
          pageLoadTime = Math.round(nav.loadEventEnd - nav.startTime);
          return;
        }
      }
    }

    /* Fallback to deprecated performance.timing */
    if (performance.timing && performance.timing.loadEventEnd > 0) {
      pageLoadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      return;
    }

    /* If loadEventEnd not ready yet, wait for window load event */
    if (document.readyState !== 'complete') {
      window.addEventListener('load', function() {
        requestAnimationFrame(function() {
          if (performance.getEntriesByType) {
            const navEntries = performance.getEntriesByType('navigation');
            if (navEntries && navEntries.length > 0) {
              pageLoadTime = Math.round(navEntries[0].loadEventEnd - navEntries[0].startTime);
              return;
            }
          }
          if (performance.timing) {
            pageLoadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
          }
        });
      });
    }
  }

  /* --- Toggle Button --- */

  function createToggleBtn() {
    toggleBtn = document.createElement('button');
    toggleBtn.className = 'ns-perf-toggle';
    toggleBtn.setAttribute('aria-label', 'Toggle performance monitor');
    toggleBtn.setAttribute('title', 'Performance Monitor');
    toggleBtn.textContent = 'FPS';

    toggleBtn.addEventListener('click', function() {
      if (isOpen) {
        closePanel();
      } else {
        openPanel();
      }
    });

    document.body.appendChild(toggleBtn);
  }

  /* --- Panel --- */

  function createPanel() {
    panelEl = document.createElement('div');
    panelEl.className = 'ns-perf-panel';

    panelEl.innerHTML =
      '<div class="ns-perf-header">' +
        '<span class="ns-perf-title">> perf_monitor.sh</span>' +
        '<button class="ns-perf-close" aria-label="Close performance monitor">[x]</button>' +
      '</div>' +
      '<div class="ns-perf-scanlines" aria-hidden="true"></div>' +
      '<div class="ns-perf-body">' +
        /* FPS row */
        '<div class="ns-perf-row">' +
          '<span class="ns-perf-label">FPS</span>' +
          '<span class="ns-perf-value" id="ns-perf-fps">--</span>' +
        '</div>' +
        '<div class="ns-perf-sparkline" id="ns-perf-sparkline"></div>' +
        /* Memory row */
        '<div class="ns-perf-row">' +
          '<span class="ns-perf-label">MEMORY</span>' +
          '<span class="ns-perf-value" id="ns-perf-memory">N/A</span>' +
        '</div>' +
        /* DOM nodes row */
        '<div class="ns-perf-row">' +
          '<span class="ns-perf-label">DOM NODES</span>' +
          '<span class="ns-perf-value" id="ns-perf-dom">--</span>' +
        '</div>' +
        /* Page load row */
        '<div class="ns-perf-row">' +
          '<span class="ns-perf-label">PAGE LOAD</span>' +
          '<span class="ns-perf-value" id="ns-perf-load">--</span>' +
        '</div>' +
        /* Network resources row */
        '<div class="ns-perf-row">' +
          '<span class="ns-perf-label">NETWORK</span>' +
          '<span class="ns-perf-value" id="ns-perf-network">--</span>' +
        '</div>' +
        /* Uptime row */
        '<div class="ns-perf-row">' +
          '<span class="ns-perf-label">UPTIME</span>' +
          '<span class="ns-perf-value" id="ns-perf-uptime">00:00</span>' +
        '</div>' +
      '</div>';

    /* Close button handler */
    const closeBtn = panelEl.querySelector('.ns-perf-close');
    closeBtn.addEventListener('click', function() {
      closePanel();
    });

    /* Build sparkline bars (60 bars) */
    const sparklineContainer = panelEl.querySelector('#ns-perf-sparkline');
    for (let i = 0; i < 60; i++) {
      const bar = document.createElement('div');
      bar.className = 'ns-perf-spark-bar';
      sparklineContainer.appendChild(bar);
    }

    document.body.appendChild(panelEl);
  }

  /* --- Open / Close --- */

  function openPanel() {
    if (!panelEl) {
      createPanel();
    }

    isOpen = true;
    panelEl.classList.add('active');
    toggleBtn.classList.add('active');

    /* Initialize FPS history */
    fpsHistory = [];
    for (let i = 0; i < 60; i++) {
      fpsHistory.push(0);
    }

    /* Start measurement loops */
    lastFrameTime = performance.now();
    frameCount = 0;
    startMeasurementLoop();
    startDOMCountInterval();
    startUptimeInterval();

    /* Persist state */
    try {
      localStorage.setItem(STORAGE_KEY, 'open');
    } catch (e) { /* storage unavailable */ }
  }

  function closePanel() {
    isOpen = false;
    if (panelEl) {
      panelEl.classList.remove('active');
    }
    toggleBtn.classList.remove('active');

    /* Stop all loops */
    stopMeasurementLoop();
    stopDOMCountInterval();
    stopUptimeInterval();

    /* Persist state */
    try {
      localStorage.setItem(STORAGE_KEY, 'closed');
    } catch (e) { /* storage unavailable */ }
  }

  /* --- Measurement Loop (requestAnimationFrame) --- */

  let lastFPSUpdate = 0;

  function measureFrame(timestamp) {
    frameCount++;

    /* Update FPS calculation every ~1 second */
    const elapsed = timestamp - lastFPSUpdate;
    if (elapsed >= 1000) {
      fps = Math.round((frameCount * 1000) / elapsed);
      frameCount = 0;
      lastFPSUpdate = timestamp;

      /* Update FPS history for sparkline */
      fpsHistory.push(fps);
      if (fpsHistory.length > 60) {
        fpsHistory.shift();
      }

      /* Update FPS display */
      updateFPSDisplay();

      /* Update sparkline */
      if (!prefersReducedMotion) {
        updateSparkline();
      }

      /* Update memory */
      updateMemoryDisplay();

      /* Update network resources */
      updateNetworkDisplay();

      /* Update page load (if now available) */
      updatePageLoadDisplay();
    }

    rafId = requestAnimationFrame(measureFrame);
  }

  function startMeasurementLoop() {
    lastFPSUpdate = performance.now();
    frameCount = 0;
    rafId = requestAnimationFrame(measureFrame);
  }

  function stopMeasurementLoop() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  /* --- DOM Node Count (throttled to every 2s) --- */

  function countDOMNodes() {
    domNodeCount = document.querySelectorAll('*').length;
    const el = panelEl ? panelEl.querySelector('#ns-perf-dom') : null;
    if (el) {
      el.textContent = domNodeCount.toLocaleString();
    }
  }

  function startDOMCountInterval() {
    countDOMNodes(); /* immediate first read */
    domIntervalId = setInterval(countDOMNodes, 2000);
  }

  function stopDOMCountInterval() {
    if (domIntervalId !== null) {
      clearInterval(domIntervalId);
      domIntervalId = null;
    }
  }

  /* --- Uptime (every 1s) --- */

  function updateUptime() {
    const elapsedSec = Math.floor((Date.now() - pageOpenedAt) / 1000);
    const minutes = Math.floor(elapsedSec / 60);
    const seconds = elapsedSec % 60;
    const formatted = String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
    const el = panelEl ? panelEl.querySelector('#ns-perf-uptime') : null;
    if (el) {
      el.textContent = formatted;
    }
  }

  function startUptimeInterval() {
    updateUptime(); /* immediate */
    uptimeIntervalId = setInterval(updateUptime, 1000);
  }

  function stopUptimeInterval() {
    if (uptimeIntervalId !== null) {
      clearInterval(uptimeIntervalId);
      uptimeIntervalId = null;
    }
  }

  /* --- Display Updates --- */

  function updateFPSDisplay() {
    const el = panelEl ? panelEl.querySelector('#ns-perf-fps') : null;
    if (!el) return;

    el.textContent = fps;

    /* Color based on FPS value */
    if (fps > 50) {
      el.style.color = 'var(--color-primary, #00ff41)';
    } else if (fps >= 30) {
      el.style.color = 'var(--color-warning, #ffaa00)';
    } else {
      el.style.color = 'var(--color-error, #ff3333)';
    }
  }

  function updateSparkline() {
    const container = panelEl ? panelEl.querySelector('#ns-perf-sparkline') : null;
    if (!container) return;

    const bars = container.children;
    const maxFPS = 60; /* normalize against 60 FPS */

    for (let i = 0; i < bars.length && i < fpsHistory.length; i++) {
      const value = fpsHistory[i];
      const height = Math.max(1, Math.round((value / maxFPS) * 20));
      bars[i].style.height = height + 'px';

      /* Color each bar based on its FPS value */
      if (value > 50) {
        bars[i].style.backgroundColor = 'var(--color-primary, #00ff41)';
      } else if (value >= 30) {
        bars[i].style.backgroundColor = 'var(--color-warning, #ffaa00)';
      } else {
        bars[i].style.backgroundColor = 'var(--color-error, #ff3333)';
      }
    }
  }

  function updateMemoryDisplay() {
    const el = panelEl ? panelEl.querySelector('#ns-perf-memory') : null;
    if (!el) return;

    /* performance.memory is Chrome-only, non-standard */
    if (performance.memory) {
      const used = (performance.memory.usedJSHeapSize / (1024 * 1024)).toFixed(1);
      const total = (performance.memory.totalJSHeapSize / (1024 * 1024)).toFixed(1);
      el.textContent = used + ' / ' + total + ' MB';
    } else {
      el.textContent = 'N/A';
    }
  }

  function updatePageLoadDisplay() {
    const el = panelEl ? panelEl.querySelector('#ns-perf-load') : null;
    if (!el) return;

    if (pageLoadTime !== null) {
      el.textContent = pageLoadTime + ' ms';
    } else {
      el.textContent = '--';
    }
  }

  function updateNetworkDisplay() {
    const el = panelEl ? panelEl.querySelector('#ns-perf-network') : null;
    if (!el) return;

    if (performance.getEntriesByType) {
      const resources = performance.getEntriesByType('resource');
      el.textContent = resources.length + ' resources';
    } else {
      el.textContent = 'N/A';
    }
  }

  /* --- Injected Styles --- */

  function injectStyles() {
    const style = document.createElement('style');
    style.setAttribute('data-perf-monitor', '');
    style.textContent =

      /* Toggle Button */
      '.ns-perf-toggle {' +
        'position: fixed;' +
        'bottom: calc(var(--space-xl, 2rem) + 36px);' +
        'left: var(--space-xl, 2rem);' +
        'background: var(--bg-card, #1a1a1a);' +
        'border: 1px solid var(--border-color, #333333);' +
        'border-radius: var(--radius-md, 8px);' +
        'padding: var(--space-xs, 0.25rem) var(--space-sm, 0.5rem);' +
        'font-family: var(--font-mono, monospace);' +
        'font-size: var(--text-xs, 0.75rem);' +
        'color: var(--color-secondary, #00ffff);' +
        'cursor: pointer;' +
        'z-index: 50;' +
        'transition: border-color var(--transition-fast, 150ms ease), box-shadow var(--transition-fast, 150ms ease);' +
        'user-select: none;' +
        'line-height: 1;' +
      '}' +
      '.ns-perf-toggle:hover {' +
        'border-color: var(--color-secondary, #00ffff);' +
        'box-shadow: var(--glow-secondary, 0 0 20px rgba(0,255,255,0.3));' +
      '}' +
      '.ns-perf-toggle.active {' +
        'border-color: var(--color-secondary, #00ffff);' +
        'color: var(--color-text-bright, #ffffff);' +
        'background: rgba(0, 255, 255, 0.1);' +
      '}' +

      /* Panel */
      '.ns-perf-panel {' +
        'position: fixed;' +
        'bottom: calc(var(--space-xl, 2rem) + 72px);' +
        'left: var(--space-xl, 2rem);' +
        'width: 250px;' +
        'background: var(--bg-primary, #0a0a0a);' +
        'border: 1px solid var(--color-primary, #00ff41);' +
        'border-radius: var(--radius-md, 8px);' +
        'z-index: 50;' +
        'opacity: 0;' +
        'visibility: hidden;' +
        'transform: translateY(10px);' +
        'transition: opacity var(--transition-base, 300ms ease), visibility var(--transition-base, 300ms ease), transform var(--transition-base, 300ms ease);' +
        'overflow: hidden;' +
        'box-shadow: 0 0 15px rgba(0, 255, 65, 0.15), var(--shadow-card, 0 4px 20px rgba(0,0,0,0.5));' +
      '}' +
      '.ns-perf-panel.active {' +
        'opacity: 1;' +
        'visibility: visible;' +
        'transform: translateY(0);' +
      '}' +

      /* Scanlines overlay */
      '.ns-perf-scanlines {' +
        'position: absolute;' +
        'inset: 0;' +
        'background: repeating-linear-gradient(' +
          '0deg,' +
          'transparent,' +
          'transparent 2px,' +
          'rgba(0, 255, 65, 0.03) 2px,' +
          'rgba(0, 255, 65, 0.03) 4px' +
        ');' +
        'pointer-events: none;' +
        'z-index: 1;' +
      '}' +

      /* Header */
      '.ns-perf-header {' +
        'display: flex;' +
        'align-items: center;' +
        'justify-content: space-between;' +
        'padding: var(--space-sm, 0.5rem) var(--space-md, 1rem);' +
        'border-bottom: 1px solid var(--border-color, #333333);' +
        'position: relative;' +
        'z-index: 2;' +
      '}' +
      '.ns-perf-title {' +
        'font-family: var(--font-mono, monospace);' +
        'font-size: var(--text-xs, 0.75rem);' +
        'color: var(--color-primary, #00ff41);' +
        'font-weight: 600;' +
      '}' +
      '.ns-perf-close {' +
        'background: none;' +
        'border: none;' +
        'color: var(--color-text-dim, #888888);' +
        'font-family: var(--font-mono, monospace);' +
        'font-size: var(--text-xs, 0.75rem);' +
        'cursor: pointer;' +
        'padding: 2px 4px;' +
        'transition: color var(--transition-fast, 150ms ease);' +
      '}' +
      '.ns-perf-close:hover {' +
        'color: var(--color-primary, #00ff41);' +
      '}' +

      /* Body */
      '.ns-perf-body {' +
        'padding: var(--space-sm, 0.5rem) var(--space-md, 1rem);' +
        'position: relative;' +
        'z-index: 2;' +
      '}' +

      /* Metric row */
      '.ns-perf-row {' +
        'display: flex;' +
        'align-items: center;' +
        'justify-content: space-between;' +
        'padding: 3px 0;' +
        'font-family: var(--font-mono, monospace);' +
        'font-size: var(--text-xs, 0.75rem);' +
        'line-height: 1.4;' +
      '}' +
      '.ns-perf-label {' +
        'color: var(--color-text-dim, #888888);' +
        'font-weight: 500;' +
        'letter-spacing: 0.5px;' +
      '}' +
      '.ns-perf-value {' +
        'color: var(--color-secondary, #00ffff);' +
        'font-weight: 600;' +
        'text-align: right;' +
      '}' +

      /* Sparkline container */
      '.ns-perf-sparkline {' +
        'display: flex;' +
        'align-items: flex-end;' +
        'gap: 1px;' +
        'height: 22px;' +
        'padding: 2px 0 6px;' +
        'position: relative;' +
        'z-index: 2;' +
        'border-bottom: 1px solid rgba(51, 51, 51, 0.5);' +
        'margin-bottom: 2px;' +
      '}' +

      /* Sparkline bar */
      '.ns-perf-spark-bar {' +
        'flex: 1;' +
        'min-width: 2px;' +
        'max-width: 4px;' +
        'height: 1px;' +
        'background-color: var(--color-primary, #00ff41);' +
        'border-radius: 1px 1px 0 0;' +
        'transition: height 0.15s ease;' +
      '}' +

      /* Reduced motion: disable sparkline animation */
      '@media (prefers-reduced-motion: reduce) {' +
        '.ns-perf-spark-bar {' +
          'transition: none;' +
        '}' +
      '}';

    document.head.appendChild(style);
  }

  /* --- Public API --- */

  return {
    init: init,
    open: openPanel,
    close: closePanel,
    toggle: function() {
      if (isOpen) {
        closePanel();
      } else {
        openPanel();
      }
    }
  };
})();

/* Initialize when DOM is ready */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    PerfMonitor.init();
  });
} else {
  PerfMonitor.init();
}
