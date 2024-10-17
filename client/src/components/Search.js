import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:7600/search?query=${query}`);
    const data = await response.json();
    setResults(data);
  };

  return (
    <div className="search-page">
      <form onSubmit={handleSearch}>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search companies" 
        />
        <button type="submit">Search</button>
      </form>
      <ul>
        {results.map((result, index) => (
          <li key={index}>
            <Link to={`/company/${result.name}`}>{result.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Search;
