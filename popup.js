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
        chrome.runtime.sendMessage({ message: userInputTextarea.value });
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

let stopwatchInterval;

let stopwatchRunning = false; // just to see whether to update start time or not (seen below)

let increaseSWTIME = () =>
{
    swSeconds++;
    stopwatchTime.textContent = swSeconds + "s";
};
function stopwatchRun()
{
    return setInterval(function() {
        increaseSWTIME();
    }, 1000);
}

// start stopwatch
stopwatchStartButton.onclick = function()
{
    stopwatchInterval = stopwatchRun();
    chrome.storage.local.set({"stopwatchStarted" : true}).then(() => {});

    // if it wasnt running before and it just started running now
    if (!stopwatchRunning)
    {
        const startTime = new Date(); // defaults to current time
        chrome.storage.local.set({"stopwatchStartTime" : startTime}).then(() => {});
    }

    stopwatchRunning = true;
    //alert("STARTED");

};
// stop stopwatch
stopwatchStopButton.onclick = function()
{
    clearInterval(stopwatchInterval);
    chrome.storage.local.set({"stopwatchStarted" : false}).then(() => {});
    stopwatchRunning = false;
    //alert("ENDED");
};
// reset stopwatch (also stops stopwatch)
stopwatchResetButton.onclick = function()
{
    swSeconds = 0;
    swMinutes = 0;
    swHours = 0;
    stopwatchTime.textContent = "0s";

    clearInterval(stopwatchInterval);
    chrome.storage.local.set({"stopwatchStarted" : false}).then(() => {});
    stopwatchRunning = false;
};



// when popup is opened
window.onload = function()
{
    // sets things to whatever they were before
    (async () => {
        // changes notepad to previous value
        const result = await new Promise((resolve) => // Wait for the result of chrome.storage.local.get using async/await
            chrome.storage.local.get("msg", resolve)
        );

        const s = result.msg;
        document.getElementById("notepad").textContent = s;
        console.log("Value currently is " + s);


        // changes stopwatch to display correct passing of time
        const stopwatchRunOrNot = await new Promise((resolve) => // Wait for the result of chrome.storage.local.get using async/await
            chrome.storage.local.get("stopwatchStarted", resolve)
        );
        const stopwatchTime = await new Promise((resolve) => // Wait for the result of chrome.storage.local.get using async/await
            chrome.storage.local.get("stopwatchStartTime", resolve)
        );

        const r = stopwatchRunOrNot.stopwatchStarted;
        console.log("STOPWATCH IS: " + r);
        const t = stopwatchTime.stopwatchStartTime;
        console.log("STARTING TIME: " + t);

        const d = new Date();
        console.log(d);

        if (r)
        {
            stopwatchInterval = stopwatchRun();

            const currentTime = new Date();

            const timeDifference = currentTime - t;

            // Convert milliseconds into days, hours, minutes, and seconds
            const millisecondsPerSecond = 1000;
            const millisecondsPerMinute = millisecondsPerSecond * 60;
            const millisecondsPerHour = millisecondsPerMinute * 60;
            const millisecondsPerDay = millisecondsPerHour * 24;

            const days = Math.floor(timeDifference / millisecondsPerDay);
            const hours = Math.floor((timeDifference % millisecondsPerDay) / millisecondsPerHour);
            const minutes = Math.floor((timeDifference % millisecondsPerHour) / millisecondsPerMinute);
            const seconds = Math.floor((timeDifference % millisecondsPerMinute) / millisecondsPerSecond);

            // Log the time difference in a human-readable format
            console.log(`Time Difference: ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds.`);
        }

    })();

    /*
    // calculates stopwatch time based on when it was started vs right now
    const startDate = new Date('2022-01-01T12:00:00');
    const endDate = new Date(); // Defaults to the current date and time

    // Calculate the time difference in milliseconds
    const timeDifference = endDate - startDate;

    // Convert milliseconds into days, hours, minutes, and seconds
    const millisecondsPerSecond = 1000;
    const millisecondsPerMinute = millisecondsPerSecond * 60;
    const millisecondsPerHour = millisecondsPerMinute * 60;
    const millisecondsPerDay = millisecondsPerHour * 24;

    const days = Math.floor(timeDifference / millisecondsPerDay);
    const hours = Math.floor((timeDifference % millisecondsPerDay) / millisecondsPerHour);
    const minutes = Math.floor((timeDifference % millisecondsPerHour) / millisecondsPerMinute);
    const seconds = Math.floor((timeDifference % millisecondsPerMinute) / millisecondsPerSecond);

    // Log the time difference in a human-readable format
    console.log(`Time Difference: ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds.`);
    */
};