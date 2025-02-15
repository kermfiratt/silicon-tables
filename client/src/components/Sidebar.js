// src/components/Sidebar.js
import React, { useState, useEffect } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaBuilding, FaHome, FaUser } from 'react-icons/fa';
import './Sidebar.css';
import Search from './Search'; 
import logo from '../logo.webp';
import { FaCodeCompare, FaPaperclip } from 'react-icons/fa6';

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

  const handleCompareClick = () => {
    navigate('/compare'); // Navigate to Compare page
  };

  const handleReportClick = () => {
    navigate('/report'); // Navigate to Compare page
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
          <div className="sidebar-item user" onClick={handleCompareClick}>
            <FaCodeCompare className="icon" /> Compare
          </div>
        </li>

        <li>
          <div className="sidebar-item user" onClick={handleReportClick}>
            <FaPaperclip className="icon" /> Report
          </div>
        </li>

        <li>
          <div className="sidebar-item user" onClick={handleCompanyInfoClick}>
            <FaUser className="icon" /> Account
          </div>
        </li>
      </ul>

      {isSearchOpen && (
        <Search setSearchOpen={setIsSearchOpen} />
      )}
    </div>
  );
};

export default Sidebar;
