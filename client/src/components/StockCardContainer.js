import React, { useState } from 'react';
import StockCard from './StockCard';
import './StockCardContainer.css';

const StockCardContainer = () => {
  const [stocks, setStocks] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const addStock = async () => {
    if (!searchInput) return;

    const API_KEY = process.env.REACT_APP_API_KEY || 'csbat5hr01qugk3kvkngcsbat5hr01qugk3kvko0'; // Update your API key here
    try {
      const response = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${searchInput.toUpperCase()}&token=${API_KEY}`
      );
      const data = await response.json();

      if (!data || !data.c) {
        alert('Stock not found or invalid symbol');
        return;
      }

      const newStock = {
        symbol: searchInput.toUpperCase(),
        currentPrice: data.c,
        previousClose: data.pc,
        high: data.h,
        low: data.l,
      };

      setStocks([...stocks, newStock]);
      setSearchInput('');
      setShowSearch(false);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };

  const deleteStock = (symbol) => {
    setStocks(stocks.filter((stock) => stock.symbol !== symbol));
  };

  return (
    <div className="stock-card-container">
      <div className="add-stock-section">
        <button onClick={() => setShowSearch(!showSearch)} className="add-stock-button">Ekle +</button>
        {showSearch && (
          <div className="stock-search">
            <input
              type="text"
              placeholder="Hisse kodu girin (ör. AAPL)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button onClick={addStock}>Ekle</button>
          </div>
        )}
      </div>

      {stocks.length === 0 && (
        <div className="stock-card-description">
          <p>Henüz hisse kartı eklemediniz</p>
          <p>
            Takip ettiğiniz şirketlere ait detaylara kolayca ulaşmak için Hisse Kartı ekleyin.
            Sağdaki araç çubuğundan herhangi bir şirketi sürükleyerek ya da sol üstteki Ekle butonuna
            tıklayarak yeni kart ekleyebilirsiniz.
          </p>
        </div>
      )}

      <div className="stock-cards">
        {stocks.map((stock) => (
          <StockCard key={stock.symbol} stock={stock} onDelete={() => deleteStock(stock.symbol)} />
        ))}
      </div>
    </div>
  );
};

export default StockCardContainer;
