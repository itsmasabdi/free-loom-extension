
let videoTrack = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getVideo') {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                videoTrack = stream.getTracks()[0];
                sendResponse({ action: 'videoReceived', track: videoTrack });
            })
            .catch(error => {
                console.error('Error accessing the camera:', error);
            });
    }
    return true; // for async response
});
