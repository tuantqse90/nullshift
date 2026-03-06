/* ==============================
   BLOG DATA & RENDERING
   ============================== */

function parseMarkdown(md) {
  let html = md;

  // Code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre><code>${escapeHtml(code.trim())}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');

  // Bold & italic
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote><p>$1</p></blockquote>');

  // Unordered lists — wrap consecutive <li> groups
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, (match) => `<ul>${match}</ul>`);

  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Paragraphs
  html = html.replace(/\n\n(?!<)/g, '</p><p>');
  html = '<p>' + html + '</p>';

  // Clean up empty paragraphs and ones wrapping block elements
  html = html.replace(/<p><(h[23]|pre|ul|ol|blockquote|li)/g, '<$1');
  html = html.replace(/<\/(h[23]|pre|ul|ol|blockquote|li)><\/p>/g, '</$1>');
  html = html.replace(/<p>\s*<\/p>/g, '');

  return html;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function initBlog() {
  const listingEl = document.querySelector('.blog-listing');
  const postViewEl = document.querySelector('.blog-post-view');
  const gridEl = document.querySelector('.blog-grid');
  const filterBar = document.querySelector('.filter-bar');

  const searchContainer = document.querySelector('.blog-search');
  let posts = [];
  let activeFilter = 'all';
  let searchQuery = '';
  let scrollHandler = null;

  // Show skeleton while loading
  if (gridEl) {
    gridEl.innerHTML = Array(4).fill(`
      <div class="skeleton-card">
        <div class="skeleton-line short"></div>
        <div class="skeleton-title"></div>
        <div class="skeleton-line long"></div>
        <div class="skeleton-line medium"></div>
        <div class="skeleton-tags">
          <div class="skeleton-tag"></div>
          <div class="skeleton-tag"></div>
        </div>
      </div>
    `).join('');
  }

  fetch('data/blog-posts.json')
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    })
    .then(data => {
      posts = data;
      buildBlogFilters();
      buildSearch();
      renderListing(posts);
      handleHash();
    })
    .catch(() => {
      if (gridEl) {
        gridEl.innerHTML = '<div class="empty-state">Failed to load blog posts. Try opening via a local server.</div>';
      }
    });

  function buildBlogFilters() {
    if (!filterBar) return;

    const pillars = [
      { value: 'all', label: 'All Posts' },
      { value: 'privacy', label: 'Privacy' },
      { value: 'ai', label: 'AI' },
      { value: 'blockchain', label: 'Blockchain' },
      { value: 'zk', label: 'ZK' }
    ];

    pillars.forEach(p => {
      const btn = document.createElement('button');
      btn.className = `filter-btn${p.value === 'all' ? ' active' : ''}`;
      btn.dataset.filterValue = p.value;
      btn.textContent = p.label;
      btn.addEventListener('click', () => {
        activeFilter = p.value;
        filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyFiltersAndSearch();
      });
      filterBar.appendChild(btn);
    });
  }

  function buildSearch() {
    if (!searchContainer) return;

    searchContainer.innerHTML = `
      <svg class="blog-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.35-4.35"/>
      </svg>
      <input type="text" class="blog-search-input" placeholder="Search posts..." aria-label="Search blog posts">
      <span class="blog-search-kbd">/</span>
    `;

    const input = searchContainer.querySelector('.blog-search-input');
    input.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      applyFiltersAndSearch();
    });
  }

  function applyFiltersAndSearch() {
    let filtered = activeFilter === 'all' ? posts : posts.filter(p => p.pillar === activeFilter);
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchQuery) ||
        p.excerpt.toLowerCase().includes(searchQuery) ||
        p.content.toLowerCase().includes(searchQuery)
      );
    }
    renderListing(filtered);
  }

  function renderListing(items) {
    if (!gridEl) return;

    const countEl = document.querySelector('.blog-count .count');
    if (countEl) {
      countEl.textContent = items.length;
    }

    if (items.length === 0) {
      gridEl.innerHTML = '<div class="empty-state">> No posts found.</div>';
      return;
    }

    gridEl.innerHTML = items.map(post => `
      <article class="blog-card" data-post-id="${post.id}">
        <div class="blog-date">${formatDate(post.date)}</div>
        <h3 class="blog-title">${post.title}</h3>
        <p class="blog-excerpt">${post.excerpt}</p>
        <div class="blog-meta">
          <span class="pillar-badge" data-pillar="${post.pillar}">${post.pillar.toUpperCase()}</span>
          <span class="text-dim">${post.read_time}</span>
        </div>
      </article>
    `).join('');

    gridEl.querySelectorAll('.blog-card').forEach(card => {
      card.addEventListener('click', () => {
        window.location.hash = card.dataset.postId;
      });
    });
  }

  function showPost(postId) {
    const post = posts.find(p => p.id === postId);
    if (!post || !postViewEl || !listingEl) return;

    listingEl.classList.add('hidden');
    postViewEl.classList.add('active');

    postViewEl.querySelector('.post-title').textContent = post.title;
    postViewEl.querySelector('.post-date').textContent = formatDate(post.date);
    postViewEl.querySelector('.post-read-time').textContent = post.read_time;

    const pillarEl = postViewEl.querySelector('.post-pillar');
    if (pillarEl) {
      pillarEl.dataset.pillar = post.pillar;
      pillarEl.textContent = post.pillar.toUpperCase();
    }

    const contentHtml = parseMarkdown(post.content);
    postViewEl.querySelector('.post-content').innerHTML = contentHtml;

    // Generate TOC from headings
    buildTOC(postViewEl);

    // Init reading progress bar
    initReadingProgress();

    // Add copy buttons to code blocks
    addCodeCopyButtons(postViewEl);

    // Add share buttons
    addShareButtons(postViewEl, post);

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Structured data
    const existingLd = document.querySelector('script[type="application/ld+json"]');
    if (existingLd) existingLd.remove();

    const ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      datePublished: post.date,
      description: post.excerpt
    });
    document.head.appendChild(ld);
  }

  function buildTOC(container) {
    const existingToc = container.querySelector('.post-toc');
    if (existingToc) existingToc.remove();

    const headings = container.querySelectorAll('.post-content h2, .post-content h3');
    if (headings.length < 2) return;

    const toc = document.createElement('nav');
    toc.className = 'post-toc';
    toc.setAttribute('aria-label', 'Table of contents');
    toc.innerHTML = '<h4 class="toc-title">Table of Contents</h4>';

    const list = document.createElement('ul');
    headings.forEach((h, i) => {
      const id = 'heading-' + i;
      h.id = id;
      const li = document.createElement('li');
      li.className = h.tagName === 'H3' ? 'toc-sub' : '';
      const a = document.createElement('a');
      a.href = '#' + id;
      a.textContent = h.textContent;
      a.addEventListener('click', (e) => {
        e.preventDefault();
        h.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      li.appendChild(a);
      list.appendChild(li);
    });
    toc.appendChild(list);

    const postContent = container.querySelector('.post-content');
    postContent.parentNode.insertBefore(toc, postContent);
  }

  function initReadingProgress() {
    // Remove previous scroll handler to prevent leaks
    if (scrollHandler) {
      window.removeEventListener('scroll', scrollHandler);
    }

    let progressBar = document.querySelector('.reading-progress');
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.className = 'reading-progress';
      progressBar.innerHTML = '<div class="reading-progress-fill"></div>';
      document.body.appendChild(progressBar);
    }
    progressBar.classList.add('active');

    const fill = progressBar.querySelector('.reading-progress-fill');
    scrollHandler = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      fill.style.width = progress + '%';
    };

    window.addEventListener('scroll', scrollHandler, { passive: true });
    scrollHandler();
  }

  function addCodeCopyButtons(container) {
    container.querySelectorAll('pre').forEach(pre => {
      if (pre.parentElement && pre.parentElement.classList.contains('code-block-wrapper')) return;

      const wrapper = document.createElement('div');
      wrapper.className = 'code-block-wrapper';
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      const btn = document.createElement('button');
      btn.className = 'code-copy-btn';
      btn.textContent = 'Copy';
      btn.setAttribute('aria-label', 'Copy code');
      btn.addEventListener('click', () => {
        const code = pre.querySelector('code');
        const text = code ? code.textContent : pre.textContent;
        navigator.clipboard.writeText(text).then(() => {
          btn.textContent = 'Copied!';
          btn.classList.add('copied');
          if (typeof Toast !== 'undefined') Toast.success('Code copied to clipboard');
          setTimeout(() => {
            btn.textContent = 'Copy';
            btn.classList.remove('copied');
          }, 2000);
        }).catch(() => {
          if (typeof Toast !== 'undefined') Toast.error('Failed to copy');
        });
      });
      wrapper.appendChild(btn);
    });
  }

  function addShareButtons(container, post) {
    const existing = container.querySelector('.post-share');
    if (existing) existing.remove();

    const url = `https://nullshift.sh/blog#${post.id}`;
    const text = post.title;
    const shareDiv = document.createElement('div');
    shareDiv.className = 'post-share';
    shareDiv.innerHTML = `
      <span class="share-label">Share:</span>
      <button class="share-btn" data-action="copy" aria-label="Copy link">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
        Link
      </button>
      <a class="share-btn" href="https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}" target="_blank" rel="noopener noreferrer" aria-label="Share on X">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        X
      </a>
      <a class="share-btn" href="https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}" target="_blank" rel="noopener noreferrer" aria-label="Share on Telegram">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0h-.056zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
        Telegram
      </a>
    `;

    const postMeta = container.querySelector('.post-meta');
    if (postMeta) {
      postMeta.parentNode.insertBefore(shareDiv, postMeta.nextSibling);
    }

    shareDiv.querySelector('[data-action="copy"]').addEventListener('click', () => {
      navigator.clipboard.writeText(url).then(() => {
        if (typeof Toast !== 'undefined') Toast.success('Link copied to clipboard');
      });
    });
  }

  function showListing() {
    if (!listingEl || !postViewEl) return;
    listingEl.classList.remove('hidden');
    postViewEl.classList.remove('active');

    const progressBar = document.querySelector('.reading-progress');
    if (progressBar) progressBar.classList.remove('active');

    // Clean up scroll handler
    if (scrollHandler) {
      window.removeEventListener('scroll', scrollHandler);
      scrollHandler = null;
    }
  }

  function handleHash() {
    const hash = window.location.hash.slice(1);
    if (hash) {
      showPost(hash);
    } else {
      showListing();
    }
  }

  window.addEventListener('hashchange', handleHash);

  const backLink = document.querySelector('.back-link');
  if (backLink) {
    backLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.hash = '';
    });
  }
}

function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}
