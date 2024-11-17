import React, { useState } from 'react';
import StockCard from './StockCard';
import './StockCardContainer.css';

const StockCardContainer = () => {
  const [stocks, setStocks] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const addStock = async () => {
    if (!searchInput) return;
    try {
      const response = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${searchInput.toUpperCase()}&token=${process.env.REACT_APP_API_KEY}`
      );
      const data = await response.json();

      if (!data || !data.c) {
        alert('Hisse bulunamadı veya geçersiz sembol');
        return;
      }

      // Grafik verileri için API çağrısı
      const historicalResponse = await fetch(
        `https://finnhub.io/api/v1/stock/candle?symbol=${searchInput.toUpperCase()}&resolution=D&from=1609459200&to=1700000000&token=${process.env.REACT_APP_API_KEY}`
      );
      const historicalData = await historicalResponse.json();

      const chartData =
        historicalData && historicalData.c ? historicalData.c : [100, 102, 105, 103, 110]; // Placeholder grafik verisi

      const newStock = {
        symbol: searchInput.toUpperCase(),
        currentPrice: data.c,
        previousClose: data.pc,
        high: data.h,
        low: data.l,
        marketCap: '5.848.000.000', // Placeholder veri
        chartData,
        priceChange: data.c > data.pc ? 'up' : 'down',
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
        <button onClick={() => setShowSearch(!showSearch)} className="add-stock-button">Ekle</button>
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
