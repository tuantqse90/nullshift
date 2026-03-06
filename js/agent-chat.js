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
    'seo-research-agent': {
      name: 'SEO Research Agent',
      pillar: 'ai',
      color: 'var(--color-secondary)',
      welcome: 'SEO Research Agent online. LLM streaming active. What keyword do you want to analyze?',
      responses: {
        market: [
          'Search volume trending up for "privacy tools" — 45% increase this quarter.',
          'Competitor analysis: top 3 domains averaging DA 62. Gap identified in long-tail keywords.',
          'SERP features detected: 4 featured snippets, 2 knowledge panels in your niche.'
        ],
        trade: [
          'Keyword difficulty for "DeFi lending" is moderate (KD 38). Good opportunity.',
          'Content gap analysis complete. 12 untapped keyword clusters identified.',
          'Recommended bid range: $2.40-$3.80 CPC for target keywords.'
        ],
        alert: [
          'Ranking alert: "zero knowledge proofs" moved from position 18 to 11.',
          'New competitor detected in SERP for 3 tracked keywords.',
          'Search trend spike: "AI agents" volume up 200% in last 7 days.'
        ],
        privacy: [
          'All keyword research data processed locally. No third-party API tracking.',
          'Search queries anonymized. No user fingerprinting in analysis pipeline.',
          'Data retention: keyword data auto-purged after 90 days.'
        ],
        help: [
          'Available queries: keyword, search, SEO, rank, competition, content. Try: "Analyze keyword: privacy tools"'
        ],
        status: [
          'SEO Research Agent: ACTIVE | Uptime: 99.7% | Queries (24h): 2,847 | Accuracy: 94.2% | Latency: < 300ms'
        ],
        default: [
          'Processing query... Ask about keywords, search trends, competition, or content optimization.',
          'LLM analysis ready. Provide a keyword or topic for deep research.',
          'Query received. Specify: keyword, niche, competitor URL, or content topic.'
        ]
      }
    },
    'guardian-vision': {
      name: 'Guardian Vision',
      pillar: 'ai',
      color: 'var(--color-secondary)',
      welcome: 'Guardian Vision active. Camera feeds monitored. All detection modules operational.',
      responses: {
        market: [
          'Environmental sensor data: Temperature 23°C, Humidity 45%. All within safe range.',
          'Activity pattern analysis: normal household activity detected. No anomalies.',
          'Smart AC adjusted to 24°C based on occupancy prediction model.'
        ],
        trade: [
          'Hardware status: Raspberry Pi 4B running at 52°C. CPU load 34%.',
          'Camera feed FPS: 30fps. Processing pipeline latency: 87ms.',
          'Model inference: MobileNetV2 running at 12fps on edge device.'
        ],
        alert: [
          'No fire/smoke detected in last 24 hours. All zones clear.',
          'Fall detection: 0 incidents today. Monitoring 3 active zones.',
          'Last alert was a false positive 6h ago — shadow movement. Model updated.',
          'Seizure detection module: calibrated and monitoring. No events.',
          'Smart AC alert: filter maintenance due in 14 days.'
        ],
        privacy: [
          'All camera feeds processed locally on Raspberry Pi. No cloud uploads.',
          'Video frames discarded after inference. No recording stored.',
          'Alert notifications sent via encrypted Telegram channel only.'
        ],
        help: [
          'Available queries: fire, fall, seizure, temperature, camera, AC. Try: "Is there any fire detected?"'
        ],
        status: [
          'Guardian Vision: ACTIVE | Uptime: 99.99% | Frames: 1.2M | False Positive: 0.3% | Response: < 100ms'
        ],
        default: [
          'All detection modules running. Ask about fire, fall, seizure detection, or smart AC status.',
          'Monitoring active. Specify zone, sensor type, or detection module for details.',
          'Query received. I can report on safety events, sensor data, or device health.'
        ]
      }
    },
    'alert-bot': {
      name: 'Alert Bot',
      pillar: 'privacy',
      color: 'var(--color-primary)',
      welcome: 'Alert Bot active. Telegram channels encrypted. 6 notification channels operational.',
      responses: {
        market: [
          'SEO alert: 3 keyword ranking changes detected in last 6 hours.',
          'Marketing alert: Campaign #12 ROAS exceeded target. Budget reallocation recommended.',
          'Content alert: New competitor blog post detected in target keyword cluster.'
        ],
        trade: [
          'Escrow alert: 2 new trades opened on P2P marketplace. Funds locked.',
          'Smart contract event: dispute resolution triggered on trade #3,401.',
          'BNB Chain gas: 3 gwei. Optimal for contract interactions.'
        ],
        alert: [
          'No critical alerts in the last 24 hours. All channels secure.',
          'Active triggers: 47 SEO alerts, 12 safety alerts, 8 contract alerts.',
          'Alert delivery success rate: 99.99%. Zero missed critical alerts.',
          'Channel status: Telegram (encrypted) x4, Webhook (signed) x2.',
          'Priority routing active: P1 instant, P2 < 5min, P3 hourly digest.'
        ],
        privacy: [
          'All alert payloads encrypted end-to-end via Telegram Bot API.',
          'Alert metadata scrubbed before delivery. Source IP anonymized.',
          'Notification channels rotate encryption keys every 24h automatically.'
        ],
        help: [
          'Available queries: alert, notification, channel, trigger, priority. Try: "Are there any active alerts?"'
        ],
        status: [
          'Alert Bot: ACTIVE | Uptime: 99.99% | Alerts (24h): 189 | Avg Latency: < 50ms | Channels: 6'
        ],
        default: [
          'Awaiting alert configuration. Ask about active alerts, triggers, or channel status.',
          'No matching alert rule found. Specify: alert type, priority, or channel.',
          'Processing... I aggregate alerts from all agents. Ask about any notification topic.'
        ]
      }
    },
    'privacy-guard': {
      name: 'Privacy Guard',
      pillar: 'privacy',
      color: 'var(--color-primary)',
      welcome: 'Privacy Guard deployed. All agent communications encrypted. Audit score: A+.',
      responses: {
        market: [
          'SEO data feeds pass through privacy filter. No PII detected in keyword data.',
          'Marketing campaign data anonymized. No user-level tracking enabled.',
          'Data source anonymization active. All external API calls proxied.'
        ],
        trade: [
          'Escrow contract interactions: all signed locally. Private keys never exposed.',
          'P2P marketplace: E2E encryption active between buyer and seller.',
          'Trade history access audit: 0 unauthorized queries in last 30 days.'
        ],
        alert: [
          'Privacy audit of all notification channels: PASSED. All encrypted.',
          'Alert metadata analysis: clean. No correlatable patterns detected.',
          'Security perimeter intact. Last unauthorized access attempt blocked 6h ago.'
        ],
        privacy: [
          'All inter-agent communications encrypted with AES-256-GCM.',
          'Metadata scrubbing active. Zero leaks detected since deployment.',
          'Current privacy score: A+. No exposed endpoints or data leaks.',
          'Encryption key rotation: every 6 hours. Last rotation: 2h ago.',
          'Guardian Vision feeds: processed locally, never uploaded. Verified.'
        ],
        help: [
          'Available queries: privacy, encrypt, leak, metadata, audit, security. Try: "What is the privacy score?"'
        ],
        status: [
          'Privacy Guard: ACTIVE | Uptime: 99.99% | Leaks Blocked: 0 | Encrypted Msgs: 2.8M | Audit: A+'
        ],
        default: [
          'Query logged and encrypted. Ask about privacy score, encryption, or audit reports.',
          'Insufficient context for assessment. Specify: encryption, metadata, leak, or audit.',
          'All systems secure. What privacy aspect do you want me to check?'
        ]
      }
    }
  };

  /* ---------- Pattern Matching ---------- */
  const patterns = [
    { keys: ['keyword', 'seo', 'search', 'rank', 'serp', 'content', 'market', 'trend', 'competition', 'temperature', 'sensor', 'camera', 'ac'], category: 'market' },
    { keys: ['trade', 'escrow', 'contract', 'hardware', 'device', 'raspberry', 'model', 'inference', 'gas', 'campaign', 'budget'], category: 'trade' },
    { keys: ['alert', 'fire', 'smoke', 'fall', 'seizure', 'warning', 'notification', 'trigger', 'priority'], category: 'alert' },
    { keys: ['privacy', 'encrypt', 'leak', 'metadata', 'anonymous', 'audit', 'security', 'pii', 'gdpr'], category: 'privacy' },
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
