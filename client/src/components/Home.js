// src/components/Home.js
import React from 'react';
import LiveDateTime from './LiveDateTime';
import MarketData from './MarketData';
import ProductHuntTop5 from './ProductHuntTop5';
import DeveloperConferences from './DeveloperConferences';
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
        <ProductHuntTop5 />
        <DeveloperConferences /> {/* Add the conferences next to Product Hunt block */}
      </div>

      <div className="ticker-wrapper">
        <Ticker />
      </div>
    </div>
  );
};

export default Home;
