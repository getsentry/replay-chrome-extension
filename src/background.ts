function polling() {
  // console.log("polling");
  setTimeout(polling, 1000 * 30);
}

// polling();


console.log('background');
chrome.runtime.onConnect.addListener(function (...args) {
  console.log('onConnect', ...args)

  chrome.storage.sync.get(['enabled','dsn'], (items) => {
    if (!items.enabled) {
      console.log('disabled');
      return;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tab = tabs[0];

      if (!tab.id) {
        return;
      }

      chrome.tabs.sendMessage(
        tab.id,
        {
          action: 'inject',
          dsn: items.dsn,
        },
        (msg) => {
          console.log("result message:", msg);
        }
      );
    });
  });
});
