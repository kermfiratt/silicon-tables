// src/components/SidebarDetails/PriceMetrics.js
import React, { useEffect, useState } from 'react';
import { Chart, BarElement, CategoryScale, LinearScale, Title, Tooltip } from 'chart.js';
import './PriceMetrics.css';

Chart.register(BarElement, CategoryScale, LinearScale, Title, Tooltip);

const PriceMetrics = ({ symbol, setView }) => {
  const [priceData, setPriceData] = useState([]);

  const API_KEY = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        const response = await fetch(`https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=price&token=${API_KEY}`);
        const data = await response.json();

        const metrics = data.metric || {
          peRatio: 15.2,
          eps: 3.2,
          priceToBook: 1.4,
          priceToSales: 2.5,
        };

        setPriceData([
          { label: 'PE Ratio', value: metrics.peRatio },
          { label: 'EPS', value: metrics.eps },
          { label: 'Price to Book', value: metrics.priceToBook },
          { label: 'Price to Sales', value: metrics.priceToSales },
        ]);
      } catch (error) {
        console.error("Error fetching price metrics data:", error);

        // Placeholder data in case of an API error
        setPriceData([
          { label: 'PE Ratio', value: 15.2 },
          { label: 'EPS', value: 3.2 },
          { label: 'Price to Book', value: 1.4 },
          { label: 'Price to Sales', value: 2.5 },
        ]);
      }
    };

    fetchPriceData();
  }, [symbol, API_KEY]);

  return (
    <div className="price-metrics-container">
      <div className="price-switch-container">
        <span className="switch-option" onClick={() => setView('general')}>General</span>
        <span className="switch-option" onClick={() => setView('stock')}>Stock</span>
      </div>

      <h3>Price Metrics</h3>
      <ul>
        {priceData.map((metric, index) => (
          <li key={index}>
            <strong>{metric.label}:</strong> {metric.value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PriceMetrics;
