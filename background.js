// chrome.runtime.onInstalled.addListener(({reason}) => {
//     if (reason === 'install') {
//       chrome.tabs.create({
//         url: "popup.html"
//       });
//     }
//   });


  // const maxWidth = window.screen.availWidth;
  // const maxHeight = window.screen.availHeight;
  // console.log(maxWidth);

  chrome.action.onClicked.addListener(function(tab) {
    chrome.windows.create({
      'url': 'popup.html',
      'type': 'popup',
      'width': 1000,
      'height': 800
    });
  });

  chrome.storage.local.get(["focusTime", "shortTime", "longTime","longTimeCycle"], (res) => {
    chrome.storage.local.set({
        focusTime: "focusTime" in res ? res.focusTime : 25,
        shortTime: "shortTime" in res ? res.shortTime : 5,
        longTime: "longTime" in res ? res.longTime : 15,
        longTimeCycle:"longTimeCycle" in res ? res.longTimeCycle:4
    })
})