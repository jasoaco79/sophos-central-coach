// Open side panel when the action button is clicked on a Sophos Central tab
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch(console.error);

// Forward page-context messages from content script to side panel
chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type === "PAGE_CONTEXT") {
    chrome.runtime.sendMessage({ type: "PAGE_CONTEXT", payload: message.payload }).catch(() => {
      // Side panel not open yet — ignore
    });
  }
});
