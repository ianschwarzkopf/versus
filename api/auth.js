export default function handler(req, res) {
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;
  const scope = "user-read-private user-read-email"; // adjust scopes as needed
  const code_challenge = req.query.code_challenge;

  if (!code_challenge) {
    return res.status(400).json({ error: "Missing code_challenge" });
  }

  const authUrl = new URL("https://accounts.spotify.com/authorize");
  authUrl.searchParams.append("client_id", client_id);
  authUrl.searchParams.append("response_type", "code");
  authUrl.searchParams.append("redirect_uri", redirect_uri);
  authUrl.searchParams.append("scope", scope);
  authUrl.searchParams.append("code_challenge_method", "S256");
  authUrl.searchParams.append("code_challenge", code_challenge);

  // Redirect user to Spotify authorization URL
  res.redirect(authUrl.toString());
}
