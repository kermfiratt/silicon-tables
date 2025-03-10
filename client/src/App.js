import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import Home from './components/Home';
import Search from './components/Search';
import Sidebar from './components/Sidebar';
import OptionTracker from './components/OptionTracker';
import Portfolio from './components/Portfolio';
import BalanceSheet from './components/SidebarDetails/BalanceSheet';
import Compare from './components/Compare';
import Report from './components/SidebarDetails/Report';
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
        {/* Sidebar with toggleSearch function passed as a prop */}
        <Sidebar toggleSearch={toggleSearch} />

        {/* Main content area */}
        <div className="main-content">
          <Routes>
            {/* Home route with isSearchOpen passed as a prop */}
            <Route path="/" element={<Home isSearchOpen={isSearchOpen} />} />

            {/* Other routes */}
            <Route path="/company/:symbol" element={<CompanyDetailsWrapper />} />
            <Route path="/option-tracker" element={<OptionTracker />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/balance-sheet" element={<BalanceSheet />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/report" element={<Report />} />
          </Routes>
        </div>

        {/* Render the Search component if isSearchOpen is true */}
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