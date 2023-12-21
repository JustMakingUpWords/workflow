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
}

// initial open tab, which is the notepad
renderTab("notepad", "notepadButton");

// define buttons
let notepadButton = document.getElementById("notepadButton");
let clockButton = document.getElementById("clockButton");

// control buttons
notepadButton.onclick = function()
{
    renderTab("notepad", "notepadButton");
}
clockButton.onclick = function()
{
    renderTab("clock", "clockButton");
}

// sends all notepad inputs to background script to be stored
document.addEventListener('DOMContentLoaded', function() {
    let userInputTextarea = document.getElementById('notepad');
  
    // attach an input event listener to the textarea
    userInputTextarea.addEventListener('input', function() {
        // send value of textarea to background so it can save it
        chrome.runtime.sendMessage({ message: userInputTextarea.value });
    });
});

window.onload = function()
{
    // sets notepad to whatever it was before
    (async () => {
        // Wait for the result of chrome.storage.local.get using async/await
        const result = await new Promise((resolve) =>
            chrome.storage.local.get(["key"], resolve)
        );

        const s = result.key;
        document.getElementById("notepad").textContent = s;

        console.log("Value currently is " + s);
    })();
}