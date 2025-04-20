import React, { useState } from 'react';
import axios from 'axios';

const EmotionDetector = ({ onEmotionDetected }) => {
  const [image, setImage] = useState(null);

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  const detectEmotion = async () => {
    const formData = new FormData();
    formData.append('image', image);

    const res = await axios.post('http://localhost:5000/predict-emotion', formData);
    const { emotion } = res.data;
    onEmotionDetected(emotion);
  };

  return (
    <div className="emotion-detector">
      <input type="file" onChange={handleImageUpload} />
      <button onClick={detectEmotion}>Detect Emotion</button>
    </div>
  );
};

export default EmotionDetector;
