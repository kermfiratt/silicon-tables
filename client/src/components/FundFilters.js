// src/components/FundFilters.js
import React from 'react';

const FundFilters = ({ onFilterChange }) => {
  return (
    <div className="fund-filters">
      <button onClick={() => onFilterChange('volumeDesc')}>Volume Desc</button>
      <button onClick={() => onFilterChange('volumeAsc')}>Volume Asc</button>
      <button onClick={() => onFilterChange('return1YDesc')}>1Y Return Desc</button>
      <button onClick={() => onFilterChange('return1YAsc')}>1Y Return Asc</button>
    </div>
  );
};

export default FundFilters;
