// src/components/HitStartupOfTheWeek.js
import React, { useEffect, useState } from 'react';
import './HitStartupOfTheWeek.css';

const HitStartupOfTheWeek = () => {
  const [inflationData, setInflationData] = useState(null);

  useEffect(() => {
    const fetchInflationData = async () => {
      const apiKey = process.env.REACT_APP_ALPHA_VANTAGE_KEY; // Use environment variable
      const response = await fetch(
        `https://www.alphavantage.co/query?function=INFLATION&apikey=${apiKey}`
      );
      const data = await response.json();

      if (data && data.data && data.data.length > 0) {
        // Get the latest inflation data
        const latestInflation = data.data[0];
        setInflationData({
          year: latestInflation.date.split('-')[0], // Extract the year
          value: parseFloat(latestInflation.value).toFixed(2), // Format to 2 decimal places
        });
      }
    };

    fetchInflationData();
  }, []);

  return (
    <div className="hit-startup-container">
      {inflationData && (
        <div className="inflation-rate">
          <span className="inflation-label">US Annual Inflation</span>
          <span className="inflation-year">{inflationData.year}</span>
          <span className="inflation-value">{inflationData.value}%</span>
        </div>
      )}
    </div>
  );
};

export default HitStartupOfTheWeek;