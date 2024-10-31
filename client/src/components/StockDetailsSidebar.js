// src/components/StockDetailsSidebar.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './StockDetailsSidebar.css';

const StockDetailsSidebar = ({ symbol }) => {
  const [fundamentalData, setFundamentalData] = useState({});
  const API_KEY = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    const fetchFundamentalData = async () => {
      try {
        const response = await axios.get(`https://finnhub.io/api/v1/stock/financials?symbol=${symbol}&token=${API_KEY}`);
        setFundamentalData(response.data);
      } catch (error) {
        console.error("Error fetching fundamental data:", error);
      }
    };

    fetchFundamentalData();
  }, [symbol, API_KEY]);

  return (
    <div className="stock-details-sidebar">
      <h2>{fundamentalData.name || "Şirket İsmi"}</h2>
      <ul>
        <li> Ownership </li>
        <li> Fund Ownership </li>
        <li> Financials </li>
        <li> Revenue Breakdown </li>
        <li> Price Metrics </li>
        <li> Historical Market Cap </li>
        <li> Peers </li>
        {/* Diğer temel veri başlıkları burada yer alabilir */}
      </ul>
    </div>
  );
};

export default StockDetailsSidebar;
