// src/components/SidebarDetails/Financials.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Financials.css';

const Financials = ({ symbol }) => {
  const [financialData, setFinancialData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [companyName, setCompanyName] = useState('');
  const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY;

  const formatValue = (value) => {
    if (value >= 1e9) {
      return `${(value / 1e9).toFixed(2)}B`; // Convert to billions
    }
    return value.toLocaleString();
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
          .sort((a, b) => new Date(b.fiscalDateEnding) - new Date(a.fiscalDateEnding)) // Sort by latest first
          .slice(0, 5); // Take the last 5 quarters

        const filteredBalanceData = balanceData
          .sort((a, b) => new Date(b.fiscalDateEnding) - new Date(a.fiscalDateEnding)) // Sort by latest first
          .slice(0, 5); // Take the last 5 quarters

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
        setCompanyName(symbol);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching financial data:', error.message);
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, [symbol, API_KEY]);

  if (loading) return <p>Loading financial data...</p>;
  if (!financialData.length) return <p>No financial data available for this company.</p>;

  return (
    <div className="financials-container">
      <h3>Quarterly Financial Overview for {companyName}</h3>

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
              {financialData.map((item) => (
                <td key={item.date}>{formatValue(item.revenue)}</td>
              ))}
            </tr>
            <tr>
              <td>Gross Profit</td>
              {financialData.map((item) => (
                <td key={item.date}>{formatValue(item.grossProfit)}</td>
              ))}
            </tr>
            <tr>
              <td>Net Income</td>
              {financialData.map((item) => (
                <td key={item.date}>{formatValue(item.netIncome)}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Balance Sheet Metrics */}
      <div className="metrics-comparison">
        <div className="metric-block">
          <h4 className='graph-title'>Assets (B)</h4>
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
          <h4>Liabilities (B)</h4>
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
          <h4>Equity (B)</h4>
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
      </div>

      {/* Financial Metrics Comparison */}
      <div className="metrics-comparison">
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
    </div>
  );
};

export default Financials;
