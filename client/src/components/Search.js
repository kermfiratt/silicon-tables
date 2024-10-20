import React, { useState } from 'react';
import "./SearchBar.css";


const Search = ({ setSearchOpen }) => {  // setSearchOpen prop olarak alınıyor
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();

    if (query.toLowerCase() === 'apple') {
      setSearchOpen(false); // Popup'ı kapat
      window.location.href = '/company/Apple'; // Apple sayfasına yönlendir
    } else {
      alert('Currently under maintenance'); // Apple dışındaki sorgular
    }
  };

  const handleClosePopup = () => {
    setSearchOpen(false); // Popup'ı kapat
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
          <div className="button-container">
            <button type="submit" className="search-button">Search</button>
            <button type="button" className="close-button" onClick={handleClosePopup}>Close</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Search;
