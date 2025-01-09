// src/components/SidebarDetails/Financials.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Financials.css';
import ReactSpeedometer from 'react-d3-speedometer';
import BalanceSheet from './BalanceSheet';
import SecEdgarOwnership from './SecEdgarOwnership';






const Financials = ({ symbol, setView }) => {
  const [financialData, setFinancialData] = useState([]);
  const [priceMetrics, setPriceMetrics] = useState([]);
  const [companyOverview, setCompanyOverview] = useState({});
  const [loadingFinancials, setLoadingFinancials] = useState(true);
  const [loadingPriceMetrics, setLoadingPriceMetrics] = useState(true);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [news, setNews] = useState([]); // Define news state
  const [loadingNews, setLoadingNews] = useState(true); // Define loading state for news
  const [errorFinancials, setErrorFinancials] = useState(null);
  const [errorPriceMetrics, setErrorPriceMetrics] = useState(null);
  const [errorOverview, setErrorOverview] = useState(null);
  const [errorNews, setErrorNews] = useState(null); // Define error state for news
  const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY;
  const FINNHUB_API_KEY = process.env.REACT_APP_API_KEY



  const formatValue = (value) => {
    if (value === null || value === undefined || isNaN(value)) return 'N/A'; // Handle invalid numbers
    const absValue = Math.abs(value); // Use absolute value for formatting
    const sign = value < 0 ? '-' : ''; // Keep the sign if the value is negative
  
    if (absValue >= 1e9) return `${sign}${(absValue / 1e9).toFixed(2)}B`; // Billion
    if (absValue >= 1e6) return `${sign}${(absValue / 1e6).toFixed(2)}M`; // Million
    if (absValue >= 1e3) return `${sign}${(absValue / 1e3).toFixed(2)}K`; // Thousand
    return `${sign}${absValue.toLocaleString()}`; // Smaller numbers
  };
  
  

  


  const calculatePercentageChange = (latest, previous) => {
    if (previous === 0) return 'N/A'; // Avoid division by zero
    const change = ((latest - previous) / previous) * 100;
    return `${change.toFixed(2)}%`;
  };


  


  useEffect(() => {
    const fetchNews = async () => {
      try {
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const newsResponse = await axios.get(
          `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${startDate}&to=${endDate}&token=${FINNHUB_API_KEY}`
        );
        setNews(newsResponse.data.slice(0, 20));
        setLoadingNews(false);
      } catch (error) {
        console.error('Error fetching news:', error.message);
        setErrorNews('Failed to load news.');
        setLoadingNews(false);
      }
    };
  
    fetchNews();
  }, [symbol, API_KEY]);

  

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        // Fetch income statement
        const incomeResponse = await axios.get(
          `https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=${symbol}&apikey=${API_KEY}`
        );

        // Fetch balance sheet
        const balanceResponse = await axios.get(
          `https://www.alphavantage.co/query?function=BALANCE_SHEET&symbol=${symbol}&apikey=${API_KEY}`
        );

        const incomeData = incomeResponse.data.quarterlyReports;
        const balanceData = balanceResponse.data.quarterlyReports;

        // Filter and sort data to include only the last 5 quarters
        const filteredIncomeData = incomeData
          .sort((a, b) => new Date(b.fiscalDateEnding) - new Date(a.fiscalDateEnding))
          .slice(0, 5);

        const filteredBalanceData = balanceData
          .sort((a, b) => new Date(b.fiscalDateEnding) - new Date(a.fiscalDateEnding))
          .slice(0, 5);

        // Parse financial data
        const quarters = filteredIncomeData.map((report, index) => ({
          date: report.fiscalDateEnding,
          revenue: parseFloat(report.totalRevenue) || 0,
          grossProfit: parseFloat(report.grossProfit) || 0,
          netIncome: parseFloat(report.netIncome) || 0,
          assets: parseFloat(filteredBalanceData[index]?.totalAssets) || 0,
          liabilities: parseFloat(filteredBalanceData[index]?.totalLiabilities) || 0,
          equity: parseFloat(filteredBalanceData[index]?.totalShareholderEquity) || 0,
        }));

        setFinancialData(quarters);
        setLoadingFinancials(false);
      } catch (error) {
        console.error('Error fetching financial data:', error.message);
        setErrorFinancials('Failed to load financial data.');
        setLoadingFinancials(false);
      }
    };

    const fetchPriceMetrics = async () => {
      try {
        const response = await fetch(
          `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`
        );
        const data = await response.json();

        if (data && data.Symbol) {
          setPriceMetrics([
            { label: 'PE Ratio', value: parseFloat(data.PERatio).toFixed(2) || 'N/A', color: '#4caf50' },
            { label: 'EPS', value: parseFloat(data.EPS).toFixed(2) || 'N/A', color: '#ff9800' },
            { label: 'Price to Book', value: parseFloat(data.PriceToBookRatio).toFixed(2) || 'N/A', color: '#03a9f4' },
            { label: 'Price to Sales', value: parseFloat(data.PriceToSalesRatioTTM).toFixed(2) || 'N/A', color: '#9c27b0' },
            { label: 'Dividend Yield', value: `${(parseFloat(data.DividendYield) * 100).toFixed(2)}%` || 'N/A', color: '#f44336' },
            { label: 'Beta', value: parseFloat(data.Beta).toFixed(2) || 'N/A', color: '#ffeb3b' },
            { label: 'Operating Margin', value: `${(parseFloat(data.OperatingMarginTTM) * 100).toFixed(2)}%` || 'N/A', color: '#8bc34a' },
            { label: 'Return on Equity (ROE)', value: `${(parseFloat(data.ReturnOnEquityTTM) * 100).toFixed(2)}%` || 'N/A', color: '#e91e63' },
            { label: 'Dividend Payout Ratio (DPR)', value: `${(parseFloat(data.DividendPayoutRatioTTM) * 100).toFixed(2)}%` || 'N/A', color: '#9e9e9e' },
            { label: 'EV/EBITDA', value: parseFloat(data.EVToEBITDA).toFixed(2) || 'N/A', color: '#673ab7' },
          ]);
        } else {
          throw new Error('No data available');
        }
        setLoadingPriceMetrics(false);
      } catch (error) {
        console.error('Error fetching price metrics:', error);
        setErrorPriceMetrics('Failed to load price metrics.');
        setLoadingPriceMetrics(false);
      }
    };


    const fetchCompanyOverview = async () => {
      try {
        const response = await axios.get(
          `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`
        );
        setCompanyOverview(response.data);
        setLoadingOverview(false);
      } catch (error) {
        console.error('Error fetching company overview:', error.message);
        setErrorOverview('Failed to load company overview.');
        setLoadingOverview(false);
      }
    };

    fetchFinancialData();
    fetchPriceMetrics();
    fetchCompanyOverview();
  }, [symbol, API_KEY]);

  if (loadingFinancials || loadingPriceMetrics) return <p>Loading data...</p>;
  if (errorFinancials || errorPriceMetrics) return <p>{errorFinancials || errorPriceMetrics}</p>;
  if (!financialData.length && !priceMetrics.length) return <p>No data available for this company.</p>;
  if (loadingFinancials || loadingOverview) return <p>Loading data...</p>;
if (errorFinancials || errorOverview) return <p>{errorFinancials || errorOverview}</p>;





const speedometerData = [
  {
    label: 'Strong Buy',
    value: parseInt(companyOverview.AnalystRatingStrongBuy) || 0,
  },
  {
    label: 'Neutral',
    value: parseInt(companyOverview.AnalystRatingHold) || 0,
  },
  {
    label: 'Strong Sell',
    value: parseInt(companyOverview.AnalystRatingStrongSell) || 0,
  },
];


  return (
   <div>
    

    {/* Summary Income Statement */}
    <div className="financials-block">
        <h4>Summary Income Statement</h4>
        <table className="financials-table">
          <thead>
            <tr>
              <th>Metric</th>
              {financialData.map((item) => (
                <th key={item.date}>
                  {new Date(item.date).toISOString().slice(0, 7).replace('-', '/')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
          <tr>
              <td>Sales</td>
              {financialData.map((item, index) => {
                const previousYearIndex = index + 4;
                const percentageChange =
                  previousYearIndex < financialData.length
                    ? calculatePercentageChange(item.revenue, financialData[previousYearIndex]?.revenue)
                    : null;
                return (
                  <td key={item.date}>
                    {formatValue(item.revenue)}{' '}
                    {percentageChange && (
                      <span
                        style={{
                          color: percentageChange.includes('-') ? 'red' : 'green',
                          fontWeight: 'bold',
                        }}
                      >
                        ({percentageChange})
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
            <tr>
              <td>Gross Profit</td>
              {financialData.map((item, index) => {
                const previousYearIndex = index + 4;
                const percentageChange =
                  previousYearIndex < financialData.length
                    ? calculatePercentageChange(item.grossProfit, financialData[previousYearIndex]?.grossProfit)
                    : null;
                return (
                  <td key={item.date}>
                    {formatValue(item.grossProfit)}{' '}
                    {percentageChange && (
                      <span
                        style={{
                          color: percentageChange.includes('-') ? 'red' : 'green',
                          fontWeight: 'bold',
                        }}
                      >
                        ({percentageChange})
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
            <tr>
              <td>Net Income</td>
              {financialData.map((item, index) => {
                const previousYearIndex = index + 4;
                const percentageChange =
                  previousYearIndex < financialData.length
                    ? calculatePercentageChange(item.netIncome, financialData[previousYearIndex]?.netIncome)
                    : null;
                return (
                  <td key={item.date}>
                    {formatValue(item.netIncome)}{' '}
                    {percentageChange && (
                      <span
                        style={{
                          color: percentageChange.includes('-') ? 'red' : 'green',
                          fontWeight: 'bold',
                        }}
                      >
                        ({percentageChange})
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      




      

      

      
    
    </div>


    {/* Financial Metrics */}
{/* Financial Metrics */}
<div className="metrics-grid">
  {[
    { label: 'Assets', key: 'assets' },
    { label: 'Liabilities', key: 'liabilities' },
    { label: 'Equity', key: 'equity' },
    { label: 'Quarterly Sales', key: 'revenue' },
    { label: 'Quarterly Gross Profit', key: 'grossProfit' },
    { label: 'Quarterly Net Income', key: 'netIncome' },
  ].map((metric, index) => {
    const maxMetricValue = Math.max(
      ...financialData.map((d) => Math.abs(d[metric.key] || 0)) // Absolute max value for scaling
    );

    return (
      <div className="metric-block" key={index}>
        <h4>{metric.label}</h4>
        <div className="metric-data">
          {financialData.map((item) => {
            const metricValue = item[metric.key]; // Access the correct key
            const formattedValue = formatValue(metricValue);

            return (
              <div
                key={item.date}
                className={`metric-bar ${metricValue < 0 ? 'negative-bar' : 'positive-bar'}`}
                style={{
                  height: `${(Math.abs(metricValue) / maxMetricValue) * 100 || 0}%`, // Adjust bar height
                }}
              >
                <span>{formattedValue}</span>
              </div>
            );
          })}
        </div>
        <div className="graph-dates">
          {financialData.map((item) => (
            <span key={item.date}>
              {new Date(item.date).toISOString().slice(0, 7).replace('-', '/')}
            </span>
          ))}
        </div>
      </div>
    );
  })}
</div>














    {/* Price Metrics */}
    <div className="price-metrics-container">
      <section id='price-metrics-section'>
        <h3>Price Metrics</h3>
        <div className="metrics-blocks">
          {priceMetrics.map((metric, index) => (
            <div
              key={index}
              className="metric-block"
              style={{ borderLeft: `5px solid ${metric.color}` }}
            >
              <h4 style={{ color: metric.color }}>{metric.label}</h4>
              <p>{metric.value}</p>
            </div>
          ))}
        </div>
        </section>
      </div>

      


      <div className="special-blocks-container">
  {/* Dividend Details Block */}
  <div className="special-block">
    <h4>Dividend Details</h4>
    <div className="block-content-stock">
      <p><strong>Dividend Date:</strong> {companyOverview.DividendDate || 'N/A'}</p>
      <p><strong>Ex-Dividend Date:</strong> {companyOverview.ExDividendDate || 'N/A'}</p>
      <p><strong>Dividend Per Share:</strong> {companyOverview.DividendPerShare || 'N/A'}</p>
      <p>
        <strong>Dividend Yield:</strong>{' '}
        {companyOverview.DividendYield
          ? `${(parseFloat(companyOverview.DividendYield) * 100).toFixed(2)}%`
          : 'N/A'}
      </p>
    </div>
  </div>

  {/* 52 Week & Moving Averages Block */}
  <div className="special-block">
    <h4>52 Week & Moving Averages</h4>
    <div className="block-content-stock">
      <p><strong>Market Cap:</strong> {formatValue(companyOverview.MarketCapitalization) || 'N/A'}</p>
      <p><strong>52 Week High:</strong> {companyOverview['52WeekHigh'] || 'N/A'}</p>
      <p><strong>52 Week Low:</strong> {companyOverview['52WeekLow'] || 'N/A'}</p>
      <p><strong>50 Day Moving Avg:</strong> {companyOverview['50DayMovingAverage'] || 'N/A'}</p>
      <p><strong>200 Day Moving Avg:</strong> {companyOverview['200DayMovingAverage'] || 'N/A'}</p>
    </div>
  </div>

  {/* Analyst Ratings Block */}
  <div className="special-block">
    <h4>Analyst Ratings</h4>
    <div className="block-content-stock">
      <p><strong>Target Price:</strong> {companyOverview.AnalystTargetPrice || 'N/A'}</p>
      <p><strong>Strong Buy:</strong> {companyOverview.AnalystRatingStrongBuy || 'N/A'}</p>
      <p><strong>Buy:</strong> {companyOverview.AnalystRatingBuy || 'N/A'}</p>
      <p><strong>Hold:</strong> {companyOverview.AnalystRatingHold || 'N/A'}</p>
      <p><strong>Sell:</strong> {companyOverview.AnalystRatingSell || 'N/A'}</p>
      <p><strong>Strong Sell:</strong> {companyOverview.AnalystRatingStrongSell || 'N/A'}</p>
    </div>
  </div>
</div>




<div className="special-blocks-container">
      {speedometerData.map((speedometer, index) => (
        <div key={index} className="special-block speedometer-special-block">
          <ReactSpeedometer
            maxValue={50}
            value={speedometer.value}
            needleColor="gray"
            segments={5}
            startColor="red"
            endColor="green"
            textColor="white"
            width={200} /* Matches special block size */
            height={200} /* Matches special block size */
            ringWidth={25} /* Matches the design */
          />
          <h4 className="speedometer-label">{speedometer.label}</h4>
        </div>
      ))}
    </div>





    {/* About Section */}
    <div id='about-section' className="about-company-block">
        <h4> About The Company </h4>
        <div> {companyOverview.Description} </div>
    </div>




    {/* News Section */}

    <div id="news-section" className="news-block">
  <h4>Recent News</h4>
  {loadingNews ? (
    <p>Loading news...</p>
  ) : news.length > 0 ? (
    <div className="news-list">
      {news.map((article, index) => (
        <div key={index} className="news-item">
          <a href={article.url} target="_blank" rel="noopener noreferrer" className="news-title">
            {article.headline}
          </a>
          <p className="news-date">{new Date(article.datetime * 1000).toLocaleDateString()}</p>
          <p className="news-summary">{article.summary}</p>
          {index < news.length - 1 && <hr className="news-divider" />}
        </div>
      ))}
    </div>
  ) : (
    <p>No recent news available.</p>
  )}
</div>






    {/* Balance Sheet Section */}

    <div id="balance-sheet-section" className="balance-sheet-block">
        <BalanceSheet symbol={symbol} />
    </div>






    {/* Sec Edgar Section */}

    <div>
    <SecEdgarOwnership />
    </div>


    </div>
  );
};

export default Financials;