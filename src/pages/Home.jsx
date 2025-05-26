// pages/Home.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useUser } from '../lib/useUser';

import styles from './Home.module.css'

import ArtistSearch from '../components/ArtistSearch';

export default function Home() {
  const user = useUser();

  const [spotifyToken, setSpotifyToken] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSpotifyToken(session?.provider_token);
    });
  }, []);

  useEffect(() => {
    async function createUserIfNotExists() {
      if (!user) return;

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id);

      if (data.length === 0) {
        const { user_metadata } = user;
        await supabase.from('users').insert({
          id: user.id,
          email: user.email,
          full_name: user_metadata?.full_name || user.user_metadata?.name,
          avatar_url: user_metadata?.avatar_url || user.user_metadata?.picture,
        });
      }
    }

    createUserIfNotExists();
  }, [user]);

  useEffect(() => {
  const saveSpotifyTokens = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error getting session:', error);
      return;
    }

    const session = data.session;
    const userId = session?.user?.id;
    const accessToken = session?.provider_token;
    const refreshToken = session?.provider_refresh_token;

    if (userId && accessToken && refreshToken) {
      const { error: updateError } = await supabase
        .from('users')
        .update({
          spotify_access_token: accessToken,
          spotify_refresh_token: refreshToken,
        })
        .eq('id', userId);

      if (updateError) {
        console.error('Error saving tokens:', updateError);
      } else {
        console.log('Spotify tokens saved!');
      }
    }
  };

  saveSpotifyTokens();
}, []);


  return (
    <div className={styles.home_container}>
      {spotifyToken && <ArtistSearch token={spotifyToken} />}
    </div>
  );
}
