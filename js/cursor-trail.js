/* ==============================
   CURSOR TRAIL EFFECT
   ============================== */
class CursorTrail {
  constructor() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if ('ontouchstart' in window) return;

    this.particles = [];
    this.maxParticles = 20;
    this.running = false;
    this.frameId = null;

    this.canvas = document.createElement('canvas');
    this.canvas.className = 'cursor-trail-canvas';
    this.canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9998;';
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    this.resize();
    window.addEventListener('resize', () => this.resize());

    document.addEventListener('mousemove', (e) => {
      this.addParticle(e.clientX, e.clientY);
      if (!this.running) this.start();
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.stop();
    });
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  addParticle(x, y) {
    this.particles.push({
      x,
      y,
      size: Math.random() * 3 + 1,
      life: 1,
      decay: Math.random() * 0.03 + 0.02,
      vx: (Math.random() - 0.5) * 1,
      vy: (Math.random() - 0.5) * 1,
      color: Math.random() > 0.7 ? '0, 255, 255' : '0, 255, 65'
    });

    while (this.particles.length > this.maxParticles) {
      this.particles.shift();
    }
  }

  start() {
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

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles = this.particles.filter(p => p.life > 0);

    if (this.particles.length === 0) {
      this.stop();
      return;
    }

    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      p.size *= 0.98;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${p.color}, ${p.life * 0.6})`;
      this.ctx.fill();
    });

    this.frameId = requestAnimationFrame(() => this.draw());
  }
}

// Auto-instantiate (this file is loaded with defer)
new CursorTrail();
