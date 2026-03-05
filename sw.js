/* ==============================
   SERVICE WORKER — NULLSHIFT
   ============================== */
const CACHE_NAME = 'nullshift-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/services.html',
  '/products.html',
  '/projects.html',
  '/agents.html',
  '/blog.html',
  '/404.html',
  '/css/reset.css',
  '/css/variables.css',
  '/css/global.css',
  '/css/components.css',
  '/css/animations.css',
  '/css/home.css',
  '/css/services.css',
  '/css/products.css',
  '/css/projects.css',
  '/css/agents.css',
  '/css/blog.css',
  '/js/main.js',
  '/js/effects.js',
  '/js/particles.js',
  '/js/filter.js',
  '/js/blog-data.js',
  '/js/agents-graph.js',
  '/js/cursor-trail.js',
  '/js/keyboard.js',
  '/js/stats-counter.js',
  '/js/terminal.js',
  '/js/toast.js',
  '/js/search.js',
  '/assets/icons/favicon.svg',
  '/manifest.json'
];

const DATA_ASSETS = [
  '/data/products.json',
  '/data/projects.json',
  '/data/agents.json',
  '/data/blog-posts.json'
];

// Install — cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate — clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// Fetch — network-first for data, cache-first for static
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip external requests
  if (url.origin !== location.origin) return;

  // Network-first for JSON data (always try fresh)
  if (url.pathname.startsWith('/data/')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first for static assets
  event.respondWith(
    caches.match(event.request)
      .then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        });
      })
      .catch(() => {
        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('/404.html');
        }
      })
  );
});
