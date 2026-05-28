// State
let currentProduct = null;
let currentScreen = null;
let currentTab = "talk";
let currentAudience = "IT Manager";

// Elements
const productLabel = document.getElementById("product-label");
const audienceSelect = document.getElementById("audience-select");
const tabBar = document.getElementById("tab-bar");
const panelContent = document.getElementById("panel-content");

// ── Tab switching ──
tabBar.addEventListener("click", (e) => {
  const btn = e.target.closest(".tab");
  if (!btn) return;
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  btn.classList.add("active");
  currentTab = btn.dataset.tab;
  render();
});

// ── Audience switching ──
audienceSelect.addEventListener("change", () => {
  currentAudience = audienceSelect.value;
  if (currentTab === "discovery") render();
});

// ── Listen for page context from background ──
chrome.runtime.onMessage.addListener((message) => {
  if (message.type !== "PAGE_CONTEXT") return;
  const { product } = message.payload;
  if (product && product !== currentProduct) {
    currentProduct = product;
    currentScreen = null;
    updateProductLabel();
    render();
  }
});

function updateProductLabel() {
  if (!currentProduct || !window.PRODUCTS?.[currentProduct]) {
    productLabel.textContent = "Waiting for page...";
    return;
  }
  productLabel.textContent = window.PRODUCTS[currentProduct].name;
}

function getScreenOptions(product) {
  return (product.screens || []).map((s, i) => ({ ...s, index: i }));
}

function buildScreenSelector(screens) {
  const wrap = document.createElement("div");
  wrap.className = "screen-select-wrap";
  const sel = document.createElement("select");
  sel.id = "screen-select";
  screens.forEach((s, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = s.name;
    if (currentScreen === i) opt.selected = true;
    sel.appendChild(opt);
  });
  sel.addEventListener("change", () => {
    currentScreen = parseInt(sel.value, 10);
    render();
  });
  wrap.appendChild(sel);
  return wrap;
}

// ── Renderers ──

function renderTalk(product) {
  const screens = getScreenOptions(product);
  if (!screens.length) return html("<p class='no-product'>No screens defined for this product.</p>");

  if (currentScreen === null) currentScreen = 0;
  const screen = screens[currentScreen];

  const frag = document.createDocumentFragment();
  frag.appendChild(buildScreenSelector(screens));

  // What
  const what = card("what this shows", `<p>${screen.what}</p>`);
  frag.appendChild(what);

  // Talk
  const talkContent = `<div class="talk-quote">${screen.talk}</div>`;
  const pointsHtml = screen.points?.length
    ? `<ul class="points-list">${screen.points.map(p => `<li>${p}</li>`).join("")}</ul>`
    : "";
  const talkCard = card("talk track", talkContent + pointsHtml, "talk-block");
  frag.appendChild(talkCard);

  // Action
  if (screen.action) {
    const actionDiv = document.createElement("div");
    actionDiv.className = "action-block";
    actionDiv.innerHTML = `<div class="action-label">On screen</div>${screen.action}`;
    frag.appendChild(actionDiv);
  }

  return frag;
}

function renderDiscovery(product) {
  const questions = product.discoveryByAudience?.[currentAudience] || [];
  if (!questions.length) return html("<p class='no-product'>No discovery questions for this audience.</p>");

  const frag = document.createDocumentFragment();
  const c = card(currentAudience, questions.map((q, i) =>
    `<div class="question-item"><span class="q-num">${i + 1}</span><span class="q-text">${q}</span></div>`
  ).join(""));
  frag.appendChild(c);
  return frag;
}

function renderObjections(product) {
  if (!product.objections?.length) return html("<p class='no-product'>No objections defined.</p>");
  const frag = document.createDocumentFragment();
  const inner = product.objections.map(o =>
    `<div class="objection-item"><div class="objection-q">${o.q}</div><div class="objection-a">${o.a}</div></div>`
  ).join("");
  frag.appendChild(card("objection handlers", inner));
  return frag;
}

function renderCompete(product) {
  if (!product.competitors?.length) return html("<p class='no-product'>No competitive data defined.</p>");
  const frag = document.createDocumentFragment();
  product.competitors.forEach(c => {
    const points = c.points.map(p => `<li>${p}</li>`).join("");
    frag.appendChild(card(c.name,
      `<div class="compete-name">${c.name}</div><ul class="compete-points">${points}</ul>`
    ));
  });
  return frag;
}

function render() {
  panelContent.innerHTML = "";

  if (!currentProduct || !window.PRODUCTS?.[currentProduct]) {
    panelContent.innerHTML = `<div class="empty-state"><p>Navigate to a product page in Sophos Central to load coaching content.</p></div>`;
    return;
  }

  const product = window.PRODUCTS[currentProduct];

  let content;
  switch (currentTab) {
    case "talk":       content = renderTalk(product); break;
    case "discovery":  content = renderDiscovery(product); break;
    case "objections": content = renderObjections(product); break;
    case "compete":    content = renderCompete(product); break;
    default:           content = html("<p class='no-product'>Unknown tab.</p>");
  }

  panelContent.appendChild(content);
}

// ── Helpers ──

function card(label, innerHtml, extraClass = "") {
  const div = document.createElement("div");
  div.className = `card ${extraClass}`.trim();
  div.innerHTML = `<div class="card-label">${label}</div>${innerHtml}`;
  return div;
}

function html(str) {
  const div = document.createElement("div");
  div.innerHTML = str;
  return div;
}
