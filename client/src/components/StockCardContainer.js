import React, { useState, useEffect } from 'react';
import StockCard from './StockCard';
import './StockCardContainer.css';

const StockCardContainer = () => {
  const ALPHA_VANTAGE_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY;

  const [stocks, setStocks] = useState([]);
  const [stockData, setStockData] = useState({});
  const [searchInput, setSearchInput] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const fetchStockData = async () => {
    const updatedStockData = {};
    for (let stock of stocks) {
      try {
        const response = await fetch(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock.symbol}&entitlement=delayed&apikey=${ALPHA_VANTAGE_KEY}`
        );
        const data = await response.json();
        const quote = data['Global Quote'] || data['Global Quote - DATA DELAYED BY 15 MINUTES'];

        if (quote && quote['05. price']) {
          updatedStockData[stock.symbol] = {
            currentPrice: parseFloat(quote['05. price']),
            previousClose: parseFloat(quote['08. previous close']),
            high: parseFloat(quote['03. high']),
            low: parseFloat(quote['04. low']),
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

  const addStock = async (event) => {
    if (event.key !== 'Enter') return;
    if (!searchInput.trim()) return;

    const symbol = searchInput.toUpperCase();
    if (stocks.some((stock) => stock.symbol === symbol)) {
      alert('This stock is already in your list!');
      setSearchInput('');
      return;
    }

    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&entitlement=delayed&apikey=${ALPHA_VANTAGE_KEY}`
      );
      const data = await response.json();
      const quote = data['Global Quote'] || data['Global Quote - DATA DELAYED BY 15 MINUTES'];

      if (!quote || !quote['05. price']) {
        alert('Stock not found or invalid symbol');
        return;
      }

      setStocks([...stocks, { symbol }]);
      setSearchInput('');
      setShowSearch(false);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };

  const removeStock = (symbol) => {
    setStocks(stocks.filter((stock) => stock.symbol !== symbol));
    setStockData((prevData) => {
      const newData = { ...prevData };
      delete newData[symbol];
      return newData;
    });
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
            Ekle
          </button>
        )}
        {showSearch && (
          <div className="stock-search">
            <input
              type="text"
              placeholder="Hisse kodu girin (ör. AAPL)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={addStock}
            />
          </div>
        )}
      </div>

      {stocks.length === 0 && (
        <div className="no-stocks">
          <p>Henüz hisse kartı eklemediniz.</p>
          <p>Hisse kartı eklemek için yukarıdaki "Ekle" butonuna tıklayın.</p>
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
