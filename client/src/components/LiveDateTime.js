// src/components/LiveDateTime.js
import React, { useState, useEffect } from 'react';

const LiveDateTime = () => {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  return (
    <div className="live-date-time">
      <p>{dateTime.toLocaleDateString()}</p>
      <p>{dateTime.toLocaleTimeString()}</p>
    </div>
  );
};

export default LiveDateTime;
