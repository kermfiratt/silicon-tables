import React, { useEffect, useState, forwardRef } from 'react';
import axios from 'axios';
import './Financials.css';
import ReactSpeedometer from 'react-d3-speedometer';

const Financials = forwardRef(({ symbol, refs, activeSection }, ref) => {
  const [financialData, setFinancialData] = useState([]);
  const [priceMetrics, setPriceMetrics] = useState([]);
  const [companyOverview, setCompanyOverview] = useState({});
  const [loadingFinancials, setLoadingFinancials] = useState(false);
  const [loadingPriceMetrics, setLoadingPriceMetrics] = useState(false);
  const [loadingOverview, setLoadingOverview] = useState(false);
  const [errorFinancials, setErrorFinancials] = useState(null);
  const [errorPriceMetrics, setErrorPriceMetrics] = useState(null);
  const [errorOverview, setErrorOverview] = useState(null);
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

  const calculatePercentageChange = (latest, previous) => {
    if (previous === 0) return 'N/A';
    const change = ((latest - previous) / previous) * 100;
    return `${change.toFixed(2)}%`;
  };

  // Fetch data only when the section is active and data hasn't been fetched before
  useEffect(() => {
    if (activeSection === 'financials' && !dataFetched) {
      setDataFetched(true); // Mark data as fetched
      fetchFinancialData();
      fetchPriceMetrics();
      fetchCompanyOverview();
    }
  }, [activeSection, dataFetched]);

  const fetchFinancialData = async () => {
    setLoadingFinancials(true);
    try {
      const incomeResponse = await axios.get(
        `https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=${symbol}&apikey=${API_KEY}`
      );

      const balanceResponse = await axios.get(
        `https://www.alphavantage.co/query?function=BALANCE_SHEET&symbol=${symbol}&apikey=${API_KEY}`
      );

      const incomeData = incomeResponse.data.quarterlyReports;
      const balanceData = balanceResponse.data.quarterlyReports;

      const filteredIncomeData = incomeData
        .sort((a, b) => new Date(b.fiscalDateEnding) - new Date(a.fiscalDateEnding))
        .slice(0, 5);

      const filteredBalanceData = balanceData
        .sort((a, b) => new Date(b.fiscalDateEnding) - new Date(a.fiscalDateEnding))
        .slice(0, 5);

      const quarters = filteredIncomeData.map((report, index) => ({
        date: report.fiscalDateEnding,
        revenue: parseFloat(report.totalRevenue) || 0,
        grossProfit: parseFloat(report.grossProfit) || 0,
        netIncome: parseFloat(report.netIncome) || 0,
        assets: parseFloat(filteredBalanceData[index]?.totalAssets) || 0,
        liabilities: parseFloat(filteredBalanceData[index]?.totalLiabilities) || 0,
        equity: parseFloat(filteredBalanceData[index]?.totalShareholderEquity) || 0,
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
    setLoadingPriceMetrics(true);
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
    setLoadingOverview(true);
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

  if (loadingFinancials || loadingPriceMetrics || loadingOverview) {
    return (
      <div className="loading-overlay">
        <div className="loader"></div> {/* Updated spinner class */}
        <p className="loading-text">Loading...</p>
      </div>
    );
  }

  if (errorFinancials || errorPriceMetrics || errorOverview) {
    return <p>{errorFinancials || errorPriceMetrics || errorOverview}</p>;
  }

  if (!financialData.length && !priceMetrics.length) {
    return <p>No data available for this company.</p>;
  }

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
              { label: 'Assets', key: 'assets' },
              { label: 'Liabilities', key: 'liabilities' },
              { label: 'Equity', key: 'equity' },
              { label: 'Quarterly Sales', key: 'revenue' },
              { label: 'Quarterly Gross Profit', key: 'grossProfit' },
              { label: 'Quarterly Net Income', key: 'netIncome' },
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
                ...financialData.map((d) => Math.abs(d[metric.key] || 0))
              );

              const reversedFinancialData = [...financialData].reverse();

              return (
                <div className="metric-block" key={index}>
                  <h4>{metric.label}</h4>
                  <div className="metric-data">
                    {reversedFinancialData.map((item) => {
                      const metricValue = item[metric.key];
                      const formattedValue = formatValue(metricValue);

                      return (
                        <div
                          key={item.date}
                          className={`metric-bar ${metricValue < 0 ? 'negative-bar' : 'positive-bar'}`}
                          style={{
                            height: `${(Math.abs(metricValue) / maxMetricValue) * 100 || 0}%`,
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
    </div>
  );
});

export default Financials;