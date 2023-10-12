const searchBtn=document.getElementById('search-btn');
const searchInput=document.getElementById('search');

// Replace 'YOUR_API_KEY' with your actual API key.
const API_KEY = 'AIzaSyBtRXOjmAeybXF6jImnkQ-R3NSFIosRGss';
const API_URL = 'https://www.googleapis.com/youtube/v3/search';

// Function to perform the YouTube API request and display results.
function searchYouTubeVideos(query) {
    $.get(API_URL, {
        part: 'snippet',
        q: query,
        key: API_KEY
    }, function(data) {
        // Handle the API response (data.items contains the video results).
        const videosContainer = $('#videos');
        videosContainer.empty(); // Clear previous results

        // Iterate through the video items and display them.
        data.items.forEach(function(item) {
            const videoId = item.id.videoId;
            const videoTitle = item.snippet.title;
            const videoThumbnail = item.snippet.thumbnails.medium.url;

            // Create a new video element and append it to the videos container.
            const videoElement = `<div>
                                    <h2>${videoTitle}</h2>
                                    <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">
                                        <img src="${videoThumbnail}" alt="${videoTitle}">
                                    </a>
                                   </div>`;
            videosContainer.append(videoElement);
        });
    });
}



searchBtn.addEventListener('click',()=>{
    var searchTxt=searchInput.value;
    console.log(searchTxt);
    searchYouTubeVideos(`${searchTxt} videos`);
})