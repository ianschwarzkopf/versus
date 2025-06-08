// src/components/TrackCard.jsx
import { useState } from 'react';

export default function TrackCard({ track, token, deviceId, onVote, position }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const play = async () => {
    await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ uris: [`spotify:track:${track.id}`] }),
    });
    setIsPlaying(true);
  };

  const pause = async () => {
    await fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
    setIsPlaying(false);
  };

  const togglePlay = () => (isPlaying ? pause() : play());

  const changeVolume = async (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    await fetch(`https://api.spotify.com/v1/me/player/volume?volume_percent=${Math.round(vol * 100)}&device_id=${deviceId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  return (
    <div style={styles.card}>
      <img src={track.album.images[0]?.url} alt={track.name} style={styles.image} />
      <h3>{track.name}</h3>
      <div style={styles.controls}>
        <button onClick={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={changeVolume}
          style={{ width: '100px', marginLeft: '10px' }}
        />
      </div>
      <button onClick={() => onVote(position)} style={styles.voteBtn}>Vote</button>
    </div>
  );
}

const styles = {
  card: {
    padding: '1rem',
    border: '1px solid #ccc',
    borderRadius: '12px',
    textAlign: 'center',
    width: '200px',
    margin: '1rem',
  },
  image: {
    width: '100%',
    borderRadius: '8px',
  },
  controls: {
    marginTop: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  voteBtn: {
    marginTop: '0.5rem',
    padding: '0.5rem 1rem',
    background: 'black',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
  },
};
