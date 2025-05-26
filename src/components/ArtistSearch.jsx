// components/ArtistSearch.jsx
import { useState } from 'react';

export default function ArtistSearch({ token }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const searchArtists = async () => {
    if (!query) return;

    const res = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        query
      )}&type=artist&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    setResults(data.artists?.items || []);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search for an artist"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={searchArtists}>Search</button>

      <ul>
        {results.map((artist) => (
          <li key={artist.id}>
            <img src={artist.images[0]?.url} alt="" width={40} />
            {artist.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
