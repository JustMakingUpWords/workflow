let notepadText = "";

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse)
{
    if (request.message == "send")
    {
        sendResponse({ text: notepadText });
        //console.log(notepadText + " SENT");
    } else
    {
        notepadText = request.message;
        //console.log(request.message + " : " + notepadText);
    }
});

console.log(notepadText);