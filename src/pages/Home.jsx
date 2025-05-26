import React, { useState } from 'react';
import { supabase } from './lib/supabase';
import axios from 'axios';

export default function Home() {
  const [playlists, setPlaylists] = useState([]);

  const fetchPlaylists = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.provider_token;

      if (!token) {
        console.error("No Spotify token found");
        return;
      }

      const res = await axios.get('/api/playlists', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPlaylists(res.data.items || []);
    } catch (err) {
      console.error('Error fetching playlists', err);
    }
  };

  return (
    <div>
      <h1>Your Playlists</h1>
      <button onClick={fetchPlaylists}>Get My Playlists</button>
      <ul>
        {playlists.map((pl) => (
          <li key={pl.id}>{pl.name}</li>
        ))}
      </ul>
    </div>
  );
}
