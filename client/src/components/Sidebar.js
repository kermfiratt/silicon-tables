import React, { useState } from 'react'; 
import { Link } from 'react-router-dom';
import { FaSearch, FaBuilding, FaSalesforce, FaGamepad, FaBackward, FaHome } from 'react-icons/fa';
import './Sidebar.css';
import Search from './Search'; 
import logo from '../logo.webp';

const Sidebar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false); // Daha anlamlı bir state ismi
  
  return (
    <div className="sidebar">
      <ul className="menu">


        <li>
            <div className="sidebar-header">
              <img src={logo} alt="Silicon Numbers Logo" className="sidebar-logo" />
            </div>
        </li>


        <li>
          <Link to="/" className="sidebar-item">
            <FaHome className="icon" /> Home
          </Link>
        </li>
        
        {/* Search butonu */}
        <li>
          <div 
            className="sidebar-item search-button" 
            onClick={() => setIsSearchOpen(true)} // Popup'ı açmak için direkt fonksiyon tanımı
          >
            <FaSearch className="icon" /> Search
          </div>
        </li>
        
        {/* Company Info butonu */}
        <li>
          <Link to="/company/Apple" className="sidebar-item">
            <FaBuilding className="icon" /> Company Info
          </Link>
        </li>

        {/* Inactive buttons */}
        <li className="inactive-item">
          <FaSalesforce className="icon" /> Inactive Button
        </li>
        <li className="inactive-item">
          <FaGamepad className="icon" /> Inactive Button
        </li>
        <li className="inactive-item">
          <FaBackward className="icon" /> Inactive Button
        </li>
      </ul>

      {/* Search popup'ı açıldığında */}
      {isSearchOpen && (
        <Search setSearchOpen={() => setIsSearchOpen(false)} />  // Popup'ı kapatma fonksiyonu
      )}
    </div>
  );
};

export default Sidebar;
