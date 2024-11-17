import React from 'react';
import { Line } from 'react-chartjs-2';
import './StockCard.css';

const StockCard = ({ stock, onRemove }) => {
  const {
    symbol,
    currentPrice,
    previousClose,
    high,
    low,
    marketCap,
    chartData,
    priceChange,
    timeChanges,
  } = stock;

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { x: { display: false }, y: { display: false } },
  };

  // Chart dataset
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
      {/* Stock Header */}
      <div className="stock-header">
        <div className="stock-name">{symbol}</div>
        <div className="price-section">
          <div className="current-price">{currentPrice.toFixed(2)}</div>
          <div
            className={`price-change ${
              priceChange === 'up' ? 'positive' : 'negative'
            }`}
          >
            {priceChange === 'up' ? '+' : ''}
            {(currentPrice - previousClose).toFixed(2)} (
            {((currentPrice - previousClose) / previousClose * 100).toFixed(2)}%)
          </div>
        </div>
        <button className="remove-button" onClick={() => onRemove(symbol)}>
          ✖
        </button>
      </div>

      {/* Stock Summary */}
      <div className="stock-summary">
        <div className="summary-item">
          <span>Taban</span>
          <span>{low.toFixed(2)}</span>
        </div>
        <div className="summary-item">
          <span>Tavan</span>
          <span>{high.toFixed(2)}</span>
        </div>
        <div className="summary-item">
          <span>Ö.K.</span>
          <span>{previousClose.toFixed(2)}</span>
        </div>
        <div className="summary-item">
          <span>P.D.</span>
          <span>{marketCap}</span>
        </div>
      </div>

      {/* Chart Section */}
      <div className="chart-container">
        <Line data={chartDataset} options={chartOptions} />
      </div>

      {/* Time Percentages */}
      <div className="time-percentages">
        {timeChanges.map((change, index) => (
          <div
            key={index}
            className={`time-percentage-block ${
              change.value >= 0 ? 'positive' : 'negative'
            }`}
          >
            {change.period}: {change.value >= 0 ? '+' : ''}
            {change.value.toFixed(2)}%
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockCard;
