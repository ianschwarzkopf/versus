import { generateCodeChallenge, generateCodeVerifier } from '../auth/auth'; // You need to define this

export default function Login() {
  const handleLogin = async () => {
    const verifier = generateCodeVerifier();
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem('verifier', verifier);

    window.location.href = `http://localhost:3000/api/auth?challenge=${challenge}`; // Your local backend
  };

  return <button onClick={handleLogin}>Login with Spotify</button>;
}
