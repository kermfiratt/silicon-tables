import React, { useEffect, useState, forwardRef } from 'react';
import './PriceMetrics.css';

const PriceMetrics = forwardRef(({ symbol, refs, activeSection }, ref) => {
  const [companyOverview, setCompanyOverview] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dataFetched, setDataFetched] = useState(false); // Track if data has been fetched

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

  // Fetch data only when the section is active and data hasn't been fetched before
  useEffect(() => {
    if (activeSection === 'priceMetrics' && !dataFetched) {
      setDataFetched(true); // Mark data as fetched
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
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading price metrics...</p>
      </div>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  

  return (
    <div className="price-metrics-container" ref={refs.priceMetricsRef}>
      {activeSection === 'priceMetrics' && (
        <section id="price-metrics-section">
          <h3>Price Metrics</h3>

          {/* Valuation Metrics */}
          <div className="metrics-category">
            <h4>Valuation</h4>
            <div className="metrics-blocks">
              <div className="metric-block" style={{ borderLeft: '5px solid #4CAF50' }}>
                <h4 style={{ color: '#4CAF50' }}>Market Cap</h4>
                <p>{formatValue(companyOverview.MarketCapitalization)}</p>
              </div>
              <div className="metric-block" style={{ borderLeft: '5px solid #4CAF50' }}>
                <h4 style={{ color: '#4CAF50' }}>Trailing P/E</h4>
                <p>{companyOverview.TrailingPE}</p>
              </div>
              <div className="metric-block" style={{ borderLeft: '5px solid #4CAF50' }}>
                <h4 style={{ color: '#4CAF50' }}>Forward P/E</h4>
                <p>{companyOverview.ForwardPE}</p>
              </div>
              <div className="metric-block" style={{ borderLeft: '5px solid #4CAF50' }}>
                <h4 style={{ color: '#4CAF50' }}>Price to Sales (TTM)</h4>
                <p>{companyOverview.PriceToSalesRatioTTM}</p>
              </div>
              <div className="metric-block" style={{ borderLeft: '5px solid #4CAF50' }}>
                <h4 style={{ color: '#4CAF50' }}>Price to Book</h4>
                <p>{companyOverview.PriceToBookRatio}</p>
              </div>
              <div className="metric-block" style={{ borderLeft: '5px solid #4CAF50' }}>
                <h4 style={{ color: '#4CAF50' }}>EV/Revenue</h4>
                <p>{companyOverview.EVToRevenue}</p>
              </div>
              <div className="metric-block" style={{ borderLeft: '5px solid #4CAF50' }}>
                <h4 style={{ color: '#4CAF50' }}>EV/EBITDA</h4>
                <p>{companyOverview.EVToEBITDA}</p>
              </div>
            </div>
          </div>

          {/* Dividend Metrics */}
          <div className="metrics-category">
            <h4>Dividends</h4>
            <div className="metrics-blocks">
              <div className="metric-block" style={{ borderLeft: '5px solid #2196F3' }}>
                <h4 style={{ color: '#2196F3' }}>Dividend Per Share</h4>
                <p>{companyOverview.DividendPerShare}</p>
              </div>
              <div className="metric-block" style={{ borderLeft: '5px solid #2196F3' }}>
                <h4 style={{ color: '#2196F3' }}>Dividend Yield</h4>
                <p>{companyOverview.DividendYield}</p>
              </div>
              <div className="metric-block" style={{ borderLeft: '5px solid #2196F3' }}>
                <h4 style={{ color: '#2196F3' }}>Dividend Date</h4>
                <p>{companyOverview.DividendDate}</p>
              </div>
              <div className="metric-block" style={{ borderLeft: '5px solid #2196F3' }}>
                <h4 style={{ color: '#2196F3' }}>Ex-Dividend Date</h4>
                <p>{companyOverview.ExDividendDate}</p>
              </div>
            </div>
          </div>

          {/* Profitability Metrics */}
          <div className="metrics-category">
            <h4>Profitability</h4>
            <div className="metrics-blocks">
              <div className="metric-block" style={{ borderLeft: '5px solid #FF9800' }}>
                <h4 style={{ color: '#FF9800' }}>Profit Margin</h4>
                <p>{companyOverview.ProfitMargin}</p>
              </div>
              <div className="metric-block" style={{ borderLeft: '5px solid #FF9800' }}>
                <h4 style={{ color: '#FF9800' }}>Operating Margin (TTM)</h4>
                <p>{companyOverview.OperatingMarginTTM}</p>
              </div>
              <div className="metric-block" style={{ borderLeft: '5px solid #FF9800' }}>
                <h4 style={{ color: '#FF9800' }}>Return on Assets (TTM)</h4>
                <p>{companyOverview.ReturnOnAssetsTTM}</p>
              </div>
              <div className="metric-block" style={{ borderLeft: '5px solid #FF9800' }}>
                <h4 style={{ color: '#FF9800' }}>Return on Equity (TTM)</h4>
                <p>{companyOverview.ReturnOnEquityTTM}</p>
              </div>
            </div>
          </div>

          {/* Growth Metrics */}
          <div className="metrics-category">
            <h4>Growth</h4>
            <div className="metrics-blocks">
              <div className="metric-block" style={{ borderLeft: '5px solid #9C27B0' }}>
                <h4 style={{ color: '#9C27B0' }}>Quarterly Earnings Growth (YoY)</h4>
                <p>{companyOverview.QuarterlyEarningsGrowthYOY}</p>
              </div>
              <div className="metric-block" style={{ borderLeft: '5px solid #9C27B0' }}>
                <h4 style={{ color: '#9C27B0' }}>Quarterly Revenue Growth (YoY)</h4>
                <p>{companyOverview.QuarterlyRevenueGrowthYOY}</p>
              </div>
            </div>
          </div>

          {/* Analyst Ratings */}
          <div className="metrics-category">
            <h4>Analyst Ratings</h4>
            <div className="metrics-blocks">
              <div className="metric-block" style={{ borderLeft: '5px solid #E91E63' }}>
                <h4 style={{ color: '#E91E63' }}>Analyst Target Price</h4>
                <p>{companyOverview.AnalystTargetPrice}</p>
              </div>
              <div className="metric-block" style={{ borderLeft: '5px solid #E91E63' }}>
                <h4 style={{ color: '#E91E63' }}>Strong Buy</h4>
                <p>{companyOverview.AnalystRatingStrongBuy}</p>
              </div>
              <div className="metric-block" style={{ borderLeft: '5px solid #E91E63' }}>
                <h4 style={{ color: '#E91E63' }}>Buy</h4>
                <p>{companyOverview.AnalystRatingBuy}</p>
              </div>
              <div className="metric-block" style={{ borderLeft: '5px solid #E91E63' }}>
                <h4 style={{ color: '#E91E63' }}>Hold</h4>
                <p>{companyOverview.AnalystRatingHold}</p>
              </div>
              <div className="metric-block" style={{ borderLeft: '5px solid #E91E63' }}>
                <h4 style={{ color: '#E91E63' }}>Sell</h4>
                <p>{companyOverview.AnalystRatingSell}</p>
              </div>
              <div className="metric-block" style={{ borderLeft: '5px solid #E91E63' }}>
                <h4 style={{ color: '#E91E63' }}>Strong Sell</h4>
                <p>{companyOverview.AnalystRatingStrongSell}</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
});

export default PriceMetrics;