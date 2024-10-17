import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChartLine, FaBuilding, FaStream, FaListAlt, FaChartPie, FaSearch } from 'react-icons/fa'; // Import FaSearch
import './Sidebar.css';

const Sidebar = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>Silicon Numbers</h1>
      </div>

      <div className="search-bar">
        <Link to={`/company/${searchQuery}`} className="search-button">
          <FaSearch className="icon" /> {/* Magnifying glass icon */}
          Search
        </Link>
      </div>

      <ul className="menu">
        <li><Link to="/" className="sidebar-item"><FaChartLine className="icon" /> Dashboard</Link></li>
        <li><Link to="/company/Apple" className="sidebar-item"><FaBuilding className="icon" /> Company Info</Link></li>
        <li><Link to="/" className="sidebar-item"><FaStream className="icon" /> Flow</Link></li>
        <li><Link to="/" className="sidebar-item"><FaListAlt className="icon" /> Report</Link></li>
        <li><Link to="/" className="sidebar-item"><FaChartPie className="icon" /> Funds</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
