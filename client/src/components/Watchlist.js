import React, { useState, useEffect } from 'react';
import { FaEllipsisV, FaTimes, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import './Watchlist.css';

const Watchlist = ({ isSearchOpen }) => {
  const ALPHA_VANTAGE_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY;
  const [watchlist, setWatchlist] = useState([
    { symbol: 'AAPL' }, // Apple
    { symbol: 'MSFT' }, // Microsoft
    { symbol: 'AMZN' }, // Amazon
    { symbol: 'GOOGL' }, // Alphabet
    { symbol: 'META' }, // Meta
    { symbol: 'TSLA' }, // Tesla
    { symbol: 'NVDA' }, // NVIDIA
  ]); // Default to Magnificent Seven
  const [stockData, setStockData] = useState({});
  const [showOptions, setShowOptions] = useState(false);
  const [newSymbol, setNewSymbol] = useState('');
  const [loading, setLoading] = useState(true); // Start with loading state

  // Fetch stock data for all symbols in the watchlist
  const fetchStockData = async () => {
    setLoading(true);
    const newStockData = {};

    for (let item of watchlist) {
      try {
        const response = await axios.get(
          `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${item.symbol}&apikey=${ALPHA_VANTAGE_KEY}`
        );

        console.log(`API Response for ${item.symbol}:`, response.data);

        if (response.data['Error Message']) {
          console.error(`Error for ${item.symbol}:`, response.data['Error Message']);
          newStockData[item.symbol] = { c: 'N/A', d: 'N/A' };
          continue;
        }

        const timeSeries = response.data['Time Series (Daily)'];
        if (!timeSeries || Object.keys(timeSeries).length === 0) {
          console.error(`No data found for ${item.symbol}:`, response.data);
          newStockData[item.symbol] = { c: 'N/A', d: 'N/A' };
          continue;
        }

        // Get the latest date (most recent data)
        const latestDate = Object.keys(timeSeries)[0];
        const latestData = timeSeries[latestDate];

        console.log(`Latest date for ${item.symbol}:`, latestDate);
        console.log(`Latest data for ${item.symbol}:`, latestData);

        // Extract open and close prices
        const openPrice = parseFloat(latestData['1. open']);
        const closePrice = parseFloat(latestData['4. close']);

        // Calculate percentage change
        const changePercent = ((closePrice - openPrice) / openPrice) * 100;

        // Store the data
        newStockData[item.symbol] = {
          c: closePrice, // Closing price
          d: changePercent, // Percentage change
        };
      } catch (error) {
        console.error(`Error fetching data for ${item.symbol}:`, error);
        newStockData[item.symbol] = { c: 'N/A', d: 'N/A' };
      }
    }

    console.log('Final Stock Data:', newStockData);
    setStockData(newStockData);
    setLoading(false);
  };

  // Fetch data when the component mounts or when the watchlist changes
  useEffect(() => {
    fetchStockData();
  }, [watchlist]);

  // Fetch data at market close (4:00 PM ET)
  useEffect(() => {
    const fetchAtMarketClose = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      // Check if it's 4:00 PM ET (market close)
      if (hours === 16 && minutes === 0) {
        fetchStockData();
      }
    };

    // Check every minute if it's market close
    const interval = setInterval(fetchAtMarketClose, 60 * 1000); // 1 minute

    return () => clearInterval(interval); // Cleanup on unmount
  }, [watchlist]);

  const handleRemove = (symbol) => {
    setWatchlist(watchlist.filter((item) => item.symbol !== symbol));
  };

  const handleAdd = () => {
    if (newSymbol) {
      setWatchlist([...watchlist, { symbol: newSymbol.toUpperCase() }]);
      setNewSymbol('');
    }
  };

  return (
    <div className={`watchlist-wrapper ${isSearchOpen ? 'blur-background' : ''}`}>
      <div className="watchlist-container">
        <div className="watchlist-header">
          <span>Favorites</span>
          <FaEllipsisV onClick={() => setShowOptions(!showOptions)} className="menu-icon" />
        </div>

        {showOptions && (
          <div className="add-stock-container">
            <input
              type="text"
              placeholder="Add Stock (e.g., AAPL)"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value)}
              className="add-stock-input"
            />
            <button onClick={handleAdd} className="add-button">
              <FaPlus className="add-icon" />
              Add
            </button>
          </div>
        )}

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div> {/* Spinner circle */}
            <span>Loading...</span> {/* Loading text */}
          </div>
        ) : (
          <div className="watchlist-grid">
            {watchlist.map((item, index) => (
              <div key={index} className="watchlist-item">
                <div className="symbol">{item.symbol}</div>
                <div className="price">
                  {stockData[item.symbol]?.c === 'N/A'
                    ? 'N/A'
                    : `$${stockData[item.symbol]?.c?.toFixed(2) || 'N/A'}`}
                </div>
                <div
                  className={`change ${
                    stockData[item.symbol]?.d >= 0 ? 'positive' : 'negative'
                  }`}
                >
                  {stockData[item.symbol]?.d === 'N/A'
                    ? 'N/A'
                    : `${stockData[item.symbol]?.d >= 0 ? '+' : ''}${stockData[
                        item.symbol
                      ]?.d?.toFixed(2) || 'N/A'}%`}
                </div>
                {showOptions && (
                  <FaTimes onClick={() => handleRemove(item.symbol)} className="remove-icon" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;