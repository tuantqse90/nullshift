# NullShift – Full Static Website Build Prompt

## TL;DR
Build **NullShift** (nullshift.sh) — a full static website (HTML/CSS/JS thuần) cho một solo builder labs. Dark hacker aesthetic, privacy-first, aggressive & sắc bén. Không framework, không build tool, deploy tĩnh được luôn.

---

## Brand Identity

- **Name:** NullShift
- **Domain:** nullshift.sh
- **Tagline:** `$ nullshift.sh — From null to reality.`
- **Identity:** Solo builder labs. Privacy-first. Powered by AI agents.
- **Vibe:** Dark, terminal/hacker, aggressive, sắc bén. Nghĩ cyberpunk terminal meets developer war room.
- **4 Core Pillars:** Privacy, AI, Blockchain, ZK Proofs

---

## Tech Stack

- **Pure HTML5 + CSS3 + Vanilla JS** (NO frameworks, NO build tools)
- CSS custom properties cho design tokens
- CSS animations (no external animation libs)
- Vanilla JS cho interactions, routing, effects
- Google Fonts (JetBrains Mono, Inter/Space Grotesk)
- Deploy-ready: chỉ cần serve static files (Vercel, Netlify, Cloudflare Pages, hoặc bất kỳ static host nào)

---

## Project Structure

```
nullshift/
├── index.html              # Home / Landing page
├── services.html           # Core Services (4 pillars)
├── products.html           # Products showcase
├── agents.html             # Workflow & Agents
├── blog.html               # Blog listing
├── projects.html           # Projects portfolio
├── css/
│   ├── reset.css           # CSS reset / normalize
│   ├── variables.css       # Design tokens (colors, fonts, spacing)
│   ├── global.css          # Global styles, typography, layout
│   ├── components.css      # Reusable components (cards, buttons, tags)
│   ├── animations.css      # Glitch, typing, matrix, scanline effects
│   ├── home.css            # Home page specific
│   ├── services.css        # Services page specific
│   ├── products.css        # Products page specific
│   ├── agents.css          # Agents page specific
│   ├── blog.css            # Blog page specific
│   └── projects.css        # Projects page specific
├── js/
│   ├── main.js             # Global: navbar, theme, smooth scroll
│   ├── effects.js          # Matrix rain, glitch text, typing effect, scanlines
│   ├── particles.js        # Background particle system
│   ├── agents-graph.js     # Agent workflow interactive graph (Canvas or SVG)
│   ├── filter.js           # Filtering logic for products/projects pages
│   └── blog-data.js        # Blog posts data (JSON array, rendered client-side)
├── assets/
│   ├── icons/              # SVG icons for pillars, nav, social
│   ├── images/             # Project thumbnails, product images
│   └── fonts/              # Self-hosted fonts (optional fallback)
├── data/
│   ├── projects.json       # Projects data
│   ├── products.json       # Products data
│   ├── agents.json         # Agents & workflow data
│   └── blog-posts.json     # Blog posts (title, excerpt, content in markdown)
└── README.md
```

---

## Design System

### Colors (CSS Custom Properties)
```css
:root {
  /* Backgrounds */
  --bg-primary: #0a0a0a;
  --bg-surface: #111111;
  --bg-card: #1a1a1a;
  --bg-card-hover: #222222;
  
  /* Borders */
  --border-default: #2a2a2a;
  --border-glow: #00ff41;
  
  /* Brand colors */
  --color-primary: #00ff41;       /* Matrix green - chủ đạo */
  --color-secondary: #00ffff;     /* Cyan */
  --color-accent: #ff0080;        /* Hot pink - highlights, warnings */
  --color-warning: #ffaa00;       /* Amber - status indicators */
  
  /* Text */
  --text-primary: #e0e0e0;
  --text-secondary: #999999;
  --text-muted: #555555;
  --text-bright: #ffffff;
  
  /* Pillar colors */
  --pillar-privacy: #ff0080;      /* Hot pink */
  --pillar-ai: #00ffff;           /* Cyan */
  --pillar-blockchain: #ffaa00;   /* Amber */
  --pillar-zk: #a855f7;           /* Purple */
  
  /* Effects */
  --glow-green: 0 0 20px rgba(0, 255, 65, 0.3);
  --glow-cyan: 0 0 20px rgba(0, 255, 255, 0.3);
  --glow-pink: 0 0 20px rgba(255, 0, 128, 0.3);
}
```

### Typography
```css
:root {
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
  --font-body: 'Inter', 'Space Grotesk', -apple-system, sans-serif;
  --font-heading: 'JetBrains Mono', monospace;
}
```
- Headings: JetBrains Mono (monospace, bold)
- Body text: Inter hoặc Space Grotesk
- Terminal elements, code, tags: JetBrains Mono
- Font sizes: clamp() cho responsive

### UI Components

**Terminal Prompt:**
```html
<span class="terminal-prompt">
  <span class="terminal-user">nullshift</span>
  <span class="terminal-separator">@</span>
  <span class="terminal-host">labs</span>
  <span class="terminal-dollar">$</span>
  <span class="terminal-command typing-effect">./init --privacy-first</span>
</span>
```

**Hacker Card:**
```html
<div class="hacker-card" data-pillar="privacy">
  <div class="card-scanline"></div>
  <div class="card-header">
    <span class="card-tag">[LIVE]</span>
    <span class="card-pillar-dot"></span>
  </div>
  <h3 class="card-title glitch-hover">Project Name</h3>
  <p class="card-desc">Description here</p>
  <div class="card-tech-stack">
    <span class="tech-tag">Python</span>
    <span class="tech-tag">Solidity</span>
  </div>
  <div class="card-footer">
    <a href="#" class="card-link">> View Demo</a>
    <a href="#" class="card-link">> Source</a>
  </div>
</div>
```

**Status Tags:**
```html
<span class="status-tag status-live">[LIVE]</span>
<span class="status-tag status-building">[BUILDING]</span>
<span class="status-tag status-concept">[CONCEPT]</span>
```

**Buttons:**
```html
<a href="#" class="btn-primary">> Execute</a>
<a href="#" class="btn-ghost">> View Source</a>
```

---

## Pages Detail

### 1. Home / Landing (`index.html`)

**Layout flow từ trên xuống:**

**A. Hero Section (fullscreen)**
- Background: matrix rain canvas animation (subtle, slow, faded)
- CRT scanline overlay (very subtle)
- Center content:
  ```
  $ nullshift.sh
  
  [Glitch animation] NULLSHIFT
  
  From null to reality — privacy first, agents always.
  
  [Typing effect] > Initializing privacy protocols...
  [Typing effect] > Loading AI agents...
  [Typing effect] > Connecting to blockchain...
  [Typing effect] > ZK proofs verified.
  [Typing effect] > System ready.
  
  [Button] > Enter the Void    [Button] > View Projects
  ```

**B. 4 Pillars Preview Section**
- Heading: `## Core Protocols`
- 4 cards ngang hàng, mỗi card có:
  - Icon (SVG, đơn giản, line-art style)
  - Tên pillar + tagline ngắn
  - Border glow màu riêng mỗi pillar khi hover
  - Click → `/services.html#pillar-name`

  ```
  [🔒 Privacy]           [🤖 AI]              [⛓ Blockchain]        [🔐 ZK Proofs]
  Your data.             Agents that          Trust the code,       Prove everything.
  Your rules.            never sleep.         not the middleman.    Reveal nothing.
  ```

**C. Featured Projects Section**
- Heading: `## Latest Deployments`
- 3 project cards (terminal style, lấy từ data/projects.json)
- "View all projects >" link

**D. Terminal CTA Section**
- Fake terminal window:
  ```
  ┌─ nullshift@labs ~ ─────────────────────────┐
  │ $ cat /etc/nullshift/mission.txt           │
  │                                             │
  │ > Building privacy-first tools              │
  │ > One builder. All agents.                  │
  │ > No VC. No team. No compromise.            │
  │                                             │
  │ $ contact --init                            │
  │ > [Email] > [Twitter/X] > [GitHub]          │
  └─────────────────────────────────────────────┘
  ```

**E. Footer**
- Minimal: `© 2024 NullShift | nullshift.sh`
- Social links: GitHub, Twitter/X, Telegram
- `Built by one. Powered by agents.`

---

### 2. Core Services (`services.html`)

**Hero:** 
```
$ cat /protocols/core.md
## Core Protocols
> The 4 pillars that power everything we build.
```

**4 Pillar Sections (full-width, scroll-through):**

Mỗi pillar là 1 section lớn chiếm gần full viewport:

**Privacy** (border-left: hot pink)
```
[01] PRIVACY
─────────────────────
"Your data. Your rules."

Tagline dài: Privacy is not a feature — it's a fundamental right. Every product 
we build starts with one question: "Does this protect the user?"

> End-to-end encryption by default
> Zero-knowledge architecture
> No data collection, no tracking
> Self-sovereign identity

[Related products →]
```

**AI** (border-left: cyan)
```
[02] ARTIFICIAL INTELLIGENCE  
─────────────────────
"Agents that never sleep."

Tagline dài: We build AI agents that automate, analyze, and execute — 
so one builder can do the work of an entire team.

> Autonomous agent workflows
> LLM-powered automation
> ML pipelines & computer vision
> AI-driven trading systems

[Related products →]
```

**Blockchain** (border-left: amber)
```
[03] BLOCKCHAIN
─────────────────────
"Trust the code, not the middleman."

Tagline dài: Decentralized, permissionless, unstoppable. We build on-chain 
solutions that remove intermediaries and give power back to users.

> Smart contract development (Solidity, Rust)
> DeFi protocols & DEX integration
> Token economics & bonding curves
> Cross-chain infrastructure

[Related products →]
```

**ZK Proofs** (border-left: purple)
```
[04] ZERO-KNOWLEDGE PROOFS
─────────────────────
"Prove everything. Reveal nothing."

Tagline dài: The most powerful cryptographic primitive of our generation. 
ZK lets you verify truth without exposing data.

> ZK-SNARK / ZK-STARK implementations
> Private DeFi lending & transactions
> Verifiable computation
> Anonymous credential systems

[Related products →]
```

---

### 3. Products (`products.html`)

**Hero:**
```
$ ls /products/ --all
## Products
> Built on top of our core protocols. Filter by pillar.
```

**Filter bar:**
```
[ALL] [PRIVACY] [AI] [BLOCKCHAIN] [ZK]    Status: [ALL] [LIVE] [BUILDING] [CONCEPT]
```

**Product grid:** Cards loaded from `data/products.json`

Mỗi card hiển thị:
- Product name (glitch on hover)
- Short description
- Pillar tags (colored dots/badges)
- Tech stack tags
- Status: `[LIVE]` green / `[BUILDING]` amber / `[CONCEPT]` muted
- Links: Demo, Docs, Source

**Sample products data:**
```json
[
  {
    "name": "Privacy DeFi Lending",
    "slug": "privacy-defi-lending",
    "description": "ZK-powered private lending protocol. Borrow and lend without revealing your position.",
    "pillars": ["privacy", "blockchain", "zk"],
    "tech_stack": ["Solidity", "Circom", "Python"],
    "status": "building",
    "demo_url": null,
    "repo_url": "#"
  },
  {
    "name": "AI Trading Agents",
    "slug": "ai-trading-agents", 
    "description": "Autonomous agents that analyze markets and execute trades 24/7.",
    "pillars": ["ai", "blockchain"],
    "tech_stack": ["Python", "FastAPI", "Web3.py"],
    "status": "live",
    "demo_url": "#",
    "repo_url": "#"
  },
  {
    "name": "Anonymous Marketplace",
    "slug": "anon-marketplace",
    "description": "Crypto-only P2P marketplace. Zero KYC. Zero tracking. USDT powered.",
    "pillars": ["privacy", "blockchain"],
    "tech_stack": ["Python", "Next.js", "PostgreSQL"],
    "status": "building",
    "demo_url": null,
    "repo_url": "#"
  }
]
```

---

### 4. Workflow & Agents (`agents.html`)

**Hero:**
```
$ systemctl status nullshift-agents
## Agent Ecosystem
> One builder. Many agents. All autonomous.
```

**Interactive Workflow Graph:**
- Canvas hoặc SVG based
- Nodes = các agents (mỗi node là 1 hình tròn/hex với icon)
- Edges = data flow giữa agents (animated dashed lines, flowing direction)
- Click vào node → expand panel hiển thị chi tiết agent
- Mỗi node có glow effect theo trạng thái:
  - `ACTIVE` → green pulse
  - `IDLE` → dim gray
  - `DEPRECATED` → red, strikethrough

**Agent Detail Panel (khi click node):**
```
┌─ AGENT: market-scanner ──────────────┐
│ Role: Scans crypto markets 24/7      │
│ Status: [ACTIVE]                      │
│ Tools: CoinGecko API, Web3.py        │
│ Triggers: Price alert, New listing    │
│ Output → [trading-agent], [alert-bot] │
└───────────────────────────────────────┘
```

**Terminal Log Feed (bottom section):**
- Fake live terminal showing agent activity:
```
[2024-03-05 14:23:01] market-scanner  > BTC price alert triggered: $67,234
[2024-03-05 14:23:02] trading-agent   > Analyzing entry position...
[2024-03-05 14:23:05] trading-agent   > Order placed: LONG BTC @ $67,234
[2024-03-05 14:23:06] alert-bot       > Notification sent to Telegram
[2024-03-05 14:24:00] content-agent   > Blog post draft generated: "BTC Breakout Analysis"
```
- Auto-scroll, typing effect, green text on black

**Sample agents data (`data/agents.json`):**
```json
[
  {
    "id": "market-scanner",
    "name": "Market Scanner",
    "role": "Monitors crypto markets, price feeds, and on-chain data 24/7",
    "tools": ["CoinGecko API", "Web3.py", "DeFi Llama"],
    "status": "active",
    "connections": ["trading-agent", "alert-bot"],
    "position": { "x": 200, "y": 150 }
  },
  {
    "id": "trading-agent",
    "name": "Trading Agent",
    "role": "Executes trades based on signals from scanner and AI analysis",
    "tools": ["ccxt", "Web3.py", "Custom ML model"],
    "status": "active",
    "connections": ["alert-bot", "portfolio-tracker"],
    "position": { "x": 500, "y": 150 }
  },
  {
    "id": "content-agent",
    "name": "Content Agent",
    "role": "Generates blog posts, social media content, and research reports",
    "tools": ["Claude API", "Hailuo", "FFmpeg"],
    "status": "active",
    "connections": ["alert-bot"],
    "position": { "x": 350, "y": 350 }
  },
  {
    "id": "alert-bot",
    "name": "Alert Bot",
    "role": "Sends notifications across Telegram, Discord, and email",
    "tools": ["Telegram Bot API", "Discord Webhook", "SendGrid"],
    "status": "active",
    "connections": [],
    "position": { "x": 650, "y": 300 }
  }
]
```

---

### 5. Blog (`blog.html`)

**Hero:**
```
$ tail -f /var/log/nullshift/thoughts.log
## Blog
> Deep dives, tutorials, and field notes from the void.
```

**Filter tags:**
```
[ALL] [PRIVACY] [AI] [BLOCKCHAIN] [ZK] [TUTORIALS]
```

**Blog listing:** Cards with:
- Title (monospace)
- Date + reading time
- Excerpt (2 lines)
- Tags
- Pillar badge

**Blog posts stored in `data/blog-posts.json`:**
```json
[
  {
    "title": "Why Privacy is the Ultimate Feature",
    "slug": "why-privacy-ultimate-feature",
    "date": "2024-03-01",
    "reading_time": 5,
    "excerpt": "In a world of data harvesting, building privacy-first isn't just ethical — it's a competitive advantage.",
    "tags": ["privacy", "philosophy"],
    "pillar": "privacy",
    "content": "Full markdown content here..."
  }
]
```

**Note:** Blog detail có thể render client-side bằng JS (parse markdown → HTML), hoặc tạo sẵn các file HTML riêng cho mỗi bài. Chọn cách nào đơn giản hơn.

---

### 6. Projects (`projects.html`)

**Hero:**
```
$ find /projects -type f | head -20
## Projects
> Everything built from the void. Filter by pillar or status.
```

**Filter bar:** Giống Products page (pillar + status filter)

**Project grid:** Cards loaded from `data/projects.json`

Mỗi card:
- Thumbnail/screenshot (hoặc placeholder gradient nếu không có)
- Project name
- Description
- Tech stack tags
- Pillar tags
- Status badge
- Links: Demo, Source, Docs

---

## Shared Components

### Navbar
```html
<nav class="navbar">
  <a href="/" class="nav-logo">
    <span class="logo-bracket">[</span>
    <span class="logo-text glitch-hover">NullShift</span>
    <span class="logo-bracket">]</span>
  </a>
  <div class="nav-links">
    <a href="/services.html" class="nav-link">/services</a>
    <a href="/products.html" class="nav-link">/products</a>
    <a href="/agents.html" class="nav-link">/agents</a>
    <a href="/blog.html" class="nav-link">/blog</a>
    <a href="/projects.html" class="nav-link">/projects</a>
  </div>
  <button class="nav-hamburger" aria-label="Menu">
    <span></span><span></span><span></span>
  </button>
</nav>
```
- Fixed top, blur background
- Nav links kiểu file path: `/services`, `/products`, `/agents`
- Mobile: hamburger → slide-in menu (terminal style)
- Active page highlighted green

### Footer
```html
<footer class="footer">
  <div class="footer-terminal">
    <span class="terminal-prompt">$ echo "Built by one. Powered by agents."</span>
  </div>
  <div class="footer-links">
    <a href="https://github.com/nullshift">GitHub</a>
    <a href="https://x.com/nullshift">X/Twitter</a>
    <a href="https://t.me/nullshift">Telegram</a>
  </div>
  <p class="footer-copy">© 2024 NullShift | nullshift.sh</p>
</footer>
```

---

## JS Effects (effects.js)

### 1. Matrix Rain (Canvas)
- Subtle, slow falling green characters on hero backgrounds
- Characters: mix of katakana, latin, numbers, symbols
- Fade out effect, low opacity (0.03-0.05)
- Only on home page hero, performance-optimized

### 2. Glitch Text
- On hover: text glitches with random characters for 200ms then resolves
- On page load: logo does 1 glitch cycle
- CSS clip-path based for RGB split effect

### 3. Typing Effect
- Sequential typing with cursor blink
- Used in hero section command lines
- Variable speed: faster for commands, pause before output

### 4. CRT Scanline
- Very subtle horizontal line moving down screen
- CSS only: `::after` pseudo-element with repeating-linear-gradient
- Low opacity, optional toggle

### 5. Particle Background
- Floating dots connected by lines when close
- Green/cyan colors, very subtle
- Canvas-based, used on services/agents pages

---

## Animations (CSS)

```css
/* Glow pulse for active elements */
@keyframes glow-pulse {
  0%, 100% { box-shadow: var(--glow-green); }
  50% { box-shadow: 0 0 40px rgba(0, 255, 65, 0.6); }
}

/* Cursor blink */
@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* Glitch effect */
@keyframes glitch {
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(2px, -2px); }
  60% { transform: translate(-1px, -1px); }
  80% { transform: translate(1px, 1px); }
  100% { transform: translate(0); }
}

/* Fade in up */
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Scanline */
@keyframes scanline {
  0% { top: -10%; }
  100% { top: 110%; }
}
```

---

## Responsive Breakpoints

```css
/* Mobile first */
/* sm: 640px */
/* md: 768px */
/* lg: 1024px */
/* xl: 1280px */

/* Grid: */
/* Cards: 1 col mobile → 2 col tablet → 3 col desktop */
/* Pillar sections: stack on mobile, side-by-side on desktop */
/* Agent graph: simplified list view on mobile, full graph on desktop */
```

---

## SEO & Meta

Mỗi page cần có:
```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="NullShift — Privacy-first builder labs. AI agents, blockchain, and zero-knowledge proofs.">
<meta name="theme-color" content="#0a0a0a">

<!-- Open Graph -->
<meta property="og:title" content="NullShift">
<meta property="og:description" content="From null to reality — privacy first, agents always.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://nullshift.sh">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="NullShift">
```

---

## Performance

- Không dùng framework → tải cực nhanh
- Lazy load images (Intersection Observer)
- Canvas effects chỉ chạy khi visible (pause khi tab inactive)
- Minify CSS/JS cho production (optional, dùng tool ngoài)
- Preload fonts quan trọng

---

## Implementation Order

1. **Setup project structure** — tạo folders, files theo structure trên
2. **Design system** — variables.css, reset.css, global.css, typography
3. **Shared components** — Navbar + Footer (components.css)
4. **Home page** — Hero with matrix rain, pillars preview, featured projects, terminal CTA
5. **Effects** — Glitch text, typing effect, scanlines, particles
6. **Services page** — 4 pillar sections full content
7. **Products page** — Product cards + filter
8. **Projects page** — Project cards + filter
9. **Agents page** — Workflow graph + terminal log feed
10. **Blog page** — Blog listing + simple markdown render
11. **Responsive** — Mobile hamburger menu, responsive grids, touch-friendly
12. **Polish** — Smooth scroll, page transitions, hover effects, SEO meta
13. **Data** — Populate JSON files with real project/product data

---

## Important Notes

- **NO frameworks** — Pure HTML/CSS/JS only. No React, No Vue, No Tailwind, No SCSS.
- **NO build step** — Must work by opening index.html or serving static files.
- **Dark only** — No light mode toggle needed.
- **Mobile responsive** — Must look good on phone.
- **Performance** — Canvas effects must be optimized (requestAnimationFrame, visibility check).
- **Accessibility** — Proper semantic HTML, aria labels, keyboard navigation.
- **All data in JSON files** — Easy to update content without touching HTML.
- **Browser support** — Modern browsers only (Chrome, Firefox, Safari, Edge).

---

## Railway Deployment

Site tĩnh nhưng cần 1 simple static server để Railway serve được. Dùng Node.js + Express hoặc Python http server.

### Option 1: Node.js + Express (recommended)

**Tạo file `server.js` ở root:**
```js
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, '/')));

// SPA-like fallback: serve index.html for unknown routes
app.get('*', (req, res) => {
  // Check if requested file exists, otherwise serve 404 or index
  const filePath = path.join(__dirname, req.path);
  res.sendFile(filePath, (err) => {
    if (err) {
      res.sendFile(path.join(__dirname, 'index.html'));
    }
  });
});

app.listen(PORT, () => {
  console.log(`[nullshift.sh] Server running on port ${PORT}`);
});
```

**Tạo `package.json`:**
```json
{
  "name": "nullshift",
  "version": "1.0.0",
  "description": "NullShift — Privacy-first builder labs",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "engines": {
    "node": ">=18"
  }
}
```

### Option 2: Python (alternative)

**Tạo file `server.py` ở root:**
```python
import http.server
import socketserver
import os

PORT = int(os.environ.get("PORT", 3000))

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Try to serve the requested file
        if self.path == '/':
            self.path = '/index.html'
        
        # Check if file exists
        file_path = self.path.lstrip('/')
        if not os.path.isfile(file_path):
            # Fallback to index.html
            self.path = '/index.html'
        
        return super().do_GET()

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"[nullshift.sh] Server running on port {PORT}")
    httpd.serve_forever()
```

**Tạo `Procfile`:**
```
web: python server.py
```

**Tạo `runtime.txt`:**
```
python-3.11.x
```

---

### Railway Config Files

**Tạo `railway.toml` (cho Node.js option):**
```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "node server.js"
healthcheckPath = "/"
healthcheckTimeout = 100
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 3

[service]
internalPort = 3000
```

**Tạo `nixpacks.toml` (optional, cho build optimization):**
```toml
[phases.setup]
nixPkgs = ["nodejs-18_x"]

[phases.install]
cmds = ["npm install"]

[start]
cmd = "node server.js"
```

---

### Railway Deployment Steps

```bash
# 1. Init git repo (nếu chưa có)
git init
git add .
git commit -m "feat: NullShift initial deployment"

# 2. Install Railway CLI
npm install -g @railway/cli

# 3. Login
railway login

# 4. Init project
railway init
# → Chọn "Empty Project" hoặc tạo project mới tên "nullshift"

# 5. Deploy
railway up

# 6. Generate domain
railway domain
# → Railway sẽ cấp 1 subdomain: nullshift-xxx.up.railway.app

# 7. Custom domain (sau khi deploy thành công)
# → Vào Railway dashboard → Settings → Custom Domain
# → Thêm: nullshift.sh
# → Cập nhật DNS records ở domain registrar:
#    - Type: CNAME
#    - Name: @ (hoặc root)
#    - Value: <railway-provided-cname>.railway.app
```

---

### Environment Variables (Railway Dashboard)

```
PORT=3000
NODE_ENV=production
```

Railway tự inject `PORT` nên không cần set thủ công, nhưng nên có fallback trong code.

---

### Project Structure (Updated with deployment files)

```
nullshift/
├── index.html
├── services.html
├── products.html
├── agents.html
├── blog.html
├── projects.html
├── css/
│   └── ...
├── js/
│   └── ...
├── assets/
│   └── ...
├── data/
│   └── ...
├── server.js              # ← NEW: Express static server
├── package.json           # ← NEW: Node dependencies
├── railway.toml           # ← NEW: Railway config
├── .gitignore             # ← NEW: node_modules, .env, etc.
└── README.md
```

### `.gitignore`
```
node_modules/
.env
.DS_Store
*.log
```

---

### Post-Deploy Checklist

- [ ] Site loads tại `https://xxx.up.railway.app`
- [ ] Tất cả 6 pages navigate được
- [ ] Static assets (CSS, JS, images, JSON data) load đúng
- [ ] Canvas effects chạy mượt
- [ ] Mobile responsive OK
- [ ] Custom domain `nullshift.sh` trỏ đúng
- [ ] HTTPS tự động (Railway cấp SSL miễn phí)
- [ ] Open Graph meta tags hiển thị đúng khi share link
