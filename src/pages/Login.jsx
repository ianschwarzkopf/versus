import { supabase } from '../lib/supabase';

export default function Login() {
  const signInWithSpotify = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'spotify',
      options: {
      redirectTo: `${window.location.origin}/callback`,
    },
    });
  };
  console.log(`${window.location.origin}/callback`);

  return <button onClick={signInWithSpotify}>Login with Spotify</button>;
}
