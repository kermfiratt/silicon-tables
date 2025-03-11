import React, { useState, useEffect } from 'react';
import StockCard from './StockCard';
import './StockCardContainer.css';

const StockCardContainer = () => {
  const ALPHA_VANTAGE_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY;

  const [stocks, setStocks] = useState([]);
  const [stockData, setStockData] = useState({});
  const [searchInput, setSearchInput] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // Fetch stock data for the list of stocks
  const fetchStockData = async () => {
    const updatedStockData = {};
    for (let stock of stocks) {
      try {
        const response = await fetch(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock.symbol}&apikey=${ALPHA_VANTAGE_KEY}`
        );
        const data = await response.json();
        const quote = data['Global Quote'];

        if (quote && quote['05. price']) {
          updatedStockData[stock.symbol] = {
            currentPrice: parseFloat(quote['05. price']).toFixed(2), // Two decimal places
            previousClose: parseFloat(quote['08. previous close']).toFixed(2), // Two decimal places
            high: parseFloat(quote['03. high']).toFixed(2), // Two decimal places
            low: parseFloat(quote['04. low']).toFixed(2), // Two decimal places
            volume: formatVolume(quote['06. volume']), // Shorten volume
            priceChange: parseFloat(quote['09. change']) > 0 ? 'up' : 'down',
          };
        } else {
          console.error(`Invalid data for ${stock.symbol}:`, data);
          updatedStockData[stock.symbol] = { currentPrice: null, previousClose: null };
        }
      } catch (error) {
        console.error(`Error fetching data for ${stock.symbol}:`, error);
        updatedStockData[stock.symbol] = { currentPrice: null, previousClose: null };
      }
    }
    setStockData(updatedStockData);
  };

  // Format volume to shortened form (e.g., 4.56M, 1.23B)
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

  // Fetch stock suggestions based on user input
  const fetchSuggestions = async (input) => {
    if (!input) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${input}&apikey=${ALPHA_VANTAGE_KEY}`
      );
      const data = await response.json();
      const suggestionData = data.bestMatches || [];

      // Filter and map suggestions
      const filteredSuggestions = suggestionData
        .filter((item) => !item['1. symbol'].includes('.')) // Remove symbols with extensions
        .map((item) => ({
          symbol: item['1. symbol'],
          name: item['2. name'],
        }));

      setSuggestions(filteredSuggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    }
  };

  // Add a stock to the list
  const addStock = (symbol) => {
    if (stocks.some((stock) => stock.symbol === symbol)) {
      alert('This stock is already in your list!');
      return;
    }

    setStocks([...stocks, { symbol }]);
    setSearchInput('');
    setShowSearch(false);
    setSuggestions([]);
  };

  // Remove a stock from the list
  const removeStock = (symbol) => {
    setStocks(stocks.filter((stock) => stock.symbol !== symbol));
    setStockData((prevData) => {
      const newData = { ...prevData };
      delete newData[symbol];
      return newData;
    });
  };

  // Handle search input changes
  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
    fetchSuggestions(e.target.value);
  };

  // Close search box when clicking outside
  const handleClickOutside = (e) => {
    if (!e.target.closest('.stock-search')) {
      setShowSearch(false);
      setSuggestions([]);
    }
  };

  useEffect(() => {
    if (stocks.length > 0) {
      fetchStockData();
      const interval = setInterval(fetchStockData, 20000); // Refresh every 20 seconds
      return () => clearInterval(interval);
    }
  }, [stocks]);

  return (
    <div className="stock-card-container">
      <div className="add-stock-section">
        {!showSearch && (
          <button onClick={() => setShowSearch(true)} className="add-stock-button">
            Add
          </button>
        )}
        {showSearch && (
          <div className="stock-search-wrapper" onClick={handleClickOutside}>
            <div className="stock-search">
              <input
                type="text"
                placeholder="Enter stock code (e.g., AAPL)"
                value={searchInput}
                onChange={handleSearchInputChange}
                autoFocus
              />
              {suggestions.length > 0 && (
                <div className="suggestions-dropdown-card">
                  <ul>
                    {suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        onClick={() => addStock(suggestion.symbol)}
                      >
                        <strong>{suggestion.symbol}</strong> - {suggestion.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {stocks.length === 0 && (
        <div className="no-stocks">
          <p>No stock cards added yet.</p>
          <p>Click the "Add" button above to add stock cards.</p>
        </div>
      )}

      <div className="stock-cards">
        {stocks.map((stock) => (
          <StockCard
            key={stock.symbol}
            stock={{
              symbol: stock.symbol,
              ...stockData[stock.symbol], // Pass fetched data for the stock
            }}
            onRemove={removeStock}
          />
        ))}
      </div>
    </div>
  );
};

export default StockCardContainer;