const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());

const playlists = {
  happy: ['track1.mp3', 'track2.mp3'],
  sad: ['track3.mp3'],
  angry: ['track4.mp3'],
  neutral: ['track5.mp3'],
};

app.get('/api/music/:emotion', (req, res) => {
  const { emotion } = req.params;
  res.json({ songs: playlists[emotion] || [] });
});

app.listen(PORT, () => {
  console.log(`Music server running on http://localhost:${PORT}`);
});
