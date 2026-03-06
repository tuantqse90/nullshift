/* ==============================
   BOOT SEQUENCE — NullShift
   Full-screen terminal boot animation
   Plays once on first visit, stored in localStorage
   ============================== */
(function () {
  'use strict';

  const STORAGE_KEY = 'ns_boot_seen';

  // If already seen, bail immediately
  if (localStorage.getItem(STORAGE_KEY)) return;

  // Respect prefers-reduced-motion — skip entirely
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    localStorage.setItem(STORAGE_KEY, 'true');
    return;
  }

  // ---- Build the overlay DOM immediately (before DOMContentLoaded) ----

  const overlay = document.createElement('div');
  overlay.id = 'ns-boot-overlay';
  overlay.setAttribute('aria-hidden', 'true');

  // All styles inline so this works without any CSS file dependency
  overlay.style.cssText = [
    'position: fixed',
    'top: 0',
    'left: 0',
    'width: 100vw',
    'height: 100vh',
    'z-index: 99999',
    'background: #0a0a0a',
    'display: flex',
    'flex-direction: column',
    'justify-content: center',
    'padding: 2rem',
    'box-sizing: border-box',
    'overflow: hidden',
    'opacity: 1',
    'transition: opacity 0.5s ease'
  ].join(';');

  // Scanline overlay (CSS pseudo-element via a real child div)
  const scanlines = document.createElement('div');
  scanlines.style.cssText = [
    'position: absolute',
    'top: 0',
    'left: 0',
    'width: 100%',
    'height: 100%',
    'pointer-events: none',
    'background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.03) 2px, rgba(0,255,65,0.03) 4px)',
    'z-index: 1'
  ].join(';');
  overlay.appendChild(scanlines);

  // Terminal output container
  const terminal = document.createElement('div');
  terminal.style.cssText = [
    'position: relative',
    'z-index: 2',
    'max-width: 720px',
    'width: 100%',
    'margin: 0 auto',
    'font-family: "JetBrains Mono", "Fira Code", "Courier New", monospace',
    'font-size: 14px',
    'line-height: 1.8',
    'color: #00ff41'
  ].join(';');
  overlay.appendChild(terminal);

  // Skip button
  const skipBtn = document.createElement('button');
  skipBtn.textContent = 'Skip';
  skipBtn.style.cssText = [
    'position: fixed',
    'bottom: 2rem',
    'right: 2rem',
    'z-index: 100000',
    'background: transparent',
    'border: 1px solid #333333',
    'color: #888888',
    'font-family: "JetBrains Mono", "Fira Code", "Courier New", monospace',
    'font-size: 12px',
    'padding: 6px 16px',
    'cursor: pointer',
    'border-radius: 4px',
    'transition: border-color 0.15s ease, color 0.15s ease'
  ].join(';');
  skipBtn.addEventListener('mouseenter', function () {
    skipBtn.style.borderColor = '#00ff41';
    skipBtn.style.color = '#00ff41';
  });
  skipBtn.addEventListener('mouseleave', function () {
    skipBtn.style.borderColor = '#333333';
    skipBtn.style.color = '#888888';
  });
  overlay.appendChild(skipBtn);

  // Insert into document immediately
  // document.body may not exist yet if the script is in <head>,
  // so we append to documentElement and reattach to body when ready
  (document.body || document.documentElement).appendChild(overlay);

  // ---- Boot sequence data ----

  const BOOT_LINES = [
    { tag: 'BOOT', text: 'nullshift.sh v2.0', color: '#00ffff' },
    { tag: 'INIT', text: 'Loading kernel modules...', color: '#ffaa00' },
    { tag: 'OK', text: 'privacy_shield.ko loaded', color: '#00ff41' },
    { tag: 'OK', text: 'ai_engine.ko loaded', color: '#00ff41' },
    { tag: 'OK', text: 'blockchain_node.ko loaded', color: '#00ff41' },
    { tag: 'OK', text: 'zk_proofs.ko loaded', color: '#00ff41' },
    { tag: 'INIT', text: 'Establishing secure connection...', color: '#ffaa00' },
    { tag: 'OK', text: 'TLS 1.3 handshake complete', color: '#00ff41' },
    { tag: 'OK', text: 'Certificate verified: nullshift.sh', color: '#00ff41' },
    { tag: 'INIT', text: 'Loading system components...', color: '#ffaa00' },
    { tag: 'PROGRESS', text: '', color: '#00ff41' },
    { tag: 'OK', text: 'All systems operational', color: '#00ff41' },
    { tag: 'READY', text: 'Welcome to nullshift.sh', color: '#00ffff' },
    { tag: '>', text: 'Entering main terminal...', color: '#00ff41' }
  ];

  // Tag colors for the bracket portion
  const TAG_COLORS = {
    'BOOT': '#00ffff',
    'INIT': '#ffaa00',
    'OK': '#00ff41',
    'READY': '#00ffff',
    '>': '#ff0080'
  };

  // Delays before each line starts typing (ms)
  const LINE_DELAYS = [
    0,     // [BOOT]
    400,   // [INIT] Loading kernel modules
    300,   // [OK] privacy_shield
    150,   // [OK] ai_engine
    150,   // [OK] blockchain_node
    150,   // [OK] zk_proofs
    500,   // [INIT] Establishing secure connection
    600,   // [OK] TLS 1.3
    200,   // [OK] Certificate verified
    400,   // [INIT] Loading system components
    300,   // Progress bar
    200,   // [OK] All systems operational
    400,   // [READY]
    300    // > Entering main terminal
  ];

  // ---- State ----

  let currentLine = 0;
  let currentChar = 0;
  let activeLineEl = null;
  let fullLineText = '';
  let isTyping = false;
  let isComplete = false;
  let progressAnimating = false;
  let progressValue = 0;
  let progressBarEl = null;
  let lastTypingTime = 0;
  const TYPING_INTERVAL = 25; // ms per character

  // ---- Helper: create a line element ----

  function createLineElement(lineData) {
    const line = document.createElement('div');
    line.style.whiteSpace = 'pre';
    line.style.minHeight = '1.8em';

    if (lineData.tag === '>') {
      // Special prompt line
      const tagSpan = document.createElement('span');
      tagSpan.style.color = TAG_COLORS['>'];
      tagSpan.textContent = '> ';
      line.appendChild(tagSpan);

      const textSpan = document.createElement('span');
      textSpan.style.color = lineData.color;
      line.appendChild(textSpan);

      return { el: line, textTarget: textSpan, prefix: '> ', fullText: lineData.text };
    }

    if (lineData.tag === 'PROGRESS') {
      // Progress bar line — handled differently
      line.style.color = lineData.color;
      return { el: line, textTarget: line, prefix: '', fullText: '', isProgress: true };
    }

    // Standard tagged line: [TAG] text
    const tagSpan = document.createElement('span');
    tagSpan.style.color = TAG_COLORS[lineData.tag] || '#00ff41';
    tagSpan.textContent = '[' + lineData.tag + '] ';
    line.appendChild(tagSpan);

    const textSpan = document.createElement('span');
    textSpan.style.color = '#e0e0e0';
    line.appendChild(textSpan);

    return { el: line, textTarget: textSpan, prefix: '[' + lineData.tag + '] ', fullText: lineData.text };
  }

  // ---- Progress bar animation using rAF ----

  const PROGRESS_BAR_WIDTH = 32;
  const PROGRESS_DURATION = 1200; // ms
  let progressStartTime = 0;

  function animateProgress(timestamp) {
    if (isComplete) return;

    if (!progressStartTime) progressStartTime = timestamp;
    const elapsed = timestamp - progressStartTime;
    const progress = Math.min(elapsed / PROGRESS_DURATION, 1);

    const filled = Math.floor(progress * PROGRESS_BAR_WIDTH);
    const empty = PROGRESS_BAR_WIDTH - filled;
    const percent = Math.floor(progress * 100);
    const bar = '[' + '\u2588'.repeat(filled) + '\u2591'.repeat(empty) + '] ' + percent + '%';

    progressBarEl.textContent = bar;

    if (progress < 1) {
      requestAnimationFrame(animateProgress);
    } else {
      progressAnimating = false;
      // Move to next line after progress completes
      currentLine++;
      scheduleNextLine();
    }
  }

  // ---- Typing animation using rAF ----

  function typeLine(timestamp) {
    if (isComplete) return;
    if (!isTyping) return;

    if (timestamp - lastTypingTime >= TYPING_INTERVAL) {
      lastTypingTime = timestamp;

      if (currentChar < fullLineText.length) {
        activeLineEl.textContent += fullLineText[currentChar];
        currentChar++;
      }

      if (currentChar >= fullLineText.length) {
        // Line complete
        isTyping = false;
        currentLine++;
        scheduleNextLine();
        return;
      }
    }

    requestAnimationFrame(typeLine);
  }

  // ---- Schedule next line ----

  function scheduleNextLine() {
    if (isComplete) return;
    if (currentLine >= BOOT_LINES.length) {
      finishBoot();
      return;
    }

    const delay = LINE_DELAYS[currentLine] || 200;

    setTimeout(function () {
      if (isComplete) return;
      startLine(currentLine);
    }, delay);
  }

  // ---- Start typing a line ----

  function startLine(index) {
    if (isComplete) return;

    const lineData = BOOT_LINES[index];
    const result = createLineElement(lineData);
    terminal.appendChild(result.el);

    // Auto-scroll terminal to bottom
    result.el.scrollIntoView({ behavior: 'instant', block: 'end' });

    if (result.isProgress) {
      // Animate progress bar with rAF
      progressBarEl = result.textTarget;
      progressAnimating = true;
      progressStartTime = 0;
      requestAnimationFrame(animateProgress);
      return;
    }

    // Type out the text character by character using rAF
    activeLineEl = result.textTarget;
    fullLineText = result.fullText;
    currentChar = 0;
    isTyping = true;
    lastTypingTime = 0;
    requestAnimationFrame(typeLine);
  }

  // ---- Finish boot & fade out ----

  function finishBoot() {
    if (isComplete) return;
    isComplete = true;

    localStorage.setItem(STORAGE_KEY, 'true');

    // Add blinking cursor at the end
    const cursor = document.createElement('span');
    cursor.textContent = '_';
    cursor.style.color = '#00ff41';
    cursor.style.animation = 'ns-boot-blink 1s step-end infinite';
    terminal.appendChild(cursor);

    // Inject keyframes for cursor blink
    const style = document.createElement('style');
    style.textContent = '@keyframes ns-boot-blink { 0%,100%{opacity:1} 50%{opacity:0} }';
    document.head.appendChild(style);

    // Wait a moment, then fade out and remove
    setTimeout(function () {
      overlay.style.opacity = '0';

      overlay.addEventListener('transitionend', function handler() {
        overlay.removeEventListener('transitionend', handler);
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
        if (style.parentNode) {
          style.parentNode.removeChild(style);
        }
      });
    }, 800);
  }

  // ---- Skip handler ----

  function skipBoot() {
    if (isComplete) return;
    isComplete = true;
    isTyping = false;
    progressAnimating = false;

    localStorage.setItem(STORAGE_KEY, 'true');

    overlay.style.opacity = '0';

    overlay.addEventListener('transitionend', function handler() {
      overlay.removeEventListener('transitionend', handler);
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    });
  }

  skipBtn.addEventListener('click', skipBoot);

  // Click or keypress to skip
  overlay.addEventListener('click', function (e) {
    // Don't skip if they clicked the skip button (it has its own handler)
    if (e.target === skipBtn) return;
    skipBoot();
  });

  document.addEventListener('keydown', function onKey(e) {
    if (isComplete) {
      document.removeEventListener('keydown', onKey);
      return;
    }
    skipBoot();
    document.removeEventListener('keydown', onKey);
  });

  // ---- Start the boot sequence ----

  scheduleNextLine();

})();
