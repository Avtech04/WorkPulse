var index = 0;
var task;
var state = "pomodoro";
var pause = 1;
var focuTime, shortTime, longTime, cycle;
var countTimer;
var playlist;
const videosContainer = document.getElementById('playlist-videos');
const mode = document.getElementById('current-mode');
const taskSpan = document.getElementById('task');
const cycleSpan = document.getElementById('cycles');

window.onload = async () => {

    await chrome.storage.local.get(["focusTime", "shortTime", "longTime", "longTimeCycle"], (res) => {
        focuTime = res.focusTime;
        shortTime = res.shortTime;
        longTime = res.longTime;
        cycle = res.longTimeCycle;
        countTimer = focuTime * 60;
        flipAllCards(countTimer);
    })

    await chrome.storage.local.get("playlist", (data) => {
        if (typeof data.playlist === 'undefined') {
            //no music added to playlist
        } else {
            playlist = data.playlist;
            console.log(playlist);
            renderVideos();

        }
    })

    await chrome.storage.local.get("index", (data) => {
        index = data.index;
    });
    await chrome.storage.local.get("remainingTask", (data) => {
        task = data.remainingTask[index];
        taskSpan.innerText = task.text;
        state = task.state;
        mode.innerText = state;
        if (state == "shortBreak") {
            shortBreak();
        } else if (state == "longBreak") {
            longBreak();
        } else {
            focusMode();
        }
    })
}


//render videos

const renderVideos = () => {
    videosContainer.innerHTML = "";
    playlist.forEach((video, index) => {

        const outerDiv = document.createElement('div');
        outerDiv.classList.add('small-div')

        const title = document.createElement('h4');
        title.classList.add('side_head')
        title.innerText = video.videoTitle;

        const vidImg = document.createElement('img');
        vidImg.setAttribute("src", `${video.videoThumbnail}`)
        vidImg.classList.add('side-img')

        const deleteBtn = document.createElement('button');
        deleteBtn.innerText = "Delete";
        deleteBtn.classList.add('delete-btn')
        deleteBtn.addEventListener('click', () => {
            deleteVideo(index);
        })

        outerDiv.append(vidImg);
        outerDiv.append(title);
        outerDiv.append(deleteBtn);
        videosContainer.append(outerDiv);
    });
}
//delete Videos
const deleteVideo = (index) => {
    playlist.splice(index, 1);
    renderVideos();
    saveVideos();
}

const saveVideos = () => {
    chrome.storage.local.set({ "playlist": playlist });
}


//countdown 

setInterval(() => {
    if (!pause) {
        countTimer = countTimer - 1;
        if (countTimer == 0) {
            pause = 1;
            if (state === "pomodoro") {
                task.completedCycle += 1;
                chrome.storage.local.get("tasks", (data) => {
                    data.tasks[index] = task;
                    chrome.storage.local.set({ "tasks": data.tasks });
                })
                if (task.completedCycle == task.pomodoroCycle) {
                    taskCompleted();
                }
                if (task.completedCycle < cycle) {
                    state = "shortBreak";
                    shortBreak();
                } else {
                    state = "longBreak";
                    longBreak();
                }
            } else {
                state = "pomodoro";
                focusMode();
            }
        } else {
            flipAllCards(countTimer);
        }

    }

}, 1000)


//start functionality
const startBtn = document.getElementById('start-btn');
startBtn.addEventListener('click', () => {
    pause = 1 - pause;
    if (pause) {
        startBtn.innerText = "Start";
    } else {
        startBtn.innerText = "Pause";
    }
})

//reset functionality
const resetBtn = document.getElementById('reset-btn');
resetBtn.addEventListener('click', () => {
    pause = 1;
    if (state == "pomodoro") {
        focusMode();
    } else if (state == "shortBreak") {
        shortBreak();
    } else {
        longBreak();
    }
    startBtn.innerText = "Start";
})

//focusmode function
const focusMode = () => {
    task.state = "pomodoro";
    saveTasks();
    console.log(focuTime);
    flipAllCards(focuTime * 60);
    console.log(focuTime);
    countTimer = focuTime * 60;
    startBtn.innerText = "Start";
    mode.innerText = "Focus";
    chrome.storage.local.set({ "state": "focus" });
}

//short Break function
const shortBreak = () => {
    task.state = "shortBreak";
    saveTasks();
    flipAllCards(shortTime * 60);
    countTimer = shortTime * 60;
    startBtn.innerText = "Start";
    mode.innerText = "Short Break";
    chrome.notifications.create(
        {
            title: 'WorkPulse',
            message: 'woahh man!! Time for short Break',
            iconUrl: './icon.png',
            type: 'basic'
        }
    );
    chrome.storage.local.set({ "state": "none" });
}

//long Break function
const longBreak = () => {
    task.state = "LongBreak";
    saveTasks();
    flipAllCards(longTime * 60);
    countTimer = longTime * 60;
    startBtn.innerText = "Start";
    mode.innerText = "Long Break";
    chrome.notifications.create(
        {
            title: 'WorkPulse',
            message: 'woahh man!! Time for Long Break',
            iconUrl: './icon.png',
            type: 'basic'
        }
    )
    chrome.storage.local.set({ "state": "none" });
}
//save Tasks
const saveTasks = () => {
    chrome.storage.local.get("tasks", (data) => {
        data.tasks[index] = task;
        chrome.storage.local.set({ "tasks": data.tasks });
    });
}
//task completed function
const taskCompleted = () => {
    task.done = true;
    saveTasks();

    chrome.notifications.create(
        {
            title: 'WorkPulse',
            message: 'Congratulations Task Completed',
            iconUrl: './icon.png',
            type: 'basic'
        }
    )
    window.location.href = "popup.html";
}



//clock updation in HTML
async function flipAllCards(time) {

    const seconds = time % 60
    const minutes = Math.floor(time / 60) % 60
    const hours = Math.floor(time / 3600)

    flip(document.querySelector("[data-hours-tens]"), Math.floor(hours / 10))
    flip(document.querySelector("[data-hours-ones]"), hours % 10)
    flip(document.querySelector("[data-minutes-tens]"), Math.floor(minutes / 10))
    flip(document.querySelector("[data-minutes-ones]"), minutes % 10)
    flip(document.querySelector("[data-seconds-tens]"), Math.floor(seconds / 10))
    flip(document.querySelector("[data-seconds-ones]"), seconds % 10)
}

function flip(flipCard, newNumber) {
    const topHalf = flipCard.querySelector(".top")
    const startNumber = parseInt(topHalf.textContent)
    if (newNumber === startNumber) return

    const bottomHalf = flipCard.querySelector(".bottom")
    const topFlip = document.createElement("div")
    topFlip.classList.add("top-flip")
    const bottomFlip = document.createElement("div")
    bottomFlip.classList.add("bottom-flip")

    top.textContent = startNumber
    bottomHalf.textContent = startNumber
    topFlip.textContent = startNumber
    bottomFlip.textContent = newNumber

    topFlip.addEventListener("animationstart", e => {
        topHalf.textContent = newNumber
    })
    topFlip.addEventListener("animationend", e => {
        topFlip.remove()
    })
    bottomFlip.addEventListener("animationend", e => {
        bottomHalf.textContent = newNumber
        bottomFlip.remove()
    })
    flipCard.append(topFlip, bottomFlip)
}

//back button
const backBtn = document.getElementById('back');
backBtn.addEventListener('click', () => {
    window.location.href = "popup.html";
})

//playing song from playlist
var play = 0;
const playBtn = document.getElementById('play-btn');
playBtn.addEventListener('click', async () => {
    if (playlist.length === 0) {
        alert("no songs added to playlist");
    } else {
        play = 1 - play;
        var video_index = 0;
        while (play == 1) {
            var windowId;
            chrome.windows.create({
                'url': `https://www.youtube.com/watch?v=${playlist[video_index].videoId}`,
                'state': 'minimized'
            }, (window) => {
                windowId = window.id;
            })
            await sleep(1000 * 60 * 3);
            chrome.windows.remove(windowId);
            video_index = video_index + 1;
            video_index = video_index % playlist.length;
        }
    }
})
//function for pausing
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}