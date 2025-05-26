import crypto from "crypto";

function base64URLEncode(str) {
  return str
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest();
}

export default function handler(req, res) {
  const client_id = process.env.CLIENT_ID;
  const redirect_uri = process.env.REDIRECT_URI;

  // Generate a code verifier (random string)
  const code_verifier = base64URLEncode(crypto.randomBytes(32));
  // Generate code challenge (sha256 of verifier)
  const code_challenge = base64URLEncode(sha256(code_verifier));

  // Save the code_verifier in a cookie or client localStorage?
  // Since this is stateless serverless, best to send it to client to store
  // For demo, we send it back to client in JSON; frontend must save it

  const state = crypto.randomBytes(16).toString("hex"); // optional

  const scope = "user-top-read playlist-read-private playlist-read-collaborative user-read-email";

  const params = new URLSearchParams({
    response_type: "code",
    client_id,
    scope,
    redirect_uri,
    state,
    code_challenge_method: "S256",
    code_challenge,
  });

  const spotifyAuthUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;

  res.status(200).json({
    url: spotifyAuthUrl,
    code_verifier,
    state,
  });
}
