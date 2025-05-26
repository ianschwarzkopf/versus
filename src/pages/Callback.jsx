import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Callback.module.css';
import Logo from '/versus_logo_fit.svg';

export default function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const verifier = localStorage.getItem("code_verifier");

    if (!code || !verifier) {
      console.error('Missing code or verifier');
      return;
    }

    fetch('/api/callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, code_verifier: verifier }), // <-- key renamed here
    })

      .then(res => res.json())
      .then(data => {
        console.log('Callback response data:', data);
        if (data.access_token) {
          // Successful token exchange
          navigate('/home');
        } else if (data.error) {
          // Spotify error
          console.error('Callback error:', data.error, data.error_description || '');
        } else {
          // Unexpected response
          console.error('Callback error: Unknown response', data);
        }
      })

      .catch(err => {
        console.error('Fetch error:', err);
      });
  }, []);

  return (
    <div className={styles.callback}>
      <h1>Logging in...</h1>
    </div>
  );
}
