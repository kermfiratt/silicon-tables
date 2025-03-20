import React, { useState, useEffect } from 'react';
import './LiveDateTime.css';
import axios from 'axios';

const LiveDateTime = () => {
  const [dateTime, setDateTime] = useState(new Date());
  const [marketStatuses, setMarketStatuses] = useState([]); // State for NASDAQ and Hong Kong markets

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDateTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup the interval on component unmount
  }, []);

  // Fetch market statuses
  useEffect(() => {
    const fetchMarketStatuses = async () => {
      const API_URL = `https://www.alphavantage.co/query?function=MARKET_STATUS&apikey=${process.env.REACT_APP_ALPHA_VANTAGE_KEY}`;
      try {
        const response = await axios.get(API_URL);
        const markets = response.data.markets || [];
        // Filter for NASDAQ and Hong Kong markets
        const relevantMarkets = markets.filter(
          (market) =>
            market.primary_exchanges?.includes('NASDAQ') ||
            market.region === 'Hong Kong'
        );
        setMarketStatuses(relevantMarkets);
      } catch (error) {
        console.error('Error fetching market statuses:', error);
      }
    };

    fetchMarketStatuses();
  }, []);

  // Format date to '22 October 2024'
  const formattedDate = dateTime.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  // Format time to show hours, minutes, and seconds in San Jose time
  const formattedTime = dateTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'America/Los_Angeles', // Set timezone to San Jose (Pacific Time)
  });

  return (
    <div className="live-datetime">
      <div className="date-time-container">
        <div className="date">{formattedDate}</div>
        <div className="time">
          <span className="live-indicator"></span> {/* Green dot */}
          <span className="time-text">{formattedTime}</span>
          <span className="location">San Jose, CA</span> {/* Display location next to time */}
        </div>
      </div>
      <div className="market-statuses">
        {marketStatuses.map((market, index) => (
          <div className="market-status" key={index}>
            <div className="market-header">
              {market.region === 'United States' ? 'NASDAQ' : 'Hong Kong'} Market Status
            </div>
            <div className="market-details">
              <span className="market-status-label">
                Status:{" "}
                <span
                  className={
                    market.current_status === "open" ? "market-open" : "market-closed"
                  }
                >
                  {market.current_status === "open" ? "Open" : "Closed"}
                </span>
              </span>
              <span className="market-hours">
                Open: {market.local_open} - Close: {market.local_close}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveDateTime;