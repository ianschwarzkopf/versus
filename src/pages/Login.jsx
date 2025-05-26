import { generateCodeVerifier, generateCodeChallenge } from '../auth/auth'; // your PKCE utils

export default function Login() {
  const handleLogin = async () => {
    // 1. Generate verifier and challenge for PKCE
    const verifier = generateCodeVerifier();
    const challenge = await generateCodeChallenge(verifier);

    // 2. Store verifier locally (needed later)
    localStorage.setItem('code_verifier', verifier);

    // 3. Redirect user to your backend /api/auth route with code_challenge
    window.location.href = `https://versus-plum.vercel.app/api/auth?code_challenge=${challenge}`;
  };

  return <button onClick={handleLogin}>Login with Spotify</button>;
}
