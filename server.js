const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

// Page routes (before static to avoid docs/ directory conflict)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const pages = ['services', 'products', 'agents', 'blog', 'projects', 'changelog', 'docs'];
pages.forEach(page => {
  app.get(`/${page}`, (req, res) => {
    res.sendFile(path.join(__dirname, `${page}.html`));
  });
});

app.use(express.static(path.join(__dirname), {
  maxAge: '1h',
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    } else if (filePath.match(/\.(css|js)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=3600');
    } else if (filePath.match(/\.(json)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=300');
    } else if (filePath.match(/\.(svg|png|jpg|ico|woff2?)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }
  }
}));

// Dynamic sitemap
app.get('/sitemap.xml', (req, res) => {
  const fs = require('fs');
  const baseUrl = 'https://nullshift.sh';
  const staticPages = [
    { loc: '/', priority: '1.0' },
    { loc: '/services', priority: '0.8' },
    { loc: '/products', priority: '0.8' },
    { loc: '/projects', priority: '0.8' },
    { loc: '/agents', priority: '0.7' },
    { loc: '/blog', priority: '0.7' },
    { loc: '/docs', priority: '0.6' },
    { loc: '/changelog', priority: '0.5' }
  ];

  let urls = staticPages.map(p =>
    `  <url><loc>${baseUrl}${p.loc}</loc><priority>${p.priority}</priority></url>`
  );

  try {
    const blogPosts = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/blog-posts.json'), 'utf8'));
    blogPosts.forEach(post => {
      urls.push(`  <url><loc>${baseUrl}/blog#${post.id}</loc><lastmod>${post.date}</lastmod><priority>0.6</priority></url>`);
    });
  } catch (e) {}

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.send(xml);
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

app.listen(PORT, () => {
  console.log(`[nullshift] server running on port ${PORT}`);
});
