import { useState, useEffect, useRef } from 'react';
import styles from './TrackCard.module.css';

export default function TrackCard({ track, token, deviceId, isActive, setCurrentlyPlayingId, onVote, position }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [seekPos, setSeek] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isPlaying && isActive && !isDragging) {
      intervalRef.current = setInterval(syncSeekPosition, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, isActive, isDragging]);

  useEffect(() => {
    if (!isActive && isPlaying) {
      pause();
    }
  }, [isActive]);

  const syncSeekPosition = async () => {
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
  };

  const play = async () => {
    await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ uris: [`spotify:track:${track.id}`], position_ms: seekPos }),
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

  const togglePlay = () => {
    if (!isPlaying) {
      setCurrentlyPlayingId(track.id);
      play();
    } else {
      pause();
    }
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeekChange = (e) => {
    const val = parseFloat(e.target.value);
    setSeek(val);
  };

  const handleSeekMouseDown = () => {
    setIsDragging(true);
    clearInterval(intervalRef.current);
  };

  const handleSeekMouseUp = async (e) => {
    const seek = parseFloat(e.target.value);
    setSeek(seek);
    setIsDragging(false);
    await fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${seek}&device_id=${deviceId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (isPlaying && isActive) {
      intervalRef.current = setInterval(syncSeekPosition, 1000);
    }
  };

  return (
    <div className={`${styles.card} ${isActive ? styles.active : ''}`}>
      <img src={track.albumArt} alt={track.name} className={styles.image} />

      <div className={styles.seekContainer}>
        <div className={styles.timeDisplay}>
          <span>{formatTime(seekPos)}</span>
          <span>{formatTime(track.duration_ms)}</span>
        </div>
        <input
          className={styles.seekSlider}
          type="range"
          min="0"
          max={track.duration_ms}
          step="10"
          value={seekPos}
          onChange={handleSeekChange}
          onMouseDown={handleSeekMouseDown}
          onMouseUp={handleSeekMouseUp}
          onTouchStart={handleSeekMouseDown}
          onTouchEnd={handleSeekMouseUp}
          disabled={!isActive}
        />
      </div>

      <h3>{track.name}</h3>
      <div className={styles.controls}>
        <button onClick={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</button>
      </div>
      <button onClick={() => onVote(position)} className={styles.voteBtn}>Vote</button>
    </div>
  );
}
