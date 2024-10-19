import React, { useState, useEffect } from 'react';
import "./SearchBar.css";

const Search = ({ setSearchOpen }) => {
  const [query, setQuery] = useState('');

  // useEffect to clean up the blur when the component unmounts
  useEffect(() => {
    // Add blur when the component is mounted (popup is shown)
    
    
    // Cleanup function to remove blur when the popup is closed
    return () => {
      document.body.classList.remove('blur');
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    if (query.toLowerCase() === 'apple') {
      setSearchOpen(false); // Close popup
      document.body.classList.remove('blur'); // Remove blur
      window.location.href = '/company/Apple'; // Redirect to Apple page
    } else {
      alert('Currently under maintenance'); // Alert for non-Apple queries
    }
  };

  const handleClosePopup = () => {
    setSearchOpen(false); // Close popup
    
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
          <button type="submit" className="close-button">Search</button>
        </form>
        <button className="close-button" onClick={handleClosePopup}>Close</button>
      </div>
    </div>
  );
};

export default Search;
