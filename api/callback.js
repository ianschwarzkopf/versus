import fetch from "node-fetch";
import { serialize } from "cookie";

export default async function handler(req, res) {
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
      return res.status(response.status).json(data);
    }

    const { access_token, refresh_token, expires_in } = data;

    // Set HttpOnly, Secure cookies
    // Setting cookies in OAuth callback handler
    res.setHeader('Set-Cookie', [
      serialize('spotify_access_token', access_token, {
        httpOnly: true,
        secure: true, // must be true in production
        maxAge: expires_in, // e.g. 3600 seconds
        path: '/',
        sameSite: 'lax',
      }),
      serialize('spotify_refresh_token', refresh_token, {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
        sameSite: 'lax',
      }),
    ]);



    // Respond with success, no tokens sent to client-side JS
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
