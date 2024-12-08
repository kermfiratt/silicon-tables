// src/components/StockDetailsSidebar.js
import React, { useEffect, useState } from 'react';
import './StockDetailsSidebar.css';

const StockDetailsSidebar = ({
  symbol,
  setFinancialsView,
  setNewsView, // Added for News View
}) => {
  const [activeSectionState, setActiveSectionState] = useState('financials'); // Default to 'financials'
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
            `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
          );
          const priceData = await priceResponse.json();
          const globalQuote = priceData['Global Quote'];
          if (globalQuote) {
            setCurrentPrice(parseFloat(globalQuote['05. price']).toFixed(2));
            setPriceChangePercent(parseFloat(globalQuote['10. change percent']).toFixed(2));
          }
        } catch (error) {
          console.error('Error fetching company details:', error);
        }
      }
    };

    fetchCompanyDetails();
  }, [symbol, API_KEY]);

  // Handle scrolling when activeSectionState changes
  useEffect(() => {
    switch (activeSectionState) {
      case 'financials':
        // Scroll to the top of the page for financials
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setFinancialsView();
        break;
      case 'priceMetrics':
        const priceMetricsSection = document.getElementById('price-metrics-section');
        if (priceMetricsSection) {
          const offset = 100; // Adjust offset for better alignment
          const yPosition = priceMetricsSection.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: yPosition, behavior: 'smooth' });
        }
        break;
      case 'about':
        const aboutSection = document.getElementById('about-section');
        if (aboutSection) {
          aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
        break;
      case 'news':
        setNewsView(); // Activate News View
        break;
      default:
        // Default to financials scrolling behavior
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setFinancialsView();
        break;
    }
  }, [activeSectionState, setFinancialsView, setNewsView]);

  return (
    <div className="stock-details-sidebar">
      <div className="header-container">
        {companyLogo && <img src={companyLogo} alt={`${symbol} logo`} className="company-logo" />}
        <h2 className="company-name">{symbol || 'Şirket İsmi'}</h2>
        <div>
          <span className="price-value">{currentPrice}</span>
          {priceChangePercent && (
            <span
              className={`price-change ${
                priceChangePercent > 0 ? 'positive' : 'negative'
              }`}
            >
              {priceChangePercent > 0 ? '+' : ''}
              {priceChangePercent}%
            </span>
          )}
        </div>
      </div>
      <ul>
        <li
          onClick={() => setActiveSectionState('financials')}
          className={activeSectionState === 'financials' ? 'active' : ''}
        >
          Financials
        </li>
        <li
          onClick={() => setActiveSectionState('priceMetrics')}
          className={activeSectionState === 'priceMetrics' ? 'active' : ''}
        >
          Price Metrics
        </li>
        <li
          onClick={() => setActiveSectionState('about')}
          className={activeSectionState === 'about' ? 'active' : ''}
        >
          About
        </li>
        <li
          onClick={() => setActiveSectionState('news')}
          className={activeSectionState === 'news' ? 'active' : ''}
        >
          News
        </li>
        {/* Commented out for now */}
        {/* 
        <li
          onClick={() => setActiveSectionState('ownership')}
          className={activeSectionState === 'ownership' ? 'active' : ''}
        >
          Ownership
        </li>
        <li
          onClick={() => setActiveSectionState('fundOwnership')}
          className={activeSectionState === 'fundOwnership' ? 'active' : ''}
        >
          Fund Ownership
        </li>
        <li
          onClick={() => setActiveSectionState('revenueBreakdown')}
          className={activeSectionState === 'revenueBreakdown' ? 'active' : ''}
        >
          Revenue Breakdown
        </li>
        <li
          onClick={() => setActiveSectionState('historicalMarketCap')}
          className={activeSectionState === 'historicalMarketCap' ? 'active' : ''}
        >
          Historical Market Cap
        </li>
        <li
          onClick={() => setActiveSectionState('peers')}
          className={activeSectionState === 'peers' ? 'active' : ''}
        >
          Peers
        </li>
        */}
      </ul>
    </div>
  );
};

export default StockDetailsSidebar;
