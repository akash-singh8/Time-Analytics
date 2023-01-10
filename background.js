chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  // Clear local storage data every day
  chrome.storage.local.get(["prevDate"], function (result) {
    if (!result.prevDate) {
      const date = new Date();
      chrome.storage.local.set({ prevDate: [date.getDate() * 100000] });
    } else {
      const curr = new Date();
      if (curr.getDate() != result.prevDate[0] / 100000) {
        chrome.storage.local.clear();
      }
    }
  });

  // Updating or Adding website details in local storage
  async function getTabs() {
    const tabs = await chrome.tabs.query({ currentWindow: true });
    const [tab] = await chrome.tabs.query({ active: true });

    const url = new URL(tab.url);
    const urlP = url.protocol;
    let site = url.hostname;
    if (site.startsWith("www.")) {
      site = site.slice(4);
    }

    if (
      urlP !== "edge:" &&
      urlP !== "file:" &&
      urlP !== "chrome:" &&
      urlP !== "brave:"
    ) {
      chrome.storage.local.get([site], function (result) {
        let data = {};
        const siteData = result[site];
        if (siteData) {
          // console.log("Tabs length : ", tabs.length);
          data[site] = [
            siteData[0] + (tabs.length ? Math.floor(11 / tabs.length) : 10),
            tab.favIconUrl,
          ];
        } else {
          data[site] = [0, tab.favIconUrl];
        }
        // console.log(data);
        chrome.storage.local.set(data);
      });
    }
  }

  getTabs();

  console.log(message);
  sendResponse({ executing: true });
});
