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
        const response = await fetch(
          `https://www.alphavantage.co/query?function=IPO_CALENDAR&apikey=${API_KEY}`
        );

        const rawData = await response.text();
        const parsedData = rawData
          .split('\n')
          .slice(1) // Skip the header row
          .map((line) => {
            const [name, date, exchange] = line.split(',');
            return { name, date, exchange };
          })
          .filter((ipo) => ipo.name && ipo.date && ipo.exchange); // Filter out invalid entries

        setIpoCalendar(parsedData);
      } catch (error) {
        console.error('Error fetching IPO calendar:', error);
        setError('Failed to fetch IPO calendar. Please try again later.');
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
      ) : (
        <ul className="developer-conferences-list">
          {ipoCalendar.map((ipo, index) => (
            <li key={index} className="developer-conference-item">
              <strong>{index + 1}.</strong> {ipo.name} <br />
              <span>
                {ipo.date} - {ipo.exchange}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DeveloperConferences;
