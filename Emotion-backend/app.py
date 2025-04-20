from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
import numpy as np
import cv2
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

model = load_model('learnet.h5')
emotions = ['tense', 'happiness', 'repression', 'disgust', 'surprise', 'contempt', 'fear', 'sadness']  # Modify as per your model

def preprocess_image(image):
    image = cv2.resize(image, (112, 112))
    image = image.astype('float32') / 255.0
    image = np.expand_dims(image, axis=0)
    image = np.expand_dims(image, axis=-1)
    return image

@app.route('/predict-emotion', methods=['POST'])
def predict_emotion():
    file = request.files['image']
    npimg = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(npimg, cv2.IMREAD_GRAYSCALE)

    processed = preprocess_image(img)
    preds = model.predict(processed)
    emotion = emotions[np.argmax(preds)]

    return jsonify({'emotion': emotion})

if __name__ == '__main__':
    app.run(port=3000)