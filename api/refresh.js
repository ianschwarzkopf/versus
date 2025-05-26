export default async function handler(req, res) {
  const refreshToken = req.cookies.refresh_token;

  const creds = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64');

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${creds}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  const data = await response.json();

  res.setHeader('Set-Cookie', [
    `access_token=${data.access_token}; Path=/; HttpOnly; Secure; SameSite=Lax`,
  ]);

  res.status(200).json({ success: true });
}
