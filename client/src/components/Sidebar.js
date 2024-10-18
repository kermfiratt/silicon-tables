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
          <li><Link to="/" className="sidebar-item"><FaChartLine className="icon" /> Dashboard</Link></li>
          <li><Link to="/company/Apple" className="sidebar-item"><FaBuilding className="icon" /> Company Info</Link></li>
          <li><Link to="/" className="sidebar-item"><FaStream className="icon" /> Flow</Link></li>
          <li><Link to="/" className="sidebar-item"><FaListAlt className="icon" /> Report</Link></li>
          <li><Link to="/" className="sidebar-item"><FaChartPie className="icon" /> Funds</Link></li>
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
