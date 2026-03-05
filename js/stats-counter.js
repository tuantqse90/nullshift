/* ==============================
   ANIMATED STATS COUNTER
   ============================== */
class StatsCounter {
  constructor(container) {
    this.container = container;
    this.counters = container.querySelectorAll('[data-count]');
    this.animated = false;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.animated) {
          this.animated = true;
          this.animateAll();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(this.container);
  }

  animateAll() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.counters.forEach(el => {
        el.textContent = el.dataset.count;
      });
      return;
    }

    this.counters.forEach(el => {
      const target = el.dataset.count;
      const isNumber = /^\d+$/.test(target.replace(/[+,]/g, ''));

      if (isNumber) {
        const num = parseInt(target.replace(/[+,]/g, ''), 10);
        const suffix = target.includes('+') ? '+' : '';
        const hasComma = target.includes(',');
        this.countUp(el, num, suffix, hasComma);
      } else {
        el.textContent = target;
      }
    });
  }

  countUp(el, target, suffix, hasComma) {
    const duration = 2000;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      let display = hasComma ? current.toLocaleString() : current.toString();
      el.textContent = display + suffix;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }
}
