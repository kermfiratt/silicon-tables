import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaBuilding, FaSalesforce, FaGamepad, FaBackward } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
    

      <ul className="menu">


        <li>
        <div className="sidebar-header">
        <h1>Silicon Numbers</h1>
      </div>
        </li>

      <li>
          <Link to="/" className="sidebar-item">
            <FaSearch className="icon" /> Search
          </Link>
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
    </div>
  );
};

export default Sidebar;
