import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

import styles from './SearchResults.module.css'

export default function ArtistAlbums() {
  const { id } = useParams();
  const [albums, setAlbums] = useState([]);
  const [token, setToken] = useState(null);

  useEffect(() => {
    async function fetchAlbums() {
      const { data } = await supabase.auth.getSession();
      const accessToken = data?.session?.provider_token;
      setToken(accessToken);

      if (accessToken) {
        const res = await fetch(`https://api.spotify.com/v1/artists/${id}/albums?include_groups=album,single&limit=50`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await res.json();
        setAlbums(data.items || []);
      }
    }

    fetchAlbums();
  }, [id]);

  return (
    <div className={styles.search_container}>
      <h2>Albums</h2>
      <div className={styles.results_container}>
        {albums.map((album) => (
          <div key={album.id} className={styles.artist_card}>
            <img
              src={album.images[0]?.url || '/placeholder.jpg'}
              alt={album.name}
              style={{ width: '100%', borderRadius: '8px' }}
            />
            <p>{album.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
