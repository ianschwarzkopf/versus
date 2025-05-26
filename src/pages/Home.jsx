import React, { useEffect, useState } from 'react';
import styles from './Home.module.css';
import Logo from '/versus_logo_fit.svg';
import { Outlet, Link } from "react-router-dom";
import axios from 'axios';

export default function Home() {
  const [userPlaylists, setUserPlaylists] = useState([]);
  const token = window.localStorage.getItem("token");

  const findUserPlaylists = async (e) => {
    e.preventDefault();
    const { data } = await axios.get("https://api.spotify.com/v1/me/playlists?limit=50", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const filtered = data.items.filter(item => item !== null);
    console.log(filtered);
    setUserPlaylists(filtered);
  };

  // Example placeholder for playlist track handler
  const findPlaylistTracks = (playlistId) => {
    console.log("Clicked playlist ID:", playlistId);
    // Navigate or fetch songs here
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
