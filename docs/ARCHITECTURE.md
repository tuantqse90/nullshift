# Architecture — NullShift

```
$ cat /docs/architecture.md
```

---

## Overview

NullShift là một static website thuần túy, không sử dụng framework hay build tool. Toàn bộ website được xây dựng trên HTML5, CSS3, và Vanilla JavaScript.

```
┌─────────────────────────────────────────────────────────┐
│                      Browser                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │  HTML     │  │  CSS     │  │  JS      │              │
│  │  Pages    │──│  Styles  │──│  Effects  │             │
│  └────┬─────┘  └──────────┘  └────┬─────┘              │
│       │                           │                     │
│       ▼                           ▼                     │
│  ┌──────────┐              ┌──────────┐                 │
│  │  JSON    │              │  Canvas   │                 │
│  │  Data    │              │  API      │                 │
│  └──────────┘              └──────────┘                 │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│                Express Static Server                    │
│                   (server.js)                           │
│                   PORT: 3000                            │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│                    Railway                              │
│              (Production Host)                          │
│           nullshift.sh (CNAME)                          │
└─────────────────────────────────────────────────────────┘
```

---

## Kiến trúc tổng quan

### Tầng 1: Presentation (HTML)

6 trang HTML độc lập, mỗi trang là một document hoàn chỉnh:

```
index.html ─────── Landing page, hero, pillars preview, featured projects
services.html ──── 4 pillar sections chi tiết
products.html ──── Product showcase với filter
agents.html ────── Agent workflow graph + terminal log
blog.html ──────── Blog listing với tag filter
projects.html ──── Project portfolio với filter
```

Mỗi trang share chung:
- Navbar component (fixed top)
- Footer component
- CSS design system
- `main.js` (global behaviors)

### Tầng 2: Styling (CSS)

CSS được tổ chức theo mô hình **layered architecture**:

```
Layer 1: reset.css        → Browser normalize
Layer 2: variables.css    → Design tokens (single source of truth)
Layer 3: global.css       → Base styles, typography, layout utilities
Layer 4: components.css   → Reusable UI components
Layer 5: animations.css   → Keyframes, transitions
Layer 6: [page].css       → Page-specific overrides
```

**Load order quan trọng** — mỗi layer xây trên layer trước. Tất cả CSS files được load theo thứ tự trong `<head>` của mỗi trang HTML.

### Tầng 3: Behavior (JavaScript)

```
main.js ─────────── Global: navbar toggle, smooth scroll, active page highlight
effects.js ──────── Matrix rain, glitch text, typing effect, scanlines
particles.js ────── Floating particle system (canvas)
agents-graph.js ─── Interactive workflow graph (canvas/SVG)
filter.js ───────── Client-side filtering cho products/projects
blog-data.js ────── Blog data loader + markdown renderer
```

**Không có module bundler.** Tất cả JS files được load bằng `<script>` tags ở cuối `<body>`. Thứ tự load:

```html
<script src="js/main.js"></script>
<script src="js/effects.js"></script>
<!-- Page-specific scripts -->
<script src="js/particles.js"></script>    <!-- services, agents -->
<script src="js/filter.js"></script>        <!-- products, projects -->
<script src="js/agents-graph.js"></script>  <!-- agents only -->
<script src="js/blog-data.js"></script>     <!-- blog only -->
```

### Tầng 4: Data (JSON)

Content được tách riêng khỏi markup, lưu trong JSON files:

```
data/
├── projects.json      → Project portfolio entries
├── products.json      → Product showcase entries
├── agents.json        → Agent nodes + connections
└── blog-posts.json    → Blog posts (với markdown content)
```

Data được fetch bằng `fetch()` API và render client-side bằng JS DOM manipulation.

---

## Data Flow

### Page Load Flow

```
1. Browser requests HTML page
2. HTML loads CSS files (render-blocking)
3. Fonts loaded (Google Fonts, preload)
4. HTML body renders
5. JS scripts execute (bottom of body)
6. main.js: init navbar, scroll listeners
7. effects.js: start canvas animations
8. Page-specific JS: fetch JSON data → render cards/content
```

### Filter Flow (Products/Projects)

```
User clicks filter tag
        │
        ▼
filter.js captures click event
        │
        ▼
Read current filter state (pillar + status)
        │
        ▼
Filter in-memory data array
        │
        ▼
Re-render card grid with filtered results
        │
        ▼
Update active filter UI state
```

### Agent Graph Interaction

```
Canvas renders agent nodes + edges
        │
        ▼
User clicks on a node
        │
        ▼
Hit detection: find clicked node
        │
        ▼
Render detail panel (slide in)
        │
        ▼
Show: role, tools, status, connections
        │
        ▼
Highlight connected edges (animated)
```

### Blog Render Flow

```
fetch('data/blog-posts.json')
        │
        ▼
Parse JSON array
        │
        ▼
Render listing (title, date, excerpt, tags)
        │
        ▼
User clicks post
        │
        ▼
Parse markdown content → HTML
        │
        ▼
Render full post in-page (or separate view)
```

---

## CSS Architecture

### Design Tokens (`variables.css`)

Single source of truth cho tất cả visual values:

```
Colors ──── Brand colors, backgrounds, text, borders, pillar colors
Fonts ───── Font families, fallback stacks
Spacing ─── Consistent spacing scale
Shadows ─── Glow effects per color
Borders ─── Border widths, radius values
Z-index ─── Layering scale (navbar, modals, overlays)
```

Mọi CSS rule tham chiếu đến tokens qua `var(--token-name)`. Không hardcode color/font values.

### Component Pattern

Mỗi component trong `components.css` theo pattern:

```css
/* Block */
.hacker-card { }

/* Element */
.hacker-card .card-header { }
.hacker-card .card-title { }
.hacker-card .card-footer { }

/* Modifier via data attribute */
.hacker-card[data-pillar="privacy"] { }
.hacker-card[data-pillar="ai"] { }

/* State */
.hacker-card:hover { }
.hacker-card.is-active { }
```

### Responsive Strategy

Mobile-first approach:

```css
/* Base: mobile (< 640px) */
.card-grid { grid-template-columns: 1fr; }

/* sm: 640px */
@media (min-width: 640px) {
  .card-grid { grid-template-columns: repeat(2, 1fr); }
}

/* lg: 1024px */
@media (min-width: 1024px) {
  .card-grid { grid-template-columns: repeat(3, 1fr); }
}
```

---

## Canvas Effects Architecture

### Performance Model

```
requestAnimationFrame loop
        │
        ▼
Check: Is tab visible? (document.hidden)
        │
        ├── YES (hidden) → Skip frame, return
        │
        └── NO (visible) → Continue
                │
                ▼
        Check: Is canvas in viewport? (IntersectionObserver)
                │
                ├── NO → Skip frame
                │
                └── YES → Render frame
                        │
                        ▼
                Clear canvas → Update state → Draw
```

### Matrix Rain Architecture

```
MatrixRain class
├── constructor(canvas)
│   ├── Set canvas dimensions (resize listener)
│   ├── Init columns array (screen width / font size)
│   └── Fill with random starting positions
├── draw()
│   ├── Semi-transparent black overlay (fade effect)
│   ├── For each column:
│   │   ├── Pick random character (katakana, latin, digits)
│   │   ├── Draw character at column position
│   │   └── Reset column if past bottom (random chance)
│   └── requestAnimationFrame(draw)
├── resize()
│   └── Recalculate columns on window resize
└── destroy()
    └── Cancel animation frame, cleanup
```

### Particle System Architecture

```
ParticleSystem class
├── particles[] — Array of {x, y, vx, vy, radius}
├── update()
│   ├── Move each particle by velocity
│   ├── Bounce off edges
│   └── Calculate distances between pairs
├── draw()
│   ├── Draw particle dots
│   └── Draw connecting lines (opacity by distance)
└── Performance: limit to ~80 particles, skip when hidden
```

---

## Server Architecture

### Express Static Server (`server.js`)

```
Request
   │
   ▼
express.static() middleware
   │
   ├── File exists → Serve file (HTML, CSS, JS, JSON, images)
   │
   └── File not found → Fallback to index.html (SPA-like behavior)
```

Server chỉ làm 1 việc: serve static files. Không có API endpoints, không có server-side logic.

---

## Security Considerations

- **No server-side code** — Không có API để attack
- **No database** — Không có SQL injection surface
- **No user input** — Không có form submissions, không có XSS surface
- **No cookies/tracking** — Không có session management
- **No third-party scripts** — Chỉ Google Fonts (external)
- **CSP headers** — Có thể thêm Content-Security-Policy qua Express middleware
- **HTTPS** — Railway auto-provision SSL certificate

---

## Scalability

Vì là static site:

- **CDN-ready** — Có thể đặt trước Cloudflare/CloudFront
- **Edge caching** — HTML/CSS/JS cache tại edge nodes
- **Zero server load** — Không có database queries, không có server rendering
- **Horizontal scaling** — Không cần, static files serve từ CDN

Nếu cần dynamic features trong tương lai:
- Blog comments → Embed Disqus hoặc Giscus (GitHub Discussions)
- Contact form → Formspree hoặc serverless function
- Analytics → Privacy-respecting: Plausible, Umami (self-hosted)
