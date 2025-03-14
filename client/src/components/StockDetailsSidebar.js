import React, { useState, useEffect, useRef } from 'react';
import './StockDetailsSidebar.css';
import Financials from './SidebarDetails/Financials';
import PriceMetrics from './SidebarDetails/PriceMetrics'; // Import the PriceMetrics component
import QuarterlyEarnings from './SidebarDetails/QuarterlyEarnings';
import AnnualCashFlow from './SidebarDetails/AnnualCashFlow';
import About from './SidebarDetails/About';
import News from './SidebarDetails/News';
import Report from './SidebarDetails/Report';
import BalanceSheet from './SidebarDetails/BalanceSheet';
import AnnualBalanceSheet from './SidebarDetails/AnnualBalanceSheet';

const StockDetailsSidebar = ({ symbol }) => {
  const [activeSection, setActiveSection] = useState('financials'); // Default to 'financials'
  const [companyLogo, setCompanyLogo] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [priceChangePercent, setPriceChangePercent] = useState(null);

  const API_KEY = process.env.REACT_APP_API_KEY;
  const FINNHUB_API_KEY = process.env.REACT_APP_FINNHUB_API_KEY;

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

  // Fetch company logo and price data
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      if (symbol) {
        try {
          // Fetch company logo using Finnhub
          const logoResponse = await fetch(
            `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`
          );
          const logoData = await logoResponse.json();
          setCompanyLogo(logoData.logo);

          // Fetch current price and price change using Alpha Vantage
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
  }, [symbol, API_KEY, FINNHUB_API_KEY]);

  // Scroll to the selected section
  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handle sidebar button clicks
  const handleSectionClick = (section, ref) => {
    setActiveSection(section);
    scrollToSection(ref);
  };

  return (
    <div className="stock-details-container">
      {/* Sidebar */}
      <div className="stock-details-sidebar">
        <div className="header-container">
          {companyLogo && <img src={companyLogo} alt={`${symbol} logo`} className="company-logo" />}
          <h2 className="company-name">{symbol || 'Company Name'}</h2>
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
            onClick={() => handleSectionClick('about', aboutRef)}
            className={activeSection === 'about' ? 'active' : ''}
          >
            About
          </li>
          <li
            onClick={() => handleSectionClick('news', newsRef)}
            className={activeSection === 'news' ? 'active' : ''}
          >
            News
          </li>
          <li
            onClick={() => handleSectionClick('report', reportRef)}
            className={activeSection === 'report' ? 'active' : ''}
          >
            Report
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


        <Financials
          symbol={symbol}
          refs={{
            financialsRef
          }}
          activeSection={activeSection}
        />


        <PriceMetrics
          symbol={symbol}
          refs={{
            priceMetricsRef,
          }}
          activeSection={activeSection}
        />



        <QuarterlyEarnings
          symbol={symbol}
          refs={{          
            quarterlyEarningsRef,
          }}
          activeSection={activeSection}
        />

        
         <AnnualCashFlow
          symbol={symbol}
          refs={{
            annualCashFlowRef,
          }}
          activeSection={activeSection}
        />


         <About
          symbol={symbol}
          refs={{
            aboutRef,
          }}
          activeSection={activeSection}
        />


         <News
          symbol={symbol}
          refs={{
            newsRef,
          }}
          activeSection={activeSection}
        />


        <Report
          symbol={symbol}
          refs={{
            reportRef,
          }}
          activeSection={activeSection}
        />



        <BalanceSheet
          symbol={symbol}
          refs={{
            balanceSheetRef,
          }}
          activeSection={activeSection}
        />



        <AnnualBalanceSheet
          symbol={symbol}
          refs={{
            annualBalanceSheetRef,
          }}
          activeSection={activeSection}
        />

        
      </div>
    </div>
  );
};

export default StockDetailsSidebar;