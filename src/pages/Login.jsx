import { supabase } from '../lib/supabase';

export default function Login() {
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
                ].join(' ')
      },
    });
  };
  console.log(`${window.location.origin}/callback`);

  return <button onClick={signInWithSpotify}>Login with Spotify</button>;
}
