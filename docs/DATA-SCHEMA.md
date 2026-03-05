# Data Schema — NullShift

```
$ cat /docs/data-schema.md
```

Tất cả content động được lưu trong JSON files dưới `data/`. Trang web fetch và render client-side.

---

## Products (`data/products.json`)

Mảng các product objects.

### Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Product display name |
| `slug` | string | Yes | URL-friendly identifier (unique) |
| `description` | string | Yes | Short description (1-2 sentences) |
| `pillars` | string[] | Yes | Associated pillars: `"privacy"`, `"ai"`, `"blockchain"`, `"zk"` |
| `tech_stack` | string[] | Yes | Technologies used |
| `status` | string | Yes | One of: `"live"`, `"building"`, `"concept"` |
| `demo_url` | string \| null | No | Link to live demo |
| `docs_url` | string \| null | No | Link to documentation |
| `repo_url` | string \| null | No | Link to source code |

### Example

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
    "docs_url": null,
    "repo_url": "https://github.com/nullshift/privacy-defi-lending"
  },
  {
    "name": "AI Trading Agents",
    "slug": "ai-trading-agents",
    "description": "Autonomous agents that analyze markets and execute trades 24/7.",
    "pillars": ["ai", "blockchain"],
    "tech_stack": ["Python", "FastAPI", "Web3.py"],
    "status": "live",
    "demo_url": "https://trading.nullshift.sh",
    "docs_url": null,
    "repo_url": "https://github.com/nullshift/ai-trading-agents"
  },
  {
    "name": "Anonymous Marketplace",
    "slug": "anon-marketplace",
    "description": "Crypto-only P2P marketplace. Zero KYC. Zero tracking. USDT powered.",
    "pillars": ["privacy", "blockchain"],
    "tech_stack": ["Python", "Next.js", "PostgreSQL"],
    "status": "building",
    "demo_url": null,
    "docs_url": null,
    "repo_url": "https://github.com/nullshift/anon-marketplace"
  }
]
```

### Validation Rules

- `slug` must be unique across all products
- `pillars` must only contain valid values: `"privacy"`, `"ai"`, `"blockchain"`, `"zk"`
- `status` must be one of: `"live"`, `"building"`, `"concept"`
- `tech_stack` should not be empty
- URLs must be full URLs (with `https://`) or `null`

---

## Projects (`data/projects.json`)

Mảng các project objects. Tương tự products nhưng thêm metadata.

### Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Project display name |
| `slug` | string | Yes | URL-friendly identifier (unique) |
| `description` | string | Yes | Project description |
| `pillars` | string[] | Yes | Associated pillars |
| `tech_stack` | string[] | Yes | Technologies used |
| `status` | string | Yes | `"live"`, `"building"`, `"concept"` |
| `thumbnail` | string \| null | No | Path to thumbnail image in `assets/images/` |
| `demo_url` | string \| null | No | Live demo link |
| `docs_url` | string \| null | No | Documentation link |
| `repo_url` | string \| null | No | Source code link |
| `featured` | boolean | No | Show on home page (default: `false`) |

### Example

```json
[
  {
    "name": "ZK Identity Verifier",
    "slug": "zk-identity-verifier",
    "description": "Prove your identity without revealing personal data. ZK-SNARK based credential system.",
    "pillars": ["privacy", "zk"],
    "tech_stack": ["Rust", "Circom", "React"],
    "status": "concept",
    "thumbnail": "assets/images/zk-identity.png",
    "demo_url": null,
    "docs_url": null,
    "repo_url": null,
    "featured": false
  }
]
```

### Notes

- Nếu `thumbnail` là `null`, UI render gradient placeholder theo pillar color
- Chỉ 3 projects với `featured: true` hiển thị trên home page

---

## Agents (`data/agents.json`)

Mảng các agent objects cho workflow graph trên agents page.

### Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique agent identifier (kebab-case) |
| `name` | string | Yes | Display name |
| `role` | string | Yes | What the agent does (1-2 sentences) |
| `tools` | string[] | Yes | APIs/tools the agent uses |
| `status` | string | Yes | `"active"`, `"idle"`, `"deprecated"` |
| `connections` | string[] | Yes | IDs of agents this one sends data to |
| `position` | object | Yes | `{ "x": number, "y": number }` — position on graph |
| `triggers` | string[] | No | Events that activate this agent |

### Example

```json
[
  {
    "id": "market-scanner",
    "name": "Market Scanner",
    "role": "Monitors crypto markets, price feeds, and on-chain data 24/7",
    "tools": ["CoinGecko API", "Web3.py", "DeFi Llama"],
    "status": "active",
    "connections": ["trading-agent", "alert-bot"],
    "position": { "x": 200, "y": 150 },
    "triggers": ["Price threshold", "New token listing", "Volume spike"]
  },
  {
    "id": "trading-agent",
    "name": "Trading Agent",
    "role": "Executes trades based on signals from scanner and AI analysis",
    "tools": ["ccxt", "Web3.py", "Custom ML model"],
    "status": "active",
    "connections": ["alert-bot", "portfolio-tracker"],
    "position": { "x": 500, "y": 150 },
    "triggers": ["Signal from market-scanner", "ML model prediction"]
  },
  {
    "id": "content-agent",
    "name": "Content Agent",
    "role": "Generates blog posts, social media content, and research reports",
    "tools": ["Claude API", "Hailuo", "FFmpeg"],
    "status": "active",
    "connections": ["alert-bot"],
    "position": { "x": 350, "y": 350 },
    "triggers": ["Market event", "Scheduled daily"]
  },
  {
    "id": "alert-bot",
    "name": "Alert Bot",
    "role": "Sends notifications across Telegram, Discord, and email",
    "tools": ["Telegram Bot API", "Discord Webhook", "SendGrid"],
    "status": "active",
    "connections": [],
    "position": { "x": 650, "y": 300 },
    "triggers": ["Incoming message from any agent"]
  }
]
```

### Graph Rendering Rules

- `position.x` and `position.y` are relative coordinates (0-800 range suggested)
- `connections` define directed edges: `agent A → agent B`
- Status determines visual style:
  | Status | Node Color | Effect |
  |--------|-----------|--------|
  | `active` | Green | Pulse glow animation |
  | `idle` | Gray | Dim, no animation |
  | `deprecated` | Red | Strikethrough label |

---

## Blog Posts (`data/blog-posts.json`)

Mảng các blog post objects.

### Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Post title |
| `slug` | string | Yes | URL-friendly identifier (unique) |
| `date` | string | Yes | Publication date (ISO format: `YYYY-MM-DD`) |
| `reading_time` | number | Yes | Estimated reading time in minutes |
| `excerpt` | string | Yes | Short preview text (1-2 sentences) |
| `tags` | string[] | Yes | Content tags |
| `pillar` | string | Yes | Primary pillar: `"privacy"`, `"ai"`, `"blockchain"`, `"zk"` |
| `author` | string | No | Author name (default: "NullShift") |
| `content` | string | Yes | Full post content in Markdown |

### Example

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
    "author": "NullShift",
    "content": "# Why Privacy is the Ultimate Feature\n\nIn a world where data is the new oil..."
  },
  {
    "title": "Building Autonomous Trading Agents with Python",
    "slug": "building-autonomous-trading-agents",
    "date": "2024-02-15",
    "reading_time": 12,
    "excerpt": "A deep dive into building AI agents that analyze markets and execute trades without human intervention.",
    "tags": ["ai", "blockchain", "tutorials"],
    "pillar": "ai",
    "author": "NullShift",
    "content": "# Building Autonomous Trading Agents\n\n## Prerequisites\n..."
  }
]
```

### Content Format

Blog `content` field sử dụng Markdown. Client-side renderer cần support:

| Element | Markdown | Rendered |
|---------|----------|---------|
| Heading | `# H1`, `## H2` | `<h1>`, `<h2>` |
| Bold | `**text**` | `<strong>` |
| Italic | `*text*` | `<em>` |
| Code inline | `` `code` `` | `<code>` |
| Code block | ```` ```lang ```` | `<pre><code>` |
| Link | `[text](url)` | `<a href>` |
| List | `- item` | `<ul><li>` |
| Blockquote | `> quote` | `<blockquote>` |
| Image | `![alt](src)` | `<img>` |

### Sorting & Display

- Default sort: by `date` descending (newest first)
- Home page: show latest 3 posts
- Blog page: show all, filterable by `pillar` and `tags`

---

## Valid Pillar Values

Used across all data files:

| Value | Display | Color |
|-------|---------|-------|
| `"privacy"` | Privacy | `#ff0080` |
| `"ai"` | AI | `#00ffff` |
| `"blockchain"` | Blockchain | `#ffaa00` |
| `"zk"` | ZK Proofs | `#a855f7` |

---

## Valid Status Values

### Products & Projects

| Value | Display | Badge Color |
|-------|---------|------------|
| `"live"` | `[LIVE]` | `#00ff41` (green) |
| `"building"` | `[BUILDING]` | `#ffaa00` (amber) |
| `"concept"` | `[CONCEPT]` | `#555555` (gray) |

### Agents

| Value | Display | Node Style |
|-------|---------|-----------|
| `"active"` | Active | Green pulse |
| `"idle"` | Idle | Dim gray |
| `"deprecated"` | Deprecated | Red strikethrough |

---

## Adding New Data

### Add a product

1. Open `data/products.json`
2. Add new object to array
3. Ensure `slug` is unique
4. Verify `pillars` and `status` use valid values
5. Reload page — product appears automatically

### Add a blog post

1. Open `data/blog-posts.json`
2. Add new object to array
3. Write `content` in Markdown
4. Set correct `date` (ISO format) and `reading_time`
5. Reload page — post appears in listing

### Add an agent

1. Open `data/agents.json`
2. Add new agent object
3. Set `position` to avoid overlapping with existing nodes
4. Add `id` to other agents' `connections` if they feed data to this agent
5. Reload page — agent appears on graph
