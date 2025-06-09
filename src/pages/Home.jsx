// pages/Home.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useUser } from '../lib/useUser';

import styles from './Home.module.css';
import ArtistSearch from '../components/ArtistSearch';

export default function Home() {
  const user = useUser();
  const [spotifyToken, setSpotifyToken] = useState(null);

  useEffect(() => {
    const syncUser = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      const session = sessionData?.session;
      const user = session?.user;

      if (!user || !session) {
        console.warn('No user or session available');
        return;
      }

      const { user_metadata } = user;
      const accessToken = session.provider_token;
      const refreshToken = session.provider_refresh_token;

      // Check if user exists in the users table
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching user:', fetchError);
        return;
      }

      const userData = {
        id: user.id,
        email: user.email,
        full_name: user_metadata?.full_name || user_metadata?.name || null,
        avatar_url: user_metadata?.avatar_url || user_metadata?.picture || null,
        spotify_access_token: accessToken,
        spotify_refresh_token: refreshToken,
      };

      if (!existingUser) {
        const { error: insertError } = await supabase.from('users').insert(userData);
        if (insertError) {
          console.error('Error inserting user:', insertError);
        } else {
          console.log('User inserted successfully');
        }
      } else {
        const { error: updateError } = await supabase
          .from('users')
          .update(userData)
          .eq('id', user.id);
        if (updateError) {
          console.error('Error updating user:', updateError);
        } else {
          console.log('User updated successfully');
        }
      }

      setSpotifyToken(accessToken);
    };

    syncUser();
  }, []);

  return (
    <div className={styles.home_container}>
      {spotifyToken ? (
        <ArtistSearch token={spotifyToken} />
      ) : (
        <p>Loading Spotify data...</p>
      )}
    </div>
  );
}
