import React, { useState } from 'react';
import "./SearchBar.css";

const Search = () => {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.toLowerCase() === 'apple') {
      window.location.href = '/company/Apple'; // Only Apple redirects for now
    } else {
      alert('Currently under maintenance');
    }
  };

  return (
    <div className="search-popup">
      <div className="search-popup-content">
        <form onSubmit={handleSearch}>
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search companies" 
            className="centered-search-input"
          />
          <button type="submit" className="search-button">Search</button>
        </form>
      </div>
    </div>
  );
};

export default Search;
