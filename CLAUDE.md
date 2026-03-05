# CLAUDE.md — NullShift

## Project Overview

NullShift (nullshift.sh) — a privacy-first solo builder labs static website. Dark hacker/cyberpunk aesthetic. 4 core pillars: Privacy, AI, Blockchain, ZK Proofs.

## Tech Stack — Hard Rules

- **Pure HTML5 + CSS3 + Vanilla JS** — NO frameworks (React, Vue, Svelte, etc.), NO build tools (Webpack, Vite, etc.), NO CSS frameworks (Tailwind, Bootstrap, etc.), NO preprocessors (SCSS, LESS, etc.)
- Website MUST work by opening `index.html` directly in a browser — zero build step
- Server (`server.js`) is Express.js, only for Railway deployment (serving static files)
- Google Fonts only external dependency (JetBrains Mono, Inter)
- Dark mode ONLY — no light mode toggle

## Project Structure

```
nullshift/
├── index.html, services.html, products.html, agents.html, blog.html, projects.html
├── css/
│   ├── reset.css → variables.css → global.css → components.css → animations.css
│   └── [page].css (home.css, services.css, etc.)
├── js/
│   ├── main.js (navbar, scroll), effects.js (matrix rain, glitch, typing)
│   ├── particles.js, agents-graph.js, filter.js, blog-data.js
├── data/ (products.json, projects.json, agents.json, blog-posts.json)
├── assets/icons/, assets/images/, assets/fonts/
├── server.js, package.json, railway.toml
└── docs/ (ARCHITECTURE.md, DESIGN-SYSTEM.md, DEPLOYMENT.md, CONTRIBUTING.md, DATA-SCHEMA.md)
```

## CSS Rules

- ALL visual values via CSS custom properties from `variables.css` — never hardcode colors, fonts, spacing
- CSS load order matters: reset → variables → global → components → animations → page-specific
- Mobile-first responsive: base (mobile) → sm (640px) → md (768px) → lg (1024px) → xl (1280px)
- Key colors: `--color-primary: #00ff41` (green), `--color-secondary: #00ffff` (cyan), `--color-accent: #ff0080` (pink), `--color-warning: #ffaa00` (amber), `--pillar-zk: #a855f7` (purple)
- Background: `--bg-primary: #0a0a0a`, `--bg-card: #1a1a1a`

## JS Rules

- Vanilla JS only — no jQuery, no lodash, no npm frontend packages
- `const` by default, `let` when needed, never `var`
- `fetch()` for data loading, never XMLHttpRequest
- `requestAnimationFrame` for animations, never `setInterval`
- Canvas effects MUST: check `document.hidden` (pause when tab inactive), use `IntersectionObserver` (skip when off-screen), respect `prefers-reduced-motion`
- All scripts loaded via `<script>` tags at bottom of `<body>`, no module bundler

## Data

- All dynamic content in JSON files under `data/`
- Never hardcode content in HTML — load from JSON and render client-side
- Valid pillars: `"privacy"`, `"ai"`, `"blockchain"`, `"zk"`
- Valid statuses (products/projects): `"live"`, `"building"`, `"concept"`
- Valid statuses (agents): `"active"`, `"idle"`, `"deprecated"`
- JSON keys: `snake_case`

## Components

- Terminal prompt: `nullshift@labs$` format with colored segments
- Hacker card: dark card with `data-pillar` attribute for colored glow on hover
- Status tags: `[LIVE]` green, `[BUILDING]` amber, `[CONCEPT]` gray
- Buttons: `> Execute` (primary, green border), `> View Source` (ghost)
- Navbar: fixed top, links as file paths (`/services`, `/products`), hamburger on mobile
- All shared components must appear identically across all 6 pages

## Content Tone

- Technical, direct, aggressive, no fluff
- Terminal/hacker metaphors in copy
- Use `>` prefix for button text and list items
- Status in brackets: `[LIVE]`, `[BUILDING]`, `[CONCEPT]`

## Common Commands

```bash
npm install          # Install Express dependency
npm start            # Start local server at localhost:3000
railway up           # Deploy to Railway
railway logs         # View deployment logs
```

## Don'ts

- Don't add npm packages for frontend (only Express for server)
- Don't add light mode
- Don't add tracking, analytics cookies, or invasive third-party scripts
- Don't use icon fonts — use inline SVGs
- Don't create separate HTML files for blog posts — render markdown client-side
- Don't use `setInterval` or `setTimeout` for visual animations
- Don't break the "open index.html directly" workflow
