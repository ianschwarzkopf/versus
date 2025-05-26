// Generates a random string (code verifier) of length 128
export function generateCodeVerifier() {
  const array = new Uint8Array(64); // 64 bytes = 86 char string after base64
  window.crypto.getRandomValues(array);
  return base64UrlEncode(array);
}

// Base64-url encodes an ArrayBuffer or Uint8Array
function base64UrlEncode(buffer) {
  const bytes = new Uint8Array(buffer);
  const base64String = btoa(String.fromCharCode(...bytes));
  return base64String
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
