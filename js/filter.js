/* ==============================
   FILTER SYSTEM
   ============================== */
function initFilters(config) {
  const { dataUrl, containerSelector, filterBarSelector, renderCard, filterGroups } = config;

  let allItems = [];
  let activeFilters = {};

  filterGroups.forEach(group => {
    activeFilters[group.key] = 'all';
  });

  fetch(dataUrl)
    .then(res => res.json())
    .then(data => {
      allItems = data;
      buildFilterBar(filterBarSelector, filterGroups);
      renderCards(containerSelector, allItems, renderCard);
      updateCount(allItems.length, allItems.length);
    })
    .catch(() => {
      const container = document.querySelector(containerSelector);
      if (container) {
        container.innerHTML = '<div class="empty-state">Failed to load data. Try opening via a local server.</div>';
      }
    });

  function buildFilterBar(selector, groups) {
    const bar = document.querySelector(selector);
    if (!bar) return;

    groups.forEach(group => {
      const allBtn = document.createElement('button');
      allBtn.className = 'filter-btn active';
      allBtn.dataset.filterGroup = group.key;
      allBtn.dataset.filterValue = 'all';
      allBtn.textContent = `All ${group.label}`;
      allBtn.addEventListener('click', () => handleFilter(group.key, 'all'));
      bar.appendChild(allBtn);

      group.values.forEach(val => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.dataset.filterGroup = group.key;
        btn.dataset.filterValue = val.value;
        btn.textContent = val.label;
        btn.addEventListener('click', () => handleFilter(group.key, val.value));
        bar.appendChild(btn);
      });
    });
  }

  function handleFilter(groupKey, value) {
    activeFilters[groupKey] = value;
    updateFilterUI();
    const filtered = applyFilters(allItems);
    const container = document.querySelector(containerSelector);
    renderCards(containerSelector, filtered, renderCard);
    updateCount(filtered.length, allItems.length);
  }

  function updateFilterUI() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      const group = btn.dataset.filterGroup;
      const value = btn.dataset.filterValue;
      btn.classList.toggle('active', activeFilters[group] === value);
    });
  }

  function applyFilters(items) {
    return items.filter(item => {
      return Object.entries(activeFilters).every(([key, value]) => {
        if (value === 'all') return true;
        return item[key] === value;
      });
    });
  }

  function updateCount(shown, total) {
    const countEl = document.querySelector('.filter-count .count');
    if (countEl) {
      countEl.textContent = shown === total ? total : `${shown}/${total}`;
    }
  }
}

function renderCards(containerSelector, items, renderCard) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = '<div class="empty-state">> No results found. Adjust filters.</div>';
    return;
  }

  container.innerHTML = items.map(renderCard).join('');
}
