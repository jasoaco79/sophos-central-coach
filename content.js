// Injected into all pages. Builds a page snapshot and responds to analysis requests.

function textOf(el) {
  return (el?.innerText || el?.textContent || '').replace(/\s+/g, ' ').trim();
}

function collectTexts(selector, limit = 20) {
  return [...document.querySelectorAll(selector)].map(textOf).filter(Boolean).slice(0, limit);
}

function collectActions(limit = 40) {
  const seen = new Set();
  const actions = [];
  for (const el of document.querySelectorAll('button, [role="button"], a, input[type="button"], input[type="submit"]')) {
    const label = textOf(el) || el.getAttribute('aria-label') || el.getAttribute('title') || '';
    const normalized = label.trim();
    if (!normalized || seen.has(normalized.toLowerCase())) continue;
    seen.add(normalized.toLowerCase());
    actions.push(normalized);
    if (actions.length >= limit) break;
  }
  return actions;
}

function collectSections(limit = 12) {
  const sections = [];
  for (const el of document.querySelectorAll('section, article, main > div, [role="region"], .card, [data-testid]')) {
    const heading = el.querySelector('h1, h2, h3, h4, [role="heading"]');
    const title = textOf(heading);
    if (!title) continue;
    sections.push({ type: 'section', title });
    if (sections.length >= limit) break;
  }
  return sections;
}

function collectTableSummaries(limit = 6) {
  return [...document.querySelectorAll('table, [role="table"], [role="grid"]')].slice(0, limit).map((table, index) => ({
    id: `table-${index + 1}`,
    headers: [...table.querySelectorAll('th, [role="columnheader"]')].map(textOf).filter(Boolean).slice(0, 8),
    rows: [...table.querySelectorAll('tbody tr, [role="row"]')].map(textOf).filter(Boolean).slice(0, 5),
  }));
}

function collectEntities(limit = 20) {
  const corpus = [
    document.title,
    ...collectTexts('h1, h2, h3, h4', 20),
    ...collectTexts('table, [role="table"], [role="grid"]', 10),
    ...collectTexts('[data-testid], .card, [role="region"]', 20),
  ].join(' ');
  const matches = corpus.match(/\b([A-Z0-9._-]{4,}|[A-Z][a-z]+\.[A-Z][a-z]+|[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})\b/g) || [];
  const seen = new Set();
  const out = [];
  for (const match of matches) {
    const key = match.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(match);
    if (out.length >= limit) break;
  }
  return out;
}

function buildPageSnapshot() {
  return {
    id: `snapshot-${Date.now()}`,
    timestamp: new Date().toISOString(),
    url: location.href,
    title: document.title || '',
    route: location.pathname || '/',
    headings: collectTexts('h1, h2, h3', 20),
    actions: collectActions(40),
    sections: collectSections(12),
    tables: collectTableSummaries(6),
    entities: collectEntities(20),
    rawTextSummary: textOf(document.body).slice(0, 4000),
  };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === 'WATCHMAN_ANALYZE_PAGE') {
    sendResponse(buildPageSnapshot());
  }
});
