import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Mock data for testing, using Apple as the only result
    const mockData = [
      { name: 'Apple' }
    ];

    const filteredResults = mockData.filter(company =>
      company.name.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filteredResults);
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
        <button className='sidebar-item' type="submit">Search</button>
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
