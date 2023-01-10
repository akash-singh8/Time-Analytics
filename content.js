setInterval(function () {
  chrome.runtime.sendMessage({ content: "hello" });
}, 10000);
