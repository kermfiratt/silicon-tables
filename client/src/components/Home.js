import React, { useState } from 'react';
import LiveDateTime from './LiveDateTime';
import MarketData from './MarketData';
import ProductHuntTop5 from './ProductHuntTop5';
import Commodities from './Commodities';
import TechNews from './TechNews';
import Employement from './Employement';
import Inflation from './Inflation';
import Ticker from './Ticker';
import Watchlist from './Watchlist';
import StockCardContainer from './StockCardContainer';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">

      <div className="top-bar">
        <LiveDateTime />
        <MarketData />
      </div>
      
      <StockCardContainer /> {/* Added Stock Card feature */}

      <div className="content-area">
        <ProductHuntTop5 />
        
        <div className="vc-startup-container">
          <Employement />
          <Inflation />
        </div>

        <Commodities />
      </div>

      <div className="news-area">
        <TechNews />
      </div>

      <div className="ticker-wrapper">
        <Ticker />
      </div>
     

      <Watchlist />
    

    </div>
  );
};

export default Home;
