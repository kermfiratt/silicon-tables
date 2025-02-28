import React, { useState } from 'react';
import LiveDateTime from './LiveDateTime';
import MarketData from './MarketData';
import TopTrade from './TopTrade';
import Commodities from './Commodities';
import TechNews from './TechNews';
import Employement from './Employement';
import Inflation from './Inflation';
import Ticker from './Ticker';
import Watchlist from './Watchlist';
import StockCardContainer from './StockCardContainer';
import Cpi from './SidebarDetails/Cpi';
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
        <TopTrade />
        
        <div className="vc-startup-container">
          <Employement />
          <Inflation />
        </div>
      
        
        <Commodities />
        <Cpi />
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
