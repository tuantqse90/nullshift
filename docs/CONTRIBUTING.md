# Contributing — NullShift

```
$ cat /docs/contributing.md
```

---

## Philosophy

NullShift là solo builder project. Code contributions được welcome nhưng phải follow các nguyên tắc core:

- **No frameworks** — Pure HTML/CSS/JS only
- **No build tools** — Website phải work khi mở trực tiếp `index.html`
- **Privacy first** — Không tracking, không analytics invasive, không third-party scripts
- **Dark only** — Không light mode
- **Keep it simple** — Minimal complexity, minimal dependencies

---

## Getting Started

### 1. Fork & Clone

```bash
git clone https://github.com/<your-username>/nullshift.git
cd nullshift
npm install
```

### 2. Run locally

```bash
npm start
# → http://localhost:3000
```

Hoặc mở `index.html` trực tiếp trong browser.

### 3. Make changes

Edit files trực tiếp. Không cần build step.

### 4. Test

- Mở tất cả 6 pages, verify navigation
- Test responsive trên mobile viewport (DevTools)
- Check console cho JS errors
- Verify canvas effects render và không lag

---

## Code Style

### HTML

- Semantic tags: `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`
- ARIA labels trên interactive elements
- Indent: 2 spaces
- Attributes: double quotes
- Self-closing tags: `<img />`, `<br />`

### CSS

- Sử dụng CSS custom properties từ `variables.css`
- Không hardcode colors, fonts, spacing
- BEM-like naming: `.block`, `.block-element`, `.block--modifier`
- Mobile-first media queries
- Indent: 2 spaces

```css
/* Good */
.hacker-card {
  background: var(--bg-card);
  border: 1px solid var(--border-default);
}

/* Bad */
.hacker-card {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
}
```

### JavaScript

- Vanilla JS only (no jQuery, no lodash)
- `const` by default, `let` when mutation needed, never `var`
- Arrow functions for callbacks
- Template literals for string interpolation
- `fetch()` for data loading (no XMLHttpRequest)
- `requestAnimationFrame` for animations (no `setInterval`)

```js
// Good
const loadData = async () => {
  const response = await fetch('data/products.json');
  const products = await response.json();
  renderProducts(products);
};

// Bad
function loadData() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'data/products.json');
  // ...
}
```

### JSON Data

- 2-space indent
- `snake_case` for keys
- Consistent schema per data type
- No trailing commas

---

## Project Structure Rules

### Adding a new page

1. Create `newpage.html` in root
2. Create `css/newpage.css` for page-specific styles
3. Create `js/newpage.js` if page-specific JS needed
4. Add nav link in **all** HTML files' navbar
5. Add data file in `data/` if needed

### Adding a component

1. Add styles to `css/components.css`
2. Follow existing naming patterns
3. Document the HTML structure in this file or inline

### Adding an effect

1. Add to `js/effects.js` or create specific file
2. Must include:
   - `requestAnimationFrame` (not `setInterval`)
   - Visibility check (`document.hidden`)
   - Viewport check (`IntersectionObserver`)
   - `prefers-reduced-motion` respect
   - `destroy()` cleanup method

### Modifying content

1. Edit JSON files in `data/`
2. Do NOT hardcode content in HTML

---

## Git Workflow

### Branch Naming

```
feature/add-search-page
fix/mobile-navbar-overflow
improve/matrix-rain-performance
docs/update-readme
```

### Commit Messages

Format: `type: short description`

Types:
- `feat:` — New feature
- `fix:` — Bug fix
- `improve:` — Performance or UX improvement
- `style:` — CSS changes, visual updates
- `docs:` — Documentation
- `refactor:` — Code restructuring
- `data:` — JSON data updates

Examples:
```
feat: add search functionality to blog page
fix: mobile hamburger menu not closing on link click
improve: reduce particle count on low-end devices
style: update card hover glow intensity
data: add new project entry for privacy wallet
```

### Pull Request

1. Create branch from `main`
2. Make changes
3. Test all pages (desktop + mobile)
4. Push branch
5. Open PR with description:
   - What changed
   - Why
   - Screenshots (if visual changes)
   - Testing done

---

## Content Guidelines

### Tone

- Technical, direct, no fluff
- Terminal/hacker aesthetic in copy
- Use command-line metaphors
- Aggressive but professional

### Text Examples

```
Good: "Agents that never sleep."
Bad:  "Our amazing AI-powered solution suite."

Good: "> Execute"
Bad:  "Click here to get started!"

Good: "Trust the code, not the middleman."
Bad:  "We provide decentralized solutions for enterprises."
```

### Status Tags

Use consistently:
- `[LIVE]` — Deployed and running
- `[BUILDING]` — In active development
- `[CONCEPT]` — Planned, not started

---

## Reporting Issues

Open a GitHub issue with:

1. **Description** — What's broken or what you want
2. **Steps to reproduce** — For bugs
3. **Expected vs actual** — What should happen vs what happens
4. **Browser/device** — Chrome/Firefox/Safari, desktop/mobile
5. **Screenshots** — If visual issue

---

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.
