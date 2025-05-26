import React from 'react';
import { Outlet } from 'react-router-dom';
import styles from './Layout.module.css';
import Logo from '/versus_logo_fit.svg';

export default function Layout() {
  return (
    <div className={styles.layout}>
      <header className={styles.navbar}>
        <div className={styles.logo}><img src={Logo}/>versus.fm</div>
        <nav className={styles.navLinks}>
          <button className={styles.vip} href="/#premium">VIP</button>
          <button href="/app">Login</button>
        </nav>
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
