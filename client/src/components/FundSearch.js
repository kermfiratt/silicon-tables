// src/components/FundSearch.js
import React, { useState } from 'react';

const FundSearch = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <input
      type="text"
      value={query}
      onChange={handleInputChange}
      placeholder="Search funds..."
      className="fund-search-bar"
    />
  );
};

export default FundSearch;
