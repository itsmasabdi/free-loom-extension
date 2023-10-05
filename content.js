let videoElement = null;
let currentStream = null;

function startVideo(cameraId) {
  if (currentStream) {
    currentStream.getTracks().forEach((track) => track.stop());
    videoElement.remove();
    videoElement = null;
  }

  navigator.mediaDevices
    .getUserMedia({ video: { deviceId: cameraId } })
    .then((stream) => {
      currentStream = stream;
      videoElement = document.createElement("video");
      videoElement.style.width = "200px";
      videoElement.style.height = "200px";
      videoElement.style.objectFit = "cover";
      videoElement.style.borderRadius = "50%";
      videoElement.style.position = "fixed";
      videoElement.style.bottom = "10px";
      videoElement.style.right = "10px";
      videoElement.style.zIndex = "1000000";
      videoElement.style.transform = "scaleX(-1)";
      videoElement.autoplay = true;
      document.body.appendChild(videoElement);

      // Drag and drop functionality
      let isDragging = false;
      let offsetX, offsetY;
      videoElement.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - videoElement.getBoundingClientRect().left;
        offsetY = e.clientY - videoElement.getBoundingClientRect().top;
      });

      window.addEventListener("mousemove", (e) => {
        if (isDragging) {
          videoElement.style.left = e.clientX - offsetX + "px";
          videoElement.style.top = e.clientY - offsetY + "px";
        }
      });

      window.addEventListener("mouseup", () => {
        isDragging = false;
      });

      videoElement.srcObject = stream;
    })
    .catch((error) => {
      console.error("Error accessing the camera:", error);
    });
}

function stopVideo() {
  if (currentStream) {
    currentStream.getTracks().forEach((track) => track.stop());
    videoElement.remove();
    videoElement = null;
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "startVideo") {
    startVideo(message.cameraId);
  } else if (message.action === "stopVideo") {
    stopVideo();
  }
});
