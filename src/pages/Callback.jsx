import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Callback.module.css';
import Logo from '/versus_logo_fit.svg';

export default function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const verifier = localStorage.getItem("verifier");

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
        if (data.success) {
          navigate('/home');
        } else {
          console.error('Callback error:', data.error);
          // Optionally show an error message to user here
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
