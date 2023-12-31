// changes "tabs" in popup
let renderTab = (curTab, curButton) =>
{
    let elements = document.querySelectorAll(".tab");
    console.log(elements);
    // make everthing invisible
    for (let i = 0; i < elements.length; i++)
    {
        //console.log(elements[i]);
        elements[i].style.display = "none";
    }

    let buttons = document.querySelectorAll(".button");
    console.log(buttons);
    // make correct one visible
    for (let i = 0; i < buttons.length; i++) 
    {
        //console.log(buttons[i]);
        buttons[i].className = "topButtonUnselected button"
    }

    let e = document.getElementById(curTab);
    e.style.display = "block";
    let b = document.getElementById(curButton);
    b.className = "topButtonSelected button";
};

// initial open tab, which is the notepad (currently clock for testing)
renderTab("clock", "notepadButton");

// define buttons
let notepadButton = document.getElementById("notepadButton");
let clockButton = document.getElementById("clockButton");

// tab
notepadButton.onclick = function()
{
    renderTab("notepad", "notepadButton");
};
clockButton.onclick = function()
{
    renderTab("clock", "clockButton");
};




// sends all notepad inputs to background script to be stored
document.addEventListener('DOMContentLoaded', function() {
    let userInputTextarea = document.getElementById('notepad');
  
    // attach an input event listener to the textarea
    userInputTextarea.addEventListener('input', function() {
        // send value of textarea to background so it can save it
        chrome.runtime.sendMessage({ message: "notepad", notepad: userInputTextarea.value });
    });
});




// stopwatch
let stopwatchStartButton = document.getElementById("stopwatchStartButton");
let stopwatchStopButton = document.getElementById("stopwatchStopButton");
let stopwatchResetButton = document.getElementById("stopwatchResetButton");

let stopwatchTime = document.getElementById("stopwatchTime");
let swSeconds = 0;
let swMinutes = 0;
let swHours = 0;
let swDays = 0;

let stopwatchInterval;

let swTimeSet = () =>
{
    // correct the clock
    if (swSeconds >= 60)
    {
        swSeconds = 0;
        swMinutes++;
    }
    if (swMinutes >= 60)
    {
        swMinutes = 0;
        swHours++;
    }
    if (swHours >= 24)
    {
        swHours = 0;
        swDays++;
    }

    let swTimeDisplay = swSeconds + "s";

    if (swMinutes > 0)
    {
        swTimeDisplay = swMinutes + "m " + swTimeDisplay;
    }
    if (swHours > 0)
    {
        swTimeDisplay = swHours + "h " + swTimeDisplay;
    }
    if (swDays > 0)
    {
        swTimeDisplay = swDays + "d " + swTimeDisplay;
    }

    stopwatchTime.textContent = swTimeDisplay;
}
/*
let increaseSWTIME = () =>
{
    swSeconds++;
    swTimeSet();
};
function stopwatchRun()
{
    return setInterval(function() {
        increaseSWTIME();
    }, 1000);
}
*/

// start stopwatch
stopwatchStartButton.onclick = function()
{
    chrome.runtime.sendMessage({ message: "stopwatch", swRunOrNot: true });
    alert("SENT");
};
// stop stopwatch
stopwatchStopButton.onclick = function()
{
    chrome.runtime.sendMessage({ message: "stopwatch", swRunOrNot: false });
};
// reset stopwatch (also stops stopwatch)
stopwatchResetButton.onclick = function()
{
    swSeconds = 0;
    swMinutes = 0;
    swHours = 0;
    stopwatchTime.textContent = "0s";

    
};



// when popup is opened
window.onload = function()
{
    chrome.storage.local.clear();

    // sets things to whatever they were before
    (async () => {
        // changes notepad to previous value
        {
            const result = await new Promise((resolve) => // Wait for the result of chrome.storage.local.get using async/await
                chrome.storage.local.get("msg", resolve)
            );

            const notepadMsg = result.msg;
            document.getElementById("notepad").textContent = notepadMsg;
            console.log("Value currently is " + notepadMsg);
        }

        // changes stopwatch to display correct passing of time
        {
            /*
            const stopwatchRunOrNot = await new Promise((resolve) => // Wait for the result of chrome.storage.local.get using async/await
                chrome.storage.local.get("stopwatchStarted", resolve)
            );

            const stopwatchRunOrNotVal = stopwatchRunOrNot.stopwatchStarted;
            console.log("STOPWATCH IS: " + stopwatchRunOrNotVal);
            stopwatchTime.textContent = "loading...";
            if (stopwatchRunOrNotVal)
            {
                stopwatchInterval = stopwatchRun();
            }

            const stopwatchStartTime = await new Promise((resolve) => // Wait for the result of chrome.storage.local.get using async/await
                chrome.storage.local.get("stopwatchStartTime", resolve)
            );

            const stopwatchTimeVal = stopwatchStartTime.stopwatchStartTime;
            console.log("STARTING TIME: " + stopwatchTimeVal);

            // find time difference
            const currentTime = new Date();
            const timeDifference = currentTime - stopwatchTimeVal;

            // convert milliseconds into days, hours, minutes, and seconds
            const millisecondsPerSecond = 1000;
            const millisecondsPerMinute = millisecondsPerSecond * 60;
            const millisecondsPerHour = millisecondsPerMinute * 60;
            const millisecondsPerDay = millisecondsPerHour * 24;

            const days = Math.floor(timeDifference / millisecondsPerDay);
            const hours = Math.floor((timeDifference % millisecondsPerDay) / millisecondsPerHour);
            const minutes = Math.floor((timeDifference % millisecondsPerHour) / millisecondsPerMinute);
            const seconds = Math.floor((timeDifference % millisecondsPerMinute) / millisecondsPerSecond);

            console.log(`Time Difference: ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds.`);

            // set time variables
            swSeconds = seconds;
            swMinutes = minutes;
            swHours = hours;
            swDays = days;

            swTimeSet();
            */
        }
    })();
};