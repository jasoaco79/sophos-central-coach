// Watches URL changes in Sophos Central and sends page context to the side panel

const PRODUCT_URL_MAP = [
  { pattern: /\/endpoint/i,   product: "endpoint" },
  { pattern: /\/mdr/i,        product: "mdr" },
  { pattern: /\/ztna/i,       product: "ztna" },
  { pattern: /\/email/i,      product: "email" },
  { pattern: /\/itdr|\/identity/i, product: "itdr" },
  { pattern: /\/firewall/i,   product: "firewall" },
  { pattern: /\/xdr|\/taegis/i, product: "taegis" },
  { pattern: /\/ndr/i,        product: "ndr" },
  { pattern: /\/risk/i,       product: "risk" },
  { pattern: /\/advisory/i,   product: "advisory" },
  { pattern: /\/server/i,     product: "server" },
  { pattern: /\/encryption/i, product: "encryption" },
  { pattern: /\/mobile/i,     product: "mobile" },
  { pattern: /\/wireless/i,   product: "wireless" },
  { pattern: /\/switches/i,   product: "switches" },
  { pattern: /\/dns/i,        product: "dns" },
  { pattern: /\/browser/i,    product: "browser" },
  { pattern: /\/phish/i,      product: "phish" },
];

function detectProduct(url) {
  const path = new URL(url).pathname;
  for (const entry of PRODUCT_URL_MAP) {
    if (entry.pattern.test(path)) return entry.product;
  }
  return null;
}

function sendContext(url) {
  const product = detectProduct(url);
  chrome.runtime.sendMessage({
    type: "PAGE_CONTEXT",
    payload: {
      url,
      path: new URL(url).pathname,
      product,
      title: document.title,
    },
  }).catch(() => {});
}

// Fire on initial load
sendContext(location.href);

// Watch for SPA navigation via History API
const originalPushState = history.pushState.bind(history);
const originalReplaceState = history.replaceState.bind(history);

history.pushState = (...args) => {
  originalPushState(...args);
  sendContext(location.href);
};

history.replaceState = (...args) => {
  originalReplaceState(...args);
  sendContext(location.href);
};

window.addEventListener("popstate", () => sendContext(location.href));
