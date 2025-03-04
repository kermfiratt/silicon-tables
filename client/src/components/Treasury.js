import React, { useEffect, useState } from 'react';
import './Treasury.css';

const Treasury = () => {
  const [treasuryData, setTreasuryData] = useState(null);

  useEffect(() => {
    const fetchTreasuryData = async () => {
      const apiKey = process.env.REACT_APP_ALPHA_VANTAGE_KEY; // Use environment variable
      const response = await fetch(
        `https://www.alphavantage.co/query?function=TREASURY_YIELD&interval=monthly&maturity=10year&apikey=${apiKey}`
      );
      const data = await response.json();

      if (data && data.data && data.data.length > 0) {
        // Get the latest treasury data
        const latestTreasury = data.data[0];
        setTreasuryData({
          date: formatDate(latestTreasury.date), // Format the date
          value: parseFloat(latestTreasury.value).toFixed(2), // Format to 2 decimal places
        });
      }
    };

    fetchTreasuryData();
  }, []);

  // Function to format the date as "MM / YY"
  const formatDate = (dateString) => {
    const [year, month] = dateString.split('-'); // Split the date string
    const shortYear = year.slice(-2); // Get the last two digits of the year
    return `${month} / ${shortYear}`; // Format as "MM / YY"
  };

  return (
    <div className="treasury-container">
      <h3 className="treasury-header">10-Year Treasury Rate</h3>
      {treasuryData && (
        <div className="treasury-rate">
          <span className="treasury-date">{treasuryData.date}</span>
          <span className="treasury-value">{treasuryData.value}%</span>
        </div>
      )}
    </div>
  );
};

export default Treasury;