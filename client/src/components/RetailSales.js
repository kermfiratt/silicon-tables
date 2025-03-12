import React, { useState, useEffect } from 'react';
import './RetailSales.css'; // Use RetailSales.css

const RetailSales = () => {
  const [retailSalesData, setRetailSalesData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY;

  const fetchRetailSalesData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://www.alphavantage.co/query?function=RETAIL_SALES&apikey=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch Retail Sales data');
      }

      const data = await response.json();

      // Extract the latest data point from the array
      const latestDataPoint = data.data[0];
      const latestDate = latestDataPoint.date;
      const latestValue = latestDataPoint.value;

      // Format the date to MM / YY
      const [year, month] = latestDate.split('-');
      const formattedDate = `${month} / ${year.slice(-2)}`;

      // Format the value to shorten it with "M" at the end
      const formattedValue = `${(parseFloat(latestValue) / 1000).toFixed(2)}M`;

      setRetailSalesData({
        date: formattedDate,
        value: formattedValue,
      });
    } catch (err) {
      console.error('Error fetching Retail Sales data:', err);
      setError('Failed to fetch Retail Sales data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRetailSalesData();
  }, []);

  return (
    <div className="retail-sales-container">
      <h3 className="retail-sales-header">
        Advance Retail Sales<br />
        Retail Trade
      </h3>
      {isLoading ? (
        <p>Loading data...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="retail-sales-data">
          <div className="retail-sales-item">
            <span className="retail-sales-date">{retailSalesData.date}</span>
            <span className="retail-sales-value">{retailSalesData.value}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RetailSales;