export default function handler(req, res) {
  const { challenge } = req.query;

  const params = new URLSearchParams({
    client_id: process.env.CLIENT_ID,
    response_type: 'code',
    redirect_uri: process.env.REDIRECT_URI,
    code_challenge_method: 'S256',
    code_challenge: challenge,
    scope: 'user-top-read playlist-read-private playlist-read-collaborative user-read-email',
  });

  return res.redirect(`https://accounts.spotify.com/authorize?${params}`);
}
