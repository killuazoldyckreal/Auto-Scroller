chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'reloadTab') {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            const currentTab = tabs[0];
            if (currentTab) {
                chrome.tabs.reload(currentTab.id);
            }
        });
    }
});
