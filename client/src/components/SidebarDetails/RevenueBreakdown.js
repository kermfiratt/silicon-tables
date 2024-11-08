// src/components/SidebarDetails/RevenueBreakdown.js
import React, { useEffect, useRef, useState } from 'react';
import { Chart, BarElement, CategoryScale, LinearScale, Title, Tooltip } from 'chart.js';
import './RevenueBreakdown.css';

Chart.register(BarElement, CategoryScale, LinearScale, Title, Tooltip);

const RevenueBreakdown = ({ symbol, setView }) => {
  const chartRef = useRef(null);
  const canvasRef = useRef(null);
  const [revenueData, setRevenueData] = useState([]);

  const API_KEY = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const response = await fetch(`https://finnhub.io/api/v1/stock/revenue?symbol=${symbol}&token=${API_KEY}`);
        const data = await response.json();

        const revenue = data.revenue || [
          { quarter: '2023/Q1', amount: 300 },
          { quarter: '2023/Q2', amount: 400 },
          { quarter: '2023/Q3', amount: 350 },
          { quarter: '2023/Q4', amount: 450 }
        ];

        setRevenueData(revenue);
      } catch (error) {
        console.error("Error fetching revenue data:", error);

        setRevenueData([
          { quarter: '2023/Q1', amount: 300 },
          { quarter: '2023/Q2', amount: 400 },
          { quarter: '2023/Q3', amount: 350 },
          { quarter: '2023/Q4', amount: 450 }
        ]);
      }
    };

    fetchRevenueData();
  }, [symbol, API_KEY]);

  useEffect(() => {
    const renderChart = () => {
      if (chartRef.current) {
        chartRef.current.destroy(); // Destroy previous chart instance
      }

      chartRef.current = new Chart(canvasRef.current, {
        type: 'bar',
        data: {
          labels: revenueData.map(item => item.quarter),
          datasets: [
            {
              label: 'Quarterly Revenue',
              data: revenueData.map(item => item.amount),
              backgroundColor: '#4a90e2'
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
                text: 'Quarters'
              }
            },
            y: {
              type: 'linear',
              title: {
                display: true,
                text: 'Revenue (mn)'
              }
            }
          }
        }
      });
    };

    renderChart();

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [revenueData]);

  return (
    <div className="revenue-breakdown-container">
      <div className="revenue-switch-container">
        <span className="switch-option" onClick={() => setView('general')}>General</span>
        <span className="switch-option" onClick={() => setView('stock')}>Stock</span>
      </div>
      
      <h3>Revenue Breakdown</h3>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default RevenueBreakdown;
