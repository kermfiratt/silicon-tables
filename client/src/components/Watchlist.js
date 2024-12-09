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