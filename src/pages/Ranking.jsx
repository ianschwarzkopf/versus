import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Ranking() {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [spotifyUser, setSpotifyUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUser(session?.user ?? null);
      setAccessToken(session?.provider_token ?? null);

      if (session?.provider_token) {
        fetchSpotifyUser(session.provider_token);
      }
    }
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAccessToken(session?.provider_token ?? null);
      setSpotifyUser(null);
      setError(null);

      if (session?.provider_token) {
        fetchSpotifyUser(session.provider_token);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function fetchSpotifyUser(token) {
    try {
      const res = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        setError(`Spotify API error: ${res.status} ${res.statusText}`);
        setSpotifyUser(null);
        return;
      }

      const data = await res.json();
      setSpotifyUser(data);
      setError(null);
    } catch (err) {
      setError('Fetch failed: ' + err.message);
      setSpotifyUser(null);
    }
  }

  const signInWithSpotify = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'spotify',
      options: {
        redirectTo: `${window.location.origin}/callback`,
        scopes: [
          'user-read-email',
          'user-read-private',
          'streaming',
          'user-read-playback-state',
          'user-modify-playback-state',
          'user-read-currently-playing',
        ].join(' '),
      },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setAccessToken(null);
    setSpotifyUser(null);
    setError(null);
  };

  return (
    <div style={{ padding: 20 }}>
      {user ? (
        <>
          <h3>Logged in as {user.email}</h3>
          <button onClick={signOut}>Logout</button>

          <h4>Spotify Access Token:</h4>
          <pre style={{ maxHeight: 100, overflow: 'auto', background: '#eee', padding: 10 }}>
            {accessToken ?? 'No token'}
          </pre>

          {error && (
            <p style={{ color: 'red' }}>
              <b>Error:</b> {error}
            </p>
          )}

          {spotifyUser ? (
            <div>
              <h4>Spotify User Data:</h4>
              <p>Name: {spotifyUser.display_name}</p>
              <p>Email: {spotifyUser.email}</p>
              <img
                src={spotifyUser.images?.[0]?.url}
                alt="Spotify profile"
                width={100}
                height={100}
                style={{ borderRadius: '50%' }}
              />
            </div>
          ) : (
            !error && <p>Loading Spotify user info...</p>
          )}
        </>
      ) : (
        <button onClick={signInWithSpotify}>Login with Spotify</button>
      )}
    </div>
  );
}
