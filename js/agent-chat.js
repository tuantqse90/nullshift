/* ==============================
   AGENT CHAT — Terminal-style chat interface
   ============================== */
const AgentChat = (function () {
  'use strict';

  let panel = null;
  let isOpen = false;
  let currentAgent = 'market-scanner';
  let messageHistory = [];

  /* ---------- Agent Data ---------- */
  const agents = {
    'market-scanner': {
      name: 'Market Scanner',
      pillar: 'ai',
      color: 'var(--pillar-ai)',
      welcome: 'Market Scanner online. Monitoring 50+ data sources. What do you need?',
      responses: {
        market: [
          'Current market sentiment: cautiously bullish. ETH showing strength above 200MA.',
          'Detected whale accumulation pattern on 3 tokens in the last hour.',
          'Volatility index at 42.3 -- moderate. Stay alert.',
          'BTC dominance trending down. Alt rotation likely incoming.',
          'Cross-chain volume spike detected on L2s. Watching closely.'
        ],
        trade: [
          'Forwarding trade query to Trading Agent... Recommend checking momentum signals first.',
          'Market conditions favorable for entries. Low slippage detected on major pairs.',
          'Current spread analysis complete. Best execution on DEX aggregator routes.'
        ],
        alert: [
          'No anomalies in monitored feeds. All data pipelines nominal.',
          'Last anomaly flagged 4h ago -- resolved. False positive on volume spike.',
          'Scanning threat feeds... all clear. No suspicious on-chain activity.'
        ],
        privacy: [
          'All market data feeds encrypted in transit. No metadata exposure.',
          'Data retention policy: 72h rolling window. Older data purged automatically.',
          'Feed sources anonymized through 3 proxy layers.'
        ],
        help: [
          'Available queries: price, market, trend, volume, whale, sentiment. Try: "What is the current market trend?"'
        ],
        status: [
          'Market Scanner: ACTIVE | Uptime: 99.7% | Signals (24h): 1,247 | Accuracy: 94.2% | Latency: < 200ms'
        ],
        default: [
          'Processing query... I\'m analyzing the data. Ask about prices, trades, alerts, or privacy.',
          'Scanning data feeds for relevant information. Try asking about market trends or prices.',
          'Query received. Specify: price, market, whale, trend, or volume for targeted analysis.'
        ]
      }
    },
    'trading-agent': {
      name: 'Trading Agent',
      pillar: 'blockchain',
      color: 'var(--pillar-blockchain)',
      welcome: 'Trading Agent initialized. Strategies loaded. Ready for directives.',
      responses: {
        market: [
          'Market analysis received from Scanner. Conditions look favorable for momentum plays.',
          'Correlating market data with open positions... no immediate action required.',
          'Market regime: trending. Adjusting strategy weights accordingly.'
        ],
        trade: [
          'Last trade: Sold 2.5 ETH at $3,847. PnL: +1.8%.',
          'Current strategy: momentum-following with 15min timeframe.',
          'Risk allocation: 60% conservative, 30% moderate, 10% aggressive.',
          'Open positions: 4 active, 2 pending limit orders. Total exposure within bounds.',
          'Slippage tolerance set to 0.3%. Execution routing through 5 DEX aggregators.'
        ],
        alert: [
          'Trade execution alerts: 3 filled in last hour. All within expected slippage.',
          'Stop-loss triggered on 1 position. Loss contained at -0.4%.',
          'No margin warnings. Collateral ratio healthy at 312%.'
        ],
        privacy: [
          'All trade execution routed through private mempools. No front-running risk.',
          'Transaction signing happens locally. Keys never leave the enclave.',
          'Trade history encrypted at rest. Access requires multi-sig auth.'
        ],
        help: [
          'Available queries: trade, buy, sell, strategy, risk, position, pnl. Try: "What is the current strategy?"'
        ],
        status: [
          'Trading Agent: ACTIVE | Uptime: 99.9% | Trades (24h): 342 | Win Rate: 67.8% | PnL (30d): +12.4%'
        ],
        default: [
          'Processing query... I\'m analyzing the data. Ask about prices, trades, alerts, or privacy.',
          'Standing by for trade directives. Specify: buy, sell, strategy, or risk parameters.',
          'Query acknowledged. For trade actions, provide asset, direction, and size.'
        ]
      }
    },
    'alert-bot': {
      name: 'Alert Bot',
      pillar: 'privacy',
      color: 'var(--pillar-privacy)',
      welcome: 'Alert Bot active. All notification channels encrypted and operational.',
      responses: {
        market: [
          'Market alert triggers: 23 active price alerts, 8 volume alerts, 5 whale alerts.',
          'Last market alert fired 12min ago: ETH crossed $3,800 threshold.',
          'Alert queue clear. No pending market notifications.'
        ],
        trade: [
          'Trade alerts: 3 execution confirmations delivered in last hour.',
          'Pending trade triggers: 7 limit order alerts, 2 stop-loss warnings queued.',
          'All trade notifications delivered via encrypted channel. Latency: < 50ms.'
        ],
        alert: [
          'No critical alerts in the last 24 hours. All channels secure.',
          'Last security scan: 0 vulnerabilities detected. Encryption status: active.',
          'Monitoring 47 active price triggers and 12 security rules.',
          'Alert delivery success rate: 99.99%. Zero missed critical alerts.',
          'Channel status: Telegram (encrypted), Discord (private), Webhook (signed).'
        ],
        privacy: [
          'All alert payloads encrypted end-to-end. No plaintext transmission.',
          'Alert metadata scrubbed before delivery. Source IP anonymized.',
          'Notification channels rotate encryption keys every 24h automatically.'
        ],
        help: [
          'Available queries: alert, security, threat, notification, channel. Try: "Are there any active alerts?"'
        ],
        status: [
          'Alert Bot: ACTIVE | Uptime: 99.99% | Alerts (24h): 89 | Avg Latency: < 50ms | Channels: 4'
        ],
        default: [
          'Processing query... I\'m analyzing the data. Ask about prices, trades, alerts, or privacy.',
          'Awaiting alert configuration. Ask about active alerts, security rules, or channel status.',
          'No matching alert rule found. Specify: alert type, threshold, or security scan.'
        ]
      }
    },
    'privacy-guard': {
      name: 'Privacy Guard',
      pillar: 'privacy',
      color: 'var(--pillar-privacy)',
      welcome: 'Privacy Guard deployed. All communications monitored for leaks. Speak freely.',
      responses: {
        market: [
          'Market data feeds pass through privacy filter. No PII detected in data streams.',
          'Data source anonymization active. 3 proxy layers between feeds and agents.',
          'Market data retention: 72h rolling window. Older records securely wiped.'
        ],
        trade: [
          'Trade execution privacy: all transactions routed through private mempools.',
          'Transaction fingerprinting countermeasures active. Pattern obfuscation enabled.',
          'Trade history access audit: 0 unauthorized queries in last 30 days.'
        ],
        alert: [
          'Privacy audit of alert channels: PASSED. All encrypted, no leaks.',
          'Alert metadata analysis: clean. No correlatable patterns detected.',
          'Security perimeter intact. Last probe attempt blocked 6h ago.'
        ],
        privacy: [
          'All inter-agent communications encrypted with AES-256-GCM.',
          'Metadata scrubbing active. Zero leaks detected since deployment.',
          'Current privacy score: A+. No exposed endpoints.',
          'Encryption key rotation: every 6 hours. Last rotation: 2h ago.',
          'Tor routing active for external queries. 3-hop circuit established.'
        ],
        help: [
          'Available queries: privacy, encrypt, leak, metadata, audit, security. Try: "What is the current privacy score?"'
        ],
        status: [
          'Privacy Guard: ACTIVE | Uptime: 99.99% | Leaks Blocked: 0 | Encrypted Msgs: 1.4M | Audit Score: A+'
        ],
        default: [
          'Processing query... I\'m analyzing the data. Ask about prices, trades, alerts, or privacy.',
          'Query logged and encrypted. Ask about privacy score, encryption status, or audit reports.',
          'Insufficient context for privacy assessment. Specify: encryption, metadata, leak, or audit.'
        ]
      }
    }
  };

  /* ---------- Pattern Matching ---------- */
  const patterns = [
    { keys: ['price', 'market', 'trend', 'volume', 'whale', 'sentiment', 'bull', 'bear'], category: 'market' },
    { keys: ['trade', 'buy', 'sell', 'strategy', 'position', 'pnl', 'profit', 'loss'], category: 'trade' },
    { keys: ['alert', 'security', 'threat', 'warning', 'scan', 'monitor', 'notification'], category: 'alert' },
    { keys: ['privacy', 'encrypt', 'leak', 'metadata', 'anonymous', 'tor', 'vpn', 'audit'], category: 'privacy' },
    { keys: ['help', 'command', 'how', 'what can'], category: 'help' },
    { keys: ['status', 'uptime', 'health', 'stats'], category: 'status' }
  ];

  function matchCategory(message) {
    const lower = message.toLowerCase();
    for (const pattern of patterns) {
      for (const key of pattern.keys) {
        if (lower.includes(key)) {
          return pattern.category;
        }
      }
    }
    return 'default';
  }

  function getResponse(agentId, message) {
    const agent = agents[agentId];
    if (!agent) return 'Agent not found.';
    const category = matchCategory(message);
    const pool = agent.responses[category] || agent.responses['default'];
    return pool[Math.floor(Math.random() * pool.length)];
  }

  /* ---------- CSS Injection ---------- */
  function injectStyles() {
    if (document.getElementById('agent-chat-styles')) return;

    const style = document.createElement('style');
    style.id = 'agent-chat-styles';
    style.textContent = `
      .agent-chat-btn {
        position: fixed;
        bottom: calc(var(--space-xl) + 54px);
        right: var(--space-xl);
        width: 44px;
        height: 44px;
        border-radius: var(--radius-md);
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        color: var(--color-secondary);
        cursor: pointer;
        z-index: 50;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
      }

      .agent-chat-btn:hover {
        border-color: var(--color-secondary);
        box-shadow: var(--glow-secondary);
      }

      .agent-chat-btn svg {
        width: 22px;
        height: 22px;
        fill: none;
        stroke: currentColor;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      .agent-chat-panel {
        position: fixed;
        bottom: 120px;
        right: var(--space-xl);
        width: 400px;
        height: 500px;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        z-index: 200;
        display: none;
        flex-direction: column;
        overflow: hidden;
        box-shadow: var(--shadow-card);
      }

      .agent-chat-panel.active {
        display: flex;
      }

      .chat-header {
        padding: var(--space-sm) var(--space-md);
        border-bottom: 1px solid var(--border-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: var(--bg-primary);
        flex-shrink: 0;
      }

      .chat-header-title {
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        color: var(--color-primary);
        display: flex;
        align-items: center;
        gap: var(--space-xs);
      }

      .chat-header-title::before {
        content: '>';
        color: var(--color-primary);
      }

      .chat-header-actions {
        display: flex;
        align-items: center;
        gap: var(--space-sm);
      }

      .chat-agent-select {
        background: var(--bg-input);
        border: 1px solid var(--border-color);
        color: var(--color-text);
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        padding: 2px 4px;
        border-radius: var(--radius-sm);
        cursor: pointer;
        outline: none;
      }

      .chat-agent-select:focus {
        border-color: var(--color-secondary);
      }

      .chat-agent-select option {
        background: var(--bg-card);
        color: var(--color-text);
      }

      .chat-close-btn {
        background: transparent;
        border: none;
        color: var(--color-text-dim);
        cursor: pointer;
        font-family: var(--font-mono);
        font-size: var(--text-sm);
        padding: 2px 6px;
        line-height: 1;
        transition: color var(--transition-fast);
      }

      .chat-close-btn:hover {
        color: var(--color-error);
      }

      .chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: var(--space-md);
        display: flex;
        flex-direction: column;
        gap: var(--space-sm);
        scrollbar-width: thin;
        scrollbar-color: var(--border-color) transparent;
      }

      .chat-messages::-webkit-scrollbar {
        width: 4px;
      }

      .chat-messages::-webkit-scrollbar-track {
        background: transparent;
      }

      .chat-messages::-webkit-scrollbar-thumb {
        background: var(--border-color);
        border-radius: 2px;
      }

      .chat-msg {
        max-width: 80%;
        padding: var(--space-sm) var(--space-md);
        border-radius: var(--radius-md);
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        line-height: 1.5;
        word-wrap: break-word;
      }

      .chat-msg.user {
        align-self: flex-end;
        background: var(--bg-secondary);
        color: var(--color-text-dim);
      }

      .chat-msg.agent {
        align-self: flex-start;
        background: var(--bg-primary);
        border: 1px solid var(--border-color);
        color: var(--color-text);
      }

      .chat-msg.agent .agent-label {
        display: block;
        font-size: 0.65rem;
        margin-bottom: 4px;
        opacity: 0.7;
      }

      .chat-msg.typing .dots::after {
        content: '...';
        animation: chat-dots 1s steps(3, end) infinite;
      }

      @keyframes chat-dots {
        0%   { content: '.'; }
        33%  { content: '..'; }
        66%  { content: '...'; }
      }

      .chat-input-area {
        padding: var(--space-sm);
        border-top: 1px solid var(--border-color);
        display: flex;
        gap: var(--space-xs);
        background: var(--bg-primary);
        flex-shrink: 0;
      }

      .chat-input {
        flex: 1;
        background: var(--bg-input);
        border: 1px solid var(--border-color);
        color: var(--color-text);
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        padding: var(--space-sm);
        border-radius: var(--radius-sm);
        outline: none;
      }

      .chat-input::placeholder {
        color: var(--color-text-dim);
      }

      .chat-input:focus {
        border-color: var(--color-secondary);
      }

      .chat-send {
        background: transparent;
        border: 1px solid var(--color-primary);
        color: var(--color-primary);
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        padding: var(--space-sm) var(--space-md);
        cursor: pointer;
        border-radius: var(--radius-sm);
        transition: background var(--transition-fast), color var(--transition-fast);
        white-space: nowrap;
      }

      .chat-send:hover {
        background: var(--color-primary);
        color: var(--bg-primary);
      }

      @media (max-width: 768px) {
        .agent-chat-panel {
          width: 100%;
          left: 0;
          right: 0;
          bottom: 0;
          height: 60vh;
          border-radius: 0;
          border-left: none;
          border-right: none;
          border-bottom: none;
        }
      }
    `;
    document.head.appendChild(style);
  }

  /* ---------- DOM Creation ---------- */
  function createButton() {
    const btn = document.createElement('button');
    btn.className = 'agent-chat-btn';
    btn.setAttribute('aria-label', 'Open agent chat');
    btn.innerHTML = `
      <svg viewBox="0 0 24 24">
        <polyline points="4 17 10 11 4 5"></polyline>
        <line x1="12" y1="19" x2="20" y2="19"></line>
      </svg>
    `;
    btn.addEventListener('click', toggle);
    document.body.appendChild(btn);
  }

  function createPanel() {
    panel = document.createElement('div');
    panel.className = 'agent-chat-panel';

    /* Header */
    const header = document.createElement('div');
    header.className = 'chat-header';

    const title = document.createElement('span');
    title.className = 'chat-header-title';
    title.textContent = 'agent_chat';

    const actions = document.createElement('div');
    actions.className = 'chat-header-actions';

    const select = document.createElement('select');
    select.className = 'chat-agent-select';
    select.setAttribute('aria-label', 'Select agent');
    for (const [id, agent] of Object.entries(agents)) {
      const option = document.createElement('option');
      option.value = id;
      option.textContent = agent.name;
      if (id === currentAgent) option.selected = true;
      select.appendChild(option);
    }
    select.addEventListener('change', (e) => {
      currentAgent = e.target.value;
      clearMessages();
      showWelcome();
    });

    const closeBtn = document.createElement('button');
    closeBtn.className = 'chat-close-btn';
    closeBtn.setAttribute('aria-label', 'Close chat');
    closeBtn.textContent = 'x';
    closeBtn.addEventListener('click', close);

    actions.appendChild(select);
    actions.appendChild(closeBtn);
    header.appendChild(title);
    header.appendChild(actions);

    /* Messages */
    const messages = document.createElement('div');
    messages.className = 'chat-messages';

    /* Input area */
    const inputArea = document.createElement('div');
    inputArea.className = 'chat-input-area';

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'chat-input';
    input.placeholder = 'nullshift@labs$ type a command...';
    input.setAttribute('aria-label', 'Chat message input');

    const sendBtn = document.createElement('button');
    sendBtn.className = 'chat-send';
    sendBtn.textContent = '> Send';

    const handleSend = () => {
      const text = input.value.trim();
      if (!text) return;
      input.value = '';
      sendMessage(text);
    };

    sendBtn.addEventListener('click', handleSend);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSend();
      }
    });

    inputArea.appendChild(input);
    inputArea.appendChild(sendBtn);

    panel.appendChild(header);
    panel.appendChild(messages);
    panel.appendChild(inputArea);

    document.body.appendChild(panel);
  }

  /* ---------- Message Handling ---------- */
  function getMessagesContainer() {
    return panel ? panel.querySelector('.chat-messages') : null;
  }

  function appendMessage(text, sender, agentId) {
    const container = getMessagesContainer();
    if (!container) return;

    const msg = document.createElement('div');
    msg.className = 'chat-msg ' + sender;

    if (sender === 'agent' && agentId) {
      const agent = agents[agentId];
      const label = document.createElement('span');
      label.className = 'agent-label';
      label.textContent = agent.name;
      label.style.color = agent.color;
      msg.appendChild(label);
    }

    const textNode = document.createTextNode(text);
    msg.appendChild(textNode);

    if (sender === 'agent') {
      msg.style.borderColor = agents[agentId] ? agents[agentId].color : 'var(--border-color)';
    }

    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;

    messageHistory.push({ text, sender, agent: agentId || null });
  }

  function appendTypingIndicator() {
    const container = getMessagesContainer();
    if (!container) return null;

    const agent = agents[currentAgent];
    const msg = document.createElement('div');
    msg.className = 'chat-msg agent typing';
    msg.style.borderColor = agent ? agent.color : 'var(--border-color)';

    const label = document.createElement('span');
    label.className = 'agent-label';
    label.textContent = agent.name;
    label.style.color = agent.color;

    const dots = document.createElement('span');
    dots.className = 'dots';

    msg.appendChild(label);
    msg.appendChild(dots);
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;

    return msg;
  }

  function sendMessage(text) {
    appendMessage(text, 'user');

    const typingEl = appendTypingIndicator();
    const agentId = currentAgent;
    const delay = 500 + Math.floor(Math.random() * 500);

    setTimeout(() => {
      if (typingEl && typingEl.parentNode) {
        typingEl.parentNode.removeChild(typingEl);
      }
      const response = getResponse(agentId, text);
      appendMessage(response, 'agent', agentId);
    }, delay);
  }

  function clearMessages() {
    const container = getMessagesContainer();
    if (container) container.innerHTML = '';
    messageHistory = [];
  }

  function showWelcome() {
    const agent = agents[currentAgent];
    if (agent) {
      appendMessage(agent.welcome, 'agent', currentAgent);
    }
  }

  /* ---------- Open / Close / Toggle ---------- */
  function open() {
    if (!panel) {
      createPanel();
      showWelcome();
    }
    panel.classList.add('active');
    isOpen = true;

    const input = panel.querySelector('.chat-input');
    if (input) input.focus();
  }

  function close() {
    if (panel) {
      panel.classList.remove('active');
    }
    isOpen = false;
  }

  function toggle() {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }

  /* ---------- Keyboard Shortcut ---------- */
  function handleKeydown(e) {
    if (e.key === 'Escape' && isOpen) {
      close();
    }
  }

  /* ---------- Init ---------- */
  function init() {
    injectStyles();
    createButton();
    document.addEventListener('keydown', handleKeydown);
  }

  return { init, open, close };
})();

AgentChat.init();
