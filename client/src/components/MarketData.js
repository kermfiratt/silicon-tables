import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MarketData.css'; // Make sure to create a corresponding CSS file for styling

const MarketData = () => {
  const [marketData, setMarketData] = useState({
    nasdaq: { price: 14500, change: 1.23 }, // Placeholder data for NASDAQ
    sp500: { price: 4400, change: 0.56 },  // Placeholder data for S&P 500
    dowjones: { price: 34500, change: 0.89 },  // Placeholder data for Dow Jones
    euroDollar: { rate: 1.18, change: 0.02 },  // Placeholder data for Euro/Dollar
    brent: { price: 75.43, change: 1.67 },    // Placeholder data for Brent Petroleum
  });

  const API_KEY = process.env.REACT_APP_API_KEY; // Ensure this is in your .env file

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const nasdaq = await axios.get(`https://finnhub.io/api/v1/quote?symbol=IXIC&token=${API_KEY}`);
        const sp500 = await axios.get(`https://finnhub.io/api/v1/quote?symbol=SPX&token=${API_KEY}`);
        const dowjones = await axios.get(`https://finnhub.io/api/v1/quote?symbol=DJI&token=${API_KEY}`);
        const euroDollar = await axios.get(`https://finnhub.io/api/v1/forex/rates?token=${API_KEY}`);
        const brent = await axios.get(`https://finnhub.io/api/v1/quote?symbol=CO1&token=${API_KEY}`);

        setMarketData({
          nasdaq: { price: nasdaq.data.c, change: nasdaq.data.dp },
          sp500: { price: sp500.data.c, change: sp500.data.dp },
          dowjones: { price: dowjones.data.c, change: dowjones.data.dp },
          euroDollar: { rate: euroDollar.data.quote.EURUSD, change: euroDollar.data.quote.EURUSD_change },
          brent: { price: brent.data.c, change: brent.data.dp },
        });
      } catch (error) {
        console.error('Error fetching market data:', error);
      }
    };

    fetchMarketData();
  }, [API_KEY]);

  return (
    <div className="market-data">
      <div>
        <strong>NASDAQ:</strong> {marketData.nasdaq.price} 
        <span className={`ticker-change ${marketData.nasdaq.change > 0 ? 'positive' : 'negative'}`}>
          {marketData.nasdaq.change > 0 ? `+${marketData.nasdaq.change}%` : `${marketData.nasdaq.change}%`}
        </span>
      </div>
      <div>
        <strong>S&P 500:</strong> {marketData.sp500.price} 
        <span className={`ticker-change ${marketData.sp500.change > 0 ? 'positive' : 'negative'}`}>
          {marketData.sp500.change > 0 ? `+${marketData.sp500.change}%` : `${marketData.sp500.change}%`}
        </span>
      </div>
      <div>
        <strong>Dow Jones:</strong> {marketData.dowjones.price} 
        <span className={`ticker-change ${marketData.dowjones.change > 0 ? 'positive' : 'negative'}`}>
          {marketData.dowjones.change > 0 ? `+${marketData.dowjones.change}%` : `${marketData.dowjones.change}%`}
        </span>
      </div>
      <div>
        <strong>Euro/Dollar:</strong> {marketData.euroDollar.rate} 
        <span className={`ticker-change ${marketData.euroDollar.change > 0 ? 'positive' : 'negative'}`}>
          {marketData.euroDollar.change > 0 ? `+${marketData.euroDollar.change}%` : `${marketData.euroDollar.change}%`}
        </span>
      </div>
      <div>
        <strong>Brent Petroleum:</strong> {marketData.brent.price} 
        <span className={`ticker-change ${marketData.brent.change > 0 ? 'positive' : 'negative'}`}>
          {marketData.brent.change > 0 ? `+${marketData.brent.change}%` : `${marketData.brent.change}%`}
        </span>
      </div>
    </div>
  );
};

export default MarketData;
