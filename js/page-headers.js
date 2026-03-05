/* ==============================
   PAGE HEADER CANVAS ANIMATIONS
   Unique animated backgrounds for each page hero section.
   ============================== */
const PageHeaders = (function() {

  /* --- Circuit Board (Services) --- */
  function CircuitAnimation(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.visible = true;
    this.hidden = false;
    this.frameId = null;
    this.nodes = [];
    this.edges = [];
    this.pulses = [];
    this.time = 0;

    const count = 30;
    for (let i = 0; i < count; i++) {
      this.nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 1.5
      });
    }
    for (let i = 0; i < this.nodes.length; i++) {
      const nearest = this.nodes
        .map((n, j) => ({ j, d: Math.hypot(n.x - this.nodes[i].x, n.y - this.nodes[i].y) }))
        .filter(o => o.j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 2);
      nearest.forEach(n => {
        if (!this.edges.some(e => (e.a === i && e.b === n.j) || (e.a === n.j && e.b === i))) {
          this.edges.push({ a: i, b: n.j });
        }
      });
    }
  }

  CircuitAnimation.prototype.start = function() {
    const self = this;
    const draw = function() {
      if (!self.visible || self.hidden) { self.frameId = requestAnimationFrame(draw); return; }
      const ctx = self.ctx;
      const w = self.canvas.width;
      const h = self.canvas.height;
      ctx.clearRect(0, 0, w, h);
      self.time += 0.005;

      // edges — draw as right-angle paths
      self.edges.forEach(function(e) {
        const a = self.nodes[e.a];
        const b = self.nodes[e.b];
        const mx = b.x;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(mx, a.y);
        ctx.lineTo(mx, b.y);
        ctx.strokeStyle = 'rgba(0, 255, 65, 0.15)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // pulses along edges
      self.edges.forEach(function(e, idx) {
        const t = (self.time * 2 + idx * 0.3) % 1;
        const a = self.nodes[e.a];
        const b = self.nodes[e.b];
        const mx = b.x;
        let px, py;
        if (t < 0.5) {
          const st = t * 2;
          px = a.x + (mx - a.x) * st;
          py = a.y;
        } else {
          const st = (t - 0.5) * 2;
          px = mx;
          py = a.y + (b.y - a.y) * st;
        }
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 255, 65, 0.6)';
        ctx.fill();
      });

      // nodes
      self.nodes.forEach(function(n) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 255, 65, 0.4)';
        ctx.fill();
      });

      self.frameId = requestAnimationFrame(draw);
    };
    self.frameId = requestAnimationFrame(draw);
  };

  /* --- Floating Grid (Products) --- */
  function GridAnimation(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.visible = true;
    this.hidden = false;
    this.frameId = null;
    this.dots = [];
    this.time = 0;

    const cols = 12;
    const rows = 6;
    const spacingX = canvas.width / (cols + 1);
    const spacingY = canvas.height / (rows + 1);
    for (let r = 1; r <= rows; r++) {
      for (let c = 1; c <= cols; c++) {
        this.dots.push({
          baseX: c * spacingX,
          baseY: r * spacingY,
          x: c * spacingX,
          y: r * spacingY,
          baseR: 2,
          r: 2,
          phase: Math.random() * Math.PI * 2
        });
      }
    }
  }

  GridAnimation.prototype.start = function() {
    const self = this;
    const cx = self.canvas.width / 2;
    const cy = self.canvas.height / 2;
    const draw = function() {
      if (!self.visible || self.hidden) { self.frameId = requestAnimationFrame(draw); return; }
      const ctx = self.ctx;
      ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
      self.time += 0.02;

      self.dots.forEach(function(d) {
        d.x = d.baseX + Math.sin(self.time + d.phase) * 3;
        d.y = d.baseY + Math.cos(self.time * 0.7 + d.phase) * 3;
        const dist = Math.hypot(d.x - cx, d.y - cy);
        const maxDist = Math.hypot(cx, cy);
        const proximity = 1 - Math.min(dist / maxDist, 1);
        const alpha = 0.15 + proximity * 0.45;
        d.r = d.baseR + proximity * 3;

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 255, 255, ' + alpha + ')';
        ctx.fill();

        if (proximity > 0.3) {
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.r + 4, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(0, 255, 255, ' + (proximity * 0.1) + ')';
          ctx.fill();
        }
      });

      self.frameId = requestAnimationFrame(draw);
    };
    self.frameId = requestAnimationFrame(draw);
  };

  /* --- Blockchain Blocks (Projects) --- */
  function BlockchainAnimation(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.visible = true;
    this.hidden = false;
    this.frameId = null;
    this.blocks = [];

    const count = 20;
    for (let i = 0; i < count; i++) {
      this.blocks.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        w: 16 + Math.random() * 14,
        h: 10 + Math.random() * 8,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3
      });
    }
  }

  BlockchainAnimation.prototype.start = function() {
    const self = this;
    const draw = function() {
      if (!self.visible || self.hidden) { self.frameId = requestAnimationFrame(draw); return; }
      const ctx = self.ctx;
      const w = self.canvas.width;
      const h = self.canvas.height;
      ctx.clearRect(0, 0, w, h);

      // connections
      for (let i = 0; i < self.blocks.length; i++) {
        const a = self.blocks[i];
        for (let j = i + 1; j < self.blocks.length; j++) {
          const b = self.blocks[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 160) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = 'rgba(255, 0, 128, ' + ((1 - dist / 160) * 0.2) + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // blocks
      self.blocks.forEach(function(b) {
        b.x += b.vx;
        b.y += b.vy;
        if (b.x < 0 || b.x > w) b.vx *= -1;
        if (b.y < 0 || b.y > h) b.vy *= -1;

        ctx.strokeStyle = 'rgba(255, 0, 128, 0.4)';
        ctx.lineWidth = 1;
        ctx.strokeRect(b.x - b.w / 2, b.y - b.h / 2, b.w, b.h);

        // inner hash lines
        ctx.beginPath();
        ctx.moveTo(b.x - b.w / 2 + 3, b.y);
        ctx.lineTo(b.x + b.w / 2 - 3, b.y);
        ctx.strokeStyle = 'rgba(255, 0, 128, 0.2)';
        ctx.stroke();
      });

      self.frameId = requestAnimationFrame(draw);
    };
    self.frameId = requestAnimationFrame(draw);
  };

  /* --- Neural Network (Agents) --- */
  function NeuralAnimation(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.visible = true;
    this.hidden = false;
    this.frameId = null;
    this.layers = [];
    this.connections = [];
    this.time = 0;

    const layerSizes = [4, 6, 8, 6, 4];
    const layerSpacing = canvas.width / (layerSizes.length + 1);
    layerSizes.forEach(function(size, li) {
      const layer = [];
      const nodeSpacing = canvas.height / (size + 1);
      for (let i = 0; i < size; i++) {
        layer.push({
          x: (li + 1) * layerSpacing,
          y: (i + 1) * nodeSpacing,
          r: 3
        });
      }
      this.layers.push(layer);
    }.bind(this));

    for (let l = 0; l < this.layers.length - 1; l++) {
      this.layers[l].forEach(function(a, ai) {
        this.layers[l + 1].forEach(function(b, bi) {
          if (Math.random() > 0.4) {
            this.connections.push({ from: a, to: b, phase: Math.random() * Math.PI * 2 });
          }
        }.bind(this));
      }.bind(this));
    }
  }

  NeuralAnimation.prototype.start = function() {
    const self = this;
    const draw = function() {
      if (!self.visible || self.hidden) { self.frameId = requestAnimationFrame(draw); return; }
      const ctx = self.ctx;
      ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
      self.time += 0.015;

      // connections with activation pulses
      self.connections.forEach(function(c) {
        const pulse = (Math.sin(self.time * 2 + c.phase) + 1) / 2;
        ctx.beginPath();
        ctx.moveTo(c.from.x, c.from.y);
        ctx.lineTo(c.to.x, c.to.y);
        ctx.strokeStyle = 'rgba(0, 255, 255, ' + (0.05 + pulse * 0.15) + ')';
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // pulse dot traveling along connection
        const t = (self.time + c.phase) % 1;
        const px = c.from.x + (c.to.x - c.from.x) * t;
        const py = c.from.y + (c.to.y - c.from.y) * t;
        ctx.beginPath();
        ctx.arc(px, py, 1, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 255, 255, ' + (pulse * 0.4) + ')';
        ctx.fill();
      });

      // nodes
      self.layers.forEach(function(layer) {
        layer.forEach(function(n) {
          const glow = (Math.sin(self.time * 3 + n.x * 0.01) + 1) / 2;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(0, 255, 255, ' + (0.3 + glow * 0.3) + ')';
          ctx.fill();
        });
      });

      self.frameId = requestAnimationFrame(draw);
    };
    self.frameId = requestAnimationFrame(draw);
  };

  /* --- Falling Code Horizontal (Blog) --- */
  function CodeAnimation(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.visible = true;
    this.hidden = false;
    this.frameId = null;
    this.rows = [];
    this.chars = '01{}[]<>#!/bin/bash;const==>async_await.map();';

    const rowCount = Math.min(Math.floor(canvas.height / 18), 16);
    for (let i = 0; i < rowCount; i++) {
      this.rows.push({
        y: (i + 1) * (canvas.height / (rowCount + 1)),
        offset: Math.random() * canvas.width,
        speed: 0.3 + Math.random() * 0.8,
        text: '',
        alpha: 0.15 + Math.random() * 0.25
      });
      // generate random text for this row
      let txt = '';
      for (let c = 0; c < 80; c++) {
        txt += this.chars[Math.floor(Math.random() * this.chars.length)];
      }
      this.rows[i].text = txt;
    }
  }

  CodeAnimation.prototype.start = function() {
    const self = this;
    const draw = function() {
      if (!self.visible || self.hidden) { self.frameId = requestAnimationFrame(draw); return; }
      const ctx = self.ctx;
      ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
      ctx.font = '12px JetBrains Mono, monospace';

      self.rows.forEach(function(row) {
        row.offset += row.speed;
        if (row.offset > self.canvas.width + 600) row.offset = -600;
        ctx.fillStyle = 'rgba(0, 255, 65, ' + row.alpha + ')';
        ctx.fillText(row.text, row.offset - 600, row.y);
      });

      self.frameId = requestAnimationFrame(draw);
    };
    self.frameId = requestAnimationFrame(draw);
  };

  /* --- Timeline (Changelog) --- */
  function TimelineAnimation(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.visible = true;
    this.hidden = false;
    this.frameId = null;
    this.dots = [];
    this.scrollOffset = 0;

    const count = 25;
    const spacing = (canvas.height + 200) / count;
    for (let i = 0; i < count; i++) {
      this.dots.push({
        baseY: i * spacing,
        x: canvas.width / 2 + (Math.random() - 0.5) * 60,
        r: 2 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  TimelineAnimation.prototype.start = function() {
    const self = this;
    const draw = function() {
      if (!self.visible || self.hidden) { self.frameId = requestAnimationFrame(draw); return; }
      const ctx = self.ctx;
      const w = self.canvas.width;
      const h = self.canvas.height;
      ctx.clearRect(0, 0, w, h);
      self.scrollOffset += 0.3;

      // central line
      ctx.beginPath();
      ctx.moveTo(w / 2, 0);
      ctx.lineTo(w / 2, h);
      ctx.strokeStyle = 'rgba(0, 255, 65, 0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();

      const totalH = h + 200;
      self.dots.forEach(function(d) {
        let y = (d.baseY - self.scrollOffset) % totalH;
        if (y < -20) y += totalH;
        const pulse = (Math.sin(self.scrollOffset * 0.05 + d.phase) + 1) / 2;
        const alpha = 0.2 + pulse * 0.4;

        // connecting line from center to dot
        ctx.beginPath();
        ctx.moveTo(w / 2, y);
        ctx.lineTo(d.x, y);
        ctx.strokeStyle = 'rgba(0, 255, 65, ' + (alpha * 0.4) + ')';
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // dot
        ctx.beginPath();
        ctx.arc(d.x, y, d.r + pulse * 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 255, 65, ' + alpha + ')';
        ctx.fill();
      });

      self.frameId = requestAnimationFrame(draw);
    };
    self.frameId = requestAnimationFrame(draw);
  };

  /* --- Sine Waves (Docs) --- */
  function WaveAnimation(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.visible = true;
    this.hidden = false;
    this.frameId = null;
    this.time = 0;
    this.waves = [
      { amp: 30, freq: 0.015, speed: 0.03, color: '0, 255, 65', alpha: 0.3 },
      { amp: 20, freq: 0.02, speed: -0.02, color: '0, 255, 255', alpha: 0.25 },
      { amp: 25, freq: 0.012, speed: 0.015, color: '0, 255, 65', alpha: 0.2 },
      { amp: 15, freq: 0.025, speed: -0.035, color: '0, 255, 255', alpha: 0.15 }
    ];
  }

  WaveAnimation.prototype.start = function() {
    const self = this;
    const draw = function() {
      if (!self.visible || self.hidden) { self.frameId = requestAnimationFrame(draw); return; }
      const ctx = self.ctx;
      const w = self.canvas.width;
      const h = self.canvas.height;
      ctx.clearRect(0, 0, w, h);
      self.time += 1;

      const mid = h / 2;
      self.waves.forEach(function(wave) {
        ctx.beginPath();
        for (let x = 0; x <= w; x += 2) {
          const y = mid + Math.sin(x * wave.freq + self.time * wave.speed) * wave.amp;
          if (x === 0) { ctx.moveTo(x, y); } else { ctx.lineTo(x, y); }
        }
        ctx.strokeStyle = 'rgba(' + wave.color + ', ' + wave.alpha + ')';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      self.frameId = requestAnimationFrame(draw);
    };
    self.frameId = requestAnimationFrame(draw);
  };

  /* --- Animation Registry --- */
  const animations = {
    circuit: CircuitAnimation,
    grid: GridAnimation,
    blockchain: BlockchainAnimation,
    neural: NeuralAnimation,
    code: CodeAnimation,
    timeline: TimelineAnimation,
    wave: WaveAnimation
  };

  /* --- Resize Helper --- */
  function resizeCanvas(canvas) {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }

  /* --- Init --- */
  function init() {
    const canvas = document.querySelector('.page-header-canvas');
    if (!canvas) return;

    const type = canvas.dataset.animation;
    if (!type || !animations[type]) return;

    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');

    // Size canvas to parent
    resizeCanvas(canvas);
    window.addEventListener('resize', function() {
      resizeCanvas(canvas);
    });

    // Create animation instance
    const anim = new animations[type](canvas, ctx);

    // IntersectionObserver — only animate when visible
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        anim.visible = entry.isIntersecting;
      });
    }, { threshold: 0.1 });
    observer.observe(canvas);

    // Pause when tab is hidden
    document.addEventListener('visibilitychange', function() {
      anim.hidden = document.hidden;
    });

    anim.start();
  }

  return { init: init };
})();

PageHeaders.init();
