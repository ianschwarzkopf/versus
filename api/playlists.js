import fetch from "node-fetch";
import { parse, serialize } from "cookie";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Parse cookies from request header
  const cookies = parse(req.headers.cookie || "");
  let access_token = cookies.spotify_access_token;
  const refresh_token = cookies.spotify_refresh_token;

  if (!access_token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  // Try calling Spotify API with access token
  let spotifyResponse = await fetch("https://api.spotify.com/v1/me/playlists?limit=50", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  // If access token expired (401), try refreshing it
  if (spotifyResponse.status === 401 && refresh_token) {
    const tokenRefreshResponse = await refreshAccessToken(refresh_token);

    if (!tokenRefreshResponse.success) {
      return res.status(401).json({ error: "Refresh token invalid" });
    }

    access_token = tokenRefreshResponse.access_token;

    // Update access token cookie with new token and expiry
    res.setHeader(
      "Set-Cookie",
      serialize("spotify_access_token", access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: tokenRefreshResponse.expires_in,
        path: "/",
        sameSite: "lax",
      })
    );

    // Retry Spotify API call with new access token
    spotifyResponse = await fetch("https://api.spotify.com/v1/me/playlists?limit=50", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
  }

  if (!spotifyResponse.ok) {
    const errorData = await spotifyResponse.json();
    return res.status(spotifyResponse.status).json({ error: errorData.error.message });
  }

  const data = await spotifyResponse.json();
  res.status(200).json(data);
}

// Helper function to refresh Spotify access token using refresh token
async function refreshAccessToken(refresh_token) {
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", refresh_token);

  // Spotify requires Authorization header with client_id and client_secret in base64
  const basicAuth = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false };
    }

    return {
      success: true,
      access_token: data.access_token,
      expires_in: data.expires_in,
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return { success: false };
  }
}
