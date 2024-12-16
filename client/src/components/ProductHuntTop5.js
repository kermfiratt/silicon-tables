// src/components/ProductHuntTop5.js
import React, { useEffect, useState } from 'react';
import './ProductHuntTop5.css';
import axios from 'axios';

const ProductHuntTop5 = () => {
  const [companies, setCompanies] = useState([]); // Holds the top traded companies
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY;

  // Function to format volume with a dollar sign
  const formatVolume = (num) => {
    if (num >= 1.0e9) return `$${(num / 1.0e9).toFixed(1)}B`;
    if (num >= 1.0e6) return `$${(num / 1.0e6).toFixed(1)}M`;
    if (num >= 1.0e3) return `$${(num / 1.0e3).toFixed(1)}K`;
    return `$${num}`;
  };

  useEffect(() => {
    const fetchTopTraded = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${API_KEY}`
        );

        console.log('API Response:', response.data);

        // Extract most actively traded companies and slice the top 10
        const topTraded = response.data?.most_actively_traded || [];
        setCompanies(topTraded.slice(0, 10));
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data. Please check your API key or internet connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchTopTraded();
  }, [API_KEY]);

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
        <h2 className="product-hunt-header">Top Traded Companies</h2>
        {loading ? (
          <p>Loading data...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <ul className="product-hunt-list">
            {companies.map((company, index) => (
              <li key={company.ticker || index} className="product-hunt-item">
                <span className="product-rank">{index + 1}.</span>
                <span className="product-name">{company.ticker}</span>
                <span className="product-votes">{formatVolume(company.volume)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProductHuntTop5;
