// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home'; // Import the new Home component
import Search from './components/Search';
import CompanyDetails from './components/CompanyDetails';
import Sidebar from './components/Sidebar';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            {/* Home component is the default route */}
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/company/:symbol" element={<CompanyDetails />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
