chrome.runtime.onMessage.addListener( function(request, sender, sendResponse)
{
    if (request.message == "send")
    {
        /*
        let s = "";
        chrome.storage.local.get(["key"]).then((result) => {
            console.log("Value currently is bvalbalblablalbalb " + result.key);
            s = result.key;
        });
        (async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            sendResponse({ text: s });
        })();
        */
    } else
    {
        let msg = request.message;
        chrome.storage.local.set({key: msg}).then(() =>
        {
            console.log("Value is set " + msg);
        });
        //console.log(msg);
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