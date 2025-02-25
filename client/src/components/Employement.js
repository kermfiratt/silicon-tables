// src/components/HitStartupOfTheWeek.js
import React, { useEffect, useState } from 'react';
import './Employement.css';

const HitStartupOfTheWeek = () => {
  const [unemploymentData, setUnemploymentData] = useState([]);

  useEffect(() => {
    const fetchUnemploymentData = async () => {
      const apiKey = process.env.REACT_APP_ALPHA_VANTAGE_KEY; // Use environment variable
      const response = await fetch(
        `https://www.alphavantage.co/query?function=UNEMPLOYMENT&apikey=${apiKey}`
      );
      const data = await response.json();

      if (data && data.data) {
        // Get the last 5 unemployment data points and format the dates
        const lastFiveData = data.data.slice(0, 5).map((item) => ({
          ...item,
          formattedDate: formatDate(item.date), // Format the date
        }));
        setUnemploymentData(lastFiveData);
      }
    };

    fetchUnemploymentData();
  }, []);

  // Function to format the date as "MM / YYYY"
  const formatDate = (dateString) => {
    const [year, month] = dateString.split('-'); // Split the date string
    return `${month} / ${year}`; // Format as "MM / YYYY"
  };

  return (
    <div className="unemployment-container">
      <div className="unemployment-header">
        <h2>US Monthly Unemployment Rates</h2>
      </div>
      <ul className="unemployment-list">
        {unemploymentData.map((item, index) => (
          <li key={index} className="unemployment-item">
            <span className="month-name">{item.formattedDate}</span>
            <span className="unemployment-value">{item.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HitStartupOfTheWeek;