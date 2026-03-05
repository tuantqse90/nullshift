# JS Modules — NullShift

```
$ cat /docs/js-modules.md
```

Tất cả JavaScript files nằm trong `js/`. Không có module bundler — load bằng `<script>` tags ở cuối `<body>`.

---

## Load Order

```html
<!-- Global (tất cả pages) -->
<script src="js/main.js"></script>
<script src="js/effects.js"></script>

<!-- Page-specific -->
<script src="js/particles.js"></script>      <!-- home, services, agents -->
<script src="js/filter.js"></script>          <!-- products, projects, blog -->
<script src="js/agents-graph.js"></script>    <!-- agents only -->
<script src="js/blog-data.js"></script>       <!-- blog only -->
```

**Quan trọng:** `main.js` phải load trước vì các module khác có thể depend vào DOM state mà `main.js` đã setup (navbar, scroll listeners).

---

## main.js — Global Behaviors

Chạy trên tất cả 6 pages. Handle navbar, scroll, và page-level initialization.

### Functions

| Function | Description |
|----------|-------------|
| `initNavbar()` | Setup hamburger toggle, mobile nav panel, active page highlight |
| `initSmoothScroll()` | Smooth scroll cho anchor links (`<a href="#section">`) |
| `highlightActivePage()` | Check `window.location.pathname` → add `.active` class cho nav link tương ứng |
| `initScrollAnimations()` | Setup IntersectionObserver cho fade-in-up animations on scroll |

### Navbar Logic

```
DOMContentLoaded
    │
    ▼
initNavbar()
    ├── Query: .nav-hamburger, #mobile-nav
    ├── Hamburger click → toggle .is-open on mobile nav
    ├── Close button click → remove .is-open
    ├── Click outside panel → remove .is-open
    ├── Escape key → remove .is-open
    └── Set aria-hidden, aria-expanded attributes
```

### Scroll Animations

```js
// IntersectionObserver cho fade-in-up
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.animate-on-scroll').forEach(el => {
  observer.observe(el);
});
```

### Dependencies

- Không depend vào JS module nào khác
- Tất cả DOM queries chạy sau `DOMContentLoaded`

---

## effects.js — Visual Effects

Canvas-based và CSS-triggered effects. Chạy trên tất cả pages.

### Classes

#### `MatrixRain`

Matrix rain effect cho hero backgrounds.

```
new MatrixRain(canvasElement)
```

| Property | Type | Description |
|----------|------|-------------|
| `canvas` | HTMLCanvasElement | Target canvas |
| `ctx` | CanvasRenderingContext2D | Drawing context |
| `columns` | number[] | Y position của mỗi column |
| `fontSize` | number | Character size (default: `14`) |
| `animationId` | number | requestAnimationFrame ID |
| `isVisible` | boolean | IntersectionObserver state |

| Method | Description |
|--------|-------------|
| `init()` | Calculate columns, setup resize listener, start animation |
| `draw()` | Render 1 frame: black overlay → draw characters → update positions |
| `resize()` | Recalculate columns khi window resize |
| `destroy()` | Cancel animation frame, remove event listeners, clear canvas |

Characters pool:
```js
const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';
```

Performance guards:
- Check `document.hidden` → pause khi tab inactive
- IntersectionObserver → skip draw khi canvas off-screen
- `prefers-reduced-motion` → không khởi tạo

#### `GlitchText`

Text glitch effect khi hover.

```
new GlitchText(element)
```

| Method | Description |
|--------|-------------|
| `init()` | Store original text, add mouseenter listener |
| `glitch()` | Replace chars randomly cho 200ms → resolve to original |
| `destroy()` | Remove event listeners |

Logic:
```
mouseenter
    │
    ▼
Store original text
    │
    ▼
Every 30ms for 200ms:
    ├── Replace random chars with: !@#$%^&*()_+-=
    └── After 200ms → restore original text
```

#### `TypingEffect`

Sequential typing animation.

```
new TypingEffect(element, text, speed)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `element` | HTMLElement | — | Target element |
| `text` | string | — | Text to type |
| `speed` | number | `50` | Ms per character |

| Method | Description |
|--------|-------------|
| `start()` | Begin typing animation |
| `typeChar()` | Add 1 character, schedule next via requestAnimationFrame |

### Standalone Functions

| Function | Description |
|----------|-------------|
| `initGlitchEffects()` | Query all `.glitch-hover` elements → create GlitchText instances |
| `initTypingEffects()` | Query all `.typing-effect` elements → create TypingEffect instances |
| `initScanlines()` | Add CRT scanline overlay (`::after` pseudo, CSS-only) |

### Performance

Tất cả canvas effects phải check:

```js
// Check reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) return;

// Pause when tab hidden
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    cancelAnimationFrame(animationId);
  } else {
    animationId = requestAnimationFrame(draw);
  }
});
```

---

## particles.js — Particle System

Floating connected particles background. Dùng trên home (hero), services, agents pages.

### Class: `ParticleSystem`

```
new ParticleSystem(canvasElement, options)
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `count` | number | `80` | Số particles |
| `color` | string | `'#00ff41'` | Particle color |
| `lineColor` | string | `'rgba(0, 255, 65, 0.1)'` | Connection line color |
| `maxDistance` | number | `150` | Max distance cho connection lines |
| `speed` | number | `0.5` | Particle velocity |
| `radius` | number | `2` | Particle radius |

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `particles` | Particle[] | Array of `{x, y, vx, vy, radius}` |
| `canvas` | HTMLCanvasElement | Target canvas |
| `ctx` | CanvasRenderingContext2D | Drawing context |
| `animationId` | number | requestAnimationFrame ID |
| `isVisible` | boolean | IntersectionObserver state |

#### Methods

| Method | Description |
|--------|-------------|
| `init()` | Create particles, setup observers, start loop |
| `createParticles()` | Generate random particles within canvas bounds |
| `update()` | Move particles, bounce off edges |
| `drawParticles()` | Render dots |
| `drawConnections()` | Draw lines between nearby particles (opacity by distance) |
| `animate()` | Main loop: update → drawParticles → drawConnections |
| `resize()` | Recalculate bounds, reposition out-of-bounds particles |
| `destroy()` | Cancel animation, remove listeners |

#### Animation Loop

```
requestAnimationFrame
    │
    ▼
Check document.hidden → skip if hidden
    │
    ▼
Check IntersectionObserver → skip if off-screen
    │
    ▼
Clear canvas
    │
    ▼
update(): move particles by velocity, bounce off walls
    │
    ▼
drawConnections(): for each pair, if distance < maxDistance → draw line
    │
    ▼
drawParticles(): draw circles
    │
    ▼
Next frame
```

#### Performance Notes

- Limit `count` to `80` max (giảm xuống `40` trên mobile)
- Connection calculation là O(n²) — keep particle count low
- Skip frames khi tab hidden hoặc canvas off-screen
- Detect mobile: `window.innerWidth < 768` → halve particle count

---

## filter.js — Client-Side Filtering

Filtering logic cho products, projects, và blog pages.

### Functions

| Function | Description |
|----------|-------------|
| `initFilters(dataUrl, renderFn)` | Main init: fetch data, setup filter listeners, render |
| `fetchData(url)` | Fetch JSON data, return array |
| `applyFilters(data, filters)` | Filter array by active pillar + status |
| `renderCards(container, items, templateFn)` | Clear container, render filtered items |
| `updateFilterUI(activeFilters)` | Toggle `.active` class on filter buttons |

### Filter State

```js
const filterState = {
  pillar: 'all',    // 'all' | 'privacy' | 'ai' | 'blockchain' | 'zk'
  status: 'all',    // 'all' | 'live' | 'building' | 'concept'
  tag: 'all'        // Blog only: 'all' | tag string
};
```

### Flow

```
Page load
    │
    ▼
initFilters('data/products.json', renderProductCard)
    │
    ├── fetch() → parse JSON → store in memory
    │
    ├── Setup click listeners on .filter-tag buttons
    │
    └── Initial render (all items)

User clicks filter tag
    │
    ▼
Update filterState
    │
    ▼
applyFilters(allData, filterState)
    │
    ▼
renderCards(container, filteredData, templateFn)
    │
    ▼
updateFilterUI(filterState)
```

### Filter Logic

```js
const applyFilters = (data, filters) => {
  return data.filter(item => {
    const pillarMatch = filters.pillar === 'all'
      || item.pillars.includes(filters.pillar)
      || item.pillar === filters.pillar;  // blog posts use singular

    const statusMatch = filters.status === 'all'
      || item.status === filters.status;

    return pillarMatch && statusMatch;
  });
};
```

### Card Template Functions

Mỗi page truyền render function riêng:

- **Products:** `renderProductCard(product)` → hacker-card với tech stack, status, links
- **Projects:** `renderProjectCard(project)` → hacker-card với thumbnail, tech stack, featured badge
- **Blog:** `renderBlogCard(post)` → blog-card với date, excerpt, tags

### Usage Example

```js
// products.html
document.addEventListener('DOMContentLoaded', () => {
  initFilters('data/products.json', renderProductCard);
});

const renderProductCard = (product) => {
  const card = document.createElement('div');
  card.className = 'hacker-card';
  card.setAttribute('data-pillar', product.pillars[0]);
  card.innerHTML = `
    <div class="card-header">
      <span class="status-tag status-${product.status}">[${product.status.toUpperCase()}]</span>
    </div>
    <h3 class="card-title glitch-hover">${product.name}</h3>
    <p class="card-desc">${product.description}</p>
    <div class="card-tech-stack">
      ${product.tech_stack.map(t => `<span class="tech-tag">${t}</span>`).join('')}
    </div>
    <div class="card-footer">
      ${product.demo_url ? `<a href="${product.demo_url}" class="card-link">> View Demo</a>` : ''}
      ${product.repo_url ? `<a href="${product.repo_url}" class="card-link">> Source</a>` : ''}
    </div>
  `;
  return card;
};
```

---

## agents-graph.js — Agent Workflow Graph

Interactive workflow graph cho agents page. Canvas-based.

### Class: `AgentGraph`

```
new AgentGraph(canvasElement)
```

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `canvas` | HTMLCanvasElement | Canvas element |
| `ctx` | CanvasRenderingContext2D | Drawing context |
| `agents` | Agent[] | Parsed from `data/agents.json` |
| `edges` | Edge[] | Calculated from `connections` |
| `selectedAgent` | Agent \| null | Currently selected node |
| `hoveredAgent` | Agent \| null | Currently hovered node |
| `animationId` | number | requestAnimationFrame ID |
| `edgeFlowOffset` | number | Animated dash offset |

#### Methods

| Method | Description |
|--------|-------------|
| `init()` | Fetch agents data, calculate edges, setup listeners, start render |
| `calculateEdges()` | Convert `connections` arrays → edge objects `{from, to}` |
| `draw()` | Main render: clear → drawEdges → drawNodes → drawLabels |
| `drawNode(agent)` | Draw circle/hexagon + status indicator |
| `drawEdge(edge)` | Draw dashed line with animated flow + arrow |
| `drawLabel(agent)` | Draw agent name below node |
| `handleClick(event)` | Hit detection → select agent → show detail panel |
| `handleMouseMove(event)` | Hit detection → update cursor, hover state |
| `hitTest(x, y)` | Return agent if point inside node radius, else null |
| `showDetailPanel(agent)` | Populate + slide-in `.agent-panel` |
| `hideDetailPanel()` | Slide-out `.agent-panel` |
| `resize()` | Scale positions to canvas size |
| `destroy()` | Cleanup animation, listeners |

#### Edge Animation

```
requestAnimationFrame loop:
    │
    ▼
Increment edgeFlowOffset += 0.5
    │
    ▼
ctx.setLineDash([5, 5])
ctx.lineDashOffset = -edgeFlowOffset
    │
    ▼
Draw dashed line from source.position → target.position
    │
    ▼
Draw arrowhead at target end
```

#### Hit Detection

```js
const hitTest = (mouseX, mouseY) => {
  const nodeRadius = 30;
  for (const agent of agents) {
    const dx = mouseX - agent.position.x;
    const dy = mouseY - agent.position.y;
    if (dx * dx + dy * dy <= nodeRadius * nodeRadius) {
      return agent;
    }
  }
  return null;
};
```

#### Mobile Fallback

Khi `window.innerWidth < 768`:
- Không render canvas graph
- Render agent list view (HTML cards) thay thế
- Mỗi agent card hiển thị: name, role, status, tools, connections

```js
const isMobile = window.innerWidth < 768;
if (isMobile) {
  renderAgentList(agents);
} else {
  const graph = new AgentGraph(canvas);
  graph.init();
}
```

---

## blog-data.js — Blog Data & Markdown Renderer

Fetch blog posts, render listing, parse markdown cho full post view.

### Functions

| Function | Description |
|----------|-------------|
| `initBlog()` | Fetch blog data, render listing, setup post navigation |
| `fetchBlogPosts()` | Fetch `data/blog-posts.json`, sort by date descending |
| `renderBlogListing(posts)` | Render blog cards in grid |
| `renderBlogPost(post)` | Parse markdown → HTML, render full post view |
| `parseMarkdown(content)` | Convert markdown string → HTML string |
| `handlePostClick(slug)` | Switch from listing view → post view |
| `handleBackClick()` | Switch from post view → listing view |

### Markdown Parser

Lightweight client-side markdown → HTML converter. Không dùng third-party library.

#### Supported Elements

| Markdown | Regex | HTML Output |
|----------|-------|-------------|
| `# Heading` | `/^# (.+)$/gm` | `<h1>` |
| `## Heading` | `/^## (.+)$/gm` | `<h2>` |
| `### Heading` | `/^### (.+)$/gm` | `<h3>` |
| `**bold**` | `/\*\*(.+?)\*\*/g` | `<strong>` |
| `*italic*` | `/\*(.+?)\*/g` | `<em>` |
| `` `code` `` | `/`(.+?)`/g` | `<code>` |
| `[text](url)` | `/\[(.+?)\]\((.+?)\)/g` | `<a href>` |
| `![alt](src)` | `/!\[(.+?)\]\((.+?)\)/g` | `<img>` |
| `> quote` | `/^> (.+)$/gm` | `<blockquote>` |
| `- item` | Group consecutive | `<ul><li>` |
| ` ```lang ` | Group between fences | `<pre><code>` |
| Empty line | `/^\s*$/` | Paragraph break |

#### Security

**Quan trọng:** Markdown content được inject vào DOM. Phải sanitize:

```js
const sanitize = (str) => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};
```

- Sanitize raw text trước khi parse markdown
- Chỉ cho phép safe HTML tags sau khi parse
- Không eval() hoặc innerHTML từ untrusted sources
- Links: chỉ cho phép `https://` URLs, block `javascript:` protocol

#### Parse Flow

```
Raw markdown string
    │
    ▼
Sanitize HTML entities
    │
    ▼
Extract code blocks (preserve raw content)
    │
    ▼
Parse block elements (headings, blockquotes, lists)
    │
    ▼
Parse inline elements (bold, italic, code, links, images)
    │
    ▼
Wrap remaining text in <p> tags
    │
    ▼
Restore code blocks
    │
    ▼
Return HTML string
```

### Blog Navigation

```
Blog listing view                    Blog post view
┌─────────────────────┐             ┌─────────────────────┐
│ [Card] [Card] [Card]│  click →    │ < Back to blog      │
│ [Card] [Card] [Card]│             │ # Post Title        │
│                     │  ← back     │ Full content...     │
└─────────────────────┘             └─────────────────────┘
```

State management:
```js
// URL hash based navigation
// #listing → show blog list
// #post/slug-name → show specific post

window.addEventListener('hashchange', () => {
  const hash = window.location.hash;
  if (hash.startsWith('#post/')) {
    const slug = hash.replace('#post/', '');
    renderBlogPost(slug);
  } else {
    renderBlogListing();
  }
});
```

---

## Coding Conventions

### Tất cả modules tuân theo:

- `const` by default, `let` khi cần reassign, **never** `var`
- Arrow functions cho callbacks
- `fetch()` cho data loading, never XMLHttpRequest
- `requestAnimationFrame` cho animations, never `setInterval`
- Template literals cho HTML generation
- `querySelector` / `querySelectorAll` cho DOM queries
- Event delegation khi possible (attach listener to parent)
- Mỗi class/effect phải có `destroy()` method cho cleanup

### Error Handling

```js
const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`[nullshift] Failed to load ${url}:`, error);
    return [];
  }
};
```

### DOM Ready Pattern

```js
document.addEventListener('DOMContentLoaded', () => {
  // All initialization here
});
```
