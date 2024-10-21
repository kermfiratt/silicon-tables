import React, { useState } from 'react';
import "./SearchBar.css";
import axios from "axios";
import { useNavigate } from 'react-router-dom'; // For routing

const Search = ({ setSearchOpen }) => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook to programmatically navigate

  const handleSearch = async (e) => {
    e.preventDefault();

    const API_URL = `https://finnhub.io/api/v1/stock/profile2?symbol=${query.toUpperCase()}&token=${process.env.REACT_APP_API_KEY}`;

    try {
      const response = await axios.get(API_URL);
      const companyData = response.data;

      if (companyData && companyData.name) {
        // If valid company data is returned, close the search popup and redirect
        setSearchOpen(false);
        navigate(`/company/${query.toUpperCase()}`); // Navigate to the CompanyDetails page with the symbol
      } else {
        setError('Company not found or under maintenance.');
      }
    } catch (error) {
      console.error('Error fetching company data:', error);
      setError('Error fetching company data or currently under maintenance.');
    }
  };

  const handleClosePopup = () => {
    setSearchOpen(false); // Close the popup
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
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div className="button-container">
            <button type="submit" className="search-bar-button">Search</button>
            <button type="button" className="close-button" onClick={handleClosePopup}>Close</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Search;
