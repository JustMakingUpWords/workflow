let t = 0;
let swInterval;
let testRun = () =>
{
    return setInterval(function() {
        t++;
        chrome.runtime.sendMessage({ message: "hi" });
        console.log(t);
    }, 1000);
}

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse)
{
    if (request.message == "notepad")
    {
        let msg = request.notepad;
        chrome.storage.local.set({"msg" : msg}).then(() =>
        {
            console.log("Value is set " + msg);
        });
        //console.log(msg);
    }
    if (request.message == "stopwatch")
    {
        let swRunning = request.swRunOrNot;

        if (swRunning)
        {
            swInterval = testRun();
        }
        else
        {
            clearInterval(swInterval)
        }
    }
});

/*
let value = 10;
chrome.storage.local.set({ key: value }).then(() => {
    console.log("dwadwaaaaaaaa Value is set");
});

chrome.storage.local.get(["key"]).then((result) => {
    console.log("Value currently is bvalbalblablalbalb " + result.key);
});
*/