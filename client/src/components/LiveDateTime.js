// src/components/LiveDateTime.js
import React, { useState, useEffect } from 'react';
import './LiveDateTime.css';

const LiveDateTime = () => {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDateTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup the interval on component unmount
  }, []);

  // Format date to '22 October 2024'
  const formattedDate = dateTime.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  // Format time to show hours, minutes, and seconds
  const formattedTime = dateTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <div className="live-datetime">
      <div className="date">{formattedDate}</div>
      <div className="time">
        <span className="live-indicator"></span> {/* Green dot */}
        <span className="time-text">{formattedTime}</span>
      </div>
    </div>
  );
};

export default LiveDateTime;
