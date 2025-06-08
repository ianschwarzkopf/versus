import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function RankingPage() {
  const { state } = useLocation();
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    const fetchTracks = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.provider_token;

      if (!token || !state?.albumIds) return;

      const allTracks = [];

      for (const albumId of state.albumIds) {
        const res = await fetch(`https://api.spotify.com/v1/albums/${albumId}/tracks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await res.json();
        allTracks.push(...json.items);
      }

      setTracks(allTracks);
    };

    fetchTracks();
  }, [state]);

  return (
    <div>
      <h1>Rank the Songs</h1>
      {tracks.map((track) => (
        <div key={track.id}>{track.name}</div>
      ))}
    </div>
  );
}
