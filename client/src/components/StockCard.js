import React, { useState, useEffect } from 'react';
import './StockCard.css';

const StockCard = ({ stock, onRemove }) => {
  const {
    symbol = 'N/A',
    currentPrice = 0,
    previousClose = 0,
    priceChange = 'neutral',
  } = stock;

  const [timePercentageData, setTimePercentageData] = useState({});
  const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dailyResponse = await fetch(
          `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&outputsize=full&apikey=${API_KEY}`
        );
        const dailyData = await dailyResponse.json();
        const timeSeriesDaily = dailyData['Time Series (Daily)'];

        if (timeSeriesDaily) {
          const dailyPrices = Object.entries(timeSeriesDaily).map(([date, values]) => ({
            date,
            price: parseFloat(values['4. close']),
          }));
          calculateTimePercentageData(dailyPrices);
        } else {
          console.error('No daily data available:', dailyData);
          setTimePercentageData({});
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setTimePercentageData({});
      }
    };

    const calculateTimePercentageData = (data) => {
      const timeFrames = {
        '1W': 7,
        '1M': 30,
        '3M': 90,
        '6M': 180,
        '1Y': 365,
        '5Y': 1825,
      };
      const percentages = {};
      const latestPrice = data[0]?.price || 0;

      Object.entries(timeFrames).forEach(([label, days]) => {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - days);
        const pastData = data.find((item) => new Date(item.date) <= pastDate);

        if (pastData) {
          percentages[label] = (
            ((latestPrice - pastData.price) / pastData.price) *
            100
          ).toFixed(2);
        } else {
          percentages[label] = 'N/A';
        }
      });

      setTimePercentageData(percentages);
    };

    fetchData();
  }, [symbol, API_KEY]);

  return (
    <div className="stock-card">
      {/* Close Button */}
      <button className="close-button" onClick={() => onRemove(symbol)}>✖</button>

      {/* Stock Header */}
      <div className="stock-header">
        <div className="stock-name">{symbol}</div>
        <div className="price-section">
          <div className="current-price">${currentPrice.toFixed(2)}</div>
          <div
            className={`price-change ${
              priceChange === 'up' ? 'positive' : priceChange === 'down' ? 'negative' : ''
            }`}
          >
            {priceChange === 'up' ? '+' : ''}
            {(currentPrice - previousClose).toFixed(2)} (
            {previousClose > 0
              ? ((currentPrice - previousClose) / previousClose * 100).toFixed(2)
              : 'N/A'}
            %)
          </div>
        </div>
      </div>

      {/* Time Percentage Blocks */}
      <div className="time-percentages">
        {Object.entries(timePercentageData).map(([key, value]) => (
          <div
            key={key}
            className={`time-percentage-block ${
              value > 0 ? 'positive' : value < 0 ? 'negative' : ''
            }`}
          >
            {key} % <br />
            {value !== 'N/A' ? `${value}%` : 'N/A'}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockCard;
