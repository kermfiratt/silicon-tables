// src/components/RecentVCFunds.js
import React, { useState, useEffect } from 'react';
import './Commodities.css';

const RecentVCFunds = () => {
  const [commoditiesData, setCommoditiesData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY;

  const fetchCommoditiesData = async () => {
    const commodityEndpoints = [
      { name: 'Crude Oil (WTI)', function: 'WTI', interval: 'monthly' },
      { name: 'Crude Oil (Brent)', function: 'BRENT', interval: 'monthly' },
      { name: 'Natural Gas', function: 'NATURAL_GAS', interval: 'monthly' },
      { name: 'Aluminum', function: 'ALUMINUM', interval: 'monthly' },
      { name: 'Copper', function: 'COPPER', interval: 'monthly' },
    ];

    try {
      setIsLoading(true);
      const promises = commodityEndpoints.map(async (commodity) => {
        const response = await fetch(
          `https://www.alphavantage.co/query?function=${commodity.function}&interval=${commodity.interval}&apikey=${API_KEY}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch data for ${commodity.name}`);
        }

        const data = await response.json();
        const latestDate = Object.keys(data.data || {})[0];
        const latestPrice = data.data?.[latestDate]?.value;

        return {
          name: commodity.name,
          price: parseFloat(latestPrice).toFixed(2),
        };
      });

      const results = await Promise.all(promises);
      setCommoditiesData(results);
    } catch (err) {
      console.error('Error fetching commodities data:', err);
      setError('Failed to fetch commodities data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommoditiesData();
  }, []);

  return (
    <div className="recent-vc-funds-container">
      <h3 className="recent-vc-funds-header">Popular Commodities Prices</h3>
      {isLoading ? (
        <p>Loading data...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <ul className="recent-vc-funds-list">
          {commoditiesData.map((commodity, index) => (
            <li key={index} className="recent-vc-funds-item">
              <span className="commodity-name">{commodity.name}</span>
              <span className="commodity-price" style={{ color: '#4caf50' }}>
                ${commodity.price}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentVCFunds;
