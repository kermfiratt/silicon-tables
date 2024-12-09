// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Search from './components/Search';
import CompanyDetails from './components/CompanyDetails';
import Sidebar from './components/Sidebar';
import Funds from './components/Funds';
import VC from './components/VC';
import OptionTracker from './components/OptionTracker'; // Yeni Option Tracker
import Portfolio from './components/Portfolio'; // Yeni Portfolio bileşeni
import BalanceSheet from './components/SidebarDetails/BalanceSheet';

import './App.css';

function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <Router>
      <div className="app-container">
        <Sidebar toggleSearch={toggleSearch} />

        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/company/:symbol" element={<CompanyDetails />} />
            <Route path="/funds" element={<Funds />} />
            <Route path="/vcs" element={<VC />} />
            <Route path="/option-tracker" element={<OptionTracker />} /> {/* Option Tracker rotası */}
            <Route path="/portfolio" element={<Portfolio />} /> {/* Portfolio rotası */}
            <Route path="/balance-sheet" element={<BalanceSheet />} />
            
          </Routes>
        </div>

        {isSearchOpen && <Search setSearchOpen={setIsSearchOpen} />}
      </div>
    </Router>
  );
}

export default App;