import React, { useState } from 'react';
import axios from 'axios';
import './VC.css';

const VC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a valid company name.');
      setSearchResults(null);
      return;
    }

    try {
      const response = await axios.post('http://localhost:7600/api/search', {
        name: searchQuery,
      });

      setSearchResults(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching data from server:', err.response?.data || err.message);
      setError(
        err.response?.data?.error || 'Failed to fetch data. Please try again later.'
      );
      setSearchResults(null);
    }
  };

  return (
    <div className="vc-container">
      <h1>Search Companies</h1>
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Enter company name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {error && <p className="error-message">{error}</p>}
      {searchResults && (
        <div className="search-results">
          <h3>{searchResults.name}</h3>
          <p><strong>Domain:</strong> {searchResults.domain || 'N/A'}</p>
          <p><strong>ID:</strong> {searchResults.id || 'N/A'}</p>
          <p><strong>Description:</strong> {searchResults.description || 'N/A'}</p>
        </div>
      )}
    </div>
  );
};

export default VC;
