import React, { useState } from 'react';
import LiveDateTime from './LiveDateTime';
import MarketData from './MarketData';
import TopTrade from './TopTrade';
import Commodities from './Commodities';
import TechNews from './TechNews';
import Employement from './Employement';
import Treasury from './Treasury';
import Ticker from './Ticker';
import Watchlist from './Watchlist';
import StockCardContainer from './StockCardContainer';
import Cpi from './Cpi';
import './Home.css';
import Explanation from './Explanation';

const Home = () => {
  return (
    <div className="home-container">

      <div className="top-bar">
        <LiveDateTime />
        <MarketData />
      </div>
      
      <Explanation />
      <StockCardContainer /> {/* Added Stock Card feature */}

      <div className="content-area">
        <TopTrade />
        
        <div className="vc-startup-container">
          <Commodities />
          <Treasury />
        </div>
      
        <div>
        <Employement />
        <Cpi />
        </div>


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
