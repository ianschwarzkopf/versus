import { useState, useEffect, useRef } from 'react';
import styles from './TrackCard.module.css';

export default function TrackCard({
  track,
  token,
  deviceId,
  isActive,
  setCurrentlyPlayingId,
  onVote,
  position
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [seekPos, setSeek] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const intervalRef = useRef(null);

  // Reset on track change
  useEffect(() => {
    setSeek(0);
    setIsPlaying(false);
  }, [track.id]);

  // Smooth local seek ticking
  useEffect(() => {
    if (isPlaying && isActive && !isDragging) {
      intervalRef.current = setInterval(() => {
        setSeek((prev) => prev + 1000);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, isActive, isDragging]);

  // Auto-pause if not active card
  useEffect(() => {
    if (!isActive && isPlaying) pause();
  }, [isActive]);

  const play = async () => {
    await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ uris: [`spotify:track:${track.id}`], position_ms: seekPos }),
    });

    // Brief pause to allow Spotify to catch up
    setTimeout(async () => {
      const res = await fetch(`https://api.spotify.com/v1/me/player`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSeek(data.progress_ms);
      }
    }, 300);

    setIsPlaying(true);
  };

  const pause = async () => {
    await fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
    setIsPlaying(false);
  };

  const handleSeekChange = (e) => {
    if (!isActive) return;
    setSeek(parseFloat(e.target.value));
  };

  const handleSeekStart = () => {
    setIsDragging(true);
    clearInterval(intervalRef.current);
  };

  const handleSeekEnd = async () => {
    setIsDragging(false);
    await fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${seekPos}&device_id=${deviceId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });

    // Re-sync position after seek
    setTimeout(async () => {
      const res = await fetch(`https://api.spotify.com/v1/me/player`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSeek(data.progress_ms);
      }
    }, 200);
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
        step="1000"
        value={seekPos}
        onChange={handleSeekChange}
        onMouseDown={handleSeekStart}
        onMouseUp={handleSeekEnd}
        onTouchStart={handleSeekStart}
        onTouchEnd={handleSeekEnd}
        disabled={!isActive}
      />
      <div className={styles.controls}>
        <div className={styles.artist_names}>
          <h3>{track.name}</h3>
          <h4>{track.artist.map(artist => artist.name).join(', ')}</h4>
        </div>

        <button className={styles.playBtn} onClick={togglePlay}>{isPlaying ? '||' : '>'}</button>
      </div>

      <button onClick={() => onVote(position)}>
        Vote
      </button>
    </div>
  );
}
