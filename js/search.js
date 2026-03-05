/* ==============================
   GLOBAL SEARCH
   ============================== */
const GlobalSearch = {
  overlay: null,
  input: null,
  results: null,
  data: { products: [], projects: [], agents: [], posts: [] },
  loaded: false,

  init() {
    this.createOverlay();
    this.bindEvents();
  },

  createOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'search-overlay';
    this.overlay.id = 'global-search';
    this.overlay.innerHTML = `
      <div class="search-modal">
        <div class="search-input-wrapper">
          <svg class="search-modal-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input type="text" class="search-modal-input" placeholder="Search products, projects, agents, blog..." aria-label="Global search">
          <kbd class="search-modal-kbd">Esc</kbd>
        </div>
        <div class="search-results" id="search-results">
          <div class="search-hint">Type to search across all content</div>
        </div>
      </div>
    `;
    document.body.appendChild(this.overlay);

    this.input = this.overlay.querySelector('.search-modal-input');
    this.results = this.overlay.querySelector('.search-results');
  },

  bindEvents() {
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });

    this.input.addEventListener('input', () => {
      this.search(this.input.value.trim().toLowerCase());
    });

    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
    });
  },

  async loadData() {
    if (this.loaded) return;

    const urls = [
      { key: 'products', url: 'data/products.json' },
      { key: 'projects', url: 'data/projects.json' },
      { key: 'agents', url: 'data/agents.json' },
      { key: 'posts', url: 'data/blog-posts.json' }
    ];

    await Promise.all(urls.map(async ({ key, url }) => {
      try {
        const res = await fetch(url);
        this.data[key] = await res.json();
      } catch (e) {}
    }));

    this.loaded = true;
  },

  async open() {
    await this.loadData();
    this.overlay.classList.add('active');
    this.input.value = '';
    this.results.innerHTML = '<div class="search-hint">Type to search across all content</div>';
    setTimeout(() => this.input.focus(), 50);
  },

  close() {
    this.overlay.classList.remove('active');
  },

  search(query) {
    if (!query) {
      this.results.innerHTML = '<div class="search-hint">Type to search across all content</div>';
      return;
    }

    const matches = [];

    this.data.products.forEach(item => {
      if (this.matches(item, ['name', 'description'], query)) {
        matches.push({ type: 'Product', name: item.name, desc: item.description, pillar: item.pillar, status: item.status, url: 'products.html' });
      }
    });

    this.data.projects.forEach(item => {
      if (this.matches(item, ['name', 'description'], query)) {
        matches.push({ type: 'Project', name: item.name, desc: item.description, pillar: item.pillar, status: item.status, url: 'projects.html' });
      }
    });

    this.data.agents.forEach(item => {
      if (this.matches(item, ['name', 'role', 'description'], query)) {
        matches.push({ type: 'Agent', name: item.name, desc: item.role, pillar: item.pillar, status: item.status, url: 'agents.html' });
      }
    });

    this.data.posts.forEach(item => {
      if (this.matches(item, ['title', 'excerpt', 'content'], query)) {
        matches.push({ type: 'Blog', name: item.title, desc: item.excerpt, pillar: item.pillar, url: `blog.html#${item.id}` });
      }
    });

    if (matches.length === 0) {
      this.results.innerHTML = '<div class="search-hint">> No results found.</div>';
      return;
    }

    this.results.innerHTML = matches.slice(0, 12).map(m => `
      <a href="${m.url}" class="search-result-item">
        <div class="search-result-type">${m.type}</div>
        <div class="search-result-name">${m.name}</div>
        <div class="search-result-desc">${this.truncate(m.desc, 80)}</div>
        <div class="search-result-meta">
          <span class="pillar-badge" data-pillar="${m.pillar}">${m.pillar.toUpperCase()}</span>
          ${m.status ? `<span class="status-tag" data-status="${m.status}">[${m.status.toUpperCase()}]</span>` : ''}
        </div>
      </a>
    `).join('');
  },

  matches(item, fields, query) {
    return fields.some(f => item[f] && item[f].toLowerCase().includes(query));
  },

  truncate(str, len) {
    return str.length > len ? str.slice(0, len) + '...' : str;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  GlobalSearch.init();
});
