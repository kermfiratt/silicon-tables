// src/components/Sidebar.js
import React, { useState, useEffect } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaBuilding, FaBackward, FaHome, FaDatabase, FaAngellist, FaChartLine } from 'react-icons/fa';
import './Sidebar.css';
import Search from './Search'; 
import logo from '../logo.webp';

const Sidebar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [latestCompany, setLatestCompany] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const lastVisitedCompany = localStorage.getItem('latestCompany');
    if (lastVisitedCompany) {
      setLatestCompany(lastVisitedCompany);
    }
  }, []);

  const handleCompanyInfoClick = () => {
    if (latestCompany) {
      navigate(`/company/${latestCompany}`);
    } else {
      navigate(`/company/Apple`);
    }
  };

  return (
    <div className="sidebar">
      <ul className="menu">
        <li>
          <div className="sidebar-logo">
            <Link to="/" className="sidebar-item">
              <img src={logo} alt="Silicon Numbers Logo" className="sidebar-logo" />
            </Link>
          </div>
        </li>

        <li>
          <Link to="/" className="sidebar-item">
            <FaHome className="icon" /> Home
          </Link>
        </li>
        
        <li>
          <div 
            className="sidebar-item search-button" 
            onClick={() => setIsSearchOpen(true)}
          >
            <FaSearch className="icon" /> Search
          </div>
        </li>
        
        <li>
          <div className="sidebar-item" onClick={handleCompanyInfoClick}>
            <FaBuilding className="icon" /> Company Info
          </div>
        </li>

        <li>
          <Link to="/funds" className="sidebar-item">
            <FaDatabase className="icon" /> Funds
          </Link>
        </li>

        <li>
          <Link to="/vcs" className="sidebar-item">
            <FaAngellist className="icon" /> VCs
          </Link>
        </li>

        {/* Yeni Option Tracker butonu */}
        <li>
          <Link to="/option-tracker" className="sidebar-item">
            <FaChartLine className="icon" /> Option Tracker
          </Link>
        </li>

        <li className="inactive-item">
          <FaBackward className="icon" /> Inactive Button
        </li>
      </ul>

      {isSearchOpen && (
        <Search setSearchOpen={setIsSearchOpen} />
      )}
    </div>
  );
};

export default Sidebar;
