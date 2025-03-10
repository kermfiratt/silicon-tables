import React, { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

const Search = ({ setSearchOpen }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [recentCompanies, setRecentCompanies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    document.getElementById('search-input').focus(); // Auto-focus on input
  }, []);

  // Fetch suggestions from Alpha Vantage API
  const fetchSuggestions = async (input) => {
    if (!input) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${input}&apikey=${process.env.REACT_APP_ALPHA_VANTAGE_KEY}`
      );
      const suggestionData = response.data?.bestMatches || [];

      // Filter and map suggestions
      const filteredSuggestions = suggestionData
        .filter((item) => !item["1. symbol"].includes('.')) // Remove symbols with extensions
        .map((item) => ({
          ticker: item["1. symbol"],
          name: item["2. name"],
        }));

      setSuggestions(filteredSuggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (ticker, name) => {
    // Add to recent companies
    setRecentCompanies((prev) => {
      const exists = prev.find((company) => company.ticker === ticker);
      if (exists) return prev; // Avoid duplicates
      const newCompany = { ticker, name };
      return [newCompany, ...prev.slice(0, 4)]; // Keep only the last 5 companies
    });

    navigate(`/company/${ticker}`); // Navigate to company page
    setSearchOpen(false); // Close search popup
    setQuery(''); // Clear query
    setSuggestions([]); // Clear suggestions
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleSuggestionClick(suggestions[0].ticker, suggestions[0].name);
    }
  };

  // Close search popup
  const handleClosePopup = (e) => {
    if (e.target.className === 'search-popup') {
      setSearchOpen(false);
    }
  };

  return (
    <div className="search-popup" onClick={handleClosePopup}>
      <div className="search-popup-content">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-wrapper">
            <FiSearch className="search-icon" />
            <input
              id="search-input"
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                fetchSuggestions(e.target.value);
              }}
              placeholder="Search for companies..."
              autoComplete="off"
            />
          </div>
        </form>

        {/* Suggestions dropdown */}
        {suggestions.length > 0 && (
          <div className="suggestions-dropdown">
            <ul>
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion.ticker, suggestion.name)}
                >
                  <strong>{suggestion.ticker}</strong> - {suggestion.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recently visited companies */}
        {recentCompanies.length > 0 && (
          <div className="recent-companies">
            <h4>Recently Searched</h4>
            <ul>
              {recentCompanies.map((company, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(company.ticker, company.name)}
                >
                  <strong>{company.ticker}</strong> - {company.name}
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