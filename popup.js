
var remainingTask, completedTask;
var focusTime=25;
var cycleCount=4;

window.onload = async () => {
    await chrome.storage.local.get(["focusTime","longTimeCycle"], (res) => {
        focusTime=res.focusTime;
        cycleCount=res.longTimeCycle;
    })
    refreshTasks();
}

//reload the tasks

const refreshTasks = () => {
    taskContainer.innerHTML = "";
    chrome.storage.local.get("tasks", (data) => {
        console.log(data.tasks);
        remainingTask = data.tasks.filter((task) => {
            return task.done === false;
        })
        completedTask = data.tasks.filter((task) => {
            return task.done === true;
        })
        renderTasks();
    })
}


//add tasks
const addTaskInput = document.getElementById('task-input');
addTaskInput.addEventListener('keypress', (event) => {
    if (event.key == 'Enter' && addTaskInput.value != "") {
        addTask();
    }
})
const addTask = () => {
    const task = {
        text: addTaskInput.value,
        pomodoroCycle: cycleCount,
        done: false,
        completedCycle: 0,
        index: 0,
    }
    addTaskInput.value = "";
    chrome.storage.local.get("tasks", (data) => {
        if (typeof data.tasks === 'undefined') {
            data.tasks = [task];
        } else {
            task.index = data.tasks.length;
            data.tasks.push(task);
        }
        chrome.storage.local.set({ "tasks": data.tasks });
        refreshTasks();
    })


}


//update the total time, elapsed time, remaining task, completed task
const updateSecondCotainer = async() => {

    console.log(focusTime);
    const remTaskCount = document.getElementById('task-cnt');
    remTaskCount.innerText = remainingTask.length;

    const comTaskCount = document.getElementById('comp-task-cnt');
    comTaskCount.innerText = completedTask.length;

    var remTotalTime = 0;
    var elapTotalTime = 0;

    remainingTask.forEach((task) => {

        remTotalTime += (Number(task.pomodoroCycle)) * focusTime;
        console.log(remTotalTime);
    });

    completedTask.forEach((task) => {
        elapTotalTime += (Number(task.pomodoroCycle)) * focusTime;
    })

    
    const estimateTime = document.getElementById('estimated-time');
    timeCalculator(remTotalTime,estimateTime);
    const  elapsedTime=document.getElementById('elapsed-time');
    
    timeCalculator(elapTotalTime,elapsedTime);

}

const timeCalculator=(time,element)=>{
    var hour = Math.floor((time) / 60);
    var min = (time) % 60
    if (hour) {
        element.innerText = hour + " h " + min + " min";
    } else {
        element.innerText = min + " min";
    }
}


//Render Tasks

const renderTasks = () => {
    updateSecondCotainer();
    remainingTask.forEach((task, index) => {
        renderTask(task, index);
    })
}
const taskContainer = document.getElementById('tasks');
const renderTask = (task, index) => {
    const taskRow = document.createElement('div');
    taskRow.classList.add('task-row');


    const text = document.createElement('span');
    text.innerText = task.text;
    text.classList.add('pp1')


    const startBtn = document.createElement('button');
    startBtn.innerText = "Start";
    startBtn.classList.add('pp2');


    const deletBtn = document.createElement('button');
    deletBtn.innerText = "Remove";
    deletBtn.classList.add('remove');

    startBtn.addEventListener('click', () => {
        chrome.storage.local.set({ "index": index });
        chrome.storage.local.set({ "remainingTask": remainingTask });
        window.location.href = "timer.html";
    })


    const cycle = document.createElement('span');
    cycle.innerText = task.completedCycle + '/' + task.pomodoroCycle;
    cycle.classList.add('cycles')


    taskRow.appendChild(text);
    taskRow.appendChild(startBtn);
    taskRow.appendChild(deletBtn);
    taskRow.appendChild(cycle);
    taskContainer.appendChild(taskRow);
}

//
const createPlaylist=document.getElementById('create-playlist');
createPlaylist.addEventListener('click',()=>{
    window.location.href="search.html";
})