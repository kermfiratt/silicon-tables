import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MarketData = () => {
  const [marketData, setMarketData] = useState({
    aapl: null,
    sp500: null,
    dowjones: null,
    euroDollar: null,
    brent: null,
  });

  const API_KEY = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const aapl = await axios.get(`https://finnhub.io/api/v1/quote?symbol=IXIC&token=${API_KEY}`);
        const sp500 = await axios.get(`https://finnhub.io/api/v1/quote?symbol=SPX&token=${API_KEY}`);
        const dowjones = await axios.get(`https://finnhub.io/api/v1/quote?symbol=DJI&token=${API_KEY}`);
        const euroDollar = await axios.get(`https://finnhub.io/api/v1/forex/rates?token=${API_KEY}`);
        const brent = await axios.get(`https://finnhub.io/api/v1/quote?symbol=CO1&token=${API_KEY}`);

        setMarketData({
          aapl: aapl.data,
          sp500: sp500.data,
          dowjones: dowjones.data,
          euroDollar: euroDollar.data,
          brent: brent.data,
        });
      } catch (error) {
        console.error('Error fetching market data:', error);
      }
    };

    fetchMarketData();
  }, [API_KEY]);

  return (
    <div className="market-data">
      <div><strong>aapl:</strong> {marketData.aapl ? marketData.aapl.c : 'Loading...'}</div>
      <div><strong>S&P 500:</strong> {marketData.sp500 ? marketData.sp500.c : 'Loading...'}</div>
      <div><strong>Dow Jones:</strong> {marketData.dowjones ? marketData.dowjones.c : 'Loading...'}</div>
      <div><strong>Euro/Dollar:</strong> {marketData.euroDollar ? marketData.euroDollar.eur : 'Loading...'}</div>
      <div><strong>Brent Petroleum:</strong> {marketData.brent ? marketData.brent.c : 'Loading...'}</div>
    </div>
  );
};

export default MarketData;
