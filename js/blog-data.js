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

  // Unordered lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, (match) => `<ul>${match}</ul>`);

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

  let posts = [];
  let activeFilter = 'all';

  fetch('data/blog-posts.json')
    .then(res => res.json())
    .then(data => {
      posts = data;
      buildBlogFilters();
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
        const filtered = p.value === 'all' ? posts : posts.filter(post => post.pillar === p.value);
        renderListing(filtered);
      });
      filterBar.appendChild(btn);
    });
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

    postViewEl.querySelector('.post-content').innerHTML = parseMarkdown(post.content);

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

  function showListing() {
    if (!listingEl || !postViewEl) return;
    listingEl.classList.remove('hidden');
    postViewEl.classList.remove('active');
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
