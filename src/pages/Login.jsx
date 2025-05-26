import { generateCodeVerifier, generateCodeChallenge } from '../auth/auth'; // your PKCE utils

export default function Login() {
  const handleLogin = async () => {
  const verifier = generateCodeVerifier();
  const challenge = await generateCodeChallenge(verifier);

  localStorage.setItem('code_verifier', verifier);

  // Notice `code_challenge` here
  window.location.href = `https://versus-plum.vercel.app/api/auth?code_challenge=${challenge}`;
};


  return <button onClick={handleLogin}>Login with Spotify</button>;
}
