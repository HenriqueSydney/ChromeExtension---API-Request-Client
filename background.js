/* eslint-disable no-undef */
try {
chrome.runtime.onInstalled.addListener(() => {
    console.log("Service worker registered");
  });
  
  chrome.action.onClicked.addListener(() => {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        const activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { type: "popup-modal" })
    })
    // chrome.scripting.executeScript({
    //   target: { tabId: tab.id },
    //   function: () => { /* empty function */ }
    // }).then(() => {
    //   // Content script is injected, send the message
    //   chrome.runtime.sendMessage({ type: "popup-modal" }, (response) => {
    //     console.log(response);
    //   });
    // }).catch(() => {
    //   // Content script not injected, handle the error (optional)
    //   console.error("Content script not injected!");
    // });
  });  
  
} catch (e) {
    console.error(e);
}