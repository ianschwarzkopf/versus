import { supabase } from '../lib/supabase';

export default function Login() {
  const signInWithSpotify = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'spotify',
      options: {
      redirectTo: `https://versus-plum.vercel.app//callback`,
    },
    });
  };
  console.log(`${window.location.origin}/callback`);

  return <button onClick={signInWithSpotify}>Login with Spotify</button>;
}
