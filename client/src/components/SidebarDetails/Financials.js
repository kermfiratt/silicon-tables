// src/components/SidebarDetails/Financials.js
import React, { useEffect, useRef } from 'react';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip } from 'chart.js';
import './Financials.css';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip);

const Financials = ({ symbol, setView }) => {
  const chartRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const renderChart = () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      chartRef.current = new Chart(canvasRef.current, {
        type: 'bar',
        data: {
          labels: ['2023/Q1', '2023/Q2', '2023/Q3', '2023/Q4'],
          datasets: [
            {
              label: 'Quarterly Sales',
              data: [500, 400, 300, 600], // Placeholder data
              backgroundColor: '#4a90e2',
            },
            {
              label: 'Quarterly EBITDA',
              data: [200, 150, 250, 100], // Placeholder data
              backgroundColor: '#7cb342',
            },
            {
              label: 'Quarterly Net Income',
              data: [300, 100, -100, -200], // Placeholder data
              backgroundColor: ['#4a90e2', '#4a90e2', '#f44336', '#f44336'],
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              type: 'category',
              title: {
                display: true,
                text: 'Quarters',
              },
            },
            y: {
              type: 'linear',
              title: {
                display: true,
                text: 'Amount (mn)',
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
  }, [symbol]);

  return (
    <div className="financials-block">

<div className="switch-container">
        <button onClick={() => setView('general')} className="switch-option">General</button>
        <button onClick={() => setView('stock')} className="switch-option">Stock</button>
      </div>
      <h3>Financial Data</h3>
      <canvas ref={canvasRef}></canvas>
      
    </div>
  );
};

export default Financials;
