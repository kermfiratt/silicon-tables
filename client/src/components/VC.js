import React, { useState } from 'react';
import axios from 'axios';
import './VC.css';

const VC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a valid query.');
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get('http://localhost:7600/api/search', {
        params: { query: searchQuery },
      });

      const results = response.data.entities.map((entity) => ({
        name: entity.properties.name || 'Not Available',
        chairpersons: entity.properties.founders || 'Not Available',
        totalEmployees: entity.properties.num_employees_min
          ? `${entity.properties.num_employees_min} - ${entity.properties.num_employees_max || 'N/A'}`
          : 'Not Available',
        funding: entity.properties.funding_stage || 'Not Available',
        location: entity.properties.headquarters_city || 'Not Available',
      }));

      setSearchResults(results);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err.message);
      setError('Failed to fetch data. Please try again later.');
      setSearchResults([]);
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
          <div key={index} className="result-block">
            <h3>{result.name}</h3>
            <p>
              <strong>Chairpersons:</strong> {result.chairpersons}
            </p>
            <p>
              <strong>Total Employees:</strong> {result.totalEmployees}
            </p>
            <p>
              <strong>Funding Stage:</strong> {result.funding}
            </p>
            <p>
              <strong>Location:</strong> {result.location}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VC;
