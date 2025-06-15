from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
from tensorflow.keras.models import load_model

app = Flask(__name__)
CORS(app)  # Allow requests from React frontend

# Load the machine learning model
model = load_model('lear_net.h5')

# Define emotions and song mappings
emotions = ['Tense', 'Happiness', 'Repression', 'Disgust', 'Surprise', 'Contempt', 'Fear', 'Sadness']
emotion_to_song = {
    'Tense': 'metal.mp3',
    'Happiness': 'happy.mp3',
    'Repression': 'Orchestral.mp3',
    'Disgust': 'metal.mp3',
    'Surprise': 'Orchestral.mp3',
    'Contempt': 'metal.mp3',
    'Fear': 'Orchestral.mp3',
    'Sadness': 'happy2.mp3'
}
default_song = 'happy2.mp3'

@app.route('/get_next_song', methods=['POST'])
def get_next_song():
    try:
        # Receive image file from frontend
        image_file = request.files['image']
        image_data = image_file.read()
        
        # Decode and preprocess image
        image = cv2.imdecode(np.frombuffer(image_data, np.uint8), cv2.IMREAD_COLOR)
        image = cv2.resize(image, (112, 112)) 
        image = image / 255.0  # Normalize
        image = np.expand_dims(image, axis=0)  # Add batch dimension

        # Predict emotion
        predictions = model.predict(image)
        emotion_index = np.argmax(predictions)
        emotion = emotions[emotion_index]

        # Map emotion to song
        song = emotion_to_song.get(emotion, default_song)

        return jsonify({'emotion': emotion, 'song': song})
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'emotion': 'Unable to Detect switching to Happy ', 'song': default_song}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)