import React, { useState, useEffect } from 'react';
import { FaEllipsisV, FaTimes, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import './Watchlist.css';

const Watchlist = () => {
  const ALPHA_VANTAGE_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY;
  const [watchlist, setWatchlist] = useState([
    { symbol: 'AAPL' },
    { symbol: 'MSFT' },
    { symbol: 'TSLA' },
  ]);
  const [stockData, setStockData] = useState({});
  const [showOptions, setShowOptions] = useState(false);
  const [newSymbol, setNewSymbol] = useState('');

  useEffect(() => {
    const fetchStockData = async () => {
      const newStockData = {};

      for (let item of watchlist) {
        try {
          const response = await axios.get(
            `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${item.symbol}&entitlement=delayed&apikey=${ALPHA_VANTAGE_KEY}`
          );

          const globalQuote =
            response.data['Global Quote'] || // Standard response structure
            response.data['Global Quote - DATA DELAYED BY 15 MINUTES']; // Handle delayed key

          console.log(`Raw API response for ${item.symbol}:`, response.data); // Debugging

          if (globalQuote) {
            newStockData[item.symbol] = {
              c: parseFloat(globalQuote['05. price'] || 0), // Current Price
              d: parseFloat(globalQuote['10. change percent'] || 0), // Change %
            };
          } else {
            console.error(`Invalid data for ${item.symbol}:`, response.data);
            newStockData[item.symbol] = { c: null, d: null };
          }
        } catch (error) {
          console.error(`Error fetching data for ${item.symbol}:`, error);
          newStockData[item.symbol] = { c: null, d: null };
        }
      }

      console.log('Final Stock Data:', newStockData);
      setStockData(newStockData);
    };

    if (watchlist.length > 0) fetchStockData();
    const interval = setInterval(fetchStockData, 5000); // Refresh every 20 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [watchlist, ALPHA_VANTAGE_KEY]);

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
    <div className="watchlist-container">
      <div className="watchlist-header">
        <span>Favorites</span>
        <FaEllipsisV onClick={() => setShowOptions(!showOptions)} className="menu-icon" />
      </div>

      {showOptions && (
        <div className="add-stock-container">
          <input
            type="text"
            placeholder="Add Stock"
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value)}
            className="add-stock-input"
          />
          <FaPlus onClick={handleAdd} className="add-icon" />
        </div>
      )}

      <div className="watchlist-grid">
        {watchlist.map((item, index) => (
          <div key={index} className="watchlist-item">
            <div className="symbol">{item.symbol}</div>
            <div className="price">
              {stockData[item.symbol]?.c !== undefined
                ? stockData[item.symbol]?.c !== null
                  ? `$${stockData[item.symbol].c.toFixed(2)}`
                  : 'N/A'
                : 'Fetching...'}
            </div>
            <div
              className={`change ${
                stockData[item.symbol]?.d >= 0 ? 'positive' : 'negative'
              }`}
            >
              {stockData[item.symbol]?.d !== undefined
                ? stockData[item.symbol]?.d !== null
                  ? `${stockData[item.symbol].d >= 0 ? '+' : ''}${stockData[
                      item.symbol
                    ].d.toFixed(2)}%`
                  : 'N/A'
                : 'Fetching...'}
            </div>
            {showOptions && (
              <FaTimes onClick={() => handleRemove(item.symbol)} className="remove-icon" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Watchlist;














/*

import React, { useState, useEffect } from 'react';
import { FaEllipsisV, FaTimes, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import './Watchlist.css';

const Watchlist = () => {
  const ALPHA_VANTAGE_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY;
  const [watchlist, setWatchlist] = useState([
    { symbol: 'AAPL' },
    { symbol: 'MSFT' },
    { symbol: 'TSLA' },
  ]);
  const [stockData, setStockData] = useState({});
  const [marketStatus, setMarketStatus] = useState('closed'); // Default market status
  const [showOptions, setShowOptions] = useState(false);
  const [newSymbol, setNewSymbol] = useState('');

  useEffect(() => {
    // Fetch market status
    const fetchMarketStatus = async () => {
      const API_URL = `https://www.alphavantage.co/query?function=MARKET_STATUS&apikey=${ALPHA_VANTAGE_KEY}`;
      try {
        const response = await axios.get(API_URL);
        const markets = response.data.markets || [];
        const nasdaqMarket = markets.find((market) =>
          market.primary_exchanges?.includes('NASDAQ')
        );
        if (nasdaqMarket) {
          setMarketStatus(nasdaqMarket.current_status);
        }
      } catch (error) {
        console.error('Error fetching market status:', error);
      }
    };

    fetchMarketStatus();
    const marketStatusInterval = setInterval(fetchMarketStatus, 300000); // Refresh every 5 minutes

    return () => clearInterval(marketStatusInterval); // Cleanup on unmount
  }, [ALPHA_VANTAGE_KEY]);

  useEffect(() => {
    const fetchStockData = async () => {
      const newStockData = {};
      for (let item of watchlist) {
        try {
          const response = await axios.get(
            `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${item.symbol}&apikey=${ALPHA_VANTAGE_KEY}`
          );

          const globalQuote = response.data['Global Quote'];
          if (globalQuote) {
            const lastClosePrice = parseFloat(globalQuote['08. previous close'] || 0); // Last close price
            const currentPrice = parseFloat(globalQuote['05. price'] || lastClosePrice); // Use last close price if market is closed
            const changePercent = parseFloat(globalQuote['10. change percent'] || 0); // Change %

            newStockData[item.symbol] = {
              c: marketStatus === 'open' ? currentPrice : lastClosePrice, // Show last close price if market is closed
              d: marketStatus === 'open' ? changePercent : null, // Show change % only if market is open
            };
          } else {
            console.error(`Invalid data for ${item.symbol}:`, response.data);
            newStockData[item.symbol] = { c: null, d: null };
          }
        } catch (error) {
          console.error(`Error fetching data for ${item.symbol}:`, error);
          newStockData[item.symbol] = { c: null, d: null };
        }
      }

      console.log('Final Stock Data:', newStockData);
      setStockData(newStockData);
    };

    if (watchlist.length > 0) fetchStockData();
    const interval = marketStatus === 'open' ? setInterval(fetchStockData, 20000) : null; // Fetch data only if market is open

    return () => interval && clearInterval(interval); // Cleanup on unmount
  }, [watchlist, ALPHA_VANTAGE_KEY, marketStatus]);

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
    <div className="watchlist-container">
      <div className="watchlist-header">
        <span>Favorites</span>
        <FaEllipsisV onClick={() => setShowOptions(!showOptions)} className="menu-icon" />
      </div>

      {showOptions && (
        <div className="add-stock-container">
          <input
            type="text"
            placeholder="Add Stock"
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value)}
            className="add-stock-input"
          />
          <FaPlus onClick={handleAdd} className="add-icon" />
        </div>
      )}

      <div className="watchlist-grid">
        {watchlist.map((item, index) => (
          <div key={index} className="watchlist-item">
            <div className="symbol">{item.symbol}</div>
            <div className="price">
              {stockData[item.symbol]?.c !== undefined
                ? stockData[item.symbol]?.c !== null
                  ? `$${stockData[item.symbol].c.toFixed(2)}`
                  : 'N/A'
                : 'Fetching...'}
            </div>
            {marketStatus === 'open' && (
              <div
                className={`change ${
                  stockData[item.symbol]?.d >= 0 ? 'positive' : 'negative'
                }`}
              >
                {stockData[item.symbol]?.d !== undefined
                  ? stockData[item.symbol]?.d !== null
                    ? `${stockData[item.symbol].d >= 0 ? '+' : ''}${stockData[
                        item.symbol
                      ].d.toFixed(2)}%`
                    : 'N/A'
                  : 'Fetching...'}
              </div>
            )}
            {showOptions && (
              <FaTimes onClick={() => handleRemove(item.symbol)} className="remove-icon" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Watchlist;
*/