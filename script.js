const video = document.getElementById('video');

// Start the camera stream
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        startSendingFrames();
    } catch (error) {
        console.error('Error accessing the camera:', error);
        alert('Could not access the camera.');
    }
}

// Capture and send frames to Python server
function startSendingFrames() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    setInterval(() => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(blob => {
            if (blob) {
                const formData = new FormData();
                formData.append('frame', blob, 'frame.jpg');

                fetch('http://localhost:5000/process', {
                    method: 'POST',
                    body: formData
                }).catch(err => console.error('Failed to send frame:', err));
            }
        }, 'image/jpeg');
    }, 100); // Every 100ms
}

window.addEventListener('load', startCamera);
