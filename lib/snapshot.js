export function textOf(el) {
  return (el?.innerText || el?.textContent || '').replace(/\s+/g, ' ').trim();
}

export function collectTexts(selector, limit = 20) {
  return [...document.querySelectorAll(selector)]
    .map(textOf)
    .filter(Boolean)
    .slice(0, limit);
}

export function collectActions(limit = 40) {
  const seen = new Set();
  const actions = [];

  for (const el of document.querySelectorAll('button, [role="button"], a, input[type="button"], input[type="submit"]')) {
    const label = textOf(el) || el.getAttribute('aria-label') || el.getAttribute('title') || '';
    const normalized = label.trim();
    if (!normalized) continue;
    if (seen.has(normalized.toLowerCase())) continue;
    seen.add(normalized.toLowerCase());
    actions.push(normalized);
    if (actions.length >= limit) break;
  }

  return actions;
}

export function collectSections(limit = 12) {
  const candidates = [...document.querySelectorAll('section, article, main > div, [role="region"], .card, [data-testid]')];
  const sections = [];

  for (const el of candidates) {
    const heading = el.querySelector('h1, h2, h3, h4, [role="heading"]');
    const title = textOf(heading);
    if (!title) continue;
    sections.push({ type: 'section', title });
    if (sections.length >= limit) break;
  }

  return sections;
}

export function collectTableSummaries(limit = 6) {
  const tables = [...document.querySelectorAll('table, [role="table"], [role="grid"]')];
  return tables.slice(0, limit).map((table, index) => {
    const headers = [...table.querySelectorAll('th, [role="columnheader"]')].map(textOf).filter(Boolean).slice(0, 8);
    const rows = [...table.querySelectorAll('tbody tr, [role="row"]')]
      .map((row) => textOf(row))
      .filter(Boolean)
      .slice(0, 5);
    return {
      id: `table-${index + 1}`,
      headers,
      rows
    };
  });
}

export function collectEntities(limit = 20) {
  const corpus = [
    document.title,
    ...collectTexts('h1, h2, h3, h4', 20),
    ...collectTexts('table, [role="table"], [role="grid"]', 10),
    ...collectTexts('[data-testid], .card, [role="region"]', 20)
  ].join(' ');

  const matches = corpus.match(/\b([A-Z0-9._-]{4,}|[A-Z][a-z]+\.[A-Z][a-z]+|[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})\b/g) || [];
  const unique = [];
  const seen = new Set();

  for (const match of matches) {
    const cleaned = match.trim();
    const key = cleaned.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(cleaned);
    if (unique.length >= limit) break;
  }

  return unique;
}

export function buildPageSnapshot() {
  const title = document.title || '';
  const url = location.href;
  const pathname = location.pathname || '/';
  const headings = collectTexts('h1, h2, h3', 20);
  const actions = collectActions(40);
  const sections = collectSections(12);
  const tables = collectTableSummaries(6);
  const entities = collectEntities(20);
  const rawTextSummary = textOf(document.body).slice(0, 4000);

  return {
    id: `snapshot-${Date.now()}`,
    timestamp: new Date().toISOString(),
    sourceApp: 'unknown',
    url,
    title,
    route: pathname,
    headings,
    actions,
    sections,
    tables,
    entities,
    rawTextSummary
  };
}
