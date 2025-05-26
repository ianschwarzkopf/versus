import fetch from "node-fetch";

export default async function handler(req, res) {
  // Only allow POST since this is a sensitive token exchange
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { code, code_verifier } = req.body;

  if (!code || !code_verifier) {
    return res.status(400).json({ error: "Missing code or code_verifier" });
  }

  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

  const params = new URLSearchParams();
  params.append("client_id", client_id);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", redirect_uri);
  params.append("code_verifier", code_verifier);

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      // Forward Spotify's error message
      return res.status(response.status).json(data);
    }

    // Success: return access_token, refresh_token, expires_in, etc.
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
