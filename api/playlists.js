export default async function handler(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing Spotify token' });
  }

  const access_token = authHeader.split(' ')[1];

  try {
    const spotifyResponse = await fetch(
      'https://api.spotify.com/v1/me/playlists?limit=50',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (!spotifyResponse.ok) {
      const errorData = await spotifyResponse.json();
      return res.status(spotifyResponse.status).json({ error: errorData.error.message });
    }

    const data = await spotifyResponse.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
}
