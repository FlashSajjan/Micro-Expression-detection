import { useRef, useState, useEffect } from 'react';
import './App.css';

function App() {
  const [currentMusicDetails, setCurrentMusicDetails] = useState({
    songName: 'happy2',
    songArtist: 'F2P',
    songSrc: '/Assets/songs/happy2.mp3',
    songAvatar: '/Assets/Images/image1.jpg'
  });

  // Existing state variables
  const [audioProgress, setAudioProgress] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [musicIndex, setMusicIndex] = useState(0);
  const [musicTotalLength, setMusicTotalLength] = useState('04 : 38');
  const [musicCurrentTime, setMusicCurrentTime] = useState('00 : 00');
  const [videoIndex, setVideoIndex] = useState(0);

  // New state variables for emotion detection
  const [nextSongDetails, setNextSongDetails] = useState(null);
  const [currentEmotion, setCurrentEmotion] = useState('Unknown');
  const [hasCapturedForCurrentSong, setHasCapturedForCurrentSong] = useState(false);

  const currentAudio = useRef();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Existing functions
  const handleMusicProgressBar = (e) => {
    setAudioProgress(e.target.value);
    currentAudio.current.currentTime = e.target.value * currentAudio.current.duration / 100;
  };

  let avatarClass = ['objectFitCover', 'objectFitContain', 'none'];
  const [avatarClassIndex, setAvatarClassIndex] = useState(0);
  const handleAvatar = () => {
    if (avatarClassIndex >= avatarClass.length - 1) {
      setAvatarClassIndex(0);
    } else {
      setAvatarClassIndex(avatarClassIndex + 1);
    }
  };

  const handleAudioPlay = () => {
    if (currentAudio.current.paused) {
      currentAudio.current.play();
      setIsAudioPlaying(true);
    } else {
      currentAudio.current.pause();
      setIsAudioPlaying(false);
    }
  };

  const musicAPI = [
    {
      songName: 'happy2',
      songArtist: 'F2P',
      songSrc: '/Assets/songs/happy2.mp3',
      songAvatar: '/Assets/Images/image1.webp'
    },
    {
      songName: 'happy',
      songArtist: 'F2P',
      songSrc: '/Assets/songs/happy.mp3',
      songAvatar: '/Assets/Images/image4.webp'
    },
    {
      songName: 'metal',
      songArtist: 'F2P',
      songSrc: '/Assets/songs/metal.mp3',
      songAvatar: '/Assets/Images/image2.webp'
    },
    {
      songName: 'Orchestral',
      songArtist: 'F2P',
      songSrc: '/Assets/songs/orchestral.mp3',
      songAvatar: '/Assets/Images/image3.webp'
    },
    {
      songName: 'relax',
      songArtist: 'F2P',
      songSrc: '/Assets/songs/relax.mp3',
      songAvatar: '/Assets/Images/image5.webp'
    }
  ];

  const handleNextSong = () => {
    if (musicIndex >= musicAPI.length - 1) {
      let setNumber = 0;
      setMusicIndex(setNumber);
      updateCurrentMusicDetails(setNumber);
    } else {
      let setNumber = musicIndex + 1;
      setMusicIndex(setNumber);
      updateCurrentMusicDetails(setNumber);
    }
    setHasCapturedForCurrentSong(false); // Reset for new song
  };

  const handlePrevSong = () => {
    if (musicIndex === 0) {
      let setNumber = musicAPI.length - 1;
      setMusicIndex(setNumber);
      updateCurrentMusicDetails(setNumber);
    } else {
      let setNumber = musicIndex - 1;
      setMusicIndex(setNumber);
      updateCurrentMusicDetails(setNumber);
    }
    setHasCapturedForCurrentSong(false); // Reset for new song
  };

  const updateCurrentMusicDetails = (number) => {
    let musicObject = musicAPI[number];
    currentAudio.current.src = musicObject.songSrc;
    currentAudio.current.play();
    setCurrentMusicDetails({
      songName: musicObject.songName,
      songArtist: musicObject.songArtist,
      songSrc: musicObject.songSrc,
      songAvatar: musicObject.songAvatar
    });
    setIsAudioPlaying(true);
  };

  // New function to update music details with a song object
  const playSongObject = (songObject) => {
    currentAudio.current.src = songObject.songSrc;
    currentAudio.current.play();
    setCurrentMusicDetails({
      songName: songObject.songName,
      songArtist: songObject.songArtist,
      songSrc: songObject.songSrc,
      songAvatar: songObject.songAvatar
    });
    setIsAudioPlaying(true);
    setMusicIndex(musicAPI.findIndex(song => song.songSrc === songObject.songSrc));
  };

  const handleAudioUpdate = () => {
    let minutes = Math.floor(currentAudio.current.duration / 60);
    let seconds = Math.floor(currentAudio.current.duration % 60);
    let musicTotalLength0 = `${minutes < 10 ? `0${minutes}` : minutes} : ${seconds < 10 ? `0${seconds}` : seconds}`;
    setMusicTotalLength(musicTotalLength0);

    let currentMin = Math.floor(currentAudio.current.currentTime / 60);
    let currentSec = Math.floor(currentAudio.current.currentTime % 60);
    let musicCurrentT = `${currentMin < 10 ? `0${currentMin}` : currentMin} : ${currentSec < 10 ? `0${currentSec}` : currentSec}`;
    setMusicCurrentTime(musicCurrentT);

    const progress = parseInt((currentAudio.current.currentTime / currentAudio.current.duration) * 100);
    setAudioProgress(isNaN(progress) ? 0 : progress);

    // Emotion detection 10 seconds before song ends
    if (!isNaN(currentAudio.current.duration)) {
      const remainingTime = currentAudio.current.duration - currentAudio.current.currentTime;
      if (remainingTime <= 10 && !hasCapturedForCurrentSong) {
        captureFrame().then(imageData => {
          if (imageData) {
            sendFrameToBackend(imageData).then(data => {
              if (data) {
                setNextSongDetails(data.song);
                setCurrentEmotion(data.emotion);
                setHasCapturedForCurrentSong(true);
              } else {
                setNextSongDetails('happy2.mp3');
                setCurrentEmotion('Unknown');
                setHasCapturedForCurrentSong(true);
              }
            });
          }
        });
      }
    }
  };

  const vidArray = [
    process.env.PUBLIC_URL + '/Assets/Videos/video1.mp4',
    process.env.PUBLIC_URL + '/Assets/Videos/video2.mp4',
    process.env.PUBLIC_URL + '/Assets/Videos/video3.mp4',
    process.env.PUBLIC_URL + '/Assets/Videos/video4.mp4'
  ];

  const handleChangeBackground = () => {
    if (videoIndex >= vidArray.length - 1) {
      setVideoIndex(0);
    } else {
      setVideoIndex(videoIndex + 1);
    }
  };

  // New functions for emotion detection
  const captureFrame = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      await new Promise(resolve => (videoRef.current.onplaying = resolve));
      const context = canvasRef.current.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, 224, 224);
      return new Promise(resolve => {
        canvasRef.current.toBlob(blob => {
          stream.getTracks().forEach(track => track.stop());
          resolve(blob);
        }, 'image/jpeg');
      });
    } catch (error) {
      console.error('Error capturing frame:', error);
      return null;
    }
  };

  const sendFrameToBackend = async (imageBlob) => {
    try {
      const formData = new FormData();
      formData.append('image', imageBlob, 'frame.jpg');
      const response = await fetch('https://automated-micro-expression-based-music.onrender.com/get_next_song', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending frame to backend:', error);
      return null;
    }
  };

  const getSongObject = (songName) => {
    return musicAPI.find(song => song.songSrc.endsWith(songName));
  };

  const handleSongEnd = () => {
    if (nextSongDetails) {
      const songObject = getSongObject(nextSongDetails);
      if (songObject) {
        playSongObject(songObject);
      } else {
        const defaultSong = getSongObject('happy2.mp3');
        playSongObject(defaultSong);
      }
      setHasCapturedForCurrentSong(false);
    } else {
      handleNextSong(); // Fallback to manual next if no emotion detected
    }
  };

  // Initial emotion detection on load
  useEffect(() => {
    captureFrame().then(imageData => {
      if (imageData) {
        sendFrameToBackend(imageData).then(data => {
          if (data && data.song) {
            const songObject = getSongObject(data.song);
            if (songObject) {
              playSongObject(songObject);
              setCurrentEmotion(data.emotion);
            } else {
              const defaultSong = getSongObject('happy2.mp3');
              playSongObject(defaultSong);
              setCurrentEmotion('Unknown');
            }
          } else {
            const defaultSong = getSongObject('happy2.mp3');
            playSongObject(defaultSong);
            setCurrentEmotion('Unknown');
          }
        });
      } else {
        const defaultSong = getSongObject('happy2.mp3');
        playSongObject(defaultSong);
        setCurrentEmotion('Unknown');
      }
    });
  }, []);

  return (
    <>
      <div className="container">
        <audio
          ref={currentAudio}
          onEnded={handleSongEnd}
          onTimeUpdate={handleAudioUpdate}
        ></audio>
        <video
          ref={videoRef}
          style={{ display: 'none' }}
        />
        <canvas
          ref={canvasRef}
          style={{ display: 'none' }}
          width="224"
          height="224"
        />
        <video
          src={vidArray[videoIndex]}
          loop
          muted
          autoPlay
          className="backgroundVideo"
        ></video>
        <div className="blackScreen"></div>
        <div className="music-Container">
          <p className="musicPlayer">Music Player</p>
          <p className="music-Head-Name">{currentMusicDetails.songName}</p>
          <p className="music-Artist-Name">{currentMusicDetails.songArtist}</p>
          <img
            src={currentMusicDetails.songAvatar}
            className={avatarClass[avatarClassIndex]}
            onClick={handleAvatar}
            alt="song Avatar"
            id="songAvatar"
          />
          <div className="musicTimerDiv">
            <p className="musicCurrentTime">{musicCurrentTime}</p>
            <p className="musicTotalLenght">{musicTotalLength}</p>
          </div>
          <input
            type="range"
            name="musicProgressBar"
            className="musicProgressBar"
            value={audioProgress}
            onChange={handleMusicProgressBar}
          />
          <div className="musicControlers">
            <i className="fa-solid fa-backward musicControler" onClick={handlePrevSong}></i>
            <i
              className={`fa-solid ${isAudioPlaying ? 'fa-pause-circle' : 'fa-circle-play'} playBtn`}
              onClick={handleAudioPlay}
            ></i>
            <i className="fa-solid fa-forward musicControler" onClick={handleNextSong}></i>
          </div>
          <p className="detectedEmotion">Detected Emotion: {currentEmotion}</p>
        </div>
        <div className="changeBackBtn" onClick={handleChangeBackground}>
          Change Background
        </div>
      </div>
    </>
  );
}

export default App;
