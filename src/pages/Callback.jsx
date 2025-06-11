import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import styles from './Callback.module.css';

export default function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      const session = data?.session;

      if (error) {
        console.error("Error getting session:", error.message);
        return;
      }

      if (session?.provider_token) {
        navigate('/home');
      } else {
        console.warn("No Spotify token found in session");
      }
    };

    getSession();
  }, [navigate]);

  return (
    <div className={styles.callback}>
      <h1>Logging in...</h1>
    </div>
  );
}
