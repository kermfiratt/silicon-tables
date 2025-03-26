import React, { useState, useEffect } from 'react';
import { FaEllipsisV, FaTimes, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import './Watchlist.css';

const Watchlist = ({ isSearchOpen }) => {
  const ALPHA_VANTAGE_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY;
  const [watchlist, setWatchlist] = useState([
    { symbol: 'AAPL' }, // Apple
    { symbol: 'AMZN' }, // Amazon
    { symbol: 'META' }, // Meta
    { symbol: 'TSLA' }, // Tesla
  ]); // Default to Magnificent Seven
  const [stockData, setStockData] = useState({});
  const [latestDate, setLatestDate] = useState(null); // State to store the latest date
  const [showOptions, setShowOptions] = useState(false);
  const [newSymbol, setNewSymbol] = useState('');
  const [initialLoading, setInitialLoading] = useState(true); // Only for initial loading
  const [addingStock, setAddingStock] = useState(null); // Track the stock being added

  // Fetch stock data for a single symbol
  const fetchSingleStockData = async (symbol) => {
    try {
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_KEY}`
      );

      console.log(`API Response for ${symbol}:`, response.data);

      if (response.data['Error Message']) {
        console.error(`Error for ${symbol}:`, response.data['Error Message']);
        return { c: 'N/A', d: 'N/A' };
      }

      const timeSeries = response.data['Time Series (Daily)'];
      if (!timeSeries || Object.keys(timeSeries).length === 0) {
        console.error(`No data found for ${symbol}:`, response.data);
        return { c: 'N/A', d: 'N/A' };
      }

      // Get the latest date (most recent data)
      const latestStockDate = Object.keys(timeSeries)[0];
      const latestData = timeSeries[latestStockDate];

      console.log(`Latest date for ${symbol}:`, latestStockDate);
      console.log(`Latest data for ${symbol}:`, latestData);

      // Extract open and close prices
      const openPrice = parseFloat(latestData['1. open']);
      const closePrice = parseFloat(latestData['4. close']);

      // Calculate percentage change
      const changePercent = ((closePrice - openPrice) / openPrice) * 100;

      // Return the data
      return {
        c: closePrice, // Closing price
        d: changePercent, // Percentage change
        date: latestStockDate, // Latest date for this stock
      };
    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error);
      return { c: 'N/A', d: 'N/A', date: null };
    }
  };

  // Fetch stock data for all symbols in the watchlist (only on mount)
  useEffect(() => {
    const fetchInitialStockData = async () => {
      const newStockData = {};
      let latestDate = null;

      for (let item of watchlist) {
        const data = await fetchSingleStockData(item.symbol);
        newStockData[item.symbol] = data;

        // Update the latest date if this stock's date is newer
        if (data.date && (!latestDate || new Date(data.date) > new Date(latestDate))) {
          latestDate = data.date;
        }
      }

      setStockData(newStockData);
      setLatestDate(latestDate);
      setInitialLoading(false); // Hide initial loading spinner
    };

    fetchInitialStockData();
  }, []); // Fetch only on mount

  // Handle adding a new stock
  const handleAdd = async () => {
    if (newSymbol) {
      const symbol = newSymbol.toUpperCase();
      setAddingStock(symbol); // Track the stock being added

      const data = await fetchSingleStockData(symbol);
      setStockData((prev) => ({ ...prev, [symbol]: data }));
      setWatchlist((prev) => [...prev, { symbol }]);
      setNewSymbol('');
      setAddingStock(null); // Reset the adding stock
    }
  };

  // Handle removing a stock
  const handleRemove = (symbol) => {
    setWatchlist(watchlist.filter((item) => item.symbol !== symbol));
  };

  // Format the latest date as "DD MMMM" (e.g., "30 JANUARY") in uppercase
  const formatDate = (dateString) => {
    if (!dateString) return 'LOADING...';
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' }).toUpperCase(); // Ensure English and uppercase
    return `${day} ${month}`;
  };

  return (
    <div className={`watchlist-wrapper ${isSearchOpen ? 'blur-background' : ''}`}>
      <div className="watchlist-container">
        <div className="watchlist-header">
          <span>FAVORITES</span>
          <FaEllipsisV onClick={() => setShowOptions(!showOptions)} className="menu-icon" />
        </div>

        {showOptions && (
          <div className="add-stock-container">
            <input
              type="text"
              placeholder="ADD STOCK (E.G., AAPL)"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value)}
              className="add-stock-input"
            />
            <button onClick={handleAdd} className="add-button">
              <FaPlus className="add-icon" />
              ADD
            </button>
          </div>
        )}

        {initialLoading ? (
          <div className="watchlist-loading-overlay">
            <div className="loader"></div>
            <span className="loading-text">LOADING...</span>
          </div>
        ) : (
          <div className="watchlist-grid">
            {/* New block for the latest date and "END OF DAY PRICES" */}
            <div className="watchlist-item date-block">
              <div className="date-text">
                {latestDate ? `${formatDate(latestDate)} END OF DAY PRICES` : 'LOADING...'}
              </div>
            </div>

            {watchlist.map((item, index) => (
              <div key={index} className="watchlist-item">
                {addingStock === item.symbol ? (
                  <div className="adding-stock-loading">LOADING...</div>
                ) : (
                  <>
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
                  </>
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