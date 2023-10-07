document.getElementById('openWebpage').addEventListener('click', function() {
    chrome.tabs.create({ url: 'https://youtube.com' }); 
});
