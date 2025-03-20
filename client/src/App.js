import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import Home from './components/Home';
import Search from './components/Search';
import Sidebar from './components/Sidebar';
import OptionTracker from './components/OptionTracker';
import Portfolio from './components/Portfolio';
import BalanceSheet from './components/SidebarDetails/BalanceSheet';
import Compare from './components/Compare';
import Report from './components/SidebarDetails/Report';
import Contact from './components/Contact'
import './App.css';
import StockDetailsSidebar from './components/StockDetailsSidebar';

function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [stocks, setStocks] = useState([]);

  // Load saved stocks from local storage on component mount
  useEffect(() => {
    const savedStocks = JSON.parse(localStorage.getItem('savedStocks')) || [];
    console.log('Loading stocks from local storage:', savedStocks); // Debugging
    setStocks(savedStocks);
  }, []);

  // Save stocks to local storage whenever the `stocks` state changes
  useEffect(() => {
    console.log('Saving stocks to local storage:', stocks); // Debugging
    localStorage.setItem('savedStocks', JSON.stringify(stocks));
  }, [stocks]);

  // Add a stock to the list
  const addStock = (symbol) => {
    if (stocks.some((stock) => stock.symbol === symbol)) {
      alert('This stock is already in your list!');
      return;
    }

    const newStock = { symbol };
    setStocks([...stocks, newStock]);
    console.log(`Stock added: ${symbol}`); // Debugging
  };

  // Remove a stock from the list
  const removeStock = (symbol) => {
    const updatedStocks = stocks.filter((stock) => stock.symbol !== symbol);
    setStocks(updatedStocks);
    console.log(`Stock removed: ${symbol}`); // Debugging
  };

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
            {/* Home route with isSearchOpen and stocks passed as props */}
            <Route
              path="/"
              element={
                <Home
                  isSearchOpen={isSearchOpen}
                  stocks={stocks}
                  addStock={addStock}
                  removeStock={removeStock}
                />
              }
            />

            {/* Other routes */}
            <Route path="/company/:symbol" element={<CompanyDetailsWrapper />} />
            <Route path="/option-tracker" element={<OptionTracker />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/balance-sheet" element={<BalanceSheet />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/contact" element={<Contact />} />
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