import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MarketData.css';

const MarketData = () => {
  const [marketData, setMarketData] = useState({
    nasdaq: { price: "Loading...", change: "Loading..." },
    sp500: { price: "Loading...", change: "Loading..." },
    dowjones: { price: "Loading...", change: "Loading..." },
    euroDollar: { rate: "Loading...", change: "Loading..." },
    brent: { price: "Loading...", change: "Loading..." },
  });

  const ALPHA_VANTAGE_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY;

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const [nasdaq, sp500, dowjones, euroDollar, brent] = await Promise.all([
          axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=QQQ&apikey=${ALPHA_VANTAGE_KEY}`), 
          axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=SPY&apikey=${ALPHA_VANTAGE_KEY}`), 
          axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=DIA&apikey=${ALPHA_VANTAGE_KEY}`), 
          axios.get(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=EUR&to_currency=USD&apikey=${ALPHA_VANTAGE_KEY}`), 
          axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=BNO&apikey=${ALPHA_VANTAGE_KEY}`), 
        ]);

        const formatNumber = (num) => (num ? parseFloat(num).toFixed(2) : "N/A");

        const getQuoteData = (response) => ({
          price: formatNumber(response.data?.["Global Quote"]?.["05. price"]),
          change: formatNumber(response.data?.["Global Quote"]?.["10. change percent"]),
        });

        setMarketData({
          nasdaq: getQuoteData(nasdaq),
          sp500: getQuoteData(sp500),
          dowjones: getQuoteData(dowjones),
          euroDollar: {
            rate: formatNumber(euroDollar.data?.['Realtime Currency Exchange Rate']?.['5. Exchange Rate']),
            change: "N/A",
          },
          brent: getQuoteData(brent),
        });
      } catch (error) {
        console.error('Error fetching market data:', error);
      }
    };

    fetchMarketData();
  }, [ALPHA_VANTAGE_KEY]);

  return (
    <div className="market-data">
      <div>
        <strong>NASDAQ:</strong> {marketData.nasdaq.price}
        <span className={`ticker-change ${marketData.nasdaq.change.includes('-') ? 'negative' : 'positive'}`}>
          {marketData.nasdaq.change}%
        </span>
      </div>
      <div>
        <strong>S&P 500:</strong> {marketData.sp500.price}
        <span className={`ticker-change ${marketData.sp500.change.includes('-') ? 'negative' : 'positive'}`}>
          {marketData.sp500.change}%
        </span>
      </div>
      <div>
        <strong>Dow Jones:</strong> {marketData.dowjones.price}
        <span className={`ticker-change ${marketData.dowjones.change.includes('-') ? 'negative' : 'positive'}`}>
          {marketData.dowjones.change}%
        </span>
      </div>
      <div>
        <strong>Euro/Dollar:</strong> {marketData.euroDollar.rate}
      </div>
      <div>
        <strong>Brent Petroleum:</strong> {marketData.brent.price}
      </div>
    </div>
  );
};

export default MarketData;
