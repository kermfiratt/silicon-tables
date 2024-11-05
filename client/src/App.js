// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Search from './components/Search';
import CompanyDetails from './components/CompanyDetails';
import Sidebar from './components/Sidebar';
import Funds from './components/Funds';
import VC from './components/VC';
import Startups from './components/Startups'; // Import the Startups component
import './App.css';

function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <Router>
      <div className="app-container">
        <Sidebar toggleSearch={toggleSearch} /> {/* Pass the toggle function to Sidebar */}
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/company/:symbol" element={<CompanyDetails />} />
            <Route path="/funds" element={<Funds />} />
            <Route path="/vcs" element={<VC />} />
            <Route path="/startups" element={<Startups />} /> {/* New Startups route */}
          </Routes>
        </div>
        {isSearchOpen && <Search setSearchOpen={setIsSearchOpen} />} {/* Conditionally render Search */}
      </div>
    </Router>
  );
}

export default App;
