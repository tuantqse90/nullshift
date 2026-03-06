/* ==============================
   CONTRIBUTION GRAPH
   GitHub-style activity heatmap
   ============================== */
const ContributionGraph = (function() {
  'use strict';

  const container = document.getElementById('graph-container');
  if (!container) return null;

  // --- Config ---
  const WEEKS = 52;
  const DAYS_PER_WEEK = 7;
  const CELL_SIZE = 12;
  const CELL_GAP = 2;
  const COLORS = [
    '#161b22',  // 0 contributions
    '#0e4429',  // 1-2
    '#006d32',  // 3-4
    '#26a641',  // 5-6
    '#39d353'   // 7+
  ];
  const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // --- Seeded PRNG (consistent per date) ---
  function seededRandom(seed) {
    let s = seed;
    return function() {
      s = (s * 1664525 + 1013904223) & 0xffffffff;
      return (s >>> 0) / 0xffffffff;
    };
  }

  // --- Generate simulated data ---
  function generateData() {
    const today = new Date();
    const data = [];
    const totalDays = WEEKS * DAYS_PER_WEEK;

    // Find the start date: go back (totalDays - 1) days from today,
    // then adjust to the nearest prior Sunday so weeks align
    const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const rawStart = new Date(endDate);
    rawStart.setDate(rawStart.getDate() - (totalDays - 1));
    // Adjust to Sunday
    const dayOfWeek = rawStart.getDay();
    rawStart.setDate(rawStart.getDate() - dayOfWeek);

    // Seed based on year so it stays consistent throughout the year
    const seed = endDate.getFullYear() * 7919 + 42;
    const rng = seededRandom(seed);

    // Generate "burst" weeks — periods of high activity
    const burstWeeks = new Set();
    const numBursts = 4 + Math.floor(rng() * 4); // 4-7 bursts
    for (let i = 0; i < numBursts; i++) {
      const w = Math.floor(rng() * WEEKS);
      burstWeeks.add(w);
      if (w + 1 < WEEKS) burstWeeks.add(w + 1); // bursts span ~2 weeks
    }

    // Generate "quiet" weeks
    const quietWeeks = new Set();
    const numQuiet = 3 + Math.floor(rng() * 3); // 3-5 quiet periods
    for (let i = 0; i < numQuiet; i++) {
      const w = Math.floor(rng() * WEEKS);
      quietWeeks.add(w);
    }

    let totalContributions = 0;
    const actualStart = new Date(rawStart);

    for (let week = 0; week < WEEKS; week++) {
      for (let day = 0; day < DAYS_PER_WEEK; day++) {
        const cellDate = new Date(actualStart);
        cellDate.setDate(actualStart.getDate() + week * 7 + day);

        let count = 0;
        const isWeekday = cellDate.getDay() >= 1 && cellDate.getDay() <= 5;

        if (quietWeeks.has(week)) {
          // Quiet week — mostly zeros
          count = rng() < 0.15 ? Math.floor(rng() * 2) : 0;
        } else if (burstWeeks.has(week)) {
          // Burst week — high activity
          if (isWeekday) {
            count = 3 + Math.floor(rng() * 8); // 3-10
          } else {
            count = Math.floor(rng() * 5); // 0-4
          }
        } else {
          // Normal week
          if (isWeekday) {
            count = rng() < 0.7 ? 1 + Math.floor(rng() * 4) : 0; // 70% chance of 1-4
          } else {
            count = rng() < 0.3 ? 1 + Math.floor(rng() * 2) : 0; // 30% chance of 1-2
          }
        }

        // Future dates get 0
        if (cellDate > today) {
          count = 0;
        }

        totalContributions += count;
        data.push({
          date: new Date(cellDate),
          count: count,
          week: week,
          day: day
        });
      }
    }

    return { data: data, total: totalContributions, startDate: actualStart };
  }

  // --- Get color for count ---
  function getColor(count) {
    if (count === 0) return COLORS[0];
    if (count <= 2) return COLORS[1];
    if (count <= 4) return COLORS[2];
    if (count <= 6) return COLORS[3];
    return COLORS[4];
  }

  // --- Format date for tooltip ---
  function formatDate(date) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return days[date.getDay()] + ', ' + months[date.getMonth()] + ' ' +
           date.getDate() + ', ' + date.getFullYear();
  }

  // --- Build the graph ---
  function render() {
    const result = generateData();
    const data = result.data;
    const total = result.total;
    const startDate = result.startDate;

    // Wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'graph-wrapper';

    // --- Month labels ---
    const monthsRow = document.createElement('div');
    monthsRow.className = 'graph-months';

    // Spacer for day labels column
    const monthSpacer = document.createElement('span');
    monthSpacer.className = 'graph-month-spacer';
    monthsRow.appendChild(monthSpacer);

    // Determine which month label goes above which week
    const monthPositions = [];
    let lastMonth = -1;
    for (let week = 0; week < WEEKS; week++) {
      const cellDate = new Date(startDate);
      cellDate.setDate(startDate.getDate() + week * 7);
      const month = cellDate.getMonth();
      if (month !== lastMonth) {
        monthPositions.push({ week: week, month: month });
        lastMonth = month;
      }
    }

    // Create month labels container
    const monthLabelsInner = document.createElement('div');
    monthLabelsInner.className = 'graph-months-inner';
    monthLabelsInner.style.position = 'relative';
    monthLabelsInner.style.width = (WEEKS * (CELL_SIZE + CELL_GAP)) + 'px';
    monthLabelsInner.style.height = '20px';

    monthPositions.forEach(function(pos) {
      const label = document.createElement('span');
      label.className = 'graph-month-label';
      label.textContent = MONTH_LABELS[pos.month];
      label.style.position = 'absolute';
      label.style.left = (pos.week * (CELL_SIZE + CELL_GAP)) + 'px';
      monthLabelsInner.appendChild(label);
    });

    monthsRow.appendChild(monthLabelsInner);
    wrapper.appendChild(monthsRow);

    // --- Grid area (day labels + cells) ---
    const gridArea = document.createElement('div');
    gridArea.className = 'graph-grid-area';

    // Day labels
    const dayLabels = document.createElement('div');
    dayLabels.className = 'graph-days';
    [1, 3, 5].forEach(function(dayIndex) {
      const label = document.createElement('span');
      label.className = 'graph-day-label';
      label.textContent = DAY_LABELS[dayIndex];
      label.style.gridRow = (dayIndex + 1).toString();
      dayLabels.appendChild(label);
    });
    gridArea.appendChild(dayLabels);

    // Cell grid
    const grid = document.createElement('div');
    grid.className = 'graph-grid';
    grid.style.gridTemplateColumns = 'repeat(' + WEEKS + ', ' + CELL_SIZE + 'px)';
    grid.style.gridTemplateRows = 'repeat(7, ' + CELL_SIZE + 'px)';
    grid.style.gap = CELL_GAP + 'px';

    // Tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'graph-tooltip';
    tooltip.setAttribute('role', 'tooltip');
    tooltip.style.display = 'none';

    data.forEach(function(entry) {
      const cell = document.createElement('div');
      cell.className = 'graph-cell';
      cell.style.backgroundColor = getColor(entry.count);
      cell.style.gridColumn = (entry.week + 1).toString();
      cell.style.gridRow = (entry.day + 1).toString();
      cell.setAttribute('data-count', entry.count);
      cell.setAttribute('data-date', formatDate(entry.date));
      cell.setAttribute('aria-label', entry.count + ' contributions on ' + formatDate(entry.date));

      cell.addEventListener('mouseenter', function(e) {
        const count = e.target.getAttribute('data-count');
        const date = e.target.getAttribute('data-date');
        const label = count === '1' ? ' contribution' : ' contributions';
        tooltip.textContent = count + label + ' on ' + date;
        tooltip.style.display = 'block';

        const cellRect = e.target.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const tooltipWidth = tooltip.offsetWidth;

        let left = cellRect.left - containerRect.left + cellRect.width / 2 - tooltipWidth / 2;
        // Clamp within container
        if (left < 0) left = 0;
        if (left + tooltipWidth > containerRect.width) {
          left = containerRect.width - tooltipWidth;
        }

        tooltip.style.left = left + 'px';
        tooltip.style.top = (cellRect.top - containerRect.top - 36) + 'px';
      });

      cell.addEventListener('mouseleave', function() {
        tooltip.style.display = 'none';
      });

      grid.appendChild(cell);
    });

    gridArea.appendChild(grid);
    wrapper.appendChild(gridArea);

    // --- Legend ---
    const footer = document.createElement('div');
    footer.className = 'graph-footer';

    const summary = document.createElement('span');
    summary.className = 'graph-summary';
    summary.textContent = total + ' contributions in the last year';

    const legend = document.createElement('div');
    legend.className = 'graph-legend';

    const lessLabel = document.createElement('span');
    lessLabel.className = 'graph-legend-label';
    lessLabel.textContent = 'Less';
    legend.appendChild(lessLabel);

    COLORS.forEach(function(color) {
      const swatch = document.createElement('div');
      swatch.className = 'graph-cell graph-legend-cell';
      swatch.style.backgroundColor = color;
      legend.appendChild(swatch);
    });

    const moreLabel = document.createElement('span');
    moreLabel.className = 'graph-legend-label';
    moreLabel.textContent = 'More';
    legend.appendChild(moreLabel);

    footer.appendChild(summary);
    footer.appendChild(legend);
    wrapper.appendChild(footer);

    // --- Assemble ---
    container.appendChild(wrapper);
    container.appendChild(tooltip);
  }

  // --- Init ---
  render();

  return {
    refresh: function() {
      container.innerHTML = '';
      render();
    }
  };

})();
