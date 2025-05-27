import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

import styles from './SearchResults.module.css'

export default function SearchResults() {
  const { query } = useParams();
  const navigate = useNavigate();

  const [artists, setArtists] = useState([]);
  const [token, setToken] = useState(null);

  useEffect(() => {
    async function fetchTokenAndSearch() {
      const { data } = await supabase.auth.getSession();
      const accessToken = data?.session?.provider_token;
      setToken(accessToken);

      if (query && accessToken) {
        const res = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await res.json();
        setArtists(data.artists?.items || []);
      }
    }

    fetchTokenAndSearch();
  }, [query]);

  return (
    <div className={styles.search_container}>
      <h2>Results for "{query}"</h2>
      <div style={className={styles.results_container}{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 150px)', gap: '1rem' }}>
        {artists.map((artist) => (
          <div className={styles.artist_card}
            key={artist.id}
            onClick={() => navigate(`/artist/${artist.id}`)}
            style={{ cursor: 'pointer', textAlign: 'center' }}
          >
            <img
              src={artist.images[0]?.url || '/placeholder.jpg'}
              alt={artist.name}
              style={{ width: '100%', borderRadius: '8px' }}
            />
            <p>{artist.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
