// components/TrackCard.jsx
import { useRef, useState } from 'react';

export default function TrackCard({ track, onVote }) {
  const audioRef = useRef();
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  const handleVolume = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) audioRef.current.volume = vol;
  };

  return (
    <div style={{ width: 250 }}>
      <img src={track.albumArt} alt={track.name} style={{ width: '100%', borderRadius: 8 }} />
      <h4>{track.name}</h4>
      <p style={{ fontSize: 12 }}>{track.albumName}</p>

      <div>
        <button onClick={togglePlayback}>{playing ? 'Pause' : 'Play'}</button>
        <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolume} />
      </div>

      <audio ref={audioRef} src={track.previewUrl} preload="none" />
      <button onClick={onVote}>Vote for this</button>
    </div>
  );
}
