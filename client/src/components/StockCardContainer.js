import React, { useState } from 'react';
import StockCard from './StockCard';
import './StockCardContainer.css';

const StockCardContainer = () => {
  const [stocks, setStocks] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const addStock = async (event) => {
    if (event.key !== 'Enter') return;
    if (!searchInput) return;

    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${searchInput.toUpperCase()}&apikey=${process.env.REACT_APP_ALPHA_VANTAGE_KEY}`
      );
      const data = await response.json();
      const quote = data['Global Quote'];

      if (!quote || !quote['05. price']) {
        alert('Hisse bulunamadı veya geçersiz sembol');
        return;
      }

      // Mock data for time-based changes
      const timeChanges = [
        { period: '1H', value: -0.3 },
        { period: '1A', value: 10.12 },
        { period: '3A', value: -2.77 },
        { period: '6A', value: -18.81 },
        { period: 'YTD', value: 32.0 },
        { period: '1Y', value: 28.17 },
      ];

      const newStock = {
        symbol: quote['01. symbol'],
        currentPrice: parseFloat(quote['05. price']),
        previousClose: parseFloat(quote['08. previous close']),
        high: parseFloat(quote['03. high']),
        low: parseFloat(quote['04. low']),
        marketCap: '5.848.000.000', // Placeholder value for Market Cap
        chartData: [100, 102, 105, 103, 110], // Placeholder data for the chart
        priceChange: parseFloat(quote['09. change']) > 0 ? 'up' : 'down',
        timeChanges,
      };

      setStocks([...stocks, newStock]);
      setSearchInput('');
      setShowSearch(false);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };

  const removeStock = (symbol) => {
    setStocks(stocks.filter((stock) => stock.symbol !== symbol));
  };

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
              onKeyPress={addStock} // Add stock on Enter key press
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
        {stocks.map((stock, index) => (
          <StockCard key={index} stock={stock} onRemove={removeStock} />
        ))}
      </div>
    </div>
  );
};

export default StockCardContainer;
