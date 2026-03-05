# Deployment Guide — NullShift

```
$ cat /docs/deployment.md
```

---

## Hosting Options

NullShift là static site, có thể deploy trên bất kỳ static host nào:

| Platform | Pros | Setup |
|----------|------|-------|
| **Railway** (primary) | Simple, custom domain, auto SSL | Cần `server.js` |
| Vercel | Zero config, fast CDN | Drop files |
| Netlify | Form handling, redirects | Drop files |
| Cloudflare Pages | Global CDN, Workers | Git integration |
| GitHub Pages | Free, git-based | Push to `gh-pages` |

---

## Railway Deployment (Primary)

### Prerequisites

- Node.js >= 18
- Git
- Railway CLI (`npm install -g @railway/cli`)
- Railway account ([railway.app](https://railway.app))

### Step 1: Prepare Server

NullShift cần một Express static server vì Railway cần process binding port.

**`server.js`:**
```js
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '/')));

app.get('*', (req, res) => {
  const filePath = path.join(__dirname, req.path);
  res.sendFile(filePath, (err) => {
    if (err) {
      res.sendFile(path.join(__dirname, 'index.html'));
    }
  });
});

app.listen(PORT, () => {
  console.log(`[nullshift.sh] Server running on port ${PORT}`);
});
```

**`package.json`:**
```json
{
  "name": "nullshift",
  "version": "1.0.0",
  "description": "NullShift — Privacy-first builder labs",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "engines": {
    "node": ">=18"
  }
}
```

### Step 2: Railway Config

**`railway.toml`:**
```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "node server.js"
healthcheckPath = "/"
healthcheckTimeout = 100
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 3

[service]
internalPort = 3000
```

**`nixpacks.toml`** (optional):
```toml
[phases.setup]
nixPkgs = ["nodejs-18_x"]

[phases.install]
cmds = ["npm install"]

[start]
cmd = "node server.js"
```

### Step 3: Git Init & Deploy

```bash
# Initialize git
git init
git add .
git commit -m "feat: NullShift initial build"

# Login to Railway
railway login

# Create new project
railway init
# → Select "Empty Project" or create "nullshift"

# Deploy
railway up

# Get public URL
railway domain
# → Output: nullshift-xxx.up.railway.app
```

### Step 4: Custom Domain

1. Go to **Railway Dashboard → Project → Settings → Domains**
2. Click **"Add Custom Domain"**
3. Enter: `nullshift.sh`
4. Railway provides a CNAME target

5. Go to your **domain registrar** (Namecheap, Cloudflare, etc.)
6. Add DNS record:

| Type | Name | Value |
|------|------|-------|
| CNAME | `@` | `<railway-cname>.railway.app` |
| CNAME | `www` | `<railway-cname>.railway.app` |

7. Wait for DNS propagation (5 min — 48 hours)
8. Railway auto-provisions SSL certificate

### Step 5: Verify

```bash
# Check deployment status
railway status

# View logs
railway logs

# Open in browser
railway open
```

---

## Environment Variables

| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `PORT` | `3000` | No | Server port (Railway auto-injects) |
| `NODE_ENV` | `production` | No | Environment mode |

Railway automatically injects `PORT`. No other env vars needed for static site.

---

## Alternative: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy (from project root)
vercel

# Follow prompts, select project settings
# Vercel auto-detects static site
```

**`vercel.json`** (optional, for clean URLs):
```json
{
  "cleanUrls": true,
  "trailingSlash": false
}
```

---

## Alternative: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=.
```

**`netlify.toml`** (optional):
```toml
[build]
  publish = "."

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Alternative: Cloudflare Pages

1. Go to [Cloudflare Pages](https://pages.cloudflare.com)
2. Connect GitHub repository
3. Build settings:
   - Build command: (leave empty)
   - Output directory: `.`
4. Deploy

---

## Alternative: GitHub Pages

```bash
# Push to gh-pages branch
git subtree push --prefix . origin gh-pages

# Or use GitHub Actions for auto-deploy
```

Enable in repo Settings → Pages → Source: `gh-pages` branch.

---

## CI/CD with GitHub Actions

**`.github/workflows/deploy.yml`:**
```yaml
name: Deploy to Railway

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Railway CLI
        run: npm install -g @railway/cli

      - name: Deploy
        run: railway up --service nullshift
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

### Setup:
1. In Railway Dashboard → Project → Settings → Tokens
2. Create deployment token
3. Add to GitHub repo: Settings → Secrets → `RAILWAY_TOKEN`

---

## Monitoring

### Railway Dashboard
- **Metrics:** CPU, memory, network
- **Logs:** Real-time server logs
- **Deployments:** History, rollback

### Uptime Monitoring (Optional)
- [UptimeRobot](https://uptimerobot.com) — Free, 5-min checks
- [Better Stack](https://betterstack.com) — Status pages

### Health Check

Railway pings `GET /` every interval. Server responds with `index.html` → 200 OK.

---

## Rollback

```bash
# View deployment history
railway deployments

# Rollback to previous deployment
railway rollback
```

Or via Railway Dashboard → Deployments → Click previous → "Redeploy".

---

## Performance Optimization (Production)

### Optional: Minify assets before deploy

```bash
# Install minifier tools
npm install -g html-minifier-terser csso-cli terser

# Minify CSS
for f in css/*.css; do csso "$f" -o "$f"; done

# Minify JS
for f in js/*.js; do terser "$f" -o "$f" -c -m; done

# Minify HTML
for f in *.html; do html-minifier-terser "$f" -o "$f" \
  --collapse-whitespace --remove-comments; done
```

### Optional: Add caching headers

In `server.js`:
```js
app.use(express.static(path.join(__dirname, '/'), {
  maxAge: '1d',       // Cache static assets for 1 day
  etag: true,
  lastModified: true
}));
```

### Optional: Gzip compression

```bash
npm install compression
```

```js
const compression = require('compression');
app.use(compression());
```

---

## Troubleshooting

### Site not loading after deploy

```bash
# Check logs
railway logs --tail 50

# Common issues:
# - PORT not binding: ensure server.js uses process.env.PORT
# - Missing dependencies: check package.json
# - File paths: case-sensitive on Linux (Railway runs Linux)
```

### Custom domain not resolving

1. Check DNS propagation: `dig nullshift.sh`
2. Verify CNAME record points to Railway
3. Wait up to 48 hours for propagation
4. Check Railway dashboard for domain status

### CSS/JS not loading

- Check file paths in HTML (case-sensitive on Linux)
- Ensure `express.static()` points to correct directory
- Check browser DevTools Network tab for 404s

### Canvas effects slow

- Check `requestAnimationFrame` is being used (not `setInterval`)
- Verify visibility checks (pause when tab hidden)
- Reduce particle count on mobile
- Check for memory leaks in animation loops
