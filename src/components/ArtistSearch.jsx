import { useState, useNavigate } from 'react';
import styles from './ArtistSearch.module.css'

export default function ArtistSearch({ token }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search/${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className={styles.search_container}>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          placeholder="Search for an artist..."
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
}
