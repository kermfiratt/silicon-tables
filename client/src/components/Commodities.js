import React, { useState, useEffect } from 'react';
import './Commodities.css'; // Use updated Commodities.css

const Commodities = () => {
  const [commoditiesData, setCommoditiesData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY;

  const fetchCommoditiesData = async () => {
    const commodityEndpoints = [
  
      { name: 'Natural Gas', function: 'NATURAL_GAS', interval: 'monthly' },
      { name: 'Aluminum', function: 'ALUMINUM', interval: 'monthly' },
      { name: 'Copper', function: 'COPPER', interval: 'monthly' },
      { name: 'Crude Oil (WTI)', function: 'WTI', interval: 'monthly' },
      { name: 'Crude Oil (Brent)', function: 'BRENT', interval: 'monthly' },
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
    <div className="commodities-container">
      <h3 className="commodities-header">Popular Commodities Prices</h3>
      {isLoading ? (
        <p>Loading data...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <ul className="commodities-list">
          {commoditiesData.map((commodity, index) => (
            <li key={index} className="commodities-item">
              <span className="commodity-name">{commodity.name}</span>
              <span className="commodity-price">${commodity.price}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Commodities;