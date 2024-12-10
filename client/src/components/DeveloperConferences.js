// src/components/DeveloperConferences.js
import React, { useState, useEffect } from 'react';
import './DeveloperConferences.css';

const DeveloperConferences = () => {
  const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY;
  const [ipoCalendar, setIpoCalendar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchIpoCalendar = async () => {
      try {
        setLoading(true);
        console.log('Fetching IPO Calendar...');
        const response = await fetch(
          `https://www.alphavantage.co/query?function=IPO_CALENDAR&apikey=${API_KEY}`
        );

        if (!response.ok) {
          console.error('Response not OK:', response.status, response.statusText);
          throw new Error('Network response was not OK');
        }

        const rawData = await response.text();
        console.log('Raw Data Received:', rawData);

        // Check if the data contains more than just the header row
        const rows = rawData.split('\n');
        if (rows.length <= 1) {
          console.error('No IPO data found in the response.');
          throw new Error('No IPO data available. Please try again later.');
        }

        const parsedData = rows
          .slice(1) // Skip the header row
          .map((line) => {
            const [symbol, name, ipoDate, priceRangeLow, priceRangeHigh, currency, exchange] =
              line.split(',');
            return { symbol, name, ipoDate, priceRangeLow, priceRangeHigh, currency, exchange };
          })
          .filter((ipo) => ipo.name && ipo.ipoDate && ipo.exchange); // Filter out invalid entries

        console.log('Parsed Data:', parsedData);
        setIpoCalendar(parsedData);
      } catch (error) {
        console.error('Error fetching IPO calendar:', error);
        setError(error.message || 'Failed to fetch IPO calendar. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchIpoCalendar();
  }, [API_KEY]);

  return (
    <div className="developer-conferences-container">
      <h2 className="developer-conferences-header">Upcoming IPOs</h2>
      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading...</p>
      ) : error ? (
        <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>
      ) : ipoCalendar.length > 0 ? (
        <ul className="developer-conferences-list">
          {ipoCalendar.map((ipo, index) => (
            <li key={index} className="developer-conference-item">
              <strong>{index + 1}.</strong> {ipo.name} <br />
              <span>
                {ipo.ipoDate} - {ipo.exchange} - {ipo.currency} {ipo.priceRangeLow}-
                {ipo.priceRangeHigh}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ textAlign: 'center' }}>No upcoming IPOs available.</p>
      )}
    </div>
  );
};

export default DeveloperConferences;
