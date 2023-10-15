const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search');

// Replace 'YOUR_API_KEY' with your actual API key.
const API_KEY = 'AIzaSyBtRXOjmAeybXF6jImnkQ-R3NSFIosRGss';
const API_URL = 'https://www.googleapis.com/youtube/v3/search';

// Function to perform the YouTube API request and display results.
function searchYouTubeVideos(query) {
    $.get(API_URL, {
        part: 'snippet',
        //part:'contentDetails',
        q: query,
        key: API_KEY
    }, function (data) {
        // Handle the API response (data.items contains the video results).
        const videosContainer = $('#videos');
        videosContainer.empty(); // Clear previous results

        // Iterate through the video items and display them.
        data.items.forEach(function (item, index) {
            console.log(item);
            const videoId = item.id.videoId;
            const videoTitle = item.snippet.title;
            const videoThumbnail = item.snippet.thumbnails.medium.url;

            // Create a new video element and append it to the videos container.
            const videoElement = `<div class="video-box">
                                        <img src="${videoThumbnail}" alt="${videoTitle}" class="imgg">
                                        <h3 style="
                                    font-size: 12px;height: 4vh;
                                ">${videoTitle}</h3>
                                        <button class="play" id="add-playlist-${index}">Add to PlayList</button>
                                   </div>`;

            videosContainer.append(videoElement);
            const addVideo = document.getElementById(`add-playlist-${index}`);
            var vidIndex = 0;
            addVideo.addEventListener('click', () => {
                var video = {
                    vidIndex,
                    videoId,
                    videoThumbnail,
                    videoTitle
                }
                chrome.storage.local.get("playlist", (data) => {
                    if (typeof data.playlist === 'undefined') {
                        data.playlist = [video];
                    } else {
                        video.vidIndex = data.playlist.length;
                        data.playlist.push(video);
                    }
                    chrome.storage.local.set({ "playlist": data.playlist });
                })
            })

        });
    });
}



searchBtn.addEventListener('click', () => {
    var searchTxt = searchInput.value;
    console.log(searchTxt);
    searchYouTubeVideos(`${searchTxt} videos`);
})

//back
const backBtn = document.getElementById('back');
backBtn.addEventListener('click', () => {
    window.location.href = "popup.html";
})