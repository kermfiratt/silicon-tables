import React, { useState } from 'react'; // useState hook'u eklendi
import { Link } from 'react-router-dom';
import { FaSearch, FaBuilding, FaSalesforce, FaGamepad, FaBackward } from 'react-icons/fa';
import './Sidebar.css';
import Search from './Search'; // Search popup'ı import edildi

const Sidebar = () => {
  const [searchOpen, setSearchOpen] = useState(false); // Popup kontrolü için state

  const handleSearchClick = () => {
    setSearchOpen(true); // Search popup'ı aç
    document.body.classList.add('blur'); // Arka planı blurlamak için sınıf ekle
  };

  const closePopup = () => {
    setSearchOpen(false); // Popup'ı kapat
    document.body.classList.remove('blur'); // Blur sınıfını kaldır
  };

  return (
    <div className="sidebar">
      <ul className="menu">
        <li>
          <div className="sidebar-header">
            <h1>Silicon Numbers</h1>
          </div>
        </li>
        <li>
          <div className="sidebar-item search-button" onClick={handleSearchClick}>
            <FaSearch className="icon" /> Search
          </div>
        </li>
        <li>
          <Link to="/company/Apple" className="sidebar-item">
            <FaBuilding className="icon" /> Company Info
          </Link>
        </li>
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

      {searchOpen && <Search setSearchOpen={closePopup} />} {/* Search popup açılacak */}
    </div>
  );
};

export default Sidebar;
