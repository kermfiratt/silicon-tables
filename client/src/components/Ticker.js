// src/components/Ticker.js
import React, { useState, useEffect } from 'react';
import './Ticker.css';
import axios from 'axios';

const Ticker = () => {
  const [stockData, setStockData] = useState([]);
  const ALPHA_VANTAGE_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY; // Ensure your API key is stored in .env

  const symbols = ["MSFT", "AAPL", "GOOGL", "AMZN", "TSLA"]; // Add more stock symbols as needed

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const promises = symbols.map(async (symbol) => {
          const response = await axios.get(
            `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_KEY}`
          );
          const data = response.data["Global Quote"];
          if (data && data["05. price"]) {
            return {
              symbol: data["01. symbol"],
              price: parseFloat(data["05. price"]),
              change: parseFloat(data["09. change"]),
              percentChange: parseFloat(data["10. change percent"].replace('%', '')),
            };
          } else {
            console.error(`No data for symbol: ${symbol}`);
            return null;
          }
        });

        const results = await Promise.all(promises);
        const validResults = results.filter((stock) => stock !== null);

        // Duplicate the stock data to create a seamless loop
        const duplicatedStockData = [...validResults, ...validResults];

        setStockData(duplicatedStockData);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };

    fetchStockData();

    const interval = setInterval(fetchStockData, 60000); // Refresh every 60 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [ALPHA_VANTAGE_KEY]);

  return (
    <div className="ticker-container">
      <div className="ticker-content">
        {stockData.map((stock, index) => (
          <div key={index} className="ticker-item">
            <span className="ticker-symbol">{stock.symbol}: </span>
            <span className="ticker-price">${stock.price.toFixed(2)}</span>
            <span className={`ticker-change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
              {stock.change >= 0 ? '+' : ''}
              {stock.change.toFixed(2)} ({stock.percentChange.toFixed(2)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ticker;
