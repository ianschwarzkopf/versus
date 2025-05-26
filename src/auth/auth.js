// Generates a random string (code verifier) of length 128
export function generateCodeVerifier() {
  const array = new Uint8Array(128);
  window.crypto.getRandomValues(array);
  return base64UrlEncode(array);
}

// Converts ArrayBuffer to Base64 URL-safe string (no padding, '+' -> '-', '/' -> '_')
function base64UrlEncode(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Generates a code challenge from the verifier (SHA-256, base64-url encoded)
export async function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return base64UrlEncode(digest);
}
