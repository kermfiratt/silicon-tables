import React, { useState, useEffect } from 'react';
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
  const [timePercentageData, setTimePercentageData] = useState({});
  const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch intraday data
        const intradayResponse = await fetch(
          `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${API_KEY}`
        );
        const intradayData = await intradayResponse.json();
        const timeSeries = intradayData['Time Series (5min)'];

        if (timeSeries) {
          const formattedData = Object.entries(timeSeries).map(([time, values]) => ({
            time,
            price: parseFloat(values['4. close']),
          }));

          // Sort data by time to ensure correct order
          formattedData.sort((a, b) => new Date(a.time) - new Date(b.time));
          setIntradayData(formattedData);
        } else {
          console.error('No intraday data available:', intradayData);
          setIntradayData([]);
        }

        // Fetch daily data for percentage calculations
        const dailyResponse = await fetch(
          `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&outputsize=full&apikey=${API_KEY}`
        );
        const dailyData = await dailyResponse.json();
        const timeSeriesDaily = dailyData['Time Series (Daily)'];

        if (timeSeriesDaily) {
          const dailyPrices = Object.entries(timeSeriesDaily).map(([date, values]) => ({
            date,
            price: parseFloat(values['4. close']),
          }));
          calculateTimePercentageData(dailyPrices);
        } else {
          console.error('No daily data available:', dailyData);
          setTimePercentageData({});
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setIntradayData([]);
        setTimePercentageData({});
      } finally {
        setLoading(false);
      }
    };

    const calculateTimePercentageData = (data) => {
      const timeFrames = {
        '1W': 7,
        '1M': 30,
        '3M': 90,
        '6M': 180,
        '1Y': 365,
        '5Y': 1825,
      };
      const percentages = {};
      const latestPrice = data[0]?.price || 0;

      Object.entries(timeFrames).forEach(([label, days]) => {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - days);
        const pastData = data.find((item) => new Date(item.date) <= pastDate);

        if (pastData) {
          percentages[label] = (
            ((latestPrice - pastData.price) / pastData.price) *
            100
          ).toFixed(2);
        } else {
          percentages[label] = 'N/A'; // Handle missing data
        }
      });

      setTimePercentageData(percentages);
    };

    fetchData();
  }, [symbol, API_KEY]);

  // Determine chart color based on price change
  const chartBorderColor = currentPrice < previousClose ? 'red' : 'green';

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
      x: {
        display: true,
        ticks: {
          callback: (val, index) =>
            index % Math.floor(intradayData.length / 6) === 0
              ? intradayData[index]?.time.slice(11, 16)
              : '',
        },
      },
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
        borderColor: chartBorderColor,
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
      <div className="chart-container-style">
        {loading ? (
          <p>Loading intraday data...</p>
        ) : intradayData.length > 0 ? (
          <Line data={chartDataset} options={chartOptions} />
        ) : (
          <p>No intraday data available</p>
        )}
      </div>

      {/* Time Percentage Blocks */}
      <div className="time-percentages">
        {Object.entries(timePercentageData).map(([key, value]) => (
          <div
            key={key}
            className={`time-percentage-block ${
              value > 0 ? 'positive' : value < 0 ? 'negative' : ''
            }`}
          >
            {key} % <br />
            {value !== 'N/A' ? `${value}%` : 'N/A'}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockCard;
