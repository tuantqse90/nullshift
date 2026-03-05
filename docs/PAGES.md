# Pages — NullShift

```
$ cat /docs/pages.md
```

6 trang HTML độc lập. Mỗi trang là một document hoàn chỉnh, share chung navbar, footer, và design system.

---

## Shared Structure

Tất cả pages follow template này:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Page-specific description">
  <meta name="theme-color" content="#0a0a0a">

  <!-- Open Graph -->
  <meta property="og:title" content="Page Title — NullShift">
  <meta property="og:description" content="Page description">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://nullshift.sh/page.html">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Page Title — NullShift">

  <title>Page Title — NullShift</title>

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">

  <!-- CSS (load order matters) -->
  <link rel="stylesheet" href="css/reset.css">
  <link rel="stylesheet" href="css/variables.css">
  <link rel="stylesheet" href="css/global.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/animations.css">
  <link rel="stylesheet" href="css/[page].css">
</head>
<body>
  <!-- Navbar -->
  <nav class="navbar">...</nav>

  <!-- Mobile Nav Panel -->
  <div class="mobile-nav" id="mobile-nav" aria-hidden="true">...</div>

  <!-- Main Content -->
  <main>
    <!-- Page sections here -->
  </main>

  <!-- Footer -->
  <footer class="footer">...</footer>

  <!-- JS (load order matters) -->
  <script src="js/main.js"></script>
  <script src="js/effects.js"></script>
  <!-- Page-specific scripts -->
</body>
</html>
```

---

## 1. Home / Landing (`index.html`)

### Mục đích
Landing page. First impression — dark, aggressive, cyberpunk. Giới thiệu NullShift và 4 pillars.

### Sections

| Section | Class/ID | Description |
|---------|----------|-------------|
| Hero | `.hero` | Fullscreen, matrix rain background, glitch title, typing effects |
| Pillars Preview | `.pillars-section` | 4 pillar cards ngang hàng |
| Featured Projects | `.featured-section` | 3 project cards từ `data/projects.json` (featured: true) |
| Terminal CTA | `.terminal-cta` | Fake terminal window với contact links |
| Footer | `.footer` | Shared footer |

### Hero Content

```
$ nullshift.sh

[Glitch animation] NULLSHIFT

From null to reality — privacy first, agents always.

> Initializing privacy protocols...     ← typing effect, sequential
> Loading AI agents...
> Connecting to blockchain...
> ZK proofs verified.
> System ready.

[> Enter the Void]  [> View Projects]   ← buttons
```

### Data Sources

| Data | Source | Usage |
|------|--------|-------|
| Featured projects | `data/projects.json` | Filter `featured: true`, render 3 cards |
| Latest blog posts | `data/blog-posts.json` | Optional: show latest 3 posts |

### Required CSS
`css/home.css`

### Required JS
```html
<script src="js/main.js"></script>
<script src="js/effects.js"></script>
<script src="js/particles.js"></script>
```

### Effects
- Matrix rain canvas (hero background)
- Glitch text (title)
- Typing effect (hero command lines)
- CRT scanline overlay
- Particle system (subtle, behind pillars section)
- Fade-in-up on scroll (cards, sections)

---

## 2. Core Services (`services.html`)

### Mục đích
Chi tiết 4 core pillars: Privacy, AI, Blockchain, ZK Proofs.

### Sections

| Section | Class/ID | Description |
|---------|----------|-------------|
| Hero | `.page-hero` | Terminal prompt header |
| Privacy | `#privacy` | Full-width pillar section |
| AI | `#ai` | Full-width pillar section |
| Blockchain | `#blockchain` | Full-width pillar section |
| ZK Proofs | `#zk` | Full-width pillar section |

### Hero Content

```
$ cat /protocols/core.md
## Core Protocols
> The 4 pillars that power everything we build.
```

### Pillar Section Layout

Mỗi pillar section chiếm gần full viewport:

```
┌──────────────────────────────────────────────────┐
│ [Number]  PILLAR NAME                             │
│ ─────────────────────                             │
│ "Tagline quote"                                   │
│                                                   │
│ Extended description paragraph.                   │
│                                                   │
│ > Feature point 1                                 │
│ > Feature point 2                                 │
│ > Feature point 3                                 │
│ > Feature point 4                                 │
│                                                   │
│ [Related products →]                              │
└──────────────────────────────────────────────────┘
```

Visual differentiation:
| Pillar | Number | Border-left | Accent |
|--------|--------|-------------|--------|
| Privacy | `[01]` | `--pillar-privacy` (#ff0080) | Pink |
| AI | `[02]` | `--pillar-ai` (#00ffff) | Cyan |
| Blockchain | `[03]` | `--pillar-blockchain` (#ffaa00) | Amber |
| ZK Proofs | `[04]` | `--pillar-zk` (#a855f7) | Purple |

### Data Sources
Không fetch data. Content hardcoded trong HTML (static pillar descriptions).

### Required CSS
`css/services.css`

### Required JS
```html
<script src="js/main.js"></script>
<script src="js/effects.js"></script>
<script src="js/particles.js"></script>
```

### Effects
- Particle background
- Fade-in-up on scroll (mỗi pillar section)
- Pillar border glow on viewport enter

---

## 3. Products (`products.html`)

### Mục đích
Showcase tất cả products. Filterable by pillar và status.

### Sections

| Section | Class/ID | Description |
|---------|----------|-------------|
| Hero | `.page-hero` | Terminal prompt header |
| Filter Bar | `.filter-bar` | Pillar + status filter buttons |
| Product Grid | `.card-grid` | Hacker cards loaded from JSON |

### Hero Content

```
$ ls /products/ --all
## Products
> Built on top of our core protocols. Filter by pillar.
```

### Filter Bar

```
Pillar:  [ALL] [PRIVACY] [AI] [BLOCKCHAIN] [ZK]
Status:  [ALL] [LIVE] [BUILDING] [CONCEPT]
```

### Card Display

Mỗi product card hiển thị:
- Status tag: `[LIVE]`, `[BUILDING]`, `[CONCEPT]`
- Product name (glitch on hover)
- Description
- Tech stack tags
- Action links: Demo, Docs, Source (chỉ hiện nếu URL không null)

### Data Sources

| Data | Source | Render |
|------|--------|--------|
| Products | `data/products.json` | `filter.js` → hacker-card grid |

### Required CSS
`css/products.css`

### Required JS
```html
<script src="js/main.js"></script>
<script src="js/effects.js"></script>
<script src="js/filter.js"></script>
```

### Responsive
- Mobile: 1 column
- Tablet (≥640px): 2 columns
- Desktop (≥1024px): 3 columns

---

## 4. Workflow & Agents (`agents.html`)

### Mục đích
Visualize agent ecosystem. Interactive workflow graph + fake terminal log.

### Sections

| Section | Class/ID | Description |
|---------|----------|-------------|
| Hero | `.page-hero` | Terminal prompt header |
| Agent Graph | `.agent-graph` | Interactive canvas graph |
| Agent Panel | `.agent-panel` | Slide-in detail panel (hidden default) |
| Terminal Log | `.terminal-log` | Fake live agent activity log |

### Hero Content

```
$ systemctl status nullshift-agents
## Agent Ecosystem
> One builder. Many agents. All autonomous.
```

### Agent Graph

Desktop: Canvas-based interactive graph
- Nodes = agents (circles with status indicators)
- Edges = directed connections (animated dashed lines)
- Click node → show detail panel
- Hover → highlight connections

Mobile: Falls back to card list view (no canvas)

### Terminal Log Feed

Fake live terminal, auto-scrolling agent activity:

```
[2024-03-05 14:23:01] market-scanner  > BTC price alert triggered: $67,234
[2024-03-05 14:23:02] trading-agent   > Analyzing entry position...
[2024-03-05 14:23:05] trading-agent   > Order placed: LONG BTC @ $67,234
[2024-03-05 14:23:06] alert-bot       > Notification sent to Telegram
```

### Data Sources

| Data | Source | Render |
|------|--------|--------|
| Agents | `data/agents.json` | `agents-graph.js` → canvas graph + list fallback |

### Required CSS
`css/agents.css`

### Required JS
```html
<script src="js/main.js"></script>
<script src="js/effects.js"></script>
<script src="js/particles.js"></script>
<script src="js/agents-graph.js"></script>
```

### Notes
- Agent graph canvas phải resize-aware
- Detail panel slide-in from right, close on click outside / Escape
- Terminal log entries có typing effect, auto-scroll to bottom
- `particles.js` cho subtle background behind graph

---

## 5. Blog (`blog.html`)

### Mục đích
Blog listing + full post reader. Tất cả content từ JSON, markdown rendered client-side.

### Sections

| Section | Class/ID | Description |
|---------|----------|-------------|
| Hero | `.page-hero` | Terminal prompt header |
| Filter Tags | `.filter-bar` | Pillar + tag filters |
| Blog Listing | `.blog-listing` | Blog cards (default view) |
| Blog Post | `.blog-post` | Full post reader (hidden default) |

### Hero Content

```
$ tail -f /var/log/nullshift/thoughts.log
## Blog
> Deep dives, tutorials, and field notes from the void.
```

### Filter Tags

```
[ALL] [PRIVACY] [AI] [BLOCKCHAIN] [ZK] [TUTORIALS]
```

Blog filter khác Products/Projects: filter theo `pillar` (singular) và `tags` array.

### Two Views

**Listing View** (default):
- Blog cards in grid (2 columns desktop, 1 mobile)
- Each card: title, date, reading_time, excerpt (2 lines), tags, pillar badge
- Click card → switch to post view

**Post View** (khi click card):
- `< Back to blog` link
- Full post: title, meta (date, reading_time, pillar), rendered markdown content
- URL hash: `#post/slug-name`
- Max width: `720px` centered

### Navigation

```
blog.html              → listing view
blog.html#post/slug    → specific post
```

`hashchange` event handles switching between views.

### Data Sources

| Data | Source | Render |
|------|--------|--------|
| Blog posts | `data/blog-posts.json` | `blog-data.js` → listing + post view |

### Required CSS
`css/blog.css`

### Required JS
```html
<script src="js/main.js"></script>
<script src="js/effects.js"></script>
<script src="js/filter.js"></script>
<script src="js/blog-data.js"></script>
```

### Notes
- `filter.js` handles pillar/tag filtering
- `blog-data.js` handles markdown parsing + post rendering
- Posts sorted by date descending
- Home page reuses `blog-data.js` to show latest 3 posts

---

## 6. Projects (`projects.html`)

### Mục đích
Project portfolio. Tương tự Products nhưng thêm thumbnail và featured badge.

### Sections

| Section | Class/ID | Description |
|---------|----------|-------------|
| Hero | `.page-hero` | Terminal prompt header |
| Filter Bar | `.filter-bar` | Pillar + status filter buttons |
| Project Grid | `.card-grid` | Hacker cards with thumbnails |

### Hero Content

```
$ find /projects -type f | head -20
## Projects
> Everything built from the void. Filter by pillar or status.
```

### Card Display

Giống Products cards nhưng thêm:
- Thumbnail image (hoặc gradient placeholder nếu `thumbnail: null`)
- Featured badge (nếu `featured: true`)

### Data Sources

| Data | Source | Render |
|------|--------|--------|
| Projects | `data/projects.json` | `filter.js` → hacker-card grid |

### Required CSS
`css/projects.css`

### Required JS
```html
<script src="js/main.js"></script>
<script src="js/effects.js"></script>
<script src="js/filter.js"></script>
```

### Responsive
Giống Products page: 1 col → 2 col → 3 col.

---

## Page-Specific CSS Summary

| Page | CSS File | Key Styles |
|------|----------|------------|
| Home | `css/home.css` | Hero fullscreen, matrix rain canvas, typing container, pillar preview cards, CTA terminal |
| Services | `css/services.css` | Pillar sections (full-width, border-left accents), numbered headers |
| Products | `css/products.css` | Card grid layout, filter bar positioning |
| Agents | `css/agents.css` | Graph canvas container, agent panel slide-in, terminal log, mobile list fallback |
| Blog | `css/blog.css` | Blog card layout, post view (max-width 720px), markdown content styles, view transitions |
| Projects | `css/projects.css` | Card grid with thumbnails, featured badge, gradient placeholders |

---

## Script Dependencies Matrix

| Script | index | services | products | agents | blog | projects |
|--------|-------|----------|----------|--------|------|----------|
| `main.js` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `effects.js` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `particles.js` | ✓ | ✓ | — | ✓ | — | — |
| `filter.js` | — | — | ✓ | — | ✓ | ✓ |
| `agents-graph.js` | — | — | — | ✓ | — | — |
| `blog-data.js` | ✓* | — | — | — | ✓ | — |

*`blog-data.js` trên home page chỉ để fetch latest 3 posts cho featured section.

---

## Cross-Page Navigation

Navbar links sử dụng relative paths:

| Link Text | href | Active on |
|-----------|------|-----------|
| `[NullShift]` | `/` hoặc `index.html` | Home |
| `/services` | `services.html` | Services |
| `/products` | `products.html` | Products |
| `/agents` | `agents.html` | Agents |
| `/blog` | `blog.html` | Blog |
| `/projects` | `projects.html` | Projects |

Active page detection trong `main.js`:
```js
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === 'index.html' && href === '/')) {
    link.classList.add('active');
  }
});
```

### Deep Links

- Services: `services.html#privacy`, `services.html#ai`, etc.
- Blog posts: `blog.html#post/slug-name`
- Products/Projects: filter state không persist trong URL (reset on refresh)
