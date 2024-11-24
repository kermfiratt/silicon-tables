// src/components/SidebarDetails/PriceMetrics.js
import React, { useEffect, useState } from 'react';
import './PriceMetrics.css';

const PriceMetrics = ({ symbol, setView }) => {
  const [priceMetrics, setPriceMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY;

  useEffect(() => {
    const fetchPriceMetrics = async () => {
      try {
        const response = await fetch(
          `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`
        );
        const data = await response.json();

        if (data && data.Symbol) {
          setPriceMetrics([
            { label: 'PE Ratio', value: parseFloat(data.PERatio).toFixed(2) || 'N/A', color: '#4caf50' },
            { label: 'EPS', value: parseFloat(data.EPS).toFixed(2) || 'N/A', color: '#ff9800' },
            { label: 'Price to Book', value: parseFloat(data.PriceToBookRatio).toFixed(2) || 'N/A', color: '#03a9f4' },
            { label: 'Price to Sales', value: parseFloat(data.PriceToSalesRatioTTM).toFixed(2) || 'N/A', color: '#9c27b0' },
            { label: 'Dividend Yield', value: `${(parseFloat(data.DividendYield) * 100).toFixed(2)}%` || 'N/A', color: '#f44336' },
            { label: 'Beta', value: parseFloat(data.Beta).toFixed(2) || 'N/A', color: '#ffeb3b' },
            { label: 'Operating Margin', value: `${(parseFloat(data.OperatingMarginTTM) * 100).toFixed(2)}%` || 'N/A', color: '#8bc34a' },
            { label: 'Return on Equity (ROE)', value: `${(parseFloat(data.ReturnOnEquityTTM) * 100).toFixed(2)}%` || 'N/A', color: '#e91e63' },
            { label: 'Dividend Payout Ratio (DPR)', value: `${(parseFloat(data.DividendPayoutRatioTTM) * 100).toFixed(2)}%` || 'N/A', color: '#9e9e9e' },
            { label: 'EV/EBITDA', value: parseFloat(data.EVToEBITDA).toFixed(2) || 'N/A', color: '#673ab7' },
          ]);
        } else {
          throw new Error('No data available');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching price metrics:', error);
        setError('Failed to load price metrics.');
        setLoading(false);
      }
    };

    fetchPriceMetrics();
  }, [symbol, API_KEY]);

  if (loading) return <p>Loading price metrics...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="price-metrics-container">
      <div className="price-switch-container">
        <span className="switch-option" onClick={() => setView('general')}>General</span>
        <span className="switch-option" onClick={() => setView('stock')}>Stock</span>
      </div>

      <h3>Price Metrics</h3>
      <div className="metrics-blocks">
        {priceMetrics.map((metric, index) => (
          <div
            key={index}
            className="metric-block"
            style={{ borderLeft: `5px solid ${metric.color}` }}
          >
            <h4 style={{ color: metric.color }}>{metric.label}</h4>
            <p>{metric.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriceMetrics;
