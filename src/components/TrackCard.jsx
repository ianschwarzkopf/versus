// src/components/TrackCard.jsx
import { useState } from 'react';

import styles from './TrackCard.module.css'

export default function TrackCard({ track, token, deviceId, onVote, position }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [seekPos, setSeek] = useState(0);

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

  const changeSeek = async (e) => {
    const seek = parseFloat(e.target.value);
    setSeek(seek);
    await fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${seek}&device_id=${deviceId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  const togglePlay = () => (isPlaying ? pause() : play());



  return (
    <div className={styles.card}>
      <img src={track.albumArt} alt={track.name} className={styles.image} />
      <input
        className={styles.seekSlider}
        type="range"
        min="0"
        max={track.duration_ms}
        step="1"
        value={seekPos}
        onChange={changeSeek}
      />
      <h3>{track.name}</h3>
      <div className={styles.controls}>
        <button onClick={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</button>

      </div>
      <button onClick={() => onVote(position)} className={styles.voteBtn}>Vote</button>
    </div>
  );
}
