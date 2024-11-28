// src/components/ProductHuntTop5.js
import React, { useEffect, useState } from 'react';
import './ProductHuntTop5.css';
import axios from 'axios';

const ProductHuntTop5 = () => {
  const [data, setData] = useState({ gainers: [], losers: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState('gainers'); // State for toggling between gainers and losers

  const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${API_KEY}`
        );

        console.log('API Response:', response.data);

        const gainers = response.data?.top_gainers || [];
        const losers = response.data?.top_losers || [];

        // Filter top 10 companies
        setData({
          gainers: gainers.slice(0, 10),
          losers: losers.slice(0, 10),
        });
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(
          'Failed to fetch data. Please check your API key or internet connection.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_KEY]);

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="product-hunt-container">
      <div className="product-hunt-left">
        <span>{currentDate}</span>
      </div>
      <div className="product-hunt-right">
        <div className="toggle-switch">
          <button
            className={view === 'gainers' ? 'active' : ''}
            onClick={() => handleViewChange('gainers')}
          >
            Top Gainers
          </button>
          <button
            className={view === 'losers' ? 'active' : ''}
            onClick={() => handleViewChange('losers')}
          >
            Top Losers
          </button>
        </div>
        <h2 className="product-hunt-header">
          {view === 'gainers' ? 'Top Gaining Stocks' : 'Top Losing Stocks'}
        </h2>
        {loading ? (
          <p>Loading data...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <ul className="product-hunt-list">
            {data[view]?.map((company, index) => (
              <li key={company.ticker || index} className="product-hunt-item">
                <span className="product-rank">{index + 1}.</span>
                <span className="product-name">{company.ticker}</span>
                <span
                  className="product-votes"
                  style={{
                    color: view === 'losers' ? 'red' : '#4caf50', // Red for losers, green for gainers
                  }}
                >
                  {view === 'gainers'
                    ? `+${parseFloat(company.change_percentage).toFixed(1)}%`
                    : `${parseFloat(company.change_percentage).toFixed(1)}%`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProductHuntTop5;
