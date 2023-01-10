setInterval(function () {
  chrome.runtime.sendMessage({ content: "hello" }, function (response) {
    console.log(response);
  });
}, 10000);
