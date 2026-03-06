const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.disable('x-powered-by');

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

const pages = ['services', 'products', 'agents', 'blog', 'projects', 'changelog', 'docs', 'editor', 'analytics', 'status', 'about', 'sitemap-visual', 'shortcuts', 'easter-eggs'];
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

// RSS feed
app.get('/feed.xml', (req, res) => {
  const fs = require('fs');
  const baseUrl = 'https://nullshift.sh';

  let items = '';
  try {
    const posts = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/blog-posts.json'), 'utf8'));
    items = posts.map(post => {
      const content = post.content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      return `    <item>
      <title>${post.title.replace(/&/g, '&amp;')}</title>
      <link>${baseUrl}/blog#${post.id}</link>
      <guid>${baseUrl}/blog#${post.id}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${post.excerpt.replace(/&/g, '&amp;')}</description>
      <content:encoded><![CDATA[${post.content}]]></content:encoded>
      <category>${post.pillar}</category>
    </item>`;
    }).join('\n');
  } catch (e) {}

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>NullShift Blog</title>
    <link>${baseUrl}/blog</link>
    <description>Privacy-first tools, AI agents, blockchain infrastructure, and zero-knowledge proofs. Built by nullshift.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  res.setHeader('Content-Type', 'application/rss+xml');
  res.send(xml);
});

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
    { loc: '/changelog', priority: '0.5' },
    { loc: '/editor', priority: '0.3' },
    { loc: '/analytics', priority: '0.3' },
    { loc: '/status', priority: '0.6' },
    { loc: '/about', priority: '0.7' },
    { loc: '/shortcuts', priority: '0.3' }
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

app.use((err, req, res, next) => {
  console.error('[nullshift] server error:', err.message);
  res.status(500).sendFile(path.join(__dirname, '500.html'));
});

app.listen(PORT, () => {
  console.log(`[nullshift] server running on port ${PORT}`);
});
