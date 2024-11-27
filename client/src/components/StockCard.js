import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import './StockCard.css';

const StockCard = ({ stock, onRemove }) => {
  const {
    symbol = 'N/A',
    currentPrice = 0,
    previousClose = 0,
    high = 0,
    low = 0,
    marketCap = 'N/A',
    priceChange = 'neutral',
  } = stock;

  const [intradayData, setIntradayData] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY;

  useEffect(() => {
    const fetchIntradayData = async () => {
      try {
        const response = await fetch(
          `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${API_KEY}`
        );
        const data = await response.json();
        const timeSeries = data['Time Series (5min)'];

        if (timeSeries) {
          const formattedData = Object.entries(timeSeries).map(([time, values]) => ({
            time,
            price: parseFloat(values['4. close']),
          }));

          // Sort data by time to ensure correct order
          formattedData.sort((a, b) => new Date(a.time) - new Date(b.time));

          setIntradayData(formattedData);
        } else {
          console.error('No intraday data available:', data);
          setIntradayData([]);
        }
      } catch (error) {
        console.error('Error fetching intraday data:', error);
        setIntradayData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchIntradayData();
  }, [symbol, API_KEY]);

  // Chart options for intraday price volatility
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (tooltipItem) => `$${tooltipItem.raw.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: { display: false }, // Hide X-axis
      y: { display: false }, // Hide Y-axis
    },
    elements: {
      point: {
        radius: 2, // Small points for hover
        hoverRadius: 4, // Increase size on hover
      },
    },
  };

  // Chart dataset for intraday price volatility
  const chartDataset = {
    labels: intradayData.map((data) => data.time),
    datasets: [
      {
        label: `${symbol} Intraday Prices`,
        data: intradayData.map((data) => data.price),
        borderColor: 'blue',
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
          <div className="current-price">${currentPrice.toFixed(2)}</div>
          <div
            className={`price-change ${
              priceChange === 'up'
                ? 'positive'
                : priceChange === 'down'
                ? 'negative'
                : 'neutral'
            }`}
          >
            {priceChange === 'up' ? '+' : ''}
            {(currentPrice - previousClose).toFixed(2)} (
            {previousClose > 0
              ? ((currentPrice - previousClose) / previousClose * 100).toFixed(2)
              : 'N/A'}
            %)
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

      {/* Intraday Chart */}
      <div className="chart-container">
        {loading ? (
          <p>Loading intraday data...</p>
        ) : intradayData.length > 0 ? (
          <Line data={chartDataset} options={chartOptions} />
        ) : (
          <p>No intraday data available</p>
        )}
      </div>
    </div>
  );
};

export default StockCard;
