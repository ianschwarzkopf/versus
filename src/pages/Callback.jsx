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
    console.log('Body:', req.body);

    if (!code || !verifier) {
      return res.status(400).json({ error: 'Missing code or verifier', received: req.body });
    }

    fetch('/api/callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, verifier }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          navigate('/home');
        }
      });
  }, []);

  return (
    <div className={styles.callback}>
      <h1>Logging in...</h1>
    </div>
  );
}
