// document.getElementById('openWebpage').addEventListener('click', function() {
//     chrome.tabs.create({ url: 'https://youtube.com' }); 
// });

 var remainingTask,completedTask;
 var pomodoroTime=Number(25);
 window.onload=()=>{
    refreshTasks();
 }

 //reload the tasks

 const refreshTasks=()=>{
    chrome.storage.local.get("tasks",(data)=>{
        console.log(data.tasks);
         remainingTask=data.tasks.filter((task)=>{
            return task.done===false;
         })
         completedTask=data.tasks.filter((task)=>{
            return task.done===true;
         })
         renderTasks();
    })
 }


 //add tasks
const addTaskInput=document.getElementById('task-input');
addTaskInput.addEventListener('keypress',(event)=>{
    if(event.key=='Enter'&&addTaskInput.value!=""){
        addTask();
    }
})
const addTask=()=>{
    // const clk=document.getElementById('clock');
    // var val=Number(clk.innerText);
    var val=4;
    const task={
        text:addTaskInput.value,
        pomodoroCycle:val,
        done:false,
        completedCycle:0
    }
    addTaskInput.value="";
    chrome.storage.local.get("tasks",(data)=>{
        if(typeof data.tasks==='undefined'){
            data.tasks=[task];
        }else{
        data.tasks.push(task);
        }
        chrome.storage.local.set({"tasks":data.tasks});
        refreshTasks();
    })
    
    
}


//update the total time, elapsed time, remaining task, completed task
const updateSecondCotainer=()=>{
    
    const remTaskCount=document.getElementById('task-cnt');
    remTaskCount.innerText=remainingTask.length;

    const comTaskCount=document.getElementById('comp-task-cnt');
    comTaskCount.innerText=completedTask.length;

    var remTotalTime=0;
    var elapTotalTime=0;

    remainingTask.forEach((task) => {
        
        remTotalTime+=(Number(task.pomodoroCycle))*pomodoroTime;
        console.log(remTotalTime);
    });

    completedTask.forEach((task)=>{
        elapTotalTime+=(Number(task.pomodoroCycle))*pomodoroTime;
    })

    var hour=Math.floor((remTotalTime+elapTotalTime)/60);
    var min=(remTotalTime+elapTotalTime)%60
    const totalTime=document.getElementById('total-time');
    if(hour){
        totalTime.innerText=hour+" h "+ min+" min";
    }else{
        totalTime.innerText=min+" min";
    }
}

//Render Tasks

const renderTasks=()=>{
    updateSecondCotainer();
    remainingTask.forEach((task)=>{
        renderTask(task);
    })
}
const taskContainer=document.getElementById('tasks');
const renderTask=(task)=>{
    const taskRow=document.createElement('div');
    taskRow.classList.add('task-row');


    const text=document.createElement('span');
    text.innerText=task.text;
    text.classList.add('pp1')


    const startBtn=document.createElement('button');
    startBtn.innerText="Start";
    startBtn.classList.add('pp2')


    const cycle=document.createElement('span');
    cycle.innerText=task.completedCycle+'/'+task.pomodoroCycle;
    cycle.classList.add('cycles')


    taskRow.appendChild(text);
    taskRow.appendChild(startBtn);
    taskRow.appendChild(cycle);
    taskContainer.appendChild(taskRow);
}

