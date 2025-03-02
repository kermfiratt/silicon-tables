import React, { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import "./SearchBar.css";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Search = ({ setSearchOpen }) => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [recentCompanies, setRecentCompanies] = useState([]); // Recent companies state
  const navigate = useNavigate();

  useEffect(() => {
    document.getElementById('search-input').focus(); // Automatically focus on the search input
  }, []);

  const fetchSuggestions = async (input) => {
    if (!input) {
      setSuggestions([]);
      return;
    }

    const API_URL = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${input}&apikey=${process.env.REACT_APP_ALPHA_VANTAGE_KEY}`;

    try {
      const response = await axios.get(API_URL);
      const suggestionData = response.data?.bestMatches || [];

      // Filter and sort suggestions
      const filteredSuggestions = suggestionData
        .filter((item) => !item["1. symbol"].includes('.')) // Remove symbols with extensions
        .sort((a, b) => parseFloat(b["9. matchScore"]) - parseFloat(a["9. matchScore"])) // Sort by match score
        .map((item) => ({
          ticker: item["1. symbol"],
          name: item["2. name"],
        }));

      // Fetch logos from Finnhub
      const logoPromises = filteredSuggestions.map(async (company) => {
        const logoURL = `https://finnhub.io/api/v1/stock/profile2?symbol=${company.ticker}&token=${process.env.REACT_APP_API_KEY}`;
        const timeoutPromise = new Promise((resolve) =>
          setTimeout(() => resolve({ ...company, logo: '' }), 2500) // Timeout after 2.5 seconds
        );

        const logoResponsePromise = axios
          .get(logoURL)
          .then((res) => ({
            ...company,
            logo: res.data?.logo || '', // Add logo if available
          }))
          .catch(() => ({
            ...company,
            logo: '',
          }));

        return Promise.race([logoResponsePromise, timeoutPromise]);
      });

      const suggestionsWithLogos = await Promise.all(logoPromises);
      setSuggestions(suggestionsWithLogos);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (ticker, name) => {
    // Add the clicked company to recentCompanies
    setRecentCompanies((prev) => {
      const exists = prev.find((company) => company.ticker === ticker);
      if (exists) return prev; // Avoid duplicates
      const newCompany = { ticker, name };
      return [newCompany, ...prev.slice(0, 4)]; // Keep only the last 5 companies
    });

    navigate(`/company/${ticker}`); // Navigate to the company page
    setSearchOpen(false);
    setError(null);
    setSuggestions([]);
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query) {
      setError('Please enter a company name or ticker.');
      return;
    }

    try {
      const API_URL = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${process.env.REACT_APP_ALPHA_VANTAGE_KEY}`;
      const response = await axios.get(API_URL);
      const searchData = response.data?.bestMatches || [];

      if (searchData.length > 0) {
        const selectedCompany = searchData[0];
        handleSuggestionClick(selectedCompany["1. symbol"], selectedCompany["2. name"]);
      } else {
        setError('Company not found. Please try a different search.');
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
              onChange={(e) => {
                setQuery(e.target.value);
                fetchSuggestions(e.target.value);
              }}
              placeholder="Search for companies..."
              className="centered-search-input"
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}

          {/* Suggestions dropdown */}
          {suggestions.length > 0 && (
            <div className="suggestions-dropdown">
              <ul>
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion.ticker, suggestion.name)}
                    style={{ display: 'flex', alignItems: 'center', gap: '15px' }}
                  >
                    {suggestion.logo ? (
                      <img
                        src={suggestion.logo}
                        alt={suggestion.name}
                        className="company-logo"
                      />
                    ) : (
                      <div className="placeholder-logo">N/A</div> // Placeholder logo
                    )}
                    <div>
                      <strong>{suggestion.ticker}</strong> - {suggestion.name}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </form>

        {/* Recently visited companies */}
        {recentCompanies.length > 0 && (
          <div className="recent-companies">
            <h4>Frequently Searched</h4>
            <ul>
              {recentCompanies.map((company, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(company.ticker, company.name)}
                  style={{ cursor: 'pointer' }}
                >
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