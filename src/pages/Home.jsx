import React, { useEffect, useState } from 'react';
import styles from './Home.module.css';
import Logo from '/versus_logo_fit.svg';
import { Outlet, Link } from "react-router-dom";
import axios from 'axios';

export default function Home() {
  const [userPlaylists, setUserPlaylists] = useState([]);

  const findUserPlaylists = async () => {
    try {
      const { data } = await axios.get("/api/playlists");
      setUserPlaylists(data.items || []);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  };

  return (
    <div>
      <h1>Home</h1>
      <button onClick={findUserPlaylists}>Get My Playlists</button>
      <div className={styles.albumsWrapper}>
        {userPlaylists.map(playlist => (
          <div className={styles.albumsContainer} key={playlist.id}>
            <h3>{playlist.name}</h3>
            {playlist.images?.length ? (
              <Link to="/ViewRankSongs" className={styles.Link}>
                <button onClick={() => findPlaylistTracks(playlist.id)}>
                  <img className={styles.artistImg} width="100%" src={playlist.images[0].url} alt="" />
                </button>
              </Link>
            ) : (
              <Link to="/ViewRankSongs" className={styles.Link}>
                <button><img className={styles.artistImg} width="100%" alt="" /></button>
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
