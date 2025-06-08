import { useState, useEffect, useRef } from 'react';
import styles from './TrackCard.module.css';

export default function TrackCard({ track, token, deviceId, isActive, setCurrentlyPlayingId, onVote, position }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [seekPos, setSeek] = useState(0);
  const intervalRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    console.log('Track info:', track);
  }, [track]);
  
  // Sync position while playing
  useEffect(() => {
    if (isPlaying && isActive) {
      intervalRef.current = setInterval(async () => {
        const res = await fetch('https://api.spotify.com/v1/me/player', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.item?.id === track.id) {
            setSeek(data.progress_ms);
          } else {
            setIsPlaying(false);
          }
        }
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, isActive, token, track.id]);

  // Pause if no longer the active card
  useEffect(() => {
    if (!isActive && isPlaying) {
      pause();
    }
  }, [isActive]);

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

  const changeSeek = (e) => {
    const seek = parseFloat(e.target.value);
    setSeek(seek);

    // Debounce the API call
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${seek}&device_id=${deviceId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
    }, 300); // Adjust delay as needed
  };

  const togglePlay = () => {
    if (!isPlaying) {
      setCurrentlyPlayingId(track.id);
      play();
    } else {
      pause();
    }
  };

  return (
    <div className={`${styles.card} ${isActive ? styles.active : ''}`}>
      <img src={track.albumArt} alt={track.name} className={styles.image} />
      <input
        className={styles.seekSlider}
        type="range"
        min="0"
        max={track.duration_ms}
        step="10"
        value={seekPos}
        onChange={changeSeek}
        disabled={!isActive}
      />
      <h3>{track.name}</h3>
      <div className={styles.controls}>
        <button onClick={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</button>
      </div>
      <button onClick={() => onVote(position)} className={styles.voteBtn}>Vote</button>
    </div>
  );
}
