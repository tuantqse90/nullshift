/* ==============================
   INTERACTIVE TERMINAL EASTER EGG
   ============================== */
class InteractiveTerminal {
  constructor(container) {
    if (!container) return;
    this.container = container;
    this.history = [];
    this.historyIndex = -1;
    this.commands = this.buildCommands();

    this.render();
    this.focusInput();
  }

  buildCommands() {
    return {
      help: () => [
        'Available commands:',
        '  help          — show this help',
        '  whoami        — about nullshift',
        '  ls            — list sections',
        '  ls products   — list products',
        '  ls projects   — list projects',
        '  ls agents     — list agents',
        '  cat about     — read about us',
        '  cat mission   — our mission',
        '  cat stack     — tech stack',
        '  ping          — check status',
        '  date          — current date',
        '  uptime        — system uptime',
        '  neofetch      — system info',
        '  echo [text]   — echo text',
        '  goto [page]   — navigate to page',
        '  clear         — clear terminal',
        '  exit          — close terminal'
      ],
      whoami: () => [
        'nullshift — privacy-first builder labs',
        'Building tools at the intersection of:',
        '  > Privacy    — your data, your rules',
        '  > AI         — autonomous, on-device',
        '  > Blockchain — trustless infrastructure',
        '  > ZK Proofs  — prove without revealing'
      ],
      ls: (args) => {
        if (!args || args.length === 0) {
          return [
            'drwxr-xr-x  services/',
            'drwxr-xr-x  products/',
            'drwxr-xr-x  projects/',
            'drwxr-xr-x  agents/',
            'drwxr-xr-x  blog/',
            '-rw-r--r--  about.txt',
            '-rw-r--r--  mission.txt',
            '-rw-r--r--  stack.txt'
          ];
        }
        const section = args[0];
        if (section === 'products') return this.fetchList('data/products.json', 'name', 'status');
        if (section === 'projects') return this.fetchList('data/projects.json', 'name', 'status');
        if (section === 'agents') return this.fetchList('data/agents.json', 'name', 'status');
        return [`ls: cannot access '${section}': No such file or directory`];
      },
      cat: (args) => {
        if (!args || args.length === 0) return ['cat: missing operand'];
        const file = args[0];
        if (file === 'about') return [
          'NullShift Labs',
          '═══════════════',
          'Solo builder labs focused on privacy-first technology.',
          'We build tools that respect user sovereignty.',
          'No tracking. No backdoors. Open source.',
          '',
          'Founded: 2024',
          'Location: Decentralized',
          'Status: [ACTIVE]'
        ];
        if (file === 'mission') return [
          'MISSION',
          '═══════',
          'Build tools for the encrypted future.',
          '',
          'We believe privacy is a fundamental right,',
          'not a premium feature. Every product we ship',
          'is designed with zero-knowledge principles.',
          '',
          'If it collects data, it\'s not ours.'
        ];
        if (file === 'stack') return [
          'TECH STACK',
          '══════════',
          '> Frontend:   HTML5 + CSS3 + Vanilla JS',
          '> Backend:    Node.js / Express',
          '> Crypto:     ZK-SNARKs, MPC, FHE',
          '> AI:         On-device inference, ONNX',
          '> Chain:      Solidity, Rust (Solana)',
          '> Infra:      Railway, IPFS, Tor'
        ];
        return [`cat: ${file}: No such file or directory`];
      },
      ping: () => [
        'PING nullshift.sh (127.0.0.1): 56 data bytes',
        '64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.042 ms',
        '64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.037 ms',
        '64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time=0.039 ms',
        '--- nullshift.sh ping statistics ---',
        '3 packets transmitted, 3 received, 0% packet loss'
      ],
      date: () => [new Date().toString()],
      uptime: () => {
        const start = new Date('2024-01-01');
        const now = new Date();
        const days = Math.floor((now - start) / (1000 * 60 * 60 * 24));
        return [`up ${days} days, load average: 0.42, 0.37, 0.31`];
      },
      neofetch: () => [
        '        ╔═══════════╗',
        '        ║  NULL     ║      nullshift@labs',
        '        ║  SHIFT.SH ║      ──────────────',
        '        ╚═══════════╝      OS: NullOS v1.0',
        '                           Kernel: privacy-first',
        '                           Shell: nullsh 0.1',
        '                           Pillars: 4',
        '                           Products: 9',
        '                           Agents: 8',
        '                           Theme: dark [ONLY]',
        '                           Colors: ██ ██ ██ ██'
      ],
      echo: (args) => [args ? args.join(' ') : ''],
      goto: (args) => {
        if (!args || args.length === 0) return ['goto: missing destination. Try: home, services, products, projects, agents, blog'];
        const pages = { home: 'index.html', services: 'services.html', products: 'products.html', projects: 'projects.html', agents: 'agents.html', blog: 'blog.html' };
        const dest = args[0].toLowerCase();
        if (pages[dest]) {
          setTimeout(() => { window.location.href = pages[dest]; }, 500);
          return [`Navigating to /${dest}...`];
        }
        return [`goto: '${dest}' — unknown destination`];
      },
      clear: () => {
        this.container.querySelector('.terminal-output').innerHTML = '';
        return null;
      },
      exit: () => {
        this.container.classList.remove('active');
        return null;
      },
      sudo: () => ['[ACCESS DENIED] Nice try.'],
      rm: () => ['rm: permission denied. This is a read-only terminal.'],
      hack: () => [
        'Initializing hack sequence...',
        '████████░░░░░░░░ 42%',
        'Just kidding. We build, not break.'
      ],
      matrix: () => ['Wake up, Neo... The Matrix has you.'],
      '': () => null
    };
  }

  render() {
    this.container.innerHTML = `
      <div class="iterm-header">
        <div class="iterm-dots">
          <span class="dot red"></span>
          <span class="dot yellow"></span>
          <span class="dot green"></span>
        </div>
        <span class="iterm-title">nullshift@labs: ~</span>
        <button class="iterm-close" aria-label="Close terminal">[x]</button>
      </div>
      <div class="terminal-output">
        <div class="term-line">Welcome to NullShift Terminal v1.0</div>
        <div class="term-line">Type <span class="text-primary">help</span> for available commands.</div>
        <div class="term-line">&nbsp;</div>
      </div>
      <div class="terminal-input-line">
        <span class="term-prompt"><span class="text-primary">nullshift</span>@<span class="text-secondary">labs</span>$ </span>
        <input type="text" class="term-input" spellcheck="false" autocomplete="off" aria-label="Terminal input">
      </div>
    `;

    const input = this.container.querySelector('.term-input');
    const closeBtn = this.container.querySelector('.iterm-close');

    input.addEventListener('keydown', (e) => this.handleKey(e));
    closeBtn.addEventListener('click', () => this.container.classList.remove('active'));
  }

  handleKey(e) {
    const input = e.target;

    if (e.key === 'Enter') {
      const cmd = input.value.trim();
      this.addOutput(`<span class="text-primary">nullshift</span>@<span class="text-secondary">labs</span>$ ${this.escapeHtml(cmd)}`);

      if (cmd) {
        this.history.unshift(cmd);
        this.historyIndex = -1;
      }

      this.execute(cmd);
      input.value = '';
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
        input.value = this.history[this.historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (this.historyIndex > 0) {
        this.historyIndex--;
        input.value = this.history[this.historyIndex];
      } else {
        this.historyIndex = -1;
        input.value = '';
      }
    }
  }

  execute(cmdStr) {
    const parts = cmdStr.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    const handler = this.commands[cmd];
    if (handler) {
      const result = handler(args);
      if (result) {
        if (result instanceof Promise) {
          result.then(lines => {
            lines.forEach(line => this.addOutput(line));
          });
        } else {
          result.forEach(line => this.addOutput(line));
        }
      }
    } else {
      this.addOutput(`${cmd}: command not found. Type <span class="text-primary">help</span> for available commands.`);
    }
  }

  fetchList(url, nameKey, statusKey) {
    const output = this.container.querySelector('.terminal-output');
    const promise = fetch(url)
      .then(r => r.json())
      .then(items => {
        items.forEach(item => {
          const status = item[statusKey] || '';
          const tag = status === 'live' || status === 'active' ? `<span class="text-primary">[${status.toUpperCase()}]</span>` :
                      status === 'building' || status === 'idle' ? `<span class="text-warning">[${status.toUpperCase()}]</span>` :
                      `<span class="text-dim">[${status.toUpperCase()}]</span>`;
          this.addOutput(`  ${tag} ${item[nameKey]}`);
        });
      })
      .catch(() => {
        this.addOutput('Error: failed to fetch data.');
      });
    return promise;
  }

  addOutput(html) {
    const output = this.container.querySelector('.terminal-output');
    const line = document.createElement('div');
    line.className = 'term-line';
    line.innerHTML = html;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  focusInput() {
    const input = this.container.querySelector('.term-input');
    if (input) {
      this.container.addEventListener('click', () => input.focus());
    }
  }
}
