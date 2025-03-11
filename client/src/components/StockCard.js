import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './StockCard.css';

const StockCard = ({ stock, onRemove }) => {
  const { symbol = 'N/A' } = stock;
  const [stockData, setStockData] = useState(null);
  const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY;
  const navigate = useNavigate();

  // Function to format volume (e.g., 351113611 → 351.11M)
  const formatVolume = (volume) => {
    const volumeNum = parseFloat(volume);
    if (volumeNum >= 1e9) {
      return `${(volumeNum / 1e9).toFixed(2)}B`; // Billions
    } else if (volumeNum >= 1e6) {
      return `${(volumeNum / 1e6).toFixed(2)}M`; // Millions
    } else if (volumeNum >= 1e3) {
      return `${(volumeNum / 1e3).toFixed(2)}K`; // Thousands
    } else {
      return volumeNum.toString(); // Less than 1,000
    }
  };

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch(
          `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`
        );
        const data = await response.json();

        if (data['Error Message']) {
          throw new Error(data['Error Message']);
        }

        const metaData = data['Meta Data'];
        const timeSeries = data['Time Series (Daily)'];

        // Get the latest date
        const latestDate = metaData['3. Last Refreshed'];
        const latestData = timeSeries[latestDate];

        // Calculate percentage change between open and close
        const open = parseFloat(latestData['1. open']);
        const close = parseFloat(latestData['4. close']);
        const percentageChange = ((close - open) / open) * 100;

        setStockData({
          symbol: metaData['2. Symbol'],
          date: latestDate,
          open: open.toFixed(2), // Two decimal places
          high: parseFloat(latestData['2. high']).toFixed(2), // Two decimal places
          low: parseFloat(latestData['3. low']).toFixed(2), // Two decimal places
          close: close.toFixed(2), // Two decimal places
          volume: formatVolume(latestData['5. volume']), // Shorten volume
          percentageChange: percentageChange.toFixed(2),
        });
      } catch (error) {
        console.error('Error fetching stock data:', error);
        setStockData(null);
      }
    };

    fetchStockData();
  }, [symbol, API_KEY]);

  // Handle stock card click to navigate to details page
  const handleStockClick = () => {
    navigate(`/company/${symbol}`);
  };

  if (!stockData) {
    return <div className="stock-card">Loading...</div>;
  }

  return (
    <div className="stock-card" onClick={handleStockClick} style={{ cursor: 'pointer' }}>
      {/* Close Button */}
      <button
        className="close-button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(symbol);
        }}
      >
        ✖
      </button>

      {/* Stock Header */}
      <div className="stock-header">
        <div className="stock-name">{stockData.symbol}</div>
        <div className="price-section">
          <div className="current-price">${stockData.close}</div>
          <div
            className={`price-change ${
              stockData.percentageChange > 0
                ? 'positive'
                : stockData.percentageChange < 0
                ? 'negative'
                : ''
            }`}
          >
            {stockData.percentageChange > 0 ? '+' : ''}
            {stockData.percentageChange}%
          </div>
        </div>
      </div>

      {/* Stock Details */}
      <div className="stock-details">
        <div className="detail-row">
          <span>Open</span>
          <span>${stockData.open}</span>
        </div>
        <div className="detail-row">
          <span>High</span>
          <span>${stockData.high}</span>
        </div>
        <div className="detail-row">
          <span>Low</span>
          <span>${stockData.low}</span>
        </div>
        <div className="detail-row">
          <span>Volume</span>
          <span>{stockData.volume}</span>
        </div>
      </div>
    </div>
  );
};

export default StockCard;