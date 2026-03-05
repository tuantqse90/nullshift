# SEO & Meta Tags — NullShift

```
$ cat /docs/seo.md
```

Mỗi trang cần meta tags đầy đủ cho SEO, Open Graph (Facebook, LinkedIn), và Twitter Card.

---

## Global Meta Tags

Tất cả pages đều có:

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#0a0a0a">
<meta name="robots" content="index, follow">
<meta name="author" content="NullShift">
<link rel="canonical" href="https://nullshift.sh/{page}">
```

---

## Per-Page Meta Tags

### Home (`index.html`)

```html
<title>NullShift — From null to reality</title>
<meta name="description" content="NullShift — Privacy-first builder labs. AI agents, blockchain protocols, and zero-knowledge proofs. One builder. All agents.">

<!-- Open Graph -->
<meta property="og:title" content="NullShift — From null to reality">
<meta property="og:description" content="Privacy-first builder labs. AI agents, blockchain, and zero-knowledge proofs.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://nullshift.sh">
<meta property="og:image" content="https://nullshift.sh/assets/images/og-home.png">
<meta property="og:site_name" content="NullShift">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="NullShift — From null to reality">
<meta name="twitter:description" content="Privacy-first builder labs. AI agents, blockchain, and zero-knowledge proofs.">
<meta name="twitter:image" content="https://nullshift.sh/assets/images/og-home.png">
<meta name="twitter:site" content="@nullshift">
```

---

### Services (`services.html`)

```html
<title>Core Protocols — NullShift</title>
<meta name="description" content="The 4 pillars that power everything we build: Privacy, AI, Blockchain, and Zero-Knowledge Proofs.">

<meta property="og:title" content="Core Protocols — NullShift">
<meta property="og:description" content="Privacy, AI, Blockchain, ZK Proofs — the 4 pillars of NullShift.">
<meta property="og:url" content="https://nullshift.sh/services.html">
<meta property="og:image" content="https://nullshift.sh/assets/images/og-services.png">

<meta name="twitter:title" content="Core Protocols — NullShift">
<meta name="twitter:description" content="Privacy, AI, Blockchain, ZK Proofs — the 4 pillars of NullShift.">
```

---

### Products (`products.html`)

```html
<title>Products — NullShift</title>
<meta name="description" content="Products built on privacy, AI, blockchain, and ZK proofs. Filter by pillar or status.">

<meta property="og:title" content="Products — NullShift">
<meta property="og:description" content="Privacy-first products powered by AI agents and blockchain.">
<meta property="og:url" content="https://nullshift.sh/products.html">
<meta property="og:image" content="https://nullshift.sh/assets/images/og-products.png">

<meta name="twitter:title" content="Products — NullShift">
<meta name="twitter:description" content="Privacy-first products powered by AI agents and blockchain.">
```

---

### Agents (`agents.html`)

```html
<title>Agent Ecosystem — NullShift</title>
<meta name="description" content="One builder. Many agents. All autonomous. Explore the NullShift agent workflow ecosystem.">

<meta property="og:title" content="Agent Ecosystem — NullShift">
<meta property="og:description" content="Autonomous AI agents that scan, trade, create, and alert. One builder, many agents.">
<meta property="og:url" content="https://nullshift.sh/agents.html">
<meta property="og:image" content="https://nullshift.sh/assets/images/og-agents.png">

<meta name="twitter:title" content="Agent Ecosystem — NullShift">
<meta name="twitter:description" content="Autonomous AI agents that scan, trade, create, and alert.">
```

---

### Blog (`blog.html`)

```html
<title>Blog — NullShift</title>
<meta name="description" content="Deep dives, tutorials, and field notes from the void. Privacy, AI, blockchain, and ZK proofs.">

<meta property="og:title" content="Blog — NullShift">
<meta property="og:description" content="Deep dives, tutorials, and field notes on privacy, AI, blockchain, and ZK proofs.">
<meta property="og:url" content="https://nullshift.sh/blog.html">
<meta property="og:image" content="https://nullshift.sh/assets/images/og-blog.png">

<meta name="twitter:title" content="Blog — NullShift">
<meta name="twitter:description" content="Deep dives, tutorials, and field notes from the void.">
```

---

### Projects (`projects.html`)

```html
<title>Projects — NullShift</title>
<meta name="description" content="Project portfolio — everything built from the void. Filter by pillar, status, or technology.">

<meta property="og:title" content="Projects — NullShift">
<meta property="og:description" content="Everything built from the void. Privacy-first projects, AI agents, blockchain protocols.">
<meta property="og:url" content="https://nullshift.sh/projects.html">
<meta property="og:image" content="https://nullshift.sh/assets/images/og-projects.png">

<meta name="twitter:title" content="Projects — NullShift">
<meta name="twitter:description" content="Everything built from the void. Privacy-first projects and tools.">
```

---

## Open Graph Images

Mỗi page cần 1 OG image (`1200x630px`):

| Page | Image Path | Content |
|------|-----------|---------|
| Home | `assets/images/og-home.png` | NullShift logo + tagline trên dark background |
| Services | `assets/images/og-services.png` | 4 pillar icons + "Core Protocols" |
| Products | `assets/images/og-products.png` | Product cards mockup |
| Agents | `assets/images/og-agents.png` | Agent graph mockup |
| Blog | `assets/images/og-blog.png` | Terminal style "Blog" header |
| Projects | `assets/images/og-projects.png` | Project cards mockup |

### OG Image Guidelines

- Dimensions: `1200 x 630` pixels
- Format: PNG
- Background: `#0a0a0a` (dark, matching site)
- Text: `--font-mono` style, green accent color
- Include NullShift branding (logo + domain)
- Readable khi scaled down (social media thumbnails)

---

## Structured Data (JSON-LD)

### Organization (Home page)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "NullShift",
  "url": "https://nullshift.sh",
  "logo": "https://nullshift.sh/assets/images/logo.png",
  "description": "Privacy-first builder labs. AI agents, blockchain, and zero-knowledge proofs.",
  "sameAs": [
    "https://github.com/nullshift",
    "https://x.com/nullshift",
    "https://t.me/nullshift"
  ]
}
</script>
```

### Blog Post (Blog page — inject per post)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Post Title Here",
  "datePublished": "2024-03-01",
  "author": {
    "@type": "Person",
    "name": "NullShift"
  },
  "publisher": {
    "@type": "Organization",
    "name": "NullShift",
    "url": "https://nullshift.sh"
  },
  "description": "Post excerpt here",
  "url": "https://nullshift.sh/blog.html#post/slug"
}
</script>
```

Blog post structured data nên được inject bởi `blog-data.js` khi render post view:

```js
const injectBlogSchema = (post) => {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.date,
    author: { '@type': 'Person', name: post.author || 'NullShift' },
    publisher: { '@type': 'Organization', name: 'NullShift', url: 'https://nullshift.sh' },
    description: post.excerpt,
    url: `https://nullshift.sh/blog.html#post/${post.slug}`
  });
  document.head.appendChild(script);
};
```

---

## Favicon & App Icons

```html
<link rel="icon" type="image/svg+xml" href="assets/icons/favicon.svg">
<link rel="icon" type="image/png" sizes="32x32" href="assets/icons/favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="assets/icons/favicon-16.png">
<link rel="apple-touch-icon" sizes="180x180" href="assets/icons/apple-touch-icon.png">
```

Favicon design: `[N]` hoặc `Ø` trong terminal bracket style, green trên dark background.

---

## Sitemap

Tạo file `sitemap.xml` ở root:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://nullshift.sh/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://nullshift.sh/services.html</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://nullshift.sh/products.html</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://nullshift.sh/agents.html</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://nullshift.sh/blog.html</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://nullshift.sh/projects.html</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

---

## robots.txt

```
User-agent: *
Allow: /
Sitemap: https://nullshift.sh/sitemap.xml

# Block non-content paths
Disallow: /data/
Disallow: /assets/fonts/
```

---

## Performance & SEO Checklist

### Font Loading

```html
<!-- Preconnect to Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Font display swap — prevents FOIT -->
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

### Critical Rendering

- CSS files trong `<head>` (render-blocking — intentional, ensures styled first paint)
- JS files ở cuối `<body>` (non-blocking)
- Không dùng `defer` hoặc `async` trên JS vì load order matters
- Font preconnect giảm latency

### Image Optimization

- Lazy load images dưới fold:
  ```html
  <img src="placeholder.svg" data-src="assets/images/project.png" loading="lazy" alt="Project name">
  ```
- Format: WebP preferred, PNG fallback
- Thumbnails: max `400x300px`
- OG images: exactly `1200x630px`

### Caching Headers (server.js)

```js
// Static assets — cache 1 year
app.use('/assets', express.static('assets', {
  maxAge: '1y',
  immutable: true
}));

// CSS/JS — cache 1 week (may change)
app.use('/css', express.static('css', { maxAge: '7d' }));
app.use('/js', express.static('js', { maxAge: '7d' }));

// HTML — no cache (always fresh)
app.use(express.static('.', {
  maxAge: 0,
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

// JSON data — cache 1 hour
app.use('/data', express.static('data', { maxAge: '1h' }));
```

### Security Headers

```js
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});
```

### Content Security Policy (Optional)

```js
res.setHeader('Content-Security-Policy', [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' https://fonts.googleapis.com 'unsafe-inline'",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data:",
  "connect-src 'self'"
].join('; '));
```

**Note:** `'unsafe-inline'` cần cho CSS custom properties và inline styles. Nếu có thể, move tất cả styles vào external CSS files.

---

## SEO Validation Tools

Sau khi deploy, check bằng:

| Tool | URL | What to check |
|------|-----|---------------|
| Google Rich Results | search.google.com/test/rich-results | Structured data validation |
| Facebook Debugger | developers.facebook.com/tools/debug | OG tags preview |
| Twitter Card Validator | cards-dev.twitter.com/validator | Twitter card preview |
| Google PageSpeed | pagespeed.web.dev | Performance, SEO, Accessibility scores |
| GTmetrix | gtmetrix.com | Load time, Web Vitals |

### Target Scores

| Metric | Target |
|--------|--------|
| Lighthouse Performance | > 95 |
| Lighthouse SEO | 100 |
| Lighthouse Accessibility | > 90 |
| First Contentful Paint | < 1.0s |
| Largest Contentful Paint | < 1.5s |
| Total Blocking Time | < 50ms |
| Cumulative Layout Shift | < 0.05 |
