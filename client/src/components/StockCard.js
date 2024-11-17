import React from 'react';
import './StockCard.css';

const StockCard = ({ stock, onDelete }) => {
  return (
    <div className="stock-card">
      <div className="card-header">
        <span>{stock.symbol}</span>
        <button className="delete-button" onClick={onDelete}>×</button>
      </div>
      <div className="card-body">
        <p>Mevcut Fiyat: {stock.currentPrice}</p>
        <p>Önceki Kapanış: {stock.previousClose}</p>
        <p>Gün İçi Yüksek: {stock.high}</p>
        <p>Gün İçi Düşük: {stock.low}</p>
      </div>
    </div>
  );
};

export default StockCard;
