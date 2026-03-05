/* ==============================
   AGENT GRAPH
   ============================== */
class AgentGraph {
  constructor(canvas, agents) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.agents = agents;
    this.nodes = [];
    this.edges = [];
    this.selectedNode = null;
    this.hoveredNode = null;
    this.dragNode = null;
    this.isDragging = false;
    this.running = false;
    this.frameId = null;
    this.edgePulse = 0;

    // Zoom & pan state
    this.scale = 1;
    this.panX = 0;
    this.panY = 0;
    this.isPanning = false;
    this.panStart = { x: 0, y: 0 };

    this.resize();
    this.buildGraph();

    window.addEventListener('resize', () => {
      this.resize();
      this.layoutNodes();
    });

    this.canvas.addEventListener('click', (e) => {
      if (!this.isDragging) this.handleClick(e);
    });
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    this.canvas.addEventListener('mouseleave', () => this.handleMouseUp());
    this.canvas.addEventListener('wheel', (e) => this.handleWheel(e), { passive: false });

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
      if (document.hidden) this.stop();
    });
  }

  resize() {
    this.canvas.width = this.canvas.parentElement.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight || 500;
    this.layoutNodes();
  }

  buildGraph() {
    const pillarColors = {
      privacy: '#00ff41',
      ai: '#00ffff',
      blockchain: '#ff0080',
      zk: '#a855f7'
    };

    const statusAlpha = {
      active: 1,
      idle: 0.5,
      deprecated: 0.3
    };

    this.agents.forEach(agent => {
      this.nodes.push({
        id: agent.id,
        label: agent.name,
        color: pillarColors[agent.pillar] || '#ffffff',
        alpha: statusAlpha[agent.status] || 0.5,
        radius: agent.status === 'active' ? 24 : 18,
        x: 0,
        y: 0,
        data: agent
      });
    });

    this.agents.forEach(agent => {
      if (agent.connections) {
        agent.connections.forEach(targetId => {
          const exists = this.edges.some(e =>
            (e.from === agent.id && e.to === targetId) ||
            (e.from === targetId && e.to === agent.id)
          );
          if (!exists) {
            this.edges.push({ from: agent.id, to: targetId });
          }
        });
      }
    });

    this.layoutNodes();
  }

  layoutNodes() {
    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2;
    const radius = Math.min(cx, cy) * 0.6;

    this.nodes.forEach((node, i) => {
      const angle = (i / this.nodes.length) * Math.PI * 2 - Math.PI / 2;
      node.x = cx + Math.cos(angle) * radius;
      node.y = cy + Math.sin(angle) * radius;
    });
  }

  getNodeAt(x, y) {
    for (let i = this.nodes.length - 1; i >= 0; i--) {
      const node = this.nodes[i];
      const dx = x - node.x;
      const dy = y - node.y;
      if (Math.sqrt(dx * dx + dy * dy) <= node.radius + 4) {
        return node;
      }
    }
    return null;
  }

  screenToWorld(sx, sy) {
    return {
      x: (sx - this.panX) / this.scale,
      y: (sy - this.panY) / this.scale
    };
  }

  getNodeAt(x, y) {
    const world = this.screenToWorld(x, y);
    for (let i = this.nodes.length - 1; i >= 0; i--) {
      const node = this.nodes[i];
      const dx = world.x - node.x;
      const dy = world.y - node.y;
      if (Math.sqrt(dx * dx + dy * dy) <= node.radius + 4) {
        return node;
      }
    }
    return null;
  }

  handleMouseDown(e) {
    const rect = this.canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const node = this.getNodeAt(sx, sy);

    if (node) {
      this.dragNode = node;
      this.isDragging = false;
      this.dragStartPos = { x: sx, y: sy };
    } else {
      this.isPanning = true;
      this.panStart = { x: sx - this.panX, y: sy - this.panY };
    }
  }

  handleMouseUp(e) {
    if (this.dragNode && !this.isDragging && e) {
      // It was a click, not a drag
    }
    this.dragNode = null;
    this.isPanning = false;
    setTimeout(() => { this.isDragging = false; }, 10);
  }

  handleWheel(e) {
    e.preventDefault();
    const rect = this.canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.5, Math.min(3, this.scale * delta));

    // Zoom toward mouse position
    this.panX = mx - (mx - this.panX) * (newScale / this.scale);
    this.panY = my - (my - this.panY) * (newScale / this.scale);
    this.scale = newScale;
  }

  handleClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const node = this.getNodeAt(x, y);

    this.selectedNode = node;
    if (node) {
      this.showAgentPanel(node.data);
    } else {
      this.hideAgentPanel();
    }
  }

  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    // Dragging a node
    if (this.dragNode) {
      const world = this.screenToWorld(sx, sy);
      this.dragNode.x = world.x;
      this.dragNode.y = world.y;
      this.isDragging = true;
      this.canvas.style.cursor = 'grabbing';
      return;
    }

    // Panning
    if (this.isPanning) {
      this.panX = sx - this.panStart.x;
      this.panY = sy - this.panStart.y;
      this.canvas.style.cursor = 'move';
      return;
    }

    const node = this.getNodeAt(sx, sy);
    this.hoveredNode = node;
    this.canvas.style.cursor = node ? 'grab' : 'crosshair';
  }

  showAgentPanel(agent) {
    const panel = document.querySelector('.agent-panel');
    if (!panel) return;

    panel.querySelector('.agent-name').textContent = agent.name;
    panel.querySelector('.agent-role').textContent = agent.role;
    panel.querySelector('.agent-desc').textContent = agent.description;

    const statsContainer = panel.querySelector('.agent-stats');
    statsContainer.innerHTML = Object.entries(agent.stats).map(([key, val]) => `
      <div class="stat-item">
        <div class="stat-label">${key.replace(/_/g, ' ')}</div>
        <div class="stat-value">${val}</div>
      </div>
    `).join('');

    const statusEl = panel.querySelector('.agent-status-tag');
    if (statusEl) {
      statusEl.dataset.status = agent.status;
      statusEl.textContent = `[${agent.status.toUpperCase()}]`;
    }

    const capList = panel.querySelector('.capabilities-list');
    if (capList) {
      capList.innerHTML = agent.capabilities.map(cap =>
        `<span class="tech-tag">${cap}</span>`
      ).join('');
    }

    panel.classList.add('active');
    this.addLogEntry(`Selected agent: ${agent.name} [${agent.status.toUpperCase()}]`, 'info');
  }

  hideAgentPanel() {
    const panel = document.querySelector('.agent-panel');
    if (panel) panel.classList.remove('active');
  }

  addLogEntry(message, type = 'info') {
    const log = document.querySelector('.terminal-log');
    if (!log) return;

    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    entry.innerHTML = `<span class="timestamp">[${time}]</span> ${message}`;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;

    while (log.children.length > 50) {
      log.removeChild(log.firstChild);
    }
  }

  start() {
    if (this.running) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.drawStatic();
      return;
    }
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

  drawStatic() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.translate(this.panX, this.panY);
    this.ctx.scale(this.scale, this.scale);
    this.drawEdges(0);
    this.drawNodes(0);
    this.ctx.restore();
  }

  draw() {
    if (!this.running) return;

    this.edgePulse += 0.02;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.save();
    this.ctx.translate(this.panX, this.panY);
    this.ctx.scale(this.scale, this.scale);
    this.drawEdges(this.edgePulse);
    this.drawNodes(this.edgePulse);
    this.ctx.restore();

    this.frameId = requestAnimationFrame(() => this.draw());
  }

  drawEdges(pulse) {
    this.edges.forEach(edge => {
      const fromNode = this.nodes.find(n => n.id === edge.from);
      const toNode = this.nodes.find(n => n.id === edge.to);
      if (!fromNode || !toNode) return;

      const isHighlighted = this.selectedNode &&
        (this.selectedNode.id === edge.from || this.selectedNode.id === edge.to);

      const alpha = isHighlighted ? 0.6 : 0.15 + Math.sin(pulse) * 0.05;
      const width = isHighlighted ? 2 : 1;

      this.ctx.beginPath();
      this.ctx.moveTo(fromNode.x, fromNode.y);
      this.ctx.lineTo(toNode.x, toNode.y);
      this.ctx.strokeStyle = `rgba(0, 255, 65, ${alpha})`;
      this.ctx.lineWidth = width;
      this.ctx.stroke();

      if (isHighlighted) {
        const t = (pulse * 0.5) % 1;
        const px = fromNode.x + (toNode.x - fromNode.x) * t;
        const py = fromNode.y + (toNode.y - fromNode.y) * t;
        this.ctx.beginPath();
        this.ctx.arc(px, py, 3, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(0, 255, 65, 0.8)`;
        this.ctx.fill();
      }
    });
  }

  drawNodes(pulse) {
    this.nodes.forEach(node => {
      const isSelected = this.selectedNode && this.selectedNode.id === node.id;
      const isHovered = this.hoveredNode && this.hoveredNode.id === node.id;
      const isActive = node.data.status === 'active';

      // Pulse ring for active agents
      if (isActive && pulse) {
        const pulseRadius = node.radius + 6 + Math.sin(pulse * 1.5) * 4;
        const pulseAlpha = 0.15 + Math.sin(pulse * 1.5) * 0.1;
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, pulseRadius, 0, Math.PI * 2);
        this.ctx.strokeStyle = node.color;
        this.ctx.globalAlpha = pulseAlpha;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        this.ctx.globalAlpha = 1;
      }

      if (isSelected || isHovered) {
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, node.radius + 8, 0, Math.PI * 2);
        this.ctx.fillStyle = node.color.replace(')', ', 0.1)').replace('rgb', 'rgba');
        this.ctx.fill();
      }

      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = '#1a1a1a';
      this.ctx.fill();
      this.ctx.strokeStyle = node.color;
      this.ctx.lineWidth = isSelected ? 3 : 2;
      this.ctx.globalAlpha = node.alpha;
      this.ctx.stroke();
      this.ctx.globalAlpha = 1;

      // Inner icon dot for active nodes
      if (isActive) {
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
        this.ctx.fillStyle = node.color;
        this.ctx.globalAlpha = 0.6 + Math.sin((pulse || 0) * 2) * 0.4;
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
      }

      this.ctx.font = '11px JetBrains Mono, monospace';
      this.ctx.textAlign = 'center';
      this.ctx.fillStyle = node.color;
      this.ctx.globalAlpha = node.alpha;
      this.ctx.fillText(node.label, node.x, node.y + node.radius + 18);
      this.ctx.globalAlpha = 1;
    });
  }

  destroy() {
    this.stop();
    this.visibilityObserver.disconnect();
  }
}

/* ==============================
   MOBILE AGENT LIST
   ============================== */
function initMobileAgentList(agents) {
  const list = document.querySelector('.agents-mobile-list');
  if (!list) return;

  list.innerHTML = agents.map(agent => `
    <div class="agent-list-item" data-agent-id="${agent.id}">
      <div style="display:flex;align-items:center;justify-content:space-between">
        <div class="agent-list-name">${agent.name}</div>
        <span class="status-tag" data-status="${agent.status}">[${agent.status.toUpperCase()}]</span>
      </div>
      <div class="agent-list-role">${agent.role}</div>
    </div>
  `).join('');

  list.querySelectorAll('.agent-list-item').forEach(item => {
    item.addEventListener('click', () => {
      const agent = agents.find(a => a.id === item.dataset.agentId);
      if (agent) {
        const panel = document.querySelector('.agent-panel');
        if (panel) {
          panel.querySelector('.agent-name').textContent = agent.name;
          panel.querySelector('.agent-role').textContent = agent.role;
          panel.querySelector('.agent-desc').textContent = agent.description;

          const statsContainer = panel.querySelector('.agent-stats');
          statsContainer.innerHTML = Object.entries(agent.stats).map(([key, val]) => `
            <div class="stat-item">
              <div class="stat-label">${key.replace(/_/g, ' ')}</div>
              <div class="stat-value">${val}</div>
            </div>
          `).join('');

          const statusEl = panel.querySelector('.agent-status-tag');
          if (statusEl) {
            statusEl.dataset.status = agent.status;
            statusEl.textContent = `[${agent.status.toUpperCase()}]`;
          }

          const capList = panel.querySelector('.capabilities-list');
          if (capList) {
            capList.innerHTML = agent.capabilities.map(cap =>
              `<span class="tech-tag">${cap}</span>`
            ).join('');
          }

          panel.classList.add('active');
        }
      }
    });
  });
}
