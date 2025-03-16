import React, { useState, useEffect } from 'react';
import './Nonfarm.css'; // Use updated Nonfarm.css

const Nonfarm = () => {
  const [nonfarmData, setNonfarmData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY;

  const fetchNonfarmData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://www.alphavantage.co/query?function=NONFARM_PAYROLL&apikey=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch Nonfarm Payroll data');
      }

      const data = await response.json();

      // Extract the latest data point from the array
      const latestDataPoint = data.data[0];
      const latestDate = latestDataPoint.date;
      const latestValue = latestDataPoint.value;

      // Format the date to MM / YY
      const [year, month] = latestDate.split('-');
      const formattedDate = `${month} / ${year.slice(-2)}`;

      setNonfarmData({
        date: formattedDate,
        value: latestValue,
      });
    } catch (err) {
      console.error('Error fetching Nonfarm Payroll data:', err);
      setError('Failed to fetch Nonfarm Payroll data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNonfarmData();
  }, []);

  return (
    <div className="nonfarm-container">
      <h3 className="nonfarm-header">
        <span className="nonfarm-header-line2">NONFARM</span>
        <span className="nonfarm-header-line3">PAYROLL DATA</span>
      </h3>
      {isLoading ? (
        <p>Loading data...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="nonfarm-data">
          <div className="nonfarm-item">
            <span className="nonfarm-date">{nonfarmData.date}</span>
            <span className="nonfarm-value">{nonfarmData.value}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Nonfarm;