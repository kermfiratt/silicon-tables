// src/components/StockDetailsSidebar.js
import React, { useEffect, useState } from 'react';
import './StockDetailsSidebar.css';

const StockDetailsSidebar = ({
  symbol,
  setOwnershipView,
  setFundOwnershipView,
  setFinancialsView,
  setRevenueBreakdownView,
  setPriceMetricsView,
  setHistoricalMarketCapView,
  setPeersView,
  activeSection,
}) => {
  const [companyLogo, setCompanyLogo] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [priceChangePercent, setPriceChangePercent] = useState(null);

  const API_KEY = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    // Fetch company logo and price
    const fetchCompanyDetails = async () => {
      if (symbol) {
        try {
          const logoResponse = await fetch(
            `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${API_KEY}`
          );
          const logoData = await logoResponse.json();
          setCompanyLogo(logoData.logo);

          const priceResponse = await fetch(
            ``
          );
          const priceData = await priceResponse.json();
          setCurrentPrice(priceData.c?.toFixed(2));
          setPriceChangePercent(priceData.dp?.toFixed(2));
        } catch (error) {
          console.error('Error fetching company details:', error);
        }
      }
    };

    fetchCompanyDetails();
  }, [symbol, API_KEY]);

  return (
    <div className="stock-details-sidebar">
      <div className="header-container">
        {companyLogo && <img src={companyLogo} alt={`${symbol} logo`} className="company-logo" />}
        <h2 className="company-name">{symbol || 'Şirket İsmi'}</h2>
        
      </div>
      <ul>
        <li
          onClick={setOwnershipView}
          className={activeSection === 'ownership' ? 'active' : ''}
        >
          Ownership
        </li>
        <li
          onClick={setFundOwnershipView}
          className={activeSection === 'fundOwnership' ? 'active' : ''}
        >
          Fund Ownership
        </li>
        <li
          onClick={setFinancialsView}
          className={activeSection === 'financials' ? 'active' : ''}
        >
          Financials
        </li>
        <li
          onClick={setRevenueBreakdownView}
          className={activeSection === 'revenueBreakdown' ? 'active' : ''}
        >
          Revenue Breakdown
        </li>
        <li
          onClick={setPriceMetricsView}
          className={activeSection === 'priceMetrics' ? 'active' : ''}
        >
          Price Metrics
        </li>
        <li
          onClick={setHistoricalMarketCapView}
          className={activeSection === 'historicalMarketCap' ? 'active' : ''}
        >
          Historical Market Cap
        </li>
        <li
          onClick={setPeersView}
          className={activeSection === 'peers' ? 'active' : ''}
        >
          Peers
        </li>
      </ul>
    </div>
  );
};

export default StockDetailsSidebar;
