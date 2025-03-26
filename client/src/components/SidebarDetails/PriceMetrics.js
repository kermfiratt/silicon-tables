import React, { useEffect, useState, forwardRef } from 'react';
import './PriceMetrics.css';

const metricExplanations = {
  MarketCapitalization: "Total market value of a company's outstanding shares. Calculated as share price times shares outstanding.",
  TrailingPE: "Price-to-Earnings ratio using the last 12 months of earnings. Shows how much investors pay for each dollar of earnings.",
  ForwardPE: "Price-to-Earnings ratio using forecasted earnings for next 12 months. Indicates expected future earnings growth.",
  PriceToSalesRatioTTM: "Price-to-Sales ratio using trailing twelve month revenue. Measures value relative to sales.",
  PriceToBookRatio: "Compares market value to book value. Indicates how much shareholders pay for net assets.",
  EVToRevenue: "Enterprise Value to Revenue ratio. Measures total company value relative to sales.",
  EVToEBITDA: "Enterprise Value to EBITDA. Measures company value relative to earnings before interest, taxes, depreciation, and amortization.",
  DividendPerShare: "Annual dividend payment per share declared by the company.",
  DividendYield: "Annual dividend payment divided by stock price, shown as percentage.",
  DividendDate: "Date when dividend is paid to shareholders.",
  ExDividendDate: "Cut-off date to receive the next dividend payment.",
  ProfitMargin: "Net income divided by revenue. Shows percentage of revenue that becomes profit.",
  OperatingMarginTTM: "Operating income divided by revenue for trailing twelve months. Measures operational efficiency.",
  ReturnOnAssetsTTM: "Net income relative to total assets. Shows how efficiently assets generate profit.",
  ReturnOnEquityTTM: "Net income relative to shareholders' equity. Measures profitability from shareholders' perspective.",
  QuarterlyEarningsGrowthYOY: "Percentage growth in earnings compared to same quarter previous year.",
  QuarterlyRevenueGrowthYOY: "Percentage growth in revenue compared to same quarter previous year.",
  AnalystTargetPrice: "Average price target set by analysts covering the stock.",
  AnalystRatingStrongBuy: "Number of analysts recommending 'Strong Buy'.",
  AnalystRatingBuy: "Number of analysts recommending 'Buy'.",
  AnalystRatingHold: "Number of analysts recommending 'Hold'.",
  AnalystRatingSell: "Number of analysts recommending 'Sell'.",
  AnalystRatingStrongSell: "Number of analysts recommending 'Strong Sell'."
};

const PriceMetrics = forwardRef(({ symbol, refs, activeSection }, ref) => {
  const [companyOverview, setCompanyOverview] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dataFetched, setDataFetched] = useState(false);
  const [flippedCards, setFlippedCards] = useState({});

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

  const handleCardFlip = (metric, e) => {
    e.stopPropagation();
    setFlippedCards(prev => ({
      ...prev,
      [metric]: !prev[metric]
    }));
  };

  const handleCardClick = (metric) => {
    if (flippedCards[metric]) {
      setFlippedCards(prev => ({
        ...prev,
        [metric]: false
      }));
    }
  };

  if (loading) {
    return (
      <div className="pm-loading-overlay">
        <div className="loader"></div>
        <p className="pm-loading-text">Loading price metrics...</p>
      </div>
    );
  }

  if (error) {
    return <p className="pm-error-message">{error}</p>;
  }

  if (activeSection !== 'priceMetrics') {
    return null;
  }

  return (
    <div className="pm-container" ref={refs.priceMetricsRef}>
      <section id="price-metrics-section">
        {/* Company Name for Phone Size */}
        <div className="pm-company-name-mobile">
          {companyOverview.Name || 'N/A'}
        </div>

        <h3 className="pm-title">Price Metrics</h3>

        {/* Valuation Metrics */}
        <div className="pm-category">
          <h4 className="pm-category-title">Valuation</h4>
          <div className="pm-blocks">
            <div 
              className={`pm-block ${flippedCards.MarketCapitalization ? 'flipped' : ''}`} 
              style={{ '--pm-border-color': '#4299e1' }}
              onClick={() => handleCardClick('MarketCapitalization')}
            >
              <div className="pm-block-inner">
                <div className="pm-block-front">
                  <button 
                    className="pm-info-icon" 
                    onClick={(e) => handleCardFlip('MarketCapitalization', e)}
                    aria-label="Market Cap explanation"
                  >
                    i
                  </button>
                  <h4>Market Cap</h4>
                  <p>{formatValue(companyOverview.MarketCapitalization)}</p>
                </div>
                <div className="pm-block-back">
                  <div className="pm-explanation">
                    <p>{metricExplanations.MarketCapitalization}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* All other blocks follow the same pattern */}
            {/* Trailing P/E */}
            <div 
              className={`pm-block ${flippedCards.TrailingPE ? 'flipped' : ''}`} 
              style={{ '--pm-border-color': '#4299e1' }}
              onClick={() => handleCardClick('TrailingPE')}
            >
              <div className="pm-block-inner">
                <div className="pm-block-front">
                  <button 
                    className="pm-info-icon" 
                    onClick={(e) => handleCardFlip('TrailingPE', e)}
                    aria-label="Trailing P/E explanation"
                  >
                    i
                  </button>
                  <h4>Trailing P/E</h4>
                  <p>{companyOverview.TrailingPE || 'N/A'}</p>
                </div>
                <div className="pm-block-back">
                  <div className="pm-explanation">
                    <p>{metricExplanations.TrailingPE}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Forward P/E */}
            <div 
              className={`pm-block ${flippedCards.ForwardPE ? 'flipped' : ''}`} 
              style={{ '--pm-border-color': '#4299e1' }}
              onClick={() => handleCardClick('ForwardPE')}
            >
              <div className="pm-block-inner">
                <div className="pm-block-front">
                  <button 
                    className="pm-info-icon" 
                    onClick={(e) => handleCardFlip('ForwardPE', e)}
                    aria-label="Forward P/E explanation"
                  >
                    i
                  </button>
                  <h4>Forward P/E</h4>
                  <p>{companyOverview.ForwardPE || 'N/A'}</p>
                </div>
                <div className="pm-block-back">
                  <div className="pm-explanation">
                    <p>{metricExplanations.ForwardPE}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Price to Sales (TTM) */}
            <div 
              className={`pm-block ${flippedCards.PriceToSalesRatioTTM ? 'flipped' : ''}`} 
              style={{ '--pm-border-color': '#4299e1' }}
              onClick={() => handleCardClick('PriceToSalesRatioTTM')}
            >
              <div className="pm-block-inner">
                <div className="pm-block-front">
                  <button 
                    className="pm-info-icon" 
                    onClick={(e) => handleCardFlip('PriceToSalesRatioTTM', e)}
                    aria-label="Price to Sales explanation"
                  >
                    i
                  </button>
                  <h4>Price to Sales (TTM)</h4>
                  <p>{companyOverview.PriceToSalesRatioTTM || 'N/A'}</p>
                </div>
                <div className="pm-block-back">
                  <div className="pm-explanation">
                    <p>{metricExplanations.PriceToSalesRatioTTM}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Price to Book */}
            <div 
              className={`pm-block ${flippedCards.PriceToBookRatio ? 'flipped' : ''}`} 
              style={{ '--pm-border-color': '#4299e1' }}
              onClick={() => handleCardClick('PriceToBookRatio')}
            >
              <div className="pm-block-inner">
                <div className="pm-block-front">
                  <button 
                    className="pm-info-icon" 
                    onClick={(e) => handleCardFlip('PriceToBookRatio', e)}
                    aria-label="Price to Book explanation"
                  >
                    i
                  </button>
                  <h4>Price to Book</h4>
                  <p>{companyOverview.PriceToBookRatio || 'N/A'}</p>
                </div>
                <div className="pm-block-back">
                  <div className="pm-explanation">
                    <p>{metricExplanations.PriceToBookRatio}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* EV/Revenue */}
            <div 
              className={`pm-block ${flippedCards.EVToRevenue ? 'flipped' : ''}`} 
              style={{ '--pm-border-color': '#4299e1' }}
              onClick={() => handleCardClick('EVToRevenue')}
            >
              <div className="pm-block-inner">
                <div className="pm-block-front">
                  <button 
                    className="pm-info-icon" 
                    onClick={(e) => handleCardFlip('EVToRevenue', e)}
                    aria-label="EV/Revenue explanation"
                  >
                    i
                  </button>
                  <h4>EV/Revenue</h4>
                  <p>{companyOverview.EVToRevenue || 'N/A'}</p>
                </div>
                <div className="pm-block-back">
                  <div className="pm-explanation">
                    <p>{metricExplanations.EVToRevenue}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* EV/EBITDA */}
            <div 
              className={`pm-block ${flippedCards.EVToEBITDA ? 'flipped' : ''}`} 
              style={{ '--pm-border-color': '#4299e1' }}
              onClick={() => handleCardClick('EVToEBITDA')}
            >
              <div className="pm-block-inner">
                <div className="pm-block-front">
                  <button 
                    className="pm-info-icon" 
                    onClick={(e) => handleCardFlip('EVToEBITDA', e)}
                    aria-label="EV/EBITDA explanation"
                  >
                    i
                  </button>
                  <h4>EV/EBITDA</h4>
                  <p>{companyOverview.EVToEBITDA || 'N/A'}</p>
                </div>
                <div className="pm-block-back">
                  <div className="pm-explanation">
                    <p>{metricExplanations.EVToEBITDA}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dividend Metrics */}
        <div className="pm-category">
          <h4 className="pm-category-title">Dividends</h4>
          <div className="pm-blocks">
            <div 
              className={`pm-block ${flippedCards.DividendPerShare ? 'flipped' : ''}`} 
              style={{ '--pm-border-color': '#38b2ac' }}
              onClick={() => handleCardClick('DividendPerShare')}
            >
              <div className="pm-block-inner">
                <div className="pm-block-front">
                  <button 
                    className="pm-info-icon" 
                    onClick={(e) => handleCardFlip('DividendPerShare', e)}
                    aria-label="Dividend Per Share explanation"
                  >
                    i
                  </button>
                  <h4>Dividend Per Share</h4>
                  <p>{companyOverview.DividendPerShare || 'N/A'}</p>
                </div>
                <div className="pm-block-back">
                  <div className="pm-explanation">
                    <p>{metricExplanations.DividendPerShare}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Other dividend blocks follow same pattern */}
            {/* Dividend Yield */}
            <div 
              className={`pm-block ${flippedCards.DividendYield ? 'flipped' : ''}`} 
              style={{ '--pm-border-color': '#38b2ac' }}
              onClick={() => handleCardClick('DividendYield')}
            >
              <div className="pm-block-inner">
                <div className="pm-block-front">
                  <button 
                    className="pm-info-icon" 
                    onClick={(e) => handleCardFlip('DividendYield', e)}
                    aria-label="Dividend Yield explanation"
                  >
                    i
                  </button>
                  <h4>Dividend Yield</h4>
                  <p>{companyOverview.DividendYield || 'N/A'}</p>
                </div>
                <div className="pm-block-back">
                  <div className="pm-explanation">
                    <p>{metricExplanations.DividendYield}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dividend Date */}
            <div 
              className={`pm-block ${flippedCards.DividendDate ? 'flipped' : ''}`} 
              style={{ '--pm-border-color': '#38b2ac' }}
              onClick={() => handleCardClick('DividendDate')}
            >
              <div className="pm-block-inner">
                <div className="pm-block-front">
                  <button 
                    className="pm-info-icon" 
                    onClick={(e) => handleCardFlip('DividendDate', e)}
                    aria-label="Dividend Date explanation"
                  >
                    i
                  </button>
                  <h4>Dividend Date</h4>
                  <p>{companyOverview.DividendDate || 'N/A'}</p>
                </div>
                <div className="pm-block-back">
                  <div className="pm-explanation">
                    <p>{metricExplanations.DividendDate}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ex-Dividend Date */}
            <div 
              className={`pm-block ${flippedCards.ExDividendDate ? 'flipped' : ''}`} 
              style={{ '--pm-border-color': '#38b2ac' }}
              onClick={() => handleCardClick('ExDividendDate')}
            >
              <div className="pm-block-inner">
                <div className="pm-block-front">
                  <button 
                    className="pm-info-icon" 
                    onClick={(e) => handleCardFlip('ExDividendDate', e)}
                    aria-label="Ex-Dividend Date explanation"
                  >
                    i
                  </button>
                  <h4>Ex-Dividend Date</h4>
                  <p>{companyOverview.ExDividendDate || 'N/A'}</p>
                </div>
                <div className="pm-block-back">
                  <div className="pm-explanation">
                    <p>{metricExplanations.ExDividendDate}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profitability Metrics */}
        <div className="pm-category">
          <h4 className="pm-category-title">Profitability</h4>
          <div className="pm-blocks">
            <div 
              className={`pm-block ${flippedCards.ProfitMargin ? 'flipped' : ''}`} 
              style={{ '--pm-border-color': '#48bb78' }}
              onClick={() => handleCardClick('ProfitMargin')}
            >
              <div className="pm-block-inner">
                <div className="pm-block-front">
                  <button 
                    className="pm-info-icon" 
                    onClick={(e) => handleCardFlip('ProfitMargin', e)}
                    aria-label="Profit Margin explanation"
                  >
                    i
                  </button>
                  <h4>Profit Margin</h4>
                  <p>{companyOverview.ProfitMargin || 'N/A'}</p>
                </div>
                <div className="pm-block-back">
                  <div className="pm-explanation">
                    <p>{metricExplanations.ProfitMargin}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Other profitability blocks follow same pattern */}
            {/* Operating Margin (TTM) */}
            <div 
              className={`pm-block ${flippedCards.OperatingMarginTTM ? 'flipped' : ''}`} 
              style={{ '--pm-border-color': '#48bb78' }}
              onClick={() => handleCardClick('OperatingMarginTTM')}
            >
              <div className="pm-block-inner">
                <div className="pm-block-front">
                  <button 
                    className="pm-info-icon" 
                    onClick={(e) => handleCardFlip('OperatingMarginTTM', e)}
                    aria-label="Operating Margin explanation"
                  >
                    i
                  </button>
                  <h4>Operating Margin (TTM)</h4>
                  <p>{companyOverview.OperatingMarginTTM || 'N/A'}</p>
                </div>
                <div className="pm-block-back">
                  <div className="pm-explanation">
                    <p>{metricExplanations.OperatingMarginTTM}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Return on Assets (TTM) */}
            <div 
              className={`pm-block ${flippedCards.ReturnOnAssetsTTM ? 'flipped' : ''}`} 
              style={{ '--pm-border-color': '#48bb78' }}
              onClick={() => handleCardClick('ReturnOnAssetsTTM')}
            >
              <div className="pm-block-inner">
                <div className="pm-block-front">
                  <button 
                    className="pm-info-icon" 
                    onClick={(e) => handleCardFlip('ReturnOnAssetsTTM', e)}
                    aria-label="Return on Assets explanation"
                  >
                    i
                  </button>
                  <h4>Return on Assets (TTM)</h4>
                  <p>{companyOverview.ReturnOnAssetsTTM || 'N/A'}</p>
                </div>
                <div className="pm-block-back">
                  <div className="pm-explanation">
                    <p>{metricExplanations.ReturnOnAssetsTTM}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Return on Equity (TTM) */}
            <div 
              className={`pm-block ${flippedCards.ReturnOnEquityTTM ? 'flipped' : ''}`} 
              style={{ '--pm-border-color': '#48bb78' }}
              onClick={() => handleCardClick('ReturnOnEquityTTM')}
            >
              <div className="pm-block-inner">
                <div className="pm-block-front">
                  <button 
                    className="pm-info-icon" 
                    onClick={(e) => handleCardFlip('ReturnOnEquityTTM', e)}
                    aria-label="Return on Equity explanation"
                  >
                    i
                  </button>
                  <h4>Return on Equity (TTM)</h4>
                  <p>{companyOverview.ReturnOnEquityTTM || 'N/A'}</p>
                </div>
                <div className="pm-block-back">
                  <div className="pm-explanation">
                    <p>{metricExplanations.ReturnOnEquityTTM}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Growth Metrics */}
        <div className="pm-category">
          <h4 className="pm-category-title">Growth</h4>
          <div className="pm-blocks">
            <div 
              className={`pm-block ${flippedCards.QuarterlyEarningsGrowthYOY ? 'flipped' : ''}`} 
              style={{ '--pm-border-color': '#9f7aea' }}
              onClick={() => handleCardClick('QuarterlyEarningsGrowthYOY')}
            >
              <div className="pm-block-inner">
                <div className="pm-block-front">
                  <button 
                    className="pm-info-icon" 
                    onClick={(e) => handleCardFlip('QuarterlyEarningsGrowthYOY', e)}
                    aria-label="Quarterly Earnings Growth explanation"
                  >
                    i
                  </button>
                  <h4>Quarterly Earnings Growth (YoY)</h4>
                  <p>{companyOverview.QuarterlyEarningsGrowthYOY || 'N/A'}</p>
                </div>
                <div className="pm-block-back">
                  <div className="pm-explanation">
                    <p>{metricExplanations.QuarterlyEarningsGrowthYOY}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quarterly Revenue Growth (YoY) */}
            <div 
              className={`pm-block ${flippedCards.QuarterlyRevenueGrowthYOY ? 'flipped' : ''}`} 
              style={{ '--pm-border-color': '#9f7aea' }}
              onClick={() => handleCardClick('QuarterlyRevenueGrowthYOY')}
            >
              <div className="pm-block-inner">
                <div className="pm-block-front">
                  <button 
                    className="pm-info-icon" 
                    onClick={(e) => handleCardFlip('QuarterlyRevenueGrowthYOY', e)}
                    aria-label="Quarterly Revenue Growth explanation"
                  >
                    i
                  </button>
                  <h4>Quarterly Revenue Growth (YoY)</h4>
                  <p>{companyOverview.QuarterlyRevenueGrowthYOY || 'N/A'}</p>
                </div>
                <div className="pm-block-back">
                  <div className="pm-explanation">
                    <p>{metricExplanations.QuarterlyRevenueGrowthYOY}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analyst Ratings */}
        <div className="pm-category">
          <h4 className="pm-category-title">Analyst Ratings</h4>
          <div className="pm-blocks">
            <div 
              className={`pm-block ${flippedCards.AnalystTargetPrice ? 'flipped' : ''}`} 
              style={{ '--pm-border-color': '#ed64a6' }}
              onClick={() => handleCardClick('AnalystTargetPrice')}
            >
              <div className="pm-block-inner">
                <div className="pm-block-front">
                  <button 
                    className="pm-info-icon" 
                    onClick={(e) => handleCardFlip('AnalystTargetPrice', e)}
                    aria-label="Analyst Target Price explanation"
                  >
                    i
                  </button>
                  <h4>Analyst Target Price</h4>
                  <p>{companyOverview.AnalystTargetPrice || 'N/A'}</p>
                </div>
                <div className="pm-block-back">
                  <div className="pm-explanation">
                    <p>{metricExplanations.AnalystTargetPrice}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Other analyst rating blocks follow same pattern */}
            {/* Strong Buy */}
            <div 
              className={`pm-block ${flippedCards.AnalystRatingStrongBuy ? 'flipped' : ''}`} 
              style={{ '--pm-border-color': '#ed64a6' }}
              onClick={() => handleCardClick('AnalystRatingStrongBuy')}
            >
              <div className="pm-block-inner">
                <div className="pm-block-front">
                  <button 
                    className="pm-info-icon" 
                    onClick={(e) => handleCardFlip('AnalystRatingStrongBuy', e)}
                    aria-label="Strong Buy explanation"
                  >
                    i
                  </button>
                  <h4>Strong Buy</h4>
                  <p>{companyOverview.AnalystRatingStrongBuy || 'N/A'}</p>
                </div>
                <div className="pm-block-back">
                  <div className="pm-explanation">
                    <p>{metricExplanations.AnalystRatingStrongBuy}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Buy */}
            <div 
              className={`pm-block ${flippedCards.AnalystRatingBuy ? 'flipped' : ''}`} 
              style={{ '--pm-border-color': '#ed64a6' }}
              onClick={() => handleCardClick('AnalystRatingBuy')}
            >
              <div className="pm-block-inner">
                <div className="pm-block-front">
                  <button 
                    className="pm-info-icon" 
                    onClick={(e) => handleCardFlip('AnalystRatingBuy', e)}
                    aria-label="Buy explanation"
                  >
                    i
                  </button>
                  <h4>Buy</h4>
                  <p>{companyOverview.AnalystRatingBuy || 'N/A'}</p>
                </div>
                <div className="pm-block-back">
                  <div className="pm-explanation">
                    <p>{metricExplanations.AnalystRatingBuy}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hold */}
            <div 
              className={`pm-block ${flippedCards.AnalystRatingHold ? 'flipped' : ''}`} 
              style={{ '--pm-border-color': '#ed64a6' }}
              onClick={() => handleCardClick('AnalystRatingHold')}
            >
              <div className="pm-block-inner">
                <div className="pm-block-front">
                  <button 
                    className="pm-info-icon" 
                    onClick={(e) => handleCardFlip('AnalystRatingHold', e)}
                    aria-label="Hold explanation"
                  >
                    i
                  </button>
                  <h4>Hold</h4>
                  <p>{companyOverview.AnalystRatingHold || 'N/A'}</p>
                </div>
                <div className="pm-block-back">
                  <div className="pm-explanation">
                    <p>{metricExplanations.AnalystRatingHold}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sell */}
            <div 
              className={`pm-block ${flippedCards.AnalystRatingSell ? 'flipped' : ''}`} 
              style={{ '--pm-border-color': '#ed64a6' }}
              onClick={() => handleCardClick('AnalystRatingSell')}
            >
              <div className="pm-block-inner">
                <div className="pm-block-front">
                  <button 
                    className="pm-info-icon" 
                    onClick={(e) => handleCardFlip('AnalystRatingSell', e)}
                    aria-label="Sell explanation"
                  >
                    i
                  </button>
                  <h4>Sell</h4>
                  <p>{companyOverview.AnalystRatingSell || 'N/A'}</p>
                </div>
                <div className="pm-block-back">
                  <div className="pm-explanation">
                    <p>{metricExplanations.AnalystRatingSell}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Strong Sell */}
            <div 
              className={`pm-block ${flippedCards.AnalystRatingStrongSell ? 'flipped' : ''}`} 
              style={{ '--pm-border-color': '#ed64a6' }}
              onClick={() => handleCardClick('AnalystRatingStrongSell')}
            >
              <div className="pm-block-inner">
                <div className="pm-block-front">
                  <button 
                    className="pm-info-icon" 
                    onClick={(e) => handleCardFlip('AnalystRatingStrongSell', e)}
                    aria-label="Strong Sell explanation"
                  >
                    i
                  </button>
                  <h4>Strong Sell</h4>
                  <p>{companyOverview.AnalystRatingStrongSell || 'N/A'}</p>
                </div>
                <div className="pm-block-back">
                  <div className="pm-explanation">
                    <p>{metricExplanations.AnalystRatingStrongSell}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
});

export default PriceMetrics;