import React, { useEffect, useState, forwardRef } from 'react';
import './PriceMetrics.css';

const PriceMetrics = forwardRef(({ symbol, refs, activeSection }, ref) => {
  const [companyOverview, setCompanyOverview] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dataFetched, setDataFetched] = useState(false);

  const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY;

  const formatValue = (value) => {
    if (value === null || value === undefined || isNaN(value)) return 'N/A';
    const absValue = Math.abs(value);
    const sign = value < 0 ? '-' : '';
    if (absValue >= 1e9) return `${sign}${(absValue / 1e9).toFixed(2)}B`;
    if (absValue >= 1e6) return `${sign}${(absValue / 1e6).toFixed(2)}M`;
    if (absValue >= 1e3) return `${sign}${(absValue / 1e3).toFixed(2)}K`;
    return `${sign}${absValue.toLocaleString()}`;
  };

  useEffect(() => {
    if (activeSection === 'priceMetrics' && !dataFetched) {
      setDataFetched(true);
      fetchCompanyOverview();
    }
  }, [activeSection, dataFetched]);

  const fetchCompanyOverview = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`
      );
      const data = await response.json();

      if (data && data.Symbol) {
        setCompanyOverview(data);
      } else {
        throw new Error('No data available');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching company overview:', error);
      setError('Failed to load price metrics.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pm-loading-container">
        <div className="pm-loading-spinner"></div>
        <p className="pm-loading-text">Loading price metrics...</p>
      </div>
    );
  }

  if (error) {
    return <p className="pm-error-message">{error}</p>;
  }

  // Only render the component if the active section is 'priceMetrics'
  if (activeSection !== 'priceMetrics') {
    return null;
  }

  return (
    <div className="pm-container" ref={refs.priceMetricsRef}>
      <section id="price-metrics-section">
        <h3 className="pm-title">Price Metrics</h3>

        {/* Valuation Metrics */}
        <div className="pm-category">
          <h4 className="pm-category-title">Valuation</h4>
          <div className="pm-blocks">
            <div className="pm-block" style={{ borderLeft: '6px solid #4CAF50' }}>
              <h4>Market Cap</h4>
              <p>{formatValue(companyOverview.MarketCapitalization)}</p>
            </div>
            <div className="pm-block" style={{ borderLeft: '6px solid #4CAF50' }}>
              <h4>Trailing P/E</h4>
              <p>{companyOverview.TrailingPE || 'N/A'}</p>
            </div>
            <div className="pm-block" style={{ borderLeft: '6px solid #4CAF50' }}>
              <h4>Forward P/E</h4>
              <p>{companyOverview.ForwardPE || 'N/A'}</p>
            </div>
            <div className="pm-block" style={{ borderLeft: '6px solid #4CAF50' }}>
              <h4>Price to Sales (TTM)</h4>
              <p>{companyOverview.PriceToSalesRatioTTM || 'N/A'}</p>
            </div>
            <div className="pm-block" style={{ borderLeft: '6px solid #4CAF50' }}>
              <h4>Price to Book</h4>
              <p>{companyOverview.PriceToBookRatio || 'N/A'}</p>
            </div>
            <div className="pm-block" style={{ borderLeft: '6px solid #4CAF50' }}>
              <h4>EV/Revenue</h4>
              <p>{companyOverview.EVToRevenue || 'N/A'}</p>
            </div>
            <div className="pm-block" style={{ borderLeft: '6px solid #4CAF50' }}>
              <h4>EV/EBITDA</h4>
              <p>{companyOverview.EVToEBITDA || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Dividend Metrics */}
        <div className="pm-category">
          <h4 className="pm-category-title">Dividends</h4>
          <div className="pm-blocks">
            <div className="pm-block" style={{ borderLeft: '6px solid #2196F3' }}>
              <h4>Dividend Per Share</h4>
              <p>{companyOverview.DividendPerShare || 'N/A'}</p>
            </div>
            <div className="pm-block" style={{ borderLeft: '6px solid #2196F3' }}>
              <h4>Dividend Yield</h4>
              <p>{companyOverview.DividendYield || 'N/A'}</p>
            </div>
            <div className="pm-block" style={{ borderLeft: '6px solid #2196F3' }}>
              <h4>Dividend Date</h4>
              <p>{companyOverview.DividendDate || 'N/A'}</p>
            </div>
            <div className="pm-block" style={{ borderLeft: '6px solid #2196F3' }}>
              <h4>Ex-Dividend Date</h4>
              <p>{companyOverview.ExDividendDate || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Profitability Metrics */}
        <div className="pm-category">
          <h4 className="pm-category-title">Profitability</h4>
          <div className="pm-blocks">
            <div className="pm-block" style={{ borderLeft: '6px solid #FF9800' }}>
              <h4>Profit Margin</h4>
              <p>{companyOverview.ProfitMargin || 'N/A'}</p>
            </div>
            <div className="pm-block" style={{ borderLeft: '6px solid #FF9800' }}>
              <h4>Operating Margin (TTM)</h4>
              <p>{companyOverview.OperatingMarginTTM || 'N/A'}</p>
            </div>
            <div className="pm-block" style={{ borderLeft: '6px solid #FF9800' }}>
              <h4>Return on Assets (TTM)</h4>
              <p>{companyOverview.ReturnOnAssetsTTM || 'N/A'}</p>
            </div>
            <div className="pm-block" style={{ borderLeft: '6px solid #FF9800' }}>
              <h4>Return on Equity (TTM)</h4>
              <p>{companyOverview.ReturnOnEquityTTM || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Growth Metrics */}
        <div className="pm-category">
          <h4 className="pm-category-title">Growth</h4>
          <div className="pm-blocks">
            <div className="pm-block" style={{ borderLeft: '6px solid #9C27B0' }}>
              <h4>Quarterly Earnings Growth (YoY)</h4>
              <p>{companyOverview.QuarterlyEarningsGrowthYOY || 'N/A'}</p>
            </div>
            <div className="pm-block" style={{ borderLeft: '6px solid #9C27B0' }}>
              <h4>Quarterly Revenue Growth (YoY)</h4>
              <p>{companyOverview.QuarterlyRevenueGrowthYOY || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Analyst Ratings */}
        <div className="pm-category">
          <h4 className="pm-category-title">Analyst Ratings</h4>
          <div className="pm-blocks">
            <div className="pm-block" style={{ borderLeft: '6px solid #E91E63' }}>
              <h4>Analyst Target Price</h4>
              <p>{companyOverview.AnalystTargetPrice || 'N/A'}</p>
            </div>
            <div className="pm-block" style={{ borderLeft: '6px solid #E91E63' }}>
              <h4>Strong Buy</h4>
              <p>{companyOverview.AnalystRatingStrongBuy || 'N/A'}</p>
            </div>
            <div className="pm-block" style={{ borderLeft: '6px solid #E91E63' }}>
              <h4>Buy</h4>
              <p>{companyOverview.AnalystRatingBuy || 'N/A'}</p>
            </div>
            <div className="pm-block" style={{ borderLeft: '6px solid #E91E63' }}>
              <h4>Hold</h4>
              <p>{companyOverview.AnalystRatingHold || 'N/A'}</p>
            </div>
            <div className="pm-block" style={{ borderLeft: '6px solid #E91E63' }}>
              <h4>Sell</h4>
              <p>{companyOverview.AnalystRatingSell || 'N/A'}</p>
            </div>
            <div className="pm-block" style={{ borderLeft: '6px solid #E91E63' }}>
              <h4>Strong Sell</h4>
              <p>{companyOverview.AnalystRatingStrongSell || 'N/A'}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
});

export default PriceMetrics;