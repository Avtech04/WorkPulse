var index = 0;
var task;
var state = "pomodoro";
var pause = 1;

//retriving data of task
const taskSpan = document.getElementById('task');
const cycleSpan = document.getElementById('cycles');
chrome.storage.local.get("index", (data) => {
    index = data.index;
});
chrome.storage.local.get("remainingTask", (data) => {
    task = data.remainingTask[index];
    taskSpan.innerText = task.text;
})


//countdown 
var countTimer = 1 * 60;
flipAllCards(countTimer);
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
                if (task.completedCycle < 4) {
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
    cycleSpan.innerText = task.completedCycle + '/' + task.pomodoroCycle;
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
    flipAllCards(25 * 60);
    countTimer = 25 * 60;
    startBtn.innerText = "Start";
}

//short Break function
const shortBreak = () => {
    flipAllCards(5 * 60);
    countTimer = 5 * 60;
    startBtn.innerText = "Start";
    chrome.notifications.create(
        {
            title: 'WorkPulse',
            message: 'woahh man!! Time for short Break',
            iconUrl: './icon.png',
            type: 'basic'
        }
    )
}

//long Break function
const longBreak = () => {
    flipAllCards(15 * 60);
    countTimer = 15 * 60;
    startBtn.innerText = "Start";
    chrome.notifications.create(
        {
            title: 'WorkPulse',
            message: 'woahh man!! Time for Long Break',
            iconUrl: './icon.png',
            type: 'basic'
        }
    )
}

//task completed function
const taskCompleted = () => {
    task.done = true;
    chrome.storage.local.get("tasks", (data) => {
        data.tasks[index] = task;
        chrome.storage.local.set({ "tasks": data.tasks });
    });

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
function flipAllCards(time) {

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