// src/components/Search.js
import React, { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi'; // Importing a search icon from react-icons
import "./SearchBar.css";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Search = ({ setSearchOpen }) => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);
  const [recentCompanies, setRecentCompanies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    document.getElementById('search-input').focus(); // Automatically focus on the search input
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();

    const API_URL = `https://finnhub.io/api/v1/stock/profile2?symbol=${query.toUpperCase()}&token=${process.env.REACT_APP_API_KEY}`;

    try {
      const response = await axios.get(API_URL);
      const companyData = response.data;

      if (companyData && companyData.name) {
        setSearchOpen(false); // Close search popup
        setRecentCompanies((prev) => [companyData, ...prev.slice(0, 4)]); // Store the last 5 searches
        navigate(`/company/${query.toUpperCase()}`); // Navigate to the CompanyDetails page
      } else {
        setError('Company not found or under maintenance.');
      }
    } catch (error) {
      console.error('Error fetching company data:', error);
      setError('Error fetching company data or currently under maintenance.');
    }
  };

  const handleClosePopup = () => {
    setSearchOpen(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target.className === "search-popup") {
      handleClosePopup();
    }
  };

  return (
    <div className="search-popup" onClick={handleOverlayClick}>
      <div className="search-popup-content">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-wrapper">
            <FiSearch className="search-icon" />
            <input
              id="search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for companies..."
              className="centered-search-input"
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>

        {/* Recently visited companies */}
        {recentCompanies.length > 0 && (
          <div className="recent-companies">
            <h4>Frequently Searched</h4>
            <ul>
              {recentCompanies.map((company, index) => (
                <li key={index} onClick={() => navigate(`/company/${company.ticker}`)}>
                  <img src={company.logo} alt={company.name} className="company-logo" />
                  <span>{company.ticker}</span> - {company.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
