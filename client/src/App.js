import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import Home from './components/Home';
import Search from './components/Search';
import Sidebar from './components/Sidebar';
import OptionTracker from './components/OptionTracker'; // Yeni Option Tracker
import Portfolio from './components/Portfolio'; // Yeni Portfolio bileşeni
import BalanceSheet from './components/SidebarDetails/BalanceSheet';
import Compare from './components/Compare'; // Import Compare component
import Report from './components/Report'; // 
import './App.css';
import StockDetailsSidebar from './components/StockDetailsSidebar';

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
            <Route path="/company/:symbol" element={<CompanyDetailsWrapper />} />
            <Route path="/option-tracker" element={<OptionTracker />} /> {/* Option Tracker rotası */}
            <Route path="/portfolio" element={<Portfolio />} /> {/* Portfolio rotası */}
            <Route path="/balance-sheet" element={<BalanceSheet />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/report" element={<Report />} />
          </Routes>
        </div>

        {isSearchOpen && <Search setSearchOpen={setIsSearchOpen} />}
      </div>
    </Router>
  );
}

// Wrapper component to extract the symbol from the route parameters
const CompanyDetailsWrapper = () => {
  const { symbol } = useParams(); // Extract the symbol from the URL
  return <StockDetailsSidebar symbol={symbol} />;
};

export default App;