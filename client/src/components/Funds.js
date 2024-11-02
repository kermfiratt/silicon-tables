// src/components/Funds.js
import React, { useState, useEffect } from 'react';
import FundList from './FundList';
import FundFilters from './FundFilters';
import FundSearch from './FundSearch'; // Güncellenmiş dosya adı
import './Funds.css';

const Funds = () => {
  const [funds, setFunds] = useState([]); // Tüm fonlar
  const [filteredFunds, setFilteredFunds] = useState([]); // Filtrelenmiş fonlar
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState(''); // Seçilen filtre

  useEffect(() => {
    const fetchFunds = async () => {
      const fetchedFunds = [
        { id: 1, name: 'AAK', category: 'Variable', institution: 'Institution A', returns: { '1M': -1.37, '3M': -1.94, '6M': 10.83, '1Y': 38.84, '5Y': 44.73 } },
      ];
      setFunds(fetchedFunds);
      setFilteredFunds(fetchedFunds);
    };

    fetchFunds();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = funds.filter((fund) => fund.name.toLowerCase().includes(query.toLowerCase()));
    setFilteredFunds(filtered);
  };

  const handleFilterChange = (selectedFilter) => {
    setFilter(selectedFilter);
    let sortedFunds = [...filteredFunds];
    if (selectedFilter === 'volumeDesc') {
      sortedFunds.sort((a, b) => b.volume - a.volume);
    } else if (selectedFilter === 'volumeAsc') {
      sortedFunds.sort((a, b) => a.volume - b.volume);
    } else if (selectedFilter === 'return1YDesc') {
      sortedFunds.sort((a, b) => b.returns['1Y'] - a.returns['1Y']);
    } else if (selectedFilter === 'return1YAsc') {
      sortedFunds.sort((a, b) => a.returns['1Y'] - b.returns['1Y']);
    }
    setFilteredFunds(sortedFunds);
  };

  return (
    <div className="funds-container">
      <h1>Funds</h1>
      <FundSearch onSearch={handleSearch} />
      <FundFilters onFilterChange={handleFilterChange} />
      <FundList funds={filteredFunds} />
    </div>
  );
};

export default Funds;
