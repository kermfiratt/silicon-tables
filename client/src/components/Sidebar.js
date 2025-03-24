import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaBuilding, FaHome } from 'react-icons/fa';
import './Sidebar.css';
import logo from '../logo.webp';
import { FaCodeCompare, FaNoteSticky } from 'react-icons/fa6';

const Sidebar = ({ toggleSearch }) => {
  const navigate = useNavigate();

  const handleCompanyInfoClick = () => {
    navigate('/company/TSLA'); // Always goes to Tesla, no latestCompany logic
  };

  const handleCompareClick = () => {
    navigate('/compare');
  };

  const handleContactClick = () => {
    navigate('/contact');
  };

  return (
    <div className="sidebar">
      <ul className="menu">
        {/* Logo */}
        <li>
          <div className="sidebar-logo">
            <Link to="/" className="sidebar-item">
              <img src={logo} alt="Silicon Numbers Logo" className="sidebar-logo" />
            </Link>
          </div>
        </li>

        {/* Home */}
        <li>
          <Link to="/" className="sidebar-item">
            <FaHome className="icon" /> Home
          </Link>
        </li>

        {/* Search */}
        <li>
          <div className="sidebar-item search-button" onClick={toggleSearch}>
            <FaSearch className="icon" /> Search
          </div>
        </li>

        {/* Company Info */}
        <li>
          <div className="sidebar-item" onClick={handleCompanyInfoClick}>
            <FaBuilding className="icon" /> Company Info
          </div>
        </li>

        {/* Compare */}
        <li>
          <div className="sidebar-item user" onClick={handleCompareClick}>
            <FaCodeCompare className="icon" /> Compare
          </div>
        </li>

        {/* Contact */}
        <li>
          <div className="sidebar-item user" onClick={handleContactClick}>
            <FaNoteSticky className="icon" /> Help
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;