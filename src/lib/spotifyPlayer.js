// src/lib/spotifyPlayer.js
let player;

export const loadSpotifyPlayer = (accessToken) => {
  return new Promise((resolve) => {
    if (window.Spotify) {
      initialize(accessToken, resolve);
    } else {
      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.async = true;
      document.body.appendChild(script);
      window.onSpotifyWebPlaybackSDKReady = () => initialize(accessToken, resolve);
    }
  });
};

function initialize(accessToken, resolve) {
  player = new Spotify.Player({
    name: 'Ranking Player',
    getOAuthToken: cb => cb(accessToken),
    volume: 0.5,
  });

  player.addListener('ready', ({ device_id }) => {
    console.log('Player ready with device ID:', device_id);
    resolve({ player, device_id });
  });

  player.addListener('initialization_error', e => console.error('Init error', e.message));
  player.addListener('authentication_error', e => console.error('Auth error', e.message));
  player.addListener('account_error', e => console.error('Account error', e.message));
  player.addListener('playback_error', e => console.error('Playback error', e.message));

  player.connect();
}
