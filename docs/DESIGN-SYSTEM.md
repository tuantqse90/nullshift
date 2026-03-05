# Design System — NullShift

```
$ cat /docs/design-system.md
```

---

## Brand Identity

| Property | Value |
|----------|-------|
| Name | NullShift |
| Domain | nullshift.sh |
| Tagline | `$ nullshift.sh — From null to reality.` |
| Identity | Solo builder labs. Privacy-first. Powered by AI agents. |
| Vibe | Dark, terminal/hacker, aggressive, cyberpunk |

---

## Color Palette

### Backgrounds

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-primary` | `#0a0a0a` | Page background |
| `--bg-surface` | `#111111` | Sections, elevated areas |
| `--bg-card` | `#1a1a1a` | Card default |
| `--bg-card-hover` | `#222222` | Card hover state |

### Brand Colors

| Token | Hex | Swatch | Usage |
|-------|-----|--------|-------|
| `--color-primary` | `#00ff41` | Matrix Green | Primary brand, links, active states |
| `--color-secondary` | `#00ffff` | Cyan | Secondary accents, AI pillar |
| `--color-accent` | `#ff0080` | Hot Pink | Highlights, warnings, Privacy pillar |
| `--color-warning` | `#ffaa00` | Amber | Status indicators, Blockchain pillar |

### Pillar Colors

| Pillar | Token | Hex | Usage |
|--------|-------|-----|-------|
| Privacy | `--pillar-privacy` | `#ff0080` | Border, glow, badge |
| AI | `--pillar-ai` | `#00ffff` | Border, glow, badge |
| Blockchain | `--pillar-blockchain` | `#ffaa00` | Border, glow, badge |
| ZK Proofs | `--pillar-zk` | `#a855f7` | Border, glow, badge |

### Text

| Token | Hex | Usage |
|-------|-----|-------|
| `--text-primary` | `#e0e0e0` | Body text |
| `--text-secondary` | `#999999` | Captions, metadata |
| `--text-muted` | `#555555` | Disabled, placeholders |
| `--text-bright` | `#ffffff` | Headings, emphasis |

### Borders

| Token | Hex | Usage |
|-------|-----|-------|
| `--border-default` | `#2a2a2a` | Card borders, dividers |
| `--border-glow` | `#00ff41` | Active borders, focus states |

### Glow Effects

| Token | Value | Usage |
|-------|-------|-------|
| `--glow-green` | `0 0 20px rgba(0, 255, 65, 0.3)` | Primary glow |
| `--glow-cyan` | `0 0 20px rgba(0, 255, 255, 0.3)` | AI elements |
| `--glow-pink` | `0 0 20px rgba(255, 0, 128, 0.3)` | Privacy elements |

---

## Typography

### Font Families

| Token | Stack | Usage |
|-------|-------|-------|
| `--font-mono` | `'JetBrains Mono', 'Fira Code', 'Courier New', monospace` | Headings, code, terminal |
| `--font-body` | `'Inter', 'Space Grotesk', -apple-system, sans-serif` | Body text, descriptions |
| `--font-heading` | `'JetBrains Mono', monospace` | All headings |

### Font Loading

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
```

### Type Scale

| Level | Size | Weight | Font | Usage |
|-------|------|--------|------|-------|
| Display | `clamp(2.5rem, 5vw, 4rem)` | 700 | Mono | Hero title |
| H1 | `clamp(2rem, 4vw, 3rem)` | 700 | Mono | Page titles |
| H2 | `clamp(1.5rem, 3vw, 2rem)` | 600 | Mono | Section headings |
| H3 | `clamp(1.2rem, 2vw, 1.5rem)` | 600 | Mono | Card titles |
| Body | `1rem (16px)` | 400 | Body | Paragraphs |
| Small | `0.875rem (14px)` | 400 | Body | Captions, meta |
| Code | `0.9rem` | 400 | Mono | Inline code, tags |

### Text Rules

- Line height: `1.6` for body, `1.2` for headings
- Max width for readable text: `65ch`
- Letter spacing: `0.05em` for uppercase labels, `normal` for body

---

## Spacing

Sử dụng spacing scale nhất quán:

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `0.25rem` (4px) | Tight gaps |
| `--space-sm` | `0.5rem` (8px) | Tag padding, small gaps |
| `--space-md` | `1rem` (16px) | Component padding |
| `--space-lg` | `2rem` (32px) | Section padding |
| `--space-xl` | `4rem` (64px) | Section margins |
| `--space-2xl` | `6rem` (96px) | Page section spacing |

---

## Components

### Terminal Prompt

```html
<span class="terminal-prompt">
  <span class="terminal-user">nullshift</span>
  <span class="terminal-separator">@</span>
  <span class="terminal-host">labs</span>
  <span class="terminal-dollar">$</span>
  <span class="terminal-command typing-effect">./init --privacy-first</span>
</span>
```

Styling:
- `terminal-user` → `--color-primary` (green)
- `terminal-separator` → `--text-muted`
- `terminal-host` → `--color-secondary` (cyan)
- `terminal-dollar` → `--text-primary`
- `terminal-command` → `--text-bright`
- Font: `--font-mono`

---

### Hacker Card

```html
<div class="hacker-card" data-pillar="privacy">
  <div class="card-scanline"></div>
  <div class="card-header">
    <span class="card-tag">[LIVE]</span>
    <span class="card-pillar-dot"></span>
  </div>
  <h3 class="card-title glitch-hover">Project Name</h3>
  <p class="card-desc">Description text</p>
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

States:
| State | Behavior |
|-------|----------|
| Default | Dark card, subtle border |
| Hover | Border glows with pillar color, background lightens |
| Active | Pressed effect, glow intensifies |

Pillar modifier (`data-pillar`):
| Pillar | Hover border | Glow |
|--------|-------------|------|
| `privacy` | `#ff0080` | `--glow-pink` |
| `ai` | `#00ffff` | `--glow-cyan` |
| `blockchain` | `#ffaa00` | amber glow |
| `zk` | `#a855f7` | purple glow |

---

### Status Tags

```html
<span class="status-tag status-live">[LIVE]</span>
<span class="status-tag status-building">[BUILDING]</span>
<span class="status-tag status-concept">[CONCEPT]</span>
```

| Status | Color | Background |
|--------|-------|------------|
| LIVE | `#00ff41` | `rgba(0, 255, 65, 0.1)` |
| BUILDING | `#ffaa00` | `rgba(255, 170, 0, 0.1)` |
| CONCEPT | `#555555` | `rgba(85, 85, 85, 0.1)` |

Font: `--font-mono`, uppercase, `0.75rem`

---

### Tech Tags

```html
<span class="tech-tag">Python</span>
```

- Background: `--bg-surface`
- Border: `--border-default`
- Font: `--font-mono`, `0.75rem`
- Padding: `2px 8px`
- Border-radius: `2px`

---

### Buttons

**Primary:**
```html
<a href="#" class="btn-primary">> Execute</a>
```
- Border: `1px solid --color-primary`
- Text: `--color-primary`
- Background: transparent
- Hover: background `rgba(0, 255, 65, 0.1)`, glow effect
- Font: `--font-mono`

**Ghost:**
```html
<a href="#" class="btn-ghost">> View Source</a>
```
- Border: `1px solid --border-default`
- Text: `--text-secondary`
- Hover: border `--color-primary`, text `--color-primary`

---

### Navbar

```
┌──────────────────────────────────────────────────────────────┐
│ [NullShift]     /services  /products  /agents  /blog  /proj  │
└──────────────────────────────────────────────────────────────┘
```

- Position: fixed top
- Background: `--bg-primary` with `backdrop-filter: blur(10px)`
- Height: `60px`
- Z-index: `1000`
- Logo: brackets `[ ]` with glitch hover on text
- Links: styled as file paths (`/services`)
- Active link: `--color-primary` (green)
- Mobile: hamburger button → slide-in panel

---

### Terminal Window

```
┌─ nullshift@labs ~ ──────────────────────┐
│ $ command here                          │
│ > output line 1                         │
│ > output line 2                         │
└─────────────────────────────────────────┘
```

- Border: `1px solid --border-default`
- Border-radius: `4px`
- Header bar: darker background with title
- Dot indicators: red, yellow, green (fake window controls)
- Content: mono font, green text on dark background
- Padding: `1.5rem`

---

## Animations

### Glow Pulse

```css
@keyframes glow-pulse {
  0%, 100% { box-shadow: var(--glow-green); }
  50% { box-shadow: 0 0 40px rgba(0, 255, 65, 0.6); }
}
```
Duration: `2s`, infinite, ease-in-out
Usage: active agent nodes, live status indicators

### Cursor Blink

```css
@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
```
Duration: `1s`, infinite, step-end
Usage: terminal cursor `▌`

### Glitch

```css
@keyframes glitch {
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(2px, -2px); }
  60% { transform: translate(-1px, -1px); }
  80% { transform: translate(1px, 1px); }
  100% { transform: translate(0); }
}
```
Duration: `200ms`, single run on hover
Usage: title text, logo

### Fade In Up

```css
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
```
Duration: `0.6s`, ease-out
Usage: cards, sections on scroll (Intersection Observer trigger)

### Scanline

```css
@keyframes scanline {
  0% { top: -10%; }
  100% { top: 110%; }
}
```
Duration: `8s`, infinite, linear
Usage: CRT effect overlay (very low opacity)

---

## Responsive Breakpoints

| Breakpoint | Width | Grid Columns | Notes |
|------------|-------|-------------|-------|
| Mobile | < 640px | 1 | Hamburger menu, stacked cards |
| Tablet (sm) | >= 640px | 2 | Side-by-side cards |
| Desktop (md) | >= 768px | 2 | Wider spacing |
| Large (lg) | >= 1024px | 3 | Full layout, agent graph |
| XL | >= 1280px | 3 | Max content width |

### Mobile-specific rules

- Navbar: hamburger menu → slide-in terminal-style panel
- Cards: single column, full width
- Agent graph: falls back to list view (no canvas graph)
- Hero text: smaller, more padding
- Terminal windows: horizontal scroll if needed
- Filter bar: horizontal scroll on tags

### Max content width

```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-md);
}
```

---

## Iconography

- Style: line-art, monoline, minimal
- Stroke: 1.5px - 2px
- Size: 24x24 (default), 32x32 (pillar cards), 16x16 (inline)
- Color: inherit from parent (uses currentColor)
- Format: inline SVG (không dùng icon fonts)

### Pillar Icons

| Pillar | Icon | Description |
|--------|------|-------------|
| Privacy | Shield/Lock | Simple shield outline |
| AI | Brain/Circuit | Brain with circuit nodes |
| Blockchain | Chain/Cube | Connected chain links |
| ZK Proofs | Eye-slash/Zero | Eye with line through it |

---

## Accessibility

### Requirements

- Semantic HTML: `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`
- ARIA labels on interactive elements (hamburger, filters, graph nodes)
- Keyboard navigation: all interactive elements focusable via Tab
- Focus styles: visible outline (green glow) matching brand
- Color contrast: text passes WCAG AA on dark background
- Reduced motion: respect `prefers-reduced-motion` media query

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

Canvas effects (matrix rain, particles) phải check:
```js
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) return; // Skip canvas animations
```

### Focus Styles

```css
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Remove focus ring for mouse users */
:focus:not(:focus-visible) {
  outline: none;
}
```

Tất cả interactive elements (buttons, links, filter tags, graph nodes) phải có visible focus ring khi navigate bằng keyboard.

---

## Additional Components

### Filter Bar

Dùng trên Products, Projects, và Blog pages.

```html
<div class="filter-bar">
  <div class="filter-group">
    <span class="filter-label">Pillar:</span>
    <button class="filter-tag active" data-filter="all">ALL</button>
    <button class="filter-tag" data-filter="privacy" data-pillar="privacy">PRIVACY</button>
    <button class="filter-tag" data-filter="ai" data-pillar="ai">AI</button>
    <button class="filter-tag" data-filter="blockchain" data-pillar="blockchain">BLOCKCHAIN</button>
    <button class="filter-tag" data-filter="zk" data-pillar="zk">ZK</button>
  </div>
  <div class="filter-group">
    <span class="filter-label">Status:</span>
    <button class="filter-tag active" data-filter="all">ALL</button>
    <button class="filter-tag" data-filter="live">LIVE</button>
    <button class="filter-tag" data-filter="building">BUILDING</button>
    <button class="filter-tag" data-filter="concept">CONCEPT</button>
  </div>
</div>
```

| State | Style |
|-------|-------|
| Default | `--bg-surface` background, `--text-secondary` text, `--border-default` border |
| Hover | `--color-primary` border, `--text-primary` text |
| Active | `--color-primary` background (10% opacity), `--color-primary` text + border |
| Pillar Active | Pillar color thay cho green (privacy=pink, ai=cyan, blockchain=amber, zk=purple) |

- Font: `--font-mono`, uppercase, `0.75rem`
- Padding: `4px 12px`
- Border-radius: `2px`
- Gap giữa tags: `var(--space-xs)`
- Mobile: horizontal scroll, no wrap

---

### Blog Card

```html
<article class="blog-card" data-pillar="ai">
  <div class="blog-card-header">
    <time class="blog-date">2024-03-01</time>
    <span class="blog-reading-time">5 min read</span>
  </div>
  <h3 class="blog-card-title">Why Privacy is the Ultimate Feature</h3>
  <p class="blog-card-excerpt">In a world of data harvesting, building privacy-first isn't just ethical...</p>
  <div class="blog-card-footer">
    <div class="blog-tags">
      <span class="tech-tag">privacy</span>
      <span class="tech-tag">philosophy</span>
    </div>
    <span class="pillar-badge" data-pillar="privacy">PRIVACY</span>
  </div>
</article>
```

| Property | Value |
|----------|-------|
| Background | `--bg-card` |
| Border | `1px solid --border-default` |
| Border-left | `3px solid` pillar color (via `data-pillar`) |
| Hover | border-left glow, `--bg-card-hover` background |
| Title font | `--font-mono`, `1.125rem` |
| Date font | `--font-mono`, `0.75rem`, `--text-muted` |
| Excerpt | `--font-body`, `0.9rem`, `--text-secondary`, max 2 lines (line-clamp) |
| Padding | `var(--space-md)` |
| Cursor | pointer (entire card is clickable) |

---

### Blog Post View

Khi user click vào blog card, render full post trong page:

```html
<article class="blog-post">
  <header class="blog-post-header">
    <a href="#" class="blog-back-link">&lt; Back to blog</a>
    <h1 class="blog-post-title">Why Privacy is the Ultimate Feature</h1>
    <div class="blog-post-meta">
      <time>2024-03-01</time>
      <span>·</span>
      <span>5 min read</span>
      <span>·</span>
      <span class="pillar-badge" data-pillar="privacy">PRIVACY</span>
    </div>
  </header>
  <div class="blog-post-content">
    <!-- Rendered markdown HTML here -->
  </div>
</article>
```

Content area styles:
| Element | Style |
|---------|-------|
| `h1` | `--font-mono`, `2rem`, `--text-bright` |
| `h2` | `--font-mono`, `1.5rem`, `--color-primary`, `border-bottom: 1px solid --border-default` |
| `h3` | `--font-mono`, `1.25rem`, `--text-primary` |
| `p` | `--font-body`, `1rem`, `--text-secondary`, `line-height: 1.8` |
| `code` (inline) | `--font-mono`, `0.875rem`, `--bg-surface` background, `--color-secondary` text |
| `pre > code` | `--bg-surface`, `1px solid --border-default`, padding `var(--space-md)`, overflow-x scroll |
| `a` | `--color-primary`, underline on hover |
| `blockquote` | `border-left: 3px solid --color-primary`, `--bg-surface` background, padding `var(--space-sm)` |
| `ul/ol` | `--text-secondary`, `list-style` inside, `> ` prefix style optional |
| `img` | `max-width: 100%`, `border: 1px solid --border-default` |

Max width content area: `720px`, centered.

---

### Agent Graph Node

Node rendering trên canvas/SVG trong agents page.

```
┌─────────────────┐
│  ◉ Agent Name   │
│  Role text...   │
│  [STATUS]       │
└─────────────────┘
```

| Property | Active | Idle | Deprecated |
|----------|--------|------|------------|
| Border | `--color-primary` | `--border-default` | `#ff4444` |
| Background | `rgba(0, 255, 65, 0.05)` | `--bg-card` | `rgba(255, 68, 68, 0.05)` |
| Glow | `--glow-green` pulse | none | none |
| Label color | `--color-primary` | `--text-muted` | `#ff4444` strikethrough |
| Dot indicator | green, pulsing | gray, static | red, static |

Edge (connection line) styles:
| Property | Value |
|----------|-------|
| Color | `rgba(0, 255, 65, 0.3)` |
| Width | `1.5px` |
| Style | dashed, animated flow direction |
| Arrow | small triangle at target end |
| Hover | brighten to `rgba(0, 255, 65, 0.8)` |

---

### Agent Detail Panel

Khi click vào graph node, slide-in panel hiển thị:

```html
<div class="agent-panel" data-agent-id="market-scanner">
  <div class="agent-panel-header">
    <span class="terminal-prompt">$ agent info market-scanner</span>
    <button class="agent-panel-close" aria-label="Close">×</button>
  </div>
  <div class="agent-panel-body">
    <div class="agent-field">
      <span class="field-label">Name:</span>
      <span class="field-value">Market Scanner</span>
    </div>
    <div class="agent-field">
      <span class="field-label">Role:</span>
      <span class="field-value">Monitors crypto markets 24/7</span>
    </div>
    <div class="agent-field">
      <span class="field-label">Status:</span>
      <span class="status-tag status-active">[ACTIVE]</span>
    </div>
    <div class="agent-field">
      <span class="field-label">Tools:</span>
      <div class="agent-tools">
        <span class="tech-tag">CoinGecko API</span>
        <span class="tech-tag">Web3.py</span>
      </div>
    </div>
    <div class="agent-field">
      <span class="field-label">Output →</span>
      <span class="field-value">trading-agent, alert-bot</span>
    </div>
  </div>
</div>
```

| Property | Value |
|----------|-------|
| Position | fixed right, slide in from right |
| Width | `360px` (desktop), `100%` (mobile) |
| Background | `--bg-primary` |
| Border-left | `1px solid --color-primary` |
| Z-index | `999` |
| Header | `--bg-surface`, terminal prompt style |
| Field label | `--font-mono`, `0.75rem`, `--text-muted` |
| Field value | `--font-mono`, `0.9rem`, `--text-primary` |

---

### Terminal Log Feed

Fake live terminal trên agents page:

```html
<div class="terminal-log">
  <div class="terminal-log-header">
    <span class="terminal-dot red"></span>
    <span class="terminal-dot yellow"></span>
    <span class="terminal-dot green"></span>
    <span class="terminal-log-title">nullshift@labs — agent.log</span>
  </div>
  <div class="terminal-log-body" id="agent-log">
    <!-- Log entries rendered by JS -->
  </div>
</div>
```

Log entry format:
```html
<div class="log-entry">
  <span class="log-time">[2024-03-05 14:23:01]</span>
  <span class="log-agent">market-scanner</span>
  <span class="log-separator">&gt;</span>
  <span class="log-message">BTC price alert triggered: $67,234</span>
</div>
```

| Property | Value |
|----------|-------|
| Background | `#050505` (darker than `--bg-primary`) |
| Border | `1px solid --border-default` |
| Max height | `300px`, overflow-y scroll |
| Time color | `--text-muted` |
| Agent color | `--color-secondary` (cyan) |
| Message color | `--color-primary` (green) |
| Font | `--font-mono`, `0.8rem` |
| New entry | typing effect, fade-in |
| Auto-scroll | scroll to bottom on new entry |

---

### Mobile Navigation Panel

Hamburger menu → slide-in panel (terminal themed):

```html
<div class="mobile-nav" id="mobile-nav" aria-hidden="true">
  <div class="mobile-nav-header">
    <span class="terminal-prompt">nullshift@labs$ ls /pages/</span>
    <button class="mobile-nav-close" aria-label="Close menu">×</button>
  </div>
  <nav class="mobile-nav-links">
    <a href="/" class="mobile-nav-link">drwxr-xr-x  index.html</a>
    <a href="/services.html" class="mobile-nav-link">drwxr-xr-x  services.html</a>
    <a href="/products.html" class="mobile-nav-link">drwxr-xr-x  products.html</a>
    <a href="/agents.html" class="mobile-nav-link">drwxr-xr-x  agents.html</a>
    <a href="/blog.html" class="mobile-nav-link">drwxr-xr-x  blog.html</a>
    <a href="/projects.html" class="mobile-nav-link">drwxr-xr-x  projects.html</a>
  </nav>
  <div class="mobile-nav-footer">
    <span class="terminal-prompt">$ echo "Built by one."</span>
  </div>
</div>
```

| Property | Value |
|----------|-------|
| Position | fixed, full screen overlay |
| Background | `--bg-primary` with `0.95` opacity |
| Z-index | `1001` (above navbar) |
| Slide | from right, `transform: translateX(100%)` → `translateX(0)` |
| Transition | `0.3s ease` |
| Link style | `--font-mono`, `1.1rem`, `--text-secondary`, terminal `ls` format |
| Active link | `--color-primary` |
| Hover | `--text-primary`, background `--bg-surface` |
| Backdrop | dark overlay behind panel |

---

### Footer

```html
<footer class="footer">
  <div class="container">
    <div class="footer-terminal">
      <span class="terminal-prompt">
        <span class="terminal-user">nullshift</span>
        <span class="terminal-separator">@</span>
        <span class="terminal-host">labs</span>
        <span class="terminal-dollar">$</span>
        <span class="terminal-command">echo "Built by one. Powered by agents."</span>
      </span>
    </div>
    <div class="footer-links">
      <a href="https://github.com/nullshift" class="footer-link" aria-label="GitHub">
        <!-- GitHub SVG icon -->
      </a>
      <a href="https://x.com/nullshift" class="footer-link" aria-label="X/Twitter">
        <!-- X SVG icon -->
      </a>
      <a href="https://t.me/nullshift" class="footer-link" aria-label="Telegram">
        <!-- Telegram SVG icon -->
      </a>
    </div>
    <p class="footer-copy">© 2024 NullShift | nullshift.sh</p>
  </div>
</footer>
```

| Property | Value |
|----------|-------|
| Background | `--bg-primary` |
| Border-top | `1px solid --border-default` |
| Padding | `var(--space-xl) 0` |
| Text align | center |
| Terminal prompt | same style as hero prompts |
| Link icons | `24x24`, `--text-muted`, hover `--color-primary` |
| Copy text | `--font-mono`, `0.75rem`, `--text-muted` |
| Spacing | `var(--space-md)` between sections |

---

## Missing Glow Tokens

Bổ sung vào `variables.css` — amber và purple glow cho Blockchain và ZK pillars:

```css
:root {
  /* Existing */
  --glow-green: 0 0 20px rgba(0, 255, 65, 0.3);
  --glow-cyan: 0 0 20px rgba(0, 255, 255, 0.3);
  --glow-pink: 0 0 20px rgba(255, 0, 128, 0.3);

  /* NEW — Blockchain + ZK */
  --glow-amber: 0 0 20px rgba(255, 170, 0, 0.3);
  --glow-purple: 0 0 20px rgba(168, 85, 247, 0.3);
}
```

Pillar-to-glow mapping:

| Pillar | Glow Token |
|--------|------------|
| Privacy | `--glow-pink` |
| AI | `--glow-cyan` |
| Blockchain | `--glow-amber` |
| ZK Proofs | `--glow-purple` |
