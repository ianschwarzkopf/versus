// api/callback.js
export default async function handler(req, res) {
  const { code, verifier } = req.body;

  const body = new URLSearchParams({
    client_id: process.env.SPOTIFY_CLIENT_ID,
    grant_type: 'authorization_code',
    code,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    code_verifier: verifier,
  });

  const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  const tokenData = await tokenRes.json();

  if (tokenData.access_token) {
    // Store in secure HttpOnly cookie
    res.setHeader('Set-Cookie', [
      `access_token=${tokenData.access_token}; Path=/; HttpOnly; Secure; SameSite=Strict`,
      `refresh_token=${tokenData.refresh_token}; Path=/; HttpOnly; Secure; SameSite=Strict`,
    ]);
    res.status(200).json({ success: true });
  } else {
    res.status(400).json({ success: false });
  }
}
