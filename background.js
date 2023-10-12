chrome.runtime.onInstalled.addListener(({reason}) => {
    if (reason === 'install') {
      chrome.tabs.create({
        url: "popup.html"
      });
    }
  });
  
  chrome.storage.local.get(["focusTime", "shortTime", "longTime","longTimeCycle"], (res) => {
    chrome.storage.local.set({
        focusTime: "focusTime" in res ? res.focusTime : 25,
        shortTime: "shortTime" in res ? res.shortTime : 5,
        longTime: "longTime" in res ? res.longTime : 15,
        longTimeCycle:"longTimeCycle" in res ? res.longTimeCycle:4
    })
})