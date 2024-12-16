// src/components/RecentVCFunds.js
import React, { useState, useEffect } from 'react';
import './RecentVCFunds.css';

const RecentVCFunds = () => {
  const [earningsData, setEarningsData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY;

  const fetchEarningsData = async () => {
    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=EARNINGS_CALENDAR&horizon=6month&apikey=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.earningsCalendar) {
        throw new Error('No earnings calendar data available.');
      }

      // Filter the data for the top 5 companies
      const topCompanies = ['AAPL', 'NVDA', 'TSLA', 'GOOG', 'MSFT'];
      const filteredData = data.earningsCalendar.filter((item) =>
        topCompanies.includes(item.symbol)
      );

      setEarningsData(filteredData);
    } catch (err) {
      console.error('Error fetching earnings data:', err);
      setError('Failed to fetch earnings data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEarningsData();
  }, []);

  return (
    <div className="recent-vc-funds-container">
      <h3 className="recent-vc-funds-header">Top 5 Companies - Earnings Calendar</h3>
      {isLoading ? (
        <p>Loading data...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <ul className="recent-vc-funds-list">
          {earningsData.map((item, index) => (
            <li key={index} className="recent-vc-funds-item">
              <span className="company-symbol">{item.symbol}</span>
              <span className="earnings-date">{item.reportDate}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentVCFunds;