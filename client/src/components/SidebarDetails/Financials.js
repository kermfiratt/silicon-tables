import React, { useEffect, useState, forwardRef } from 'react';
import axios from 'axios';
import './Financials.css';
import ReactSpeedometer from 'react-d3-speedometer';
import BalanceSheet from './BalanceSheet';

const Financials = forwardRef(({ symbol, refs, activeSection }, ref) => {
  const [financialData, setFinancialData] = useState([]);
  const [priceMetrics, setPriceMetrics] = useState([]);
  const [companyOverview, setCompanyOverview] = useState({});
  const [loadingFinancials, setLoadingFinancials] = useState(true);
  const [loadingPriceMetrics, setLoadingPriceMetrics] = useState(true);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [news, setNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [errorFinancials, setErrorFinancials] = useState(null);
  const [errorPriceMetrics, setErrorPriceMetrics] = useState(null);
  const [errorOverview, setErrorOverview] = useState(null);
  const [errorNews, setErrorNews] = useState(null);
  const [quarterlyEarnings, setQuarterlyEarnings] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("2024");
  const [filteredEarnings, setFilteredEarnings] = useState([]);
  const [loadingEarnings, setLoadingEarnings] = useState(true);
  const [errorEarnings, setErrorEarnings] = useState(null);
  const [cashFlowData, setCashFlowData] = useState([]);
  const [cashFlowYears, setCashFlowYears] = useState([]);
  const [selectedCashFlowYear, setSelectedCashFlowYear] = useState('');
  const [filteredCashFlow, setFilteredCashFlow] = useState([]);
  const [loadingCashFlow, setLoadingCashFlow] = useState(true);
  const [errorCashFlow, setErrorCashFlow] = useState(null);

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

  const calculatePercentageChange = (latest, previous) => {
    if (previous === 0) return 'N/A';
    const change = ((latest - previous) / previous) * 100;
    return `${change.toFixed(2)}%`;
  };

  useEffect(() => {
    const fetchCashFlowData = async () => {
      try {
        const response = await axios.get(
          `https://www.alphavantage.co/query?function=CASH_FLOW&symbol=${symbol}&apikey=${API_KEY}`
        );
        const data = response.data;

        if (data && data.annualReports) {
          setCashFlowData(data.annualReports);

          const uniqueYears = Array.from(
            new Set(data.annualReports.map((report) => report.fiscalDateEnding.slice(0, 4))) // Added closing parenthesis
          );
          setCashFlowYears(uniqueYears);

          // Set the latest year as default
          const latestYear = uniqueYears[0];
          setSelectedCashFlowYear(latestYear);

          // Filter cash flow data by the latest year
          const filtered = data.annualReports.filter((report) =>
            report.fiscalDateEnding.startsWith(latestYear)
          );
          setFilteredCashFlow(filtered);
        } else {
          throw new Error('No cash flow data available.');
        }

        setLoadingCashFlow(false);
      } catch (err) {
        console.error('Error fetching cash flow data:', err.message);
        setErrorCashFlow('Failed to load cash flow data.');
        setLoadingCashFlow(false);
      }
    };

    fetchCashFlowData();
  }, [symbol, API_KEY]);

  useEffect(() => {
    if (selectedCashFlowYear && cashFlowData.length > 0) {
      const filtered = cashFlowData.filter((report) =>
        report.fiscalDateEnding.startsWith(selectedCashFlowYear)
      );
      setFilteredCashFlow(filtered);
    }
  }, [selectedCashFlowYear, cashFlowData]);

  useEffect(() => {
    const fetchEarningsData = async () => {
      try {
        const response = await axios.get(
          `https://www.alphavantage.co/query?function=EARNINGS&symbol=${symbol}&apikey=${API_KEY}`
        );
        const data = response.data;
  
        console.log('API Response:', data); // Log the API response
  
        if (data.Note) {
          // Handle rate limit error
          throw new Error('API rate limit exceeded. Please try again later.');
        }
  
        if (data && data.quarterlyEarnings) {
          setQuarterlyEarnings(data.quarterlyEarnings);
  
          // Extract unique years from fiscalDateEnding
          const uniqueYears = Array.from(
            new Set(data.quarterlyEarnings.map((e) => e.fiscalDateEnding.slice(0, 4))) // Fixed: Added closing parenthesis
          );
          setYears(uniqueYears);
  
          // Set the latest year as default
          const latestYear = uniqueYears[0];
          setSelectedYear(latestYear);
  
          // Filter earnings by the latest year
          const filtered = data.quarterlyEarnings.filter((e) =>
            e.fiscalDateEnding.startsWith(latestYear)
          );
          setFilteredEarnings(filtered);
        } else {
          throw new Error('No quarterly earnings data available.');
        }
  
        setLoadingEarnings(false);
      } catch (err) {
        console.error('Error fetching quarterly earnings:', err.message);
        setErrorEarnings(err.message); // Display the actual error message
        setLoadingEarnings(false);
      }
    };
  
    fetchEarningsData();
  }, [symbol, API_KEY]);

  useEffect(() => {
    if (selectedYear && quarterlyEarnings.length > 0) {
      const filtered = quarterlyEarnings.filter((e) =>
        e.fiscalDateEnding.startsWith(selectedYear)
      );
      setFilteredEarnings(filtered);
    }
  }, [selectedYear, quarterlyEarnings]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const newsResponse = await axios.get(
          `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${symbol}&apikey=${API_KEY}`
        );

        // Extract the relevant news articles from the response
        const articles = newsResponse.data.feed || [];
        setNews(articles.slice(0, 20)); // Limit to 20 articles
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

  // New Metrics
  costOfRevenue: parseFloat(report.costOfRevenue) || 0,
  operatingIncome: parseFloat(report.operatingIncome) || 0,
  sellingGeneralAndAdministrative: parseFloat(report.sellingGeneralAndAdministrative) || 0,
  researchAndDevelopment: parseFloat(report.researchAndDevelopment) || 0,
  operatingExpenses: parseFloat(report.operatingExpenses) || 0,
  netInterestIncome: parseFloat(report.netInterestIncome) || 0,
  interestIncome: parseFloat(report.interestIncome) || 0,
  interestExpense: parseFloat(report.interestExpense) || 0,
  nonInterestIncome: parseFloat(report.nonInterestIncome) || 0,
  otherNonOperatingIncome: parseFloat(report.otherNonOperatingIncome) || 0,
  depreciation: parseFloat(report.depreciation) || 0,
  depreciationAndAmortization: parseFloat(report.depreciationAndAmortization) || 0,
  incomeBeforeTax: parseFloat(report.incomeBeforeTax) || 0,
  incomeTaxExpense: parseFloat(report.incomeTaxExpense) || 0,
  netIncomeFromContinuingOperations: parseFloat(report.netIncomeFromContinuingOperations) || 0,
  comprehensiveIncomeNetOfTax: parseFloat(report.comprehensiveIncomeNetOfTax) || 0,
  ebit: parseFloat(report.ebit) || 0,
  ebitda: parseFloat(report.ebitda) || 0,
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
    <div className='financials-container' ref={ref}>
      {/* Conditional Rendering Based on Active Section */}
      {activeSection === 'financials' && (
        <div ref={refs.financialsRef}>
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
            {[
              // Existing Metrics
              { label: 'Assets', key: 'assets' },
              { label: 'Liabilities', key: 'liabilities' },
              { label: 'Equity', key: 'equity' },
              { label: 'Quarterly Sales', key: 'revenue' },
              { label: 'Quarterly Gross Profit', key: 'grossProfit' },
              { label: 'Quarterly Net Income', key: 'netIncome' },
  
              // New Metrics
              { label: 'Cost of Revenue', key: 'costOfRevenue' },
              { label: 'Operating Income', key: 'operatingIncome' },
              { label: 'Selling, General & Admin', key: 'sellingGeneralAndAdministrative' },
              { label: 'Research & Development', key: 'researchAndDevelopment' },
              { label: 'Operating Expenses', key: 'operatingExpenses' },
              { label: 'Net Interest Income', key: 'netInterestIncome' },
              { label: 'Interest Income', key: 'interestIncome' },
              { label: 'Interest Expense', key: 'interestExpense' },
              { label: 'Non-Interest Income', key: 'nonInterestIncome' },
              { label: 'Other Non-Operating Income', key: 'otherNonOperatingIncome' },
              { label: 'Depreciation', key: 'depreciation' },
              { label: 'Depreciation & Amortization', key: 'depreciationAndAmortization' },
              { label: 'Income Before Tax', key: 'incomeBeforeTax' },
              { label: 'Income Tax Expense', key: 'incomeTaxExpense' },
              { label: 'Net Income from Continuing Operations', key: 'netIncomeFromContinuingOperations' },
              { label: 'Comprehensive Income Net of Tax', key: 'comprehensiveIncomeNetOfTax' },
              { label: 'EBIT', key: 'ebit' },
              { label: 'EBITDA', key: 'ebitda' },
            ].map((metric, index) => {
              const maxMetricValue = Math.max(
                ...financialData.map((d) => Math.abs(d[metric.key] || 0)) // Absolute max value for scaling
              );
  
              // Reverse the financialData array to display the most recent data on the right
              const reversedFinancialData = [...financialData].reverse();
  
              return (
                <div className="metric-block" key={index}>
                  <h4>{metric.label}</h4>
                  <div className="metric-data">
                    {reversedFinancialData.map((item) => {
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
                    {reversedFinancialData.map((item) => (
                      <span key={item.date}>
                        {new Date(item.date).toISOString().slice(0, 7).replace('-', '/')}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
  
  {activeSection === 'priceMetrics' && (
  <div ref={refs.priceMetricsRef}>
    {/* Price Metrics */}
    <div className="price-metrics-container">
      <section id='price-metrics-section'>
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
    </div>
  </div>
)}




<div className="quarterly-earnings-section">
  <h4>Quarterly Earnings</h4>
  {loadingEarnings ? (
    <p>Loading earnings data...</p>
  ) : errorEarnings ? (
    <p>Error: {errorEarnings}</p>
  ) : (
    <div>
      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      <table>
        <thead>
          <tr>
            <th>Fiscal Date Ending</th>
            <th>Reported Date</th>
            <th>Reported EPS</th>
            <th>Estimated EPS</th>
            <th>Surprise</th>
            <th>Surprise Percentage</th>
            <th>Report Time</th>
          </tr>
        </thead>
        <tbody>
          {filteredEarnings.map((earning, index) => (
            <tr key={index}>
              <td>{earning.fiscalDateEnding}</td>
              <td>{earning.reportedDate}</td>
              <td>{earning.reportedEPS}</td>
              <td>{earning.estimatedEPS}</td>
              <td>{earning.surprise}</td>
              <td>{earning.surprisePercentage}</td>
              <td>{earning.reportTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>



     

  
      {activeSection === 'annualCashFlow' && (
        <div ref={refs.annualCashFlowRef}>
          {/* Cash Flow Section */}
          <div id='annual-cash-flow-section' className="cashflow-block">
            <h4 className="cashflow-header">Annual Cash Flow</h4>
            {loadingCashFlow ? (
              <p className="cashflow-loading">Loading Annual Cash Flow...</p>
            ) : errorCashFlow ? (
              <p className="cashflow-error">{errorCashFlow}</p>
            ) : (
              <div>
                <div className="year-selector">
                  <label htmlFor="cashflow-year-select">Select Year:</label>
                  <select
                    id="cashflow-year-select"
                    value={selectedCashFlowYear}
                    onChange={(e) => setSelectedCashFlowYear(e.target.value)}
                    className="year-dropdown"
                  >
                    {cashFlowYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                {/* First Table */}
                <table className="cashflow-table">
                  <thead>
                    <tr>
                      <th>Fiscal Date Ending</th>
                      <th>Operating Cash Flow</th>
                      <th>Payments for Operating Activities</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCashFlow.map((report, index) => (
                      <tr key={`${index}-table1`}>
                        <td>{report.fiscalDateEnding}</td>
                        <td>{formatValue(report.operatingCashflow)}</td>
                        <td>{formatValue(report.paymentsForOperatingActivities)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
  
                {/* Second Table */}
                <table className="cashflow-table">
                  <thead>
                    <tr>
                      <th>Capital Expenditures</th>
                      <th>Change in Operating Assets</th>
                      <th>Change in Operating Liabilities</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCashFlow.map((report, index) => (
                      <tr key={`${index}-table2`}>
                        <td>{formatValue(report.capitalExpenditures)}</td>
                        <td>{formatValue(report.changeInOperatingAssets)}</td>
                        <td>{formatValue(report.changeInOperatingLiabilities)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
  
                {/* Third Table */}
                <table className="cashflow-table">
                  <thead>
                    <tr>
                      <th>Cashflow from Investment</th>
                      <th>Cashflow from Financing</th>
                      <th>Net Income</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCashFlow.map((report, index) => (
                      <tr key={`${index}-table3`}>
                        <td>{formatValue(report.cashflowFromInvestment)}</td>
                        <td>{formatValue(report.cashflowFromFinancing)}</td>
                        <td>{formatValue(report.netIncome)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
  
      {activeSection === 'about' && (
        <div ref={refs.aboutRef}>
          {/* About Section */}
          <div id='about-section' className="about-company-block">
            <h4>About The Company</h4>
            <div>{companyOverview.Description}</div>
          </div>
        </div>
      )}
  
      {activeSection === 'news' && (
        <div ref={refs.newsRef}>
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
                      {article.title}
                    </a>
                    <p className="news-summary">{article.summary}</p>
                    {index < news.length - 1 && <hr className="news-divider" />}
                  </div>
                ))}
              </div>
            ) : (
              <p>No recent news available.</p>
            )}
          </div>
        </div>
      )}
  
      {activeSection === 'balanceSheet' && (
        <div ref={refs.balanceSheetRef}>
          {/* Balance Sheet Section */}
          <div id="balance-sheet-section" className="balance-sheet-block">
            <BalanceSheet symbol={symbol} />
          </div>
        </div>
      )}
    </div>
  );
});

export default Financials;