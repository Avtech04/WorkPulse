const focusInput=document.getElementById('focusInput');
const shortInput=document.getElementById('shortInput');
const longInput=document.getElementById('longInput');
const cycle=document.getElementById('cycleInput');
const saveBtn=document.getElementById('save-btn');


window.onload=()=>{
    chrome.storage.local.get(["focusTime", "shortTime", "longTime","longTimeCycle"], (res) => {
        focusInput.value=res.focusTime;
        shortInput.value=res.shortTime;
        longInput.value=res.longTime;
        cycle.value=res.longTimeCycle;
    })
}
saveBtn.addEventListener('click',()=>{
    chrome.storage.local.set({
        focusTime: focusInput.value<=60 ? focusInput.value : 25,
        shortTime: shortInput.value<=15 ? shortInput.value : 5,
        longTime: longInput.value<=30 ?longInput.value : 15,
        longTimeCycle:cycle.value
    })
    window.location.reload();
})