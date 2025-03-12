import React from 'react';
import LiveDateTime from './LiveDateTime';
import MarketData from './MarketData';
import TopTrade from './TopTrade';
import Nonfarm from './Nonfarm';
import TechNews from './TechNews';
import Employement from './Employement';
import Treasury from './Treasury';
import Ticker from './Ticker';
import Watchlist from './Watchlist';
import StockCardContainer from './StockCardContainer';
import Cpi from './Cpi';
import './Home.css';
import Explanation from './Explanation';
import RetailSales from './RetailSales';

const Home = ({ isSearchOpen }) => {
  return (
    <div className={`home-container ${isSearchOpen ? 'blur-background' : ''}`}>
      {/* Top Bar with Live Date/Time and Market Data */}
      <div className="top-bar">
        <LiveDateTime />
        <MarketData />
      </div>

      {/* Explanation Section */}
      <Explanation />

      {/* Stock Card Container */}
      <StockCardContainer />

      {/* Main Content Area */}
      <div className="content-area">
        {/* Top Trade Section */}
        <TopTrade />

        {/* Nonfarm and Treasury Section */}
        <div className="vc-startup-container">
          <Nonfarm />
          <Treasury />
          <RetailSales />
        </div>

        {/* Employment and CPI Section */}
        <div>
          <Employement />
          <Cpi isSearchOpen={isSearchOpen} />
        </div>
      </div>

      {/* Tech News Section */}
      <div className="news-area">
        <TechNews />
      </div>

      {/* Ticker Section */}
      <div className="ticker-wrapper">
        <Ticker />
      </div>

      {/* Watchlist Section */}
      <div>
      <Watchlist isSearchOpen={isSearchOpen} />
      </div>
      
    </div>
  );
};

export default Home;