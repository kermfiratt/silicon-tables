// src/components/SidebarDetails/Financials.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Financials.css';

const Financials = ({ symbol, setView }) => {
  const [financialData, setFinancialData] = useState([]);
  const [priceMetrics, setPriceMetrics] = useState([]);
  const [companyOverview, setCompanyOverview] = useState({});
  const [loadingFinancials, setLoadingFinancials] = useState(true);
  const [loadingPriceMetrics, setLoadingPriceMetrics] = useState(true);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [errorFinancials, setErrorFinancials] = useState(null);
  const [errorPriceMetrics, setErrorPriceMetrics] = useState(null);
  const [errorOverview, setErrorOverview] = useState(null);
  const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY;

  const formatValue = (value) => {
    if (value >= 1e9) {
      return `${(value / 1e9).toFixed(2)}B`; // Convert to billions
    }
    return value.toLocaleString();
  };


  const calculatePercentageChange = (latest, previous) => {
    if (previous === 0) return 'N/A'; // Avoid division by zero
    const change = ((latest - previous) / previous) * 100;
    return `${change.toFixed(2)}%`;
  };

  

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
      
    <div className="metrics-grid">
      

<div className="metric-block">
    <h4>Assets</h4>
    <div className="metric-data">
      {financialData.map((item) => (
        <div key={item.date} className="metric-bar" style={{ height: `${(item.assets / Math.max(...financialData.map((d) => d.assets))) * 100}%` }}>
          <span>{formatValue(item.assets)}</span>
        </div>
      ))}
    </div>
    <div className="graph-dates">
      {financialData.map((item) => (
        <span key={item.date}>
          {new Date(item.date).toISOString().slice(0, 7).replace('-', '/')}
        </span>
      ))}
    </div>
  </div>

  <div className="metric-block">
    <h4>Liabilities</h4>
    <div className="metric-data">
      {financialData.map((item) => (
        <div key={item.date} className="metric-bar" style={{ height: `${(item.liabilities / Math.max(...financialData.map((d) => d.liabilities))) * 100}%` }}>
          <span>{formatValue(item.liabilities)}</span>
        </div>
      ))}
    </div>
    <div className="graph-dates">
      {financialData.map((item) => (
        <span key={item.date}>
          {new Date(item.date).toISOString().slice(0, 7).replace('-', '/')}
        </span>
      ))}
    </div>
  </div>

  <div className="metric-block">
    <h4>Equity</h4>
    <div className="metric-data">
      {financialData.map((item) => (
        <div key={item.date} className="metric-bar" style={{ height: `${(item.equity / Math.max(...financialData.map((d) => d.equity))) * 100}%` }}>
          <span>{formatValue(item.equity)}</span>
        </div>
      ))}
    </div>
    <div className="graph-dates">
      {financialData.map((item) => (
        <span key={item.date}>
          {new Date(item.date).toISOString().slice(0, 7).replace('-', '/')}
        </span>
      ))}
    </div>
  </div>

  <div className="metric-block">
    <h4>Quarterly Sales</h4>
    <div className="metric-data">
      {financialData.map((item) => (
        <div key={item.date} className="metric-bar" style={{ height: `${(item.revenue / Math.max(...financialData.map((d) => d.revenue))) * 100}%` }}>
          <span>{formatValue(item.revenue)}</span>
        </div>
      ))}
    </div>
    <div className="graph-dates">
      {financialData.map((item) => (
        <span key={item.date}>
          {new Date(item.date).toISOString().slice(0, 7).replace('-', '/')}
        </span>
      ))}
    </div>
  </div>

  <div className="metric-block">
    <h4>Quarterly Gross Profit</h4>
    <div className="metric-data">
      {financialData.map((item) => (
        <div key={item.date} className="metric-bar" style={{ height: `${(item.grossProfit / Math.max(...financialData.map((d) => d.grossProfit))) * 100}%` }}>
          <span>{formatValue(item.grossProfit)}</span>
        </div>
      ))}
    </div>
    <div className="graph-dates">
      {financialData.map((item) => (
        <span key={item.date}>
          {new Date(item.date).toISOString().slice(0, 7).replace('-', '/')}
        </span>
      ))}
    </div>
  </div>

  <div className="metric-block">
    <h4>Quarterly Net Income</h4>
    <div className="metric-data">
      {financialData.map((item) => (
        <div key={item.date} className="metric-bar" style={{ height: `${(item.netIncome / Math.max(...financialData.map((d) => d.netIncome))) * 100}%` }}>
          <span>{formatValue(item.netIncome)}</span>
        </div>
      ))}
    </div>

    <div className="graph-dates">
      {financialData.map((item) => (
        <span key={item.date}>
          {new Date(item.date).toISOString().slice(0, 7).replace('-', '/')}
        </span>
      ))}
    </div>
  </div>

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


      <div id='about-section' className="about-company-block">
  <h4> About The Company </h4>
  <div> {companyOverview.Description} </div>
</div>


    </div>
  );
};

export default Financials;
