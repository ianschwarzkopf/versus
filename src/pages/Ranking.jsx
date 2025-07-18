// pages/Ranking.jsx
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { loadSpotifyPlayer } from '../lib/spotifyPlayer';
import TrackCard from '../components/TrackCard';

import styles from './Ranking.module.css';

export default function Ranking() {
  const { state } = useLocation();
  const albumIds = state?.albumIds || [];

  const [spotifyToken, setSpotifyToken] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [matchups, setMatchups] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState({});
  const [history, setHistory] = useState([]);
  const [showResults, setShowResults] = useState(false);


  const [deviceId, setDeviceId] = useState(null);

  const [volume, setVolume] = useState(0.5);
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState(null);

  const getSpotifyToken = async () => {
    if (!spotifyToken) {
      const { data } = await supabase.auth.getSession();
      const latestToken = data?.session?.provider_token;
      setSpotifyToken(latestToken);
      return latestToken;
    }
    return spotifyToken;
  };

  useEffect(() => {
    let subscription;

    async function setup() {
      const { data } = await supabase.auth.getSession();
      const accessToken = data?.session?.provider_token;
      if (!accessToken) return;

      setSpotifyToken(accessToken);
      const { device_id } = await loadSpotifyPlayer(accessToken);
      setDeviceId(device_id);

      // Stay up to date with token refresh
      const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') {
          console.log('Updated Spotify token');
          setSpotifyToken(session.provider_token);
        }
      });

      subscription = sub;
    }

    setup();

    return () => {
      subscription?.subscription.unsubscribe();
    };
  }, []);



  useEffect(() => {
    async function fetchTracks() {
      const accessToken = await getSpotifyToken();
      if (!accessToken || albumIds.length === 0) return;

      const allTracks = [];

      for (const albumId of albumIds) {
        const res = await fetch(`https://api.spotify.com/v1/albums/${albumId}/tracks?limit=50`, {
          headers: { Authorization: `Bearer ${await getSpotifyToken()}` }
        });

        if (!res.ok) {
          console.error("Failed to fetch album tracks", await res.text());
          continue;
        }

        const albumTracks = await res.json();

        const albumRes = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
          headers: { Authorization: `Bearer ${await getSpotifyToken()}` }
        });

        const albumData = await albumRes.json();

        for (const track of albumTracks.items) {
          allTracks.push({
            id: track.id,
            name: track.name,
            artist: track.artists,
            previewUrl: track.preview_url,
            albumArt: albumData.images[0]?.url,
            albumName: albumData.name,
            uri: track.uri,
            duration_ms: track.duration_ms
          });
        }
      }

      setTracks(allTracks);
      setResults(Object.fromEntries(allTracks.map((track) => [track.id, 0])));

      const pairs = [];
      for (let i = 0; i < allTracks.length; i++) {
        for (let j = i + 1; j < allTracks.length; j++) {
          pairs.push([allTracks[i], allTracks[j]]);
        }
      }
      setMatchups(pairs.sort(() => Math.random() - 0.5));
    }

    fetchTracks();
  }, [albumIds]);

  const handleVote = (choice) => {
    const [t1, t2] = matchups[currentIndex];
    const updated = { ...results };
    const newHistory = [...history];

    if (choice === 1) updated[t1.id]++;
    else if (choice === 2) updated[t2.id]++;
    else if (choice === 0) {
      updated[t1.id] += 0.5;
      updated[t2.id] += 0.5;
    }

    newHistory.push({ t1, t2, choice });
    setResults(updated);
    setHistory(newHistory);

    const next = currentIndex + 1;
    setCurrentIndex(next);
    if (next >= matchups.length) setShowResults(true);
  };

  const changeVolume = async (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    await fetch(`https://api.spotify.com/v1/me/player/volume?volume_percent=${Math.round(vol * 100)}&device_id=${deviceId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${await getSpotifyToken()}` },
    });
  };


  const handleUndo = () => {
    if (history.length === 0) return;
    const { t1, t2, choice } = history.pop();
    const updated = { ...results };

    if (choice === 1) updated[t1.id]--;
    else if (choice === 2) updated[t2.id]--;
    else if (choice === 0) {
      updated[t1.id] -= 0.5;
      updated[t2.id] -= 0.5;
    }

    setResults(updated);
    setHistory([...history]);
    setCurrentIndex((i) => i - 1);
    setShowResults(false);
  };

  if (showResults) {
    const sorted = tracks
      .map((track) => ({ ...track, score: results[track.id] }))
      .sort((a, b) => b.score - a.score);

    return (
      <div>
        <div className={styles.ranking_container}>
          <h2>Ranking Results</h2>
          <div className={styles.ranking_selection}>
            <ul>
              {sorted.map((t, i) => (
                <h3 key={t.id}>
                  #{i + 1}: {t.name} ({t.albumName})
                </h3>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (!matchups.length) return <p>Loading matchups...</p>;

  const [t1, t2] = matchups[currentIndex] || [null, null];

  return (
    <div className={styles.ranking_container}>
      <h2>Choose the Better Track</h2>
      <div className={styles.ranking_selection}>
        <TrackCard track={t1} token={spotifyToken} deviceId={deviceId} onVote={handleVote} position={1} isActive={t1.id === currentlyPlayingId} setCurrentlyPlayingId={setCurrentlyPlayingId}/>
        <div className={styles.mid_buttons}>
          <button onClick={handleUndo}>Undo</button>
          <input
            className={styles.seekSlider}
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={changeVolume}
          />
          <button onClick={() => handleVote(0)}>Tie</button>
        </div>
        <TrackCard track={t2} token={spotifyToken} deviceId={deviceId} onVote={handleVote} position={2} isActive={t2.id === currentlyPlayingId} setCurrentlyPlayingId={setCurrentlyPlayingId}/>
      </div>
      <div className={styles.progressBar} style={{width: `${(currentIndex / matchups.length) * 100}%`}}/>
    </div>
  );
}
