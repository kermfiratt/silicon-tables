import React, { useEffect, useState, useRef } from 'react';
import './StockDetailsSidebar.css';
import Financials from './SidebarDetails/Financials';
import PriceMetrics from './SidebarDetails/PriceMetrics';
import QuarterlyEarnings from './SidebarDetails/QuarterlyEarnings';
import AnnualCashFlow from './SidebarDetails/AnnualCashFlow';
import About from './SidebarDetails/About';
import News from './SidebarDetails/News';
import Report from './SidebarDetails/Report';
import BalanceSheet from './SidebarDetails/BalanceSheet';
import AnnualBalanceSheet from './SidebarDetails/AnnualBalanceSheet';

const StockDetailsSidebar = ({ symbol }) => {
  const [activeSection, setActiveSection] = useState('financials'); // Default to 'financials'
  const [currentPrice, setCurrentPrice] = useState(null);
  const [priceChangePercent, setPriceChangePercent] = useState(null);
  const [latestDate, setLatestDate] = useState(null);

  const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY;

  // Refs for scrolling to sections
  const financialsRef = useRef(null);
  const priceMetricsRef = useRef(null);
  const quarterlyEarningsRef = useRef(null);
  const annualCashFlowRef = useRef(null);
  const aboutRef = useRef(null);
  const newsRef = useRef(null);
  const balanceSheetRef = useRef(null);
  const annualBalanceSheetRef = useRef(null);
  const reportRef = useRef(null);

  // Helper function to map month numbers to month names
  const getMonthName = (monthNumber) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[monthNumber - 1] || '';
  };

  // Helper function to format date as "14 MARCH"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = getMonthName(date.getMonth() + 1).toUpperCase();
    return `${day} ${month}`;
  };

  // Fetch end-of-day data and calculate percentage change
  useEffect(() => {
    const fetchStockData = async () => {
      if (symbol) {
        try {
          const response = await fetch(
            `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`
          );
          const data = await response.json();
          const timeSeries = data['Time Series (Daily)'];
          if (timeSeries) {
            const latestDate = Object.keys(timeSeries)[0];
            const latestData = timeSeries[latestDate];
            const openPrice = parseFloat(latestData['1. open']);
            const closePrice = parseFloat(latestData['4. close']);
            const changePercent = ((closePrice - openPrice) / openPrice) * 100;

            setCurrentPrice(closePrice.toFixed(2));
            setPriceChangePercent(changePercent.toFixed(2));
            setLatestDate(latestDate);
          }
        } catch (error) {
          console.error('Error fetching stock data:', error);
        }
      }
    };

    fetchStockData();
  }, [symbol, API_KEY]);

  // Scroll to the selected section
  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handle sidebar button clicks
  const handleSectionClick = (section, ref) => {
    setActiveSection(section);

    // Only scroll for sections that need it (e.g., not PriceMetrics)
    if (section !== 'priceMetrics') {
      scrollToSection(ref);
    }
  };

  return (
    <div className="stock-details-container">
      {/* Sidebar */}
      <div className="stock-details-sidebar">
        <div className="header-container">
          {/* Company name and price container */}
          <div className="company-name-price">
            <h2 className="company-name name-wrapper">{symbol || 'Company Name'}</h2>
            <div className="price-info price-wrapper">
              <span className="price-value">${currentPrice}</span>
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

          {/* Date wrapper */}
          {latestDate && (
            <div className="date-wrapper">
              {formatDate(latestDate)} END OF DAY PRICE
            </div>
          )}
        </div>

        {/* Sidebar Navigation */}
        <ul>
          <li
            onClick={() => handleSectionClick('financials', financialsRef)}
            className={activeSection === 'financials' ? 'active' : ''}
          >
            Financials
          </li>
          <li
            onClick={() => handleSectionClick('priceMetrics', priceMetricsRef)}
            className={activeSection === 'priceMetrics' ? 'active' : ''}
          >
            Price Metrics
          </li>
          <li
            onClick={() => handleSectionClick('about', aboutRef)}
            className={activeSection === 'about' ? 'active' : ''}
          >
            About
          </li>
          <li
            onClick={() => handleSectionClick('report', reportRef)}
            className={activeSection === 'report' ? 'active' : ''}
          >
            Report
          </li>
          <li
            onClick={() => handleSectionClick('news', newsRef)}
            className={activeSection === 'news' ? 'active' : ''}
          >
            News
          </li>
          <li
            onClick={() => handleSectionClick('quarterlyEarnings', quarterlyEarningsRef)}
            className={activeSection === 'quarterlyEarnings' ? 'active' : ''}
          >
            Quarterly Earnings
          </li>
          <li
            onClick={() => handleSectionClick('annualCashFlow', annualCashFlowRef)}
            className={activeSection === 'annualCashFlow' ? 'active' : ''}
          >
            Annual Cash Flow
          </li>
          <li
            onClick={() => handleSectionClick('balanceSheet', balanceSheetRef)}
            className={activeSection === 'balanceSheet' ? 'active' : ''}
          >
            Balance Sheet
          </li>
          <li
            onClick={() => handleSectionClick('annualBalanceSheet', annualBalanceSheetRef)}
            className={activeSection === 'annualBalanceSheet' ? 'active' : ''}
          >
            Annual Balance Sheet
          </li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="stock-details-content">
        {/* Content Components */}
        <Financials
          symbol={symbol}
          refs={{ financialsRef }}
          activeSection={activeSection}
        />
        <PriceMetrics
          symbol={symbol}
          refs={{ priceMetricsRef }}
          activeSection={activeSection}
        />
        <QuarterlyEarnings
          symbol={symbol}
          refs={{ quarterlyEarningsRef }}
          activeSection={activeSection}
        />
        <AnnualCashFlow
          symbol={symbol}
          refs={{ annualCashFlowRef }}
          activeSection={activeSection}
        />
        <About
          symbol={symbol}
          refs={{ aboutRef }}
          activeSection={activeSection}
        />
        <News
          symbol={symbol}
          refs={{ newsRef }}
          activeSection={activeSection}
        />
        <Report
          symbol={symbol}
          refs={{ reportRef }}
          activeSection={activeSection}
        />
        <BalanceSheet
          symbol={symbol}
          refs={{ balanceSheetRef }}
          activeSection={activeSection}
        />
        <AnnualBalanceSheet
          symbol={symbol}
          refs={{ annualBalanceSheetRef }}
          activeSection={activeSection}
        />
      </div>
    </div>
  );
};

export default StockDetailsSidebar;