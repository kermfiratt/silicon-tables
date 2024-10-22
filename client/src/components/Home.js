// src/components/Home.js
import React from 'react';
import LiveDateTime from './LiveDateTime';
import MarketData from './MarketData';
import ProductHuntTop5 from './ProductHuntTop5';
import Ticker from './Ticker';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="top-bar">
        {/* Live date and time */}
        <LiveDateTime />
        
        {/* Market data block */}
        <MarketData />
      </div>
      
      {/* Product Hunt Top 5 block */}
      <div className="content-area">
        <ProductHuntTop5 />
      </div>

      {/* Ticker block for stock prices */}
      <div className="ticker-wrapper">
        <Ticker />
      </div>
    </div>
  );
};

export default Home;
