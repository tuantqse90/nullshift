/* ==============================
   MATRIX RAIN
   ============================== */
class MatrixRain {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.columns = [];
    this.fontSize = 14;
    this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*{}[]<>~^|\\';
    this.running = false;
    this.frameId = null;

    this.resize();
    window.addEventListener('resize', () => this.resize());

    this.visibilityObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !document.hidden) {
          this.start();
        } else {
          this.stop();
        }
      });
    }, { threshold: 0.1 });

    this.visibilityObserver.observe(this.canvas);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stop();
      }
    });
  }

  resize() {
    this.canvas.width = this.canvas.parentElement.offsetWidth;
    this.canvas.height = this.canvas.parentElement.offsetHeight;
    const colCount = Math.floor(this.canvas.width / this.fontSize);
    this.columns = new Array(colCount).fill(0);
  }

  start() {
    if (this.running) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    this.running = true;
    this.draw();
  }

  stop() {
    this.running = false;
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
  }

  draw() {
    if (!this.running) return;

    this.ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = '#00ff41';
    this.ctx.font = `${this.fontSize}px JetBrains Mono, monospace`;

    for (let i = 0; i < this.columns.length; i++) {
      const char = this.chars[Math.floor(Math.random() * this.chars.length)];
      const x = i * this.fontSize;
      const y = this.columns[i] * this.fontSize;

      this.ctx.globalAlpha = Math.random() * 0.5 + 0.3;
      this.ctx.fillText(char, x, y);
      this.ctx.globalAlpha = 1;

      if (y > this.canvas.height && Math.random() > 0.975) {
        this.columns[i] = 0;
      }
      this.columns[i]++;
    }

    this.frameId = requestAnimationFrame(() => this.draw());
  }

  destroy() {
    this.stop();
    this.visibilityObserver.disconnect();
  }
}

/* ==============================
   GLITCH TEXT
   ============================== */
class GlitchText {
  constructor(element) {
    this.element = element;
    this.originalText = element.textContent;
    this.glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?~`';
    this.isGlitching = false;

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.triggerGlitch();
      this.interval = setInterval(() => this.triggerGlitch(), 5000 + Math.random() * 5000);
    }
  }

  triggerGlitch() {
    if (this.isGlitching) return;
    this.isGlitching = true;

    const duration = 200;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      if (elapsed >= duration) {
        this.element.textContent = this.originalText;
        this.isGlitching = false;
        return;
      }

      const text = this.originalText.split('').map(char => {
        if (char === ' ') return ' ';
        return Math.random() > 0.7
          ? this.glitchChars[Math.floor(Math.random() * this.glitchChars.length)]
          : char;
      }).join('');

      this.element.textContent = text;
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }

  destroy() {
    if (this.interval) clearInterval(this.interval);
    this.element.textContent = this.originalText;
  }
}

/* ==============================
   TYPING EFFECT
   ============================== */
class TypingEffect {
  constructor(element, lines, options = {}) {
    this.element = element;
    this.lines = lines;
    this.typeSpeed = options.typeSpeed || 50;
    this.deleteSpeed = options.deleteSpeed || 30;
    this.pauseTime = options.pauseTime || 2000;
    this.lineIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.cursor = document.createElement('span');
    this.cursor.className = 'cursor';
    this.element.appendChild(this.cursor);
    this.textSpan = document.createElement('span');
    this.element.insertBefore(this.textSpan, this.cursor);

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.type();
    } else {
      this.textSpan.textContent = this.lines[0];
    }
  }

  type() {
    const currentLine = this.lines[this.lineIndex];

    if (!this.isDeleting) {
      this.textSpan.textContent = currentLine.substring(0, this.charIndex + 1);
      this.charIndex++;

      if (this.charIndex === currentLine.length) {
        this.isDeleting = true;
        this.timeout = setTimeout(() => requestAnimationFrame(() => this.type()), this.pauseTime);
        return;
      }
    } else {
      this.textSpan.textContent = currentLine.substring(0, this.charIndex - 1);
      this.charIndex--;

      if (this.charIndex === 0) {
        this.isDeleting = false;
        this.lineIndex = (this.lineIndex + 1) % this.lines.length;
      }
    }

    const speed = this.isDeleting ? this.deleteSpeed : this.typeSpeed;
    this.timeout = setTimeout(() => requestAnimationFrame(() => this.type()), speed);
  }

  destroy() {
    if (this.timeout) clearTimeout(this.timeout);
  }
}

/* ==============================
   SCANLINES INIT
   ============================== */
function initScanlines() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.body.classList.add('scanlines');
}
