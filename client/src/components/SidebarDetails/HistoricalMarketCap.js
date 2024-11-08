// src/components/SidebarDetails/HistoricalMarketCap.js
import React, { useEffect, useRef, useState } from 'react';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, Tooltip, CategoryScale } from 'chart.js';
import './HistoricalMarketCap.css';

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, Tooltip, CategoryScale);

const HistoricalMarketCap = ({ symbol, setView }) => {
  const chartRef = useRef(null);
  const canvasRef = useRef(null);
  const [marketCapData, setMarketCapData] = useState([]);

  const API_KEY = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    const fetchMarketCapData = async () => {
      try {
        const response = await fetch(`https://finnhub.io/api/v1/stock/market-capitalization?symbol=${symbol}&token=${API_KEY}`);
        const data = await response.json();

        const marketCap = data.historical || [
          { date: '2023-01', value: 1000 },
          { date: '2023-04', value: 1200 },
          { date: '2023-07', value: 1150 },
          { date: '2023-10', value: 1300 },
        ];

        setMarketCapData(marketCap);
      } catch (error) {
        console.error("Error fetching market cap data:", error);

        setMarketCapData([
          { date: '2023-01', value: 1000 },
          { date: '2023-04', value: 1200 },
          { date: '2023-07', value: 1150 },
          { date: '2023-10', value: 1300 },
        ]);
      }
    };

    fetchMarketCapData();
  }, [symbol, API_KEY]);

  useEffect(() => {
    const renderChart = () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      chartRef.current = new Chart(canvasRef.current, {
        type: 'line',
        data: {
          labels: marketCapData.map(item => item.date),
          datasets: [
            {
              label: 'Market Cap (in millions)',
              data: marketCapData.map(item => item.value),
              borderColor: '#4a90e2',
              backgroundColor: 'rgba(74, 144, 226, 0.5)',
              fill: true,
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              type: 'category',
              title: {
                display: true,
                text: 'Date',
              },
            },
            y: {
              type: 'linear',
              title: {
                display: true,
                text: 'Market Cap (mn)',
              },
            },
          },
        },
      });
    };

    renderChart();

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [marketCapData]);

  return (
    <div className="historical-market-cap-block">
      <div className="switch-container">
        <button onClick={() => setView('general')} className="switch-option">General</button>
        <button onClick={() => setView('stock')} className="switch-option">Stock</button>
      </div>
      <h3>Historical Market Cap</h3>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default HistoricalMarketCap;
