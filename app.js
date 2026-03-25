/**
 * Vitti ASX Dashboard — app.js
 * Loads dated JSON logs, renders announcement cards,
 * handles search / filtering / modal / CSV download / print.
 */

/* ── State ────────────────────────────────────── */
const state = {
  allData: [],          // raw announcements from JSON
  filtered: [],         // after all filters applied
  activeDate: '',
  activeCategory: 'All',
  activeTags: new Set(),
  searchQuery: '',
  sensitiveOnly: false,
};

/* ── DOM refs ─────────────────────────────────── */
const cardGrid        = document.getElementById('card-grid');
const emptyState      = document.getElementById('empty-state');
const loadingState    = document.getElementById('loading-state');
const searchInput     = document.getElementById('search-input');
const searchClear     = document.getElementById('search-clear');
const datePicker      = document.getElementById('date-picker');
const tagFilters      = document.getElementById('tag-filters');
const sensitiveToggle = document.getElementById('sensitive-toggle');
const categoryTabs    = document.querySelectorAll('.tab');

const statTotal     = document.getElementById('stat-total');
const statSensitive = document.getElementById('stat-sensitive');
const statShowing   = document.getElementById('stat-showing');
const statTickers   = document.getElementById('stat-tickers');
const pageDateLabel = document.getElementById('page-date-label');

const modalOverlay    = document.getElementById('modal-overlay');
const modalClose      = document.getElementById('modal-close');
const modalTicker     = document.getElementById('modal-ticker');
const modalCompany    = document.getElementById('modal-company');
const modalTime       = document.getElementById('modal-time');
const modalHeadline   = document.getElementById('modal-headline');
const modalSummary    = document.getElementById('modal-summary');
const modalTags       = document.getElementById('modal-tags');
const modalAsxLink    = document.getElementById('modal-asx-link');
const modalSensitiveBanner = document.getElementById('modal-sensitive-banner');

const btnCsv   = document.getElementById('btn-csv');
const btnPrint = document.getElementById('btn-print');
const printMeta  = document.getElementById('print-meta');
const printCards = document.getElementById('print-cards');
const themeToggle = document.getElementById('theme-toggle');
const iconMoon    = document.getElementById('icon-moon');
const iconSun     = document.getElementById('icon-sun');

/* ── Theme ────────────────────────────────────── */
(function initTheme() {
  const saved = localStorage.getItem('vitti-theme') || 'dark';
  applyTheme(saved);
})();

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const isLight = theme === 'light';
  iconMoon.style.display = isLight ? 'none'  : '';
  iconSun.style.display  = isLight ? ''      : 'none';
  localStorage.setItem('vitti-theme', theme);
}

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

/* ── Helpers ──────────────────────────────────── */
function formatTime(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: true });
  } catch { return iso; }
}

function formatDateLabel(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  } catch { return dateStr; }
}

function escHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function todayDateStr() {
  // Returns YYYY-MM-DD in AEST (UTC+10)
  const now = new Date();
  const aest = new Date(now.getTime() + 10 * 60 * 60 * 1000);
  return aest.toISOString().slice(0, 10);
}

/* ── Load data ────────────────────────────────── */
async function loadDate(dateStr) {
  setLoading(true);
  state.activeDate = dateStr;
  state.allData = [];
  state.activeTags.clear();
  state.activeCategory = 'All';
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.cat === 'All'));

  let payload = null;

  // 1. Try fetch (works over HTTP / GitHub Pages)
  if (window.location.protocol !== 'file:') {
    try {
      const resp = await fetch(`logs/${dateStr}.json?_=${Date.now()}`);
      if (resp.ok) payload = await resp.json();
    } catch (_) {}
  }

  // 2. Try fetch anyway even on file:// (Chrome with --allow-file-access might work)
  if (!payload) {
    try {
      const resp = await fetch(`logs/${dateStr}.json?_=${Date.now()}`);
      if (resp.ok) payload = await resp.json();
    } catch (_) {}
  }

  // 3. No log found — show empty state (do NOT fall back to stale sample data)
  if (payload) {
    pageDateLabel.textContent = formatDateLabel(payload.date || dateStr);
  } else {
    pageDateLabel.textContent = formatDateLabel(dateStr);
  }

  state.allData = payload ? (payload.announcements || []) : [];
  updateStatCards();
  buildTagFilterList();
  applyFilters();
  setLoading(false);
}

function setLoading(on) {
  loadingState.classList.toggle('hidden', !on);
  cardGrid.classList.toggle('hidden', on);
}

/* ── Stats ────────────────────────────────────── */
function updateStatCards() {
  statTotal.textContent     = state.allData.length;
  statSensitive.textContent = state.allData.filter(a => a.market_sensitive).length;
  statTickers.textContent   = new Set(state.allData.map(a => a.ticker)).size;
}

/* ── Tag filter list ──────────────────────────── */
function buildTagFilterList() {
  const tagCounts = {};
  state.allData.forEach(a => {
    (a.tags || []).forEach(t => { tagCounts[t] = (tagCounts[t] || 0) + 1; });
  });

  const sorted = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
  tagFilters.innerHTML = '';

  sorted.forEach(([tag, count]) => {
    const btn = document.createElement('button');
    btn.className = 'tag-filter-btn';
    btn.dataset.tag = tag;
    btn.innerHTML = `<span>${escHtml(tag)}</span><span class="tag-count">${count}</span>`;
    btn.addEventListener('click', () => toggleTagFilter(tag, btn));
    tagFilters.appendChild(btn);
  });
}

function toggleTagFilter(tag, btn) {
  if (state.activeTags.has(tag)) {
    state.activeTags.delete(tag);
    btn.classList.remove('active');
  } else {
    state.activeTags.add(tag);
    btn.classList.add('active');
  }
  applyFilters();
}

/* ── Filter & render ──────────────────────────── */
function applyFilters() {
  const q = state.searchQuery.toLowerCase().trim();

  state.filtered = state.allData.filter(a => {
    // Category tab
    if (state.activeCategory !== 'All') {
      const inTags = (a.tags || []).includes(state.activeCategory);
      const inDocType = (a.document_type || '').includes(state.activeCategory);
      if (!inTags && !inDocType) return false;
    }

    // Tag pills (OR logic — match any selected tag)
    if (state.activeTags.size > 0) {
      const aTags = new Set(a.tags || []);
      const match = [...state.activeTags].some(t => aTags.has(t));
      if (!match) return false;
    }

    // Market sensitive
    if (state.sensitiveOnly && !a.market_sensitive) return false;

    // Search
    if (q) {
      const haystack = [
        a.ticker, a.company, a.headline,
        ...(a.summary || []), ...(a.tags || [])
      ].join(' ').toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    return true;
  });

  statShowing.textContent = state.filtered.length;
  renderCards();
}

function tagClass(tag) {
  const t = tag.toLowerCase();
  if (t.includes('mining') || t.includes('production'))  return 'tag-mining';
  if (t.includes('finance') || t.includes('dividend') || t.includes('results')) return 'tag-finance';
  if (t.includes('healthcare') || t.includes('health'))  return 'tag-healthcare';
  if (t.includes('technology'))                           return 'tag-technology';
  if (t.includes('energy') || t.includes('oil'))         return 'tag-energy';
  return '';
}

function renderCards() {
  cardGrid.innerHTML = '';
  emptyState.classList.toggle('hidden', state.filtered.length > 0);

  state.filtered.forEach((ann, i) => {
    const card = document.createElement('div');
    card.className = `ann-card${ann.market_sensitive ? ' market-sensitive' : ''}`;
    card.style.animationDelay = `${Math.min(i * 40, 400)}ms`;

    const msBadge = ann.market_sensitive
      ? `<div class="ms-badge" title="Market Sensitive"><span class="ms-dot"></span></div>`
      : '';

    const summaryItems = (ann.summary || []).slice(0, 3).map(
      b => `<li>${escHtml(b)}</li>`
    ).join('');

    const tagPills = (ann.tags || []).map(
      t => `<span class="tag-pill ${tagClass(t)}">${escHtml(t)}</span>`
    ).join('');

    card.innerHTML = `
      ${msBadge}
      <div class="card-top">
        <span class="ticker-badge">${escHtml(ann.ticker)}</span>
        <div class="card-meta">
          <div class="card-company">${escHtml(ann.company)}</div>
          <div class="card-time">${formatTime(ann.time)}</div>
        </div>
      </div>
      <div class="card-headline">${escHtml(ann.headline)}</div>
      ${summaryItems ? `<div class="card-divider"></div><ul class="card-summary">${summaryItems}</ul>` : ''}
      ${tagPills ? `<div class="card-tags">${tagPills}</div>` : ''}
    `;

    // Spotlight hover effect
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });

    card.addEventListener('click', () => openModal(ann));
    cardGrid.appendChild(card);
  });
}

/* ── Modal ────────────────────────────────────── */
function openModal(ann) {
  modalTicker.textContent    = ann.ticker;
  modalCompany.textContent   = ann.company;
  modalTime.textContent      = formatTime(ann.time) + (ann.document_type ? `  ·  ${ann.document_type}` : '');
  modalHeadline.textContent  = ann.headline;
  modalAsxLink.href          = ann.url || '#';

  modalSensitiveBanner.classList.toggle('hidden', !ann.market_sensitive);

  modalSummary.innerHTML = (ann.summary || []).map(
    b => `<li>${escHtml(b)}</li>`
  ).join('');

  modalTags.innerHTML = (ann.tags || []).map(
    t => `<span class="tag-pill ${tagClass(t)}">${escHtml(t)}</span>`
  ).join('');

  modalOverlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay.classList.add('hidden');
  document.body.style.overflow = '';
}

/* ── CSV Download ─────────────────────────────── */
function downloadCSV() {
  const cols = ['ticker','company','headline','time','market_sensitive','tags','url',
                 'summary_1','summary_2','summary_3','summary_4','summary_5'];

  const rows = [cols.join(',')];

  state.filtered.forEach(a => {
    const row = [
      a.ticker,
      a.company,
      a.headline,
      a.time,
      a.market_sensitive ? 'Yes' : 'No',
      (a.tags || []).join('; '),
      a.url,
      ...(a.summary || []).concat(['','','','','']).slice(0,5),
    ].map(v => `"${String(v ?? '').replace(/"/g,'""')}"`);
    rows.push(row.join(','));
  });

  const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = `ASX-${state.activeDate}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ── Print / PDF ──────────────────────────────── */
function printReport() {
  printMeta.textContent = `${formatDateLabel(state.activeDate)}  ·  ${state.filtered.length} announcements  ·  ${state.filtered.filter(a=>a.market_sensitive).length} market sensitive  ·  Generated ${new Date().toLocaleString('en-AU')}`;

  printCards.innerHTML = state.filtered.map(a => `
    <div class="print-card${a.market_sensitive ? ' sensitive' : ''}">
      <div class="print-card-header">
        <span class="print-ticker">${escHtml(a.ticker)}</span>
        <span class="print-headline">${escHtml(a.headline)}</span>
        ${a.market_sensitive ? '<span class="print-sensitive-flag"><svg viewBox="0 0 8 8" fill="currentColor" style="width:7px;height:7px;vertical-align:middle;margin-right:4px"><circle cx="4" cy="4" r="4"/></svg>Market Sensitive</span>' : ''}
      </div>
      <div style="font-size:0.72rem;color:#888;margin-bottom:6px">${escHtml(a.company)}  ·  ${formatTime(a.time)}</div>
      <ul class="print-summary">
        ${(a.summary||[]).map(b=>`<li>${escHtml(b)}</li>`).join('')}
      </ul>
      <div class="print-tags">Tags: ${(a.tags||[]).join(', ')}</div>
    </div>
  `).join('');

  window.print();
}

/* ── Event Listeners ──────────────────────────── */

// Date picker
datePicker.addEventListener('change', e => loadDate(e.target.value));

// Search
searchInput.addEventListener('input', e => {
  state.searchQuery = e.target.value;
  searchClear.classList.toggle('visible', state.searchQuery.length > 0);
  applyFilters();
});
searchClear.addEventListener('click', () => {
  searchInput.value = '';
  state.searchQuery = '';
  searchClear.classList.remove('visible');
  applyFilters();
});

// Category tabs
categoryTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    categoryTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    state.activeCategory = tab.dataset.cat;
    applyFilters();
  });
});

// Market sensitive toggle
sensitiveToggle.addEventListener('change', e => {
  state.sensitiveOnly = e.target.checked;
  applyFilters();
});

// Modal
modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// Buttons
btnCsv.addEventListener('click', downloadCSV);
btnPrint.addEventListener('click', printReport);

// Mobile menu toggle
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
mobileMenuBtn.addEventListener("click", () => {
  document.body.classList.toggle("mobile-menu-open");
});
// Close sidebar if clicking outside on mobile
document.addEventListener("click", (e) => {
  if (document.body.classList.contains("mobile-menu-open") &&
      !e.target.closest("#sidebar") &&
      !e.target.closest("#mobile-menu-btn")) {
    document.body.classList.remove("mobile-menu-open");
  }
});

/* ── Init ─────────────────────────────────────── */
(function init() {
  const today = todayDateStr();
  datePicker.value = today;
  datePicker.max   = today;   // prevent selecting future dates
  loadDate(today);
})();
