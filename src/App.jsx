import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from './pages/LandingPage'
import Layout from './pages/Layout'
import Login from './pages/Login'
import Callback from './pages/Callback'
import Home from './pages/Home'

function App() {

  return (
    <Routes>
      <Route index element={<LandingPage />} />
      <Route path="/" element={<Layout />}>
        <Route path="login" element={<Login />} />
        <Route path="callback" element={<Callback />} />
        <Route path="home" element={<Home />} />
        <Route path="/search/:query" element={<SearchResults />} />
        <Route path="/artist/:id" element={<ArtistAlbums />} />
      </Route>
    </Routes>
  )
}

export default App
