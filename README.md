# Sophos Central Coach

A Chrome extension that surfaces contextual coaching content from the Sophos Field Guide while you navigate Sophos Central — talk tracks, discovery questions, objections, and competitive intel, right next to the live product.

## How it works

1. Install the extension (unpacked, see below)
2. Navigate to Sophos Central (`cloud.sophos.com`)
3. Click the extension icon to open the coaching sidebar
4. As you navigate between products the sidebar automatically updates

## Install

1. Clone this repo
2. Populate product data (see below)
3. Open Chrome → `chrome://extensions` → Enable Developer Mode
4. Click **Load unpacked** → select this directory

## Populate product data

You need a copy of `sophos-field-guide.html` to extract the product data:

```bash
node scripts/extract-products.js /path/to/sophos-field-guide.html
```

This writes `data/products.js` — reload the extension in Chrome after running it.

## Icons

Drop icon files into the `icons/` directory:
- `icon16.png`
- `icon32.png`
- `icon48.png`
- `icon128.png`

## Structure

```
manifest.json          — Chrome MV3 manifest
background.js          — Service worker, opens side panel on click
content.js             — Detects Sophos Central page, sends context to panel
sidepanel.html/js/css  — The coaching sidebar UI
data/products.js       — Product data (generated from field guide)
scripts/               — extract-products.js utility
```
