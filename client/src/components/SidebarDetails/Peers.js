// src/components/SidebarDetails/Peers.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Peers.css';

const Peers = ({ symbol, setView }) => {
  const [peersData, setPeersData] = useState([]);

  const API_KEY = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    const fetchPeersData = async () => {
      try {
        const response = await axios.get(`https://finnhub.io/api/v1/stock/peers?symbol=${symbol}&token=${API_KEY}`);
        setPeersData(response.data || ["AAPL", "MSFT", "GOOGL", "AMZN"]); // Placeholder data
      } catch (error) {
        console.error("Error fetching peers data:", error);
        setPeersData(["AAPL", "MSFT", "GOOGL", "AMZN"]); // Fallback placeholder data
      }
    };

    fetchPeersData();
  }, [symbol, API_KEY]);

  return (
    <div className="peers-block">
      <div className="switch-container">
        <button onClick={() => setView('general')} className="switch-option">General</button>
        <button onClick={() => setView('stock')} className="switch-option">Stock</button>
      </div>
      <h3>Company Peers</h3>
      <div className="peers-list">
        {peersData.map((peer, index) => (
          <div key={index} className="peer-item">
            {peer}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Peers;
