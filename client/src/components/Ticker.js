// src/components/Ticker.js
import React, { useState, useEffect } from 'react';
import './Ticker.css';

const Ticker = () => {
  const [stockData] = useState([
    { symbol: "MSFT", price: 299.80, change: -5.12, percentChange: -1.68 },
    { symbol: "AAPL", price: 150.34, change: 1.45, percentChange: 0.97 },
    { symbol: "GOOGL", price: 2749.60, change: -15.30, percentChange: -0.55 },
    { symbol: "AMZN", price: 3467.42, change: 12.90, percentChange: 0.37 },
    { symbol: "TSLA", price: 733.57, change: 8.67, percentChange: 1.20 },
    // Add more stock data here
  ]);

  // Duplicate the stock data to create a seamless loop
  const duplicatedStockData = [...stockData, ...stockData];

  return (
    <div className="ticker-container">
      <div className="ticker-content">
        {duplicatedStockData.map((stock, index) => (
          <div key={index} className="ticker-item">
            <span className="ticker-symbol">{stock.symbol}: </span>
            <span className="ticker-price">${stock.price.toFixed(2)}</span>
            <span className={`ticker-change ${stock.change > 0 ? 'positive' : 'negative'}`}>
              {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.percentChange.toFixed(2)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ticker;
