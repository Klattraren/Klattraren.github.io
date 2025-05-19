from flask import Flask, request
import cv2
import numpy as np
from datetime import datetime

app = Flask(__name__)

@app.route('/process', methods=['POST'])
def process_frame():
    file = request.files['frame']
    img_np = np.frombuffer(file.read(), np.uint8)
    frame = cv2.imdecode(img_np, cv2.IMREAD_COLOR)

    # Example processing: display the frame with OpenCV (for demo purposes)
    timestamp = datetime.now().strftime('%H:%M:%S')
    print(f"Received frame at {timestamp}")
    cv2.imshow('Received Frame', frame)
    if cv2.waitKey(1) == 27:  # Press ESC to exit
        return 'Stopped'

    return 'OK'

if __name__ == '__main__':
    app.run(debug=True)