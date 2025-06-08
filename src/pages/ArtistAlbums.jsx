import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

import styles from './SearchResults.module.css';

export default function ArtistAlbums() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [albums, setAlbums] = useState([]);
  const [token, setToken] = useState(null);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    async function fetchAlbums() {
      const { data } = await supabase.auth.getSession();
      const accessToken = data?.session?.provider_token;
      setToken(accessToken);

      if (accessToken) {
        const res = await fetch(
          `https://api.spotify.com/v1/artists/${id}/albums?include_groups=album,single&limit=50`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const data = await res.json();
        setAlbums(data.items || []);
      }
    }

    fetchAlbums();
  }, [id]);

  const toggleAlbum = (album) => {
    const exists = selected.find((a) => a.id === album.id);
    if (exists) {
      setSelected(selected.filter((a) => a.id !== album.id));
    } else {
      setSelected([...selected, album]);
    }
  };

  const startRanking = () => {
    const albumIds = selected.map((a) => a.id);
    navigate('/ranking', { state: { albumIds } });
  };

  const isSelected = (albumId) => selected.find((a) => a.id === albumId);

  return (
    <div className={styles.search_container}>
      <h2>Albums</h2>
      <div className={styles.results_container}>
        {albums.map((album) => (
          <div
            key={album.id}
            className={styles.artist_card}
            onClick={() => toggleAlbum(album)}
            style={{
              position: 'relative',
              border: isSelected(album.id) ? '2px solid limegreen' : '2px solid transparent',
              cursor: 'pointer',
            }}
          >
            <img
              src={album.images[0]?.url || '/placeholder.jpg'}
              alt={album.name}
              style={{ width: '100%', borderRadius: '8px' }}
            />
            {isSelected(album.id) && (
              <div
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  background: 'limegreen',
                  color: 'white',
                  borderRadius: '50%',
                  padding: '0.3rem 0.4rem',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                }}
              >
                ✔
              </div>
            )}
            <p>{album.name}</p>
          </div>
        ))}
      </div>

      {selected.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button onClick={startRanking}>Start Ranking ({selected.length})</button>
        </div>
      )}
    </div>
  );
}
