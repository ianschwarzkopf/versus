import React from 'react';
import styles from './LandingPage.module.css';
import nav from './Layout.module.css';
import Logo from '/versus_logo_fit.svg';
import { Outlet, Link } from "react-router-dom";

import VersusCards from '/versus_cards.png'

import Login from './Login'

export default function LandingPage() {
  return (
    <div className={nav.layout}>
      <header className={nav.navbar}>
        <div className={nav.logo}><img src={Logo}/>versus.fm</div>
        <nav className={nav.navLinks}>
          <button className={nav.vip} href="/#premium">VIP</button>
          <Login />
        </nav>
      </header>

      <main className={nav.mainContent}>

        <div className={styles.landing}>
          <section className={styles.hero}>
            <div className={styles.hero_left}>
              <h1 className={styles.title}>Hotline Bling or God's Plan?</h1>
              <p className={styles.subtitle}>
                You decide in the ultimate battle of track comparison.
                Pit your favorite songs against each other and find out which one you truly like the most.
              </p>
              <button href="/app">Login to Spotify</button>
            </div>
            <div>
              <img className={styles.photo} src={VersusCards}/>
            </div>
          </section>

          <section className={styles.features} id="how">
            <div>

            </div>
            <div>
              <h2>How it Works</h2>
              <ul className={styles.featureList}>
                <li>Select an album or playlist</li>
                <li>Compare songs in head-to-head matchups</li>
                <li>View your personalized ranked list</li>
              </ul>
            </div>
          </section>

          <section className={styles.vip}>
            <h2>Become a VIP</h2>
            <p> Unlock unlimited matchups, advanced ranking tools, and your personal Spotify-style wrap-up card.</p>
            <button className={nav.vip}>Learn More</button>
          </section>
        </div>

      </main>

      <footer className={nav.footer}>
        © 2025 versus.fm
      </footer>
    </div>
  );
}
