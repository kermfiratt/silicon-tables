import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaChartLine, FaBuilding, FaStream, FaListAlt, FaChartPie } from 'react-icons/fa';
import './Sidebar.css';
import './SearchBar.css';

const Sidebar = () => {
  const [searchOpen, setSearchOpen] = useState(false); // State to control search popup

  const handleSearchClick = () => {
    setSearchOpen(true); // Open the centered search bar when search is clicked
  };

  return (
    <div>
      <div className="sidebar">
        <div className="sidebar-header">
          <h1>Silicon Numbers</h1>
        </div>

        <div className="search-bar">
          <div className="search-button" onClick={handleSearchClick}>
            <FaSearch className="icon" /> Search
          </div>
        </div>

        <ul className="menu">
          {/* Active and clickable links */}
          <li><Link to="/company/Apple" className="sidebar-item"><FaBuilding className="icon" /> Company Info</Link></li>
          
          {/* Inactive links (shown but not clickable) */}
          <li className="inactive-item"><FaChartLine className="icon" /> Dashboard</li>
          <li className="inactive-item"><FaStream className="icon" /> Flow</li>
          <li className="inactive-item"><FaListAlt className="icon" /> Report</li>
          <li className="inactive-item"><FaChartPie className="icon" /> Funds</li>
        </ul>
      </div>

      {searchOpen && <CenteredSearchBar setSearchOpen={setSearchOpen} />} {/* Show search bar when open */}
    </div>
  );
};

const CenteredSearchBar = ({ setSearchOpen }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClose = () => {
    setSearchOpen(false); // Close search bar
  };

  return (
    <div className="search-popup">
      <div className="search-popup-content">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search for a company..."
          className="centered-search-input"
        />
        <button className="close-button" onClick={handleClose}>Close</button>
      </div>
    </div>
  );
};

export default Sidebar;
