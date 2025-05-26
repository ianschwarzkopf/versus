import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Callback.module.css';
import Logo from '/versus_logo_fit.svg';

export default function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
  const getSession = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (data?.session) {
      console.log('Logged in! Spotify token:', data.session.provider_token);
    }
  };
  getSession();
}, []);


  return (
    <div className={styles.callback}>
      <h1>Logging in...</h1>
    </div>
  );
}
