// src/components/Home.js
import React from 'react';
import LiveDateTime from './LiveDateTime';
import MarketData from './MarketData';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="top-bar">
        <LiveDateTime />
        <MarketData />
      </div>
    </div>
  );
};

export default Home;
