import React from 'react';
import { Line } from 'react-chartjs-2';
import './StockCard.css';

const StockCard = ({ stock, onRemove }) => {
  const { symbol, currentPrice, previousClose, high, low, marketCap, chartData, priceChange } = stock;

  // Grafik ayarları
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
  };

  const chartDataset = {
    labels: chartData.map((_, index) => index),
    datasets: [
      {
        label: `${symbol} Price`,
        data: chartData,
        borderColor: priceChange === 'up' ? 'green' : 'red',
        tension: 0.3,
        pointRadius: 0,
      },
    ],
  };

  return (
    <div className="stock-card">
      <div className="stock-header">
        <h3>{symbol}</h3>
        <button className="remove-button" onClick={() => onRemove(symbol)}>✖</button>
      </div>
      <div className="stock-details">
        <p>Mevcut Fiyat: {currentPrice}</p>
        <p>Önceki Kapanış: {previousClose}</p>
        <p>Günlük Yüksek: {high}</p>
        <p>Günlük Düşük: {low}</p>
        <p>Piyasa Değeri: {marketCap}</p>
      </div>
      <div className="stock-chart">
        <Line data={chartDataset} options={chartOptions} />
      </div>
    </div>
  );
};

export default StockCard;
