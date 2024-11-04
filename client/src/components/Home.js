// src/components/Home.js
import React from 'react';
import LiveDateTime from './LiveDateTime';
import MarketData from './MarketData';
import ProductHuntTop5 from './ProductHuntTop5';
import DeveloperConferences from './DeveloperConferences';
import TechNews from './TechNews';
import StockNews from './StockNews';
import RecentVCFunds from './RecentVCFunds';
import HitStartupOfTheWeek from './HitStartupOfTheWeek';
import Ticker from './Ticker';
import Watchlist from './Watchlist';
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
        
        <div className="vc-startup-container">
          <RecentVCFunds />
          <HitStartupOfTheWeek />
        </div>

        <DeveloperConferences />
      </div>

      <div className="news-area">
        <TechNews />
        <StockNews />
      </div>

      <div className="ticker-wrapper">
        <Ticker />
      </div>

      <Watchlist /> {/* Sağ tarafa Watchlist ekledik */}
    </div>
  );
};

export default Home;
