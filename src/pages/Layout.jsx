import React from 'react';
import { Outlet } from 'react-router-dom';
import styles from './Layout.module.css';
import Logo from '/versus_logo_fit.svg';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Layout() {
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const url = user.user_metadata?.avatar_url || user.user_metadata?.picture;
        setAvatarUrl(url);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className={styles.layout}>
      <header className={styles.navbar}>
        <div className={styles.logo}><img src={Logo}/>versus.fm</div>
        <nav className={styles.navLinks}>
          <button className={styles.vip} href="/#premium">VIP</button>
        </nav>
        {avatarUrl && (
        <img className={styles.profile_img}
          src={avatarUrl}
          alt="Profile"
          style={styles.avatar}
        />
      )}
      </header>

      <main className={styles.mainContent}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        © 2025 versus.fm
      </footer>
    </div>
  );
}
