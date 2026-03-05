# NullShift

```
$ nullshift.sh — From null to reality.
```

**NullShift** is a privacy-first solo builder labs website. Dark hacker aesthetic, powered by AI agents, built with pure HTML/CSS/JS — no frameworks, no build tools.

**Live:** [nullshift.sh](https://nullshift.sh)

---

## Core Pillars

| Pillar | Color | Focus |
|--------|-------|-------|
| Privacy | `#ff0080` Hot Pink | End-to-end encryption, zero-knowledge architecture, self-sovereign identity |
| AI | `#00ffff` Cyan | Autonomous agent workflows, LLM automation, ML pipelines |
| Blockchain | `#ffaa00` Amber | Smart contracts (Solidity/Rust), DeFi protocols, cross-chain infra |
| ZK Proofs | `#a855f7` Purple | ZK-SNARK/STARK, private transactions, verifiable computation |

---

## Tech Stack

- **HTML5 + CSS3 + Vanilla JS** — zero dependencies for the frontend
- **CSS Custom Properties** — design tokens for colors, fonts, spacing
- **CSS Animations** — glitch, typing, matrix, scanline effects
- **Canvas API** — matrix rain, particle backgrounds, agent workflow graph
- **Google Fonts** — JetBrains Mono (headings/code), Inter (body)
- **Express.js** — minimal static server for Railway deployment

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
│   ├── effects.js          # Matrix rain, glitch text, typing, scanlines
│   ├── particles.js        # Background particle system
│   ├── agents-graph.js     # Agent workflow interactive graph (Canvas/SVG)
│   ├── filter.js           # Filtering logic for products/projects
│   └── blog-data.js        # Blog posts data, rendered client-side
├── assets/
│   ├── icons/              # SVG icons for pillars, nav, social
│   ├── images/             # Project thumbnails, product images
│   └── fonts/              # Self-hosted fonts (optional fallback)
├── data/
│   ├── projects.json       # Projects data
│   ├── products.json       # Products data
│   ├── agents.json         # Agents & workflow data
│   └── blog-posts.json     # Blog posts (title, excerpt, markdown content)
├── server.js               # Express static server (for Railway)
├── package.json            # Node dependencies
├── railway.toml            # Railway deployment config
└── .gitignore
```

---

## Getting Started

### Prerequisites

- Node.js >= 18

### Local Development

```bash
# Clone the repo
git clone https://github.com/nullshift/nullshift.git
cd nullshift

# Install dependencies
npm install

# Start the server
npm start

# Open in browser
open http://localhost:3000
```

Or simply open `index.html` directly in a browser — no build step needed.

---

## Pages

### Home (`index.html`)
- Full-screen hero with matrix rain canvas animation & CRT scanline overlay
- Typing effect terminal commands showing system initialization
- 4 pillars preview cards with colored glow borders
- Featured projects section (loaded from `data/projects.json`)
- Terminal-style CTA with contact links

### Services (`services.html`)
- 4 full-width pillar sections, each near-viewport height
- Detailed descriptions and capabilities per pillar
- Color-coded border accents (Privacy=pink, AI=cyan, Blockchain=amber, ZK=purple)
- Links to related products

### Products (`products.html`)
- Filter bar: by pillar (Privacy/AI/Blockchain/ZK) and status (Live/Building/Concept)
- Product cards loaded from `data/products.json`
- Each card shows: name, description, pillar tags, tech stack, status badge, demo/source links

### Agents (`agents.html`)
- Interactive workflow graph (Canvas/SVG) showing agent nodes and data flow edges
- Click node to expand agent detail panel (role, tools, triggers, connections)
- Animated terminal log feed simulating live agent activity
- Agent data from `data/agents.json`

### Blog (`blog.html`)
- Filter by pillar tags
- Blog cards with title, date, reading time, excerpt, tags
- Content rendered client-side from `data/blog-posts.json` (markdown to HTML)

### Projects (`projects.html`)
- Filter bar: by pillar and status
- Project cards from `data/projects.json`
- Thumbnails, tech stack tags, status badges, demo/source/docs links

---

## Design System

### Colors

```css
--bg-primary: #0a0a0a;         /* Main background */
--bg-surface: #111111;         /* Surface background */
--bg-card: #1a1a1a;            /* Card background */
--color-primary: #00ff41;      /* Matrix green — primary brand */
--color-secondary: #00ffff;    /* Cyan */
--color-accent: #ff0080;       /* Hot pink — highlights */
--color-warning: #ffaa00;      /* Amber — status indicators */
```

### Typography

- **Headings:** JetBrains Mono (monospace, bold)
- **Body:** Inter / Space Grotesk (sans-serif)
- **Code/Terminal:** JetBrains Mono
- Responsive sizing with `clamp()`

### UI Components

- **Terminal Prompt** — styled command-line prompt with user@host format
- **Hacker Card** — dark card with scanline overlay, pillar-colored glow on hover
- **Status Tags** — `[LIVE]` green, `[BUILDING]` amber, `[CONCEPT]` muted
- **Buttons** — `> Execute` (primary), `> View Source` (ghost)

---

## Visual Effects

| Effect | Implementation | Usage |
|--------|---------------|-------|
| Matrix Rain | Canvas API | Home hero background |
| Glitch Text | CSS clip-path + JS | Hover on titles, logo on load |
| Typing Effect | JS sequential typing | Hero terminal commands |
| CRT Scanline | CSS `::after` pseudo-element | Subtle overlay on hero |
| Particle Background | Canvas API | Services & Agents pages |
| Glow Pulse | CSS `@keyframes` | Active elements, hover states |

---

## Data Files

All content is stored in JSON files under `data/` for easy updates without touching HTML.

### `data/products.json`
```json
{
  "name": "Product Name",
  "slug": "product-slug",
  "description": "Short description",
  "pillars": ["privacy", "blockchain"],
  "tech_stack": ["Python", "Solidity"],
  "status": "live | building | concept",
  "demo_url": "https://...",
  "repo_url": "https://..."
}
```

### `data/agents.json`
```json
{
  "id": "agent-id",
  "name": "Agent Name",
  "role": "What the agent does",
  "tools": ["Tool 1", "Tool 2"],
  "status": "active | idle | deprecated",
  "connections": ["other-agent-id"],
  "position": { "x": 200, "y": 150 }
}
```

### `data/blog-posts.json`
```json
{
  "title": "Post Title",
  "slug": "post-slug",
  "date": "2024-03-01",
  "reading_time": 5,
  "excerpt": "Short excerpt",
  "tags": ["privacy", "tutorials"],
  "pillar": "privacy",
  "content": "Full markdown content"
}
```

---

## Deployment (Railway)

### Quick Deploy

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login & init
railway login
railway init

# Deploy
railway up

# Get public URL
railway domain
```

### Configuration

**`railway.toml`:**
```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "node server.js"
healthcheckPath = "/"
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 3

[service]
internalPort = 3000
```

### Custom Domain

1. Deploy to Railway and get the railway subdomain
2. Go to Railway Dashboard → Settings → Custom Domain
3. Add `nullshift.sh`
4. Update DNS at your registrar:
   - Type: `CNAME`
   - Name: `@`
   - Value: `<railway-provided-cname>.railway.app`
5. Railway provides free SSL automatically

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port (auto-injected by Railway) |
| `NODE_ENV` | `production` | Environment |

---

## Post-Deploy Checklist

- [ ] Site loads at Railway subdomain
- [ ] All 6 pages navigate correctly
- [ ] Static assets (CSS, JS, images, JSON) load properly
- [ ] Canvas effects run smoothly
- [ ] Mobile responsive works
- [ ] Custom domain `nullshift.sh` resolves correctly
- [ ] HTTPS active (Railway auto SSL)
- [ ] Open Graph meta tags render on social share

---

## Browser Support

Modern browsers only:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## Key Principles

- **No frameworks** — Pure HTML/CSS/JS, zero build step
- **Dark only** — No light mode
- **Privacy first** — No tracking, no analytics, no cookies
- **Data-driven** — All content in JSON files
- **Performance** — Canvas effects use `requestAnimationFrame` with visibility checks
- **Accessible** — Semantic HTML, ARIA labels, keyboard navigation
- **Mobile responsive** — 1→2→3 column grid, hamburger menu on mobile

---

## License

All rights reserved. NullShift Labs.

---

```
$ echo "Built by one. Powered by agents."
```
