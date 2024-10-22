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
        <LiveDateTime />
        <MarketData />
      </div>
      
      <div className="content-area">
        {/* Add the new block below the top bar, on the left */}
        <ProductHuntTop5 />
      </div>

      {/* Add the Ticker component at the bottom of the page */}
      <div className="ticker-wrapper">
        <Ticker />
      </div>
    </div>
  );
};

export default Home;
