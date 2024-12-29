import React, { useState } from 'react';
import axios from 'axios';
import './VC.css';

const VC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a valid query.');
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.post('http://localhost:7600/api/search', {
        query: searchQuery,
      });

      setSearchResults(response.data);
      setSelectedDetails(null);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err.message);
      setError('Failed to fetch data. Please try again later.');
      setSearchResults([]);
    }
  };

  const fetchDetails = async (permalink) => {
    try {
      const response = await axios.get(`http://localhost:7600/api/details/${permalink}`);
      setSelectedDetails(response.data);
    } catch (err) {
      console.error('Error fetching details:', err.message);
      setError('Failed to fetch details. Please try again later.');
    }
  };

  return (
    <div className="vc-container">
      <h1>Search Venture Capital Firms</h1>
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search for a venture capital firm or startup..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {error && <p className="error-message">{error}</p>}
      <div className="search-results">
        {searchResults.map((result, index) => (
          <div
            key={index}
            className="result-block"
            onClick={() => fetchDetails(result.permalink)}
          >
            <h3>{result.name}</h3>
            <p>
              <strong>Website:</strong>{' '}
              <a href={result.website} target="_blank" rel="noopener noreferrer">
                {result.website || 'Not Available'}
              </a>
            </p>
            <p>
              <strong>Facebook:</strong>{' '}
              <a href={result.facebook} target="_blank" rel="noopener noreferrer">
                {result.facebook || 'Not Available'}
              </a>
            </p>
            <p>
              <strong>LinkedIn:</strong>{' '}
              <a href={result.linkedin} target="_blank" rel="noopener noreferrer">
                {result.linkedin || 'Not Available'}
              </a>
            </p>
            <p>
              <strong>Twitter:</strong>{' '}
              <a href={result.twitter} target="_blank" rel="noopener noreferrer">
                {result.twitter || 'Not Available'}
              </a>
            </p>
          </div>
        ))}
      </div>
      {selectedDetails && (
        <div className="details-block">
          <h2>{selectedDetails.name}</h2>
          <p>
            <strong>Description:</strong> {selectedDetails.shortDescription || 'Not Available'}
          </p>
        </div>
      )}
    </div>
  );
};

export default VC;
