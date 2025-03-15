import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Report.css";

const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY;

const Report = ({ symbol, refs, activeSection }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Changed to false initially
  const [dataFetched, setDataFetched] = useState(false); // Track if data has been fetched

  // Fetch data only when the section is active and data hasn't been fetched before
  useEffect(() => {
    if (activeSection === 'report' && !dataFetched) {
      setDataFetched(true); // Mark data as fetched
      fetchStockData(symbol);
    }
  }, [activeSection, dataFetched]);

  const fetchStockData = async (symbol) => {
    if (!symbol.trim()) {
      setError("Please enter a stock symbol.");
      return;
    }

    setLoading(true); // Start loading
    setError(null);

    try {
      const overviewResponse = await axios.get(
        `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol.toUpperCase()}&apikey=${API_KEY}`
      );
      const incomeResponse = await axios.get(
        `https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=${symbol.toUpperCase()}&apikey=${API_KEY}`
      );
      const balanceSheetResponse = await axios.get(
        `https://www.alphavantage.co/query?function=BALANCE_SHEET&symbol=${symbol.toUpperCase()}&apikey=${API_KEY}`
      );
      const cashFlowResponse = await axios.get(
        `https://www.alphavantage.co/query?function=CASH_FLOW&symbol=${symbol.toUpperCase()}&apikey=${API_KEY}`
      );

      if (overviewResponse.data && incomeResponse.data && balanceSheetResponse.data && cashFlowResponse.data) {
        setData({
          overview: overviewResponse.data,
          income: incomeResponse.data,
          balanceSheet: balanceSheetResponse.data,
          cashFlow: cashFlowResponse.data,
        });
      } else {
        setError("Invalid stock symbol or data not available. Please try again.");
      }
    } catch (err) {
      setError("Failed to fetch stock data. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const calculateChange = (current, previous) => {
    if (previous === 0) return 0; // Avoid division by zero
    return ((current - previous) / previous) * 100;
  };

  const calculateBpsChange = (current, previous) => {
    return (current - previous) * 10000; // Convert to basis points
  };

  const getPositiveCount = (values) => {
    return values.filter(value => value > 0).length;
  };

  // Only render the wrapper if the active section is 'report'
  if (activeSection !== 'report') {
    return null; // Return null to prevent rendering
  }

  if (loading) {
    return (
      <div className="report-container">
        <div className="loading-container-report">
          <div className="loading-spinner-report"></div>
          <div className="loading-text-report">Loading Report Data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="report-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="report-container">
        <p>No data available for this company.</p>
      </div>
    );
  }

  return (
    <div className="report-container" ref={refs.reportRef}>
      <h1 className="report-title">Financial Report</h1>

      <div className="report-blocks">
        {/* Profit Block */}
        <div className="report-block">
          <h2>Profit <span className="circle">{getPositiveCount([
            calculateBpsChange(data.income.annualReports[0].netIncome / data.income.annualReports[0].totalRevenue, data.income.annualReports[1].netIncome / data.income.annualReports[1].totalRevenue),
            calculateBpsChange(data.income.quarterlyReports[0].netIncome / data.income.quarterlyReports[0].totalRevenue, data.income.quarterlyReports[1].netIncome / data.income.quarterlyReports[1].totalRevenue),
            calculateBpsChange(data.income.annualReports[0].grossProfit / data.income.annualReports[0].totalRevenue, data.income.annualReports[1].grossProfit / data.income.annualReports[1].totalRevenue),
            calculateBpsChange(data.income.quarterlyReports[0].grossProfit / data.income.quarterlyReports[0].totalRevenue, data.income.quarterlyReports[1].grossProfit / data.income.quarterlyReports[1].totalRevenue),
            calculateBpsChange(data.income.annualReports[0].operatingIncome / data.income.annualReports[0].totalRevenue, data.income.annualReports[1].operatingIncome / data.income.annualReports[1].totalRevenue),
            calculateBpsChange(data.income.quarterlyReports[0].operatingIncome / data.income.quarterlyReports[0].totalRevenue, data.income.quarterlyReports[1].operatingIncome / data.income.quarterlyReports[1].totalRevenue)
          ])}</span></h2>
          <ul>
            <li>
              <span className="metric">Net Profit Margin (Annual)</span>
              <span className={`value ${calculateBpsChange(data.income.annualReports[0].netIncome / data.income.annualReports[0].totalRevenue, data.income.annualReports[1].netIncome / data.income.annualReports[1].totalRevenue) > 0 ? "green" : "red"}`}>
                {calculateBpsChange(data.income.annualReports[0].netIncome / data.income.annualReports[0].totalRevenue, data.income.annualReports[1].netIncome / data.income.annualReports[1].totalRevenue).toFixed(2)} bps
              </span>
            </li>
            <li>
              <span className="metric">Net Profit Margin (Quarterly)</span>
              <span className={`value ${calculateBpsChange(data.income.quarterlyReports[0].netIncome / data.income.quarterlyReports[0].totalRevenue, data.income.quarterlyReports[1].netIncome / data.income.quarterlyReports[1].totalRevenue) > 0 ? "green" : "red"}`}>
                {calculateBpsChange(data.income.quarterlyReports[0].netIncome / data.income.quarterlyReports[0].totalRevenue, data.income.quarterlyReports[1].netIncome / data.income.quarterlyReports[1].totalRevenue).toFixed(2)} bps
              </span>
            </li>
            <li>
              <span className="metric">Gross Profit Margin (Annual)</span>
              <span className={`value ${calculateBpsChange(data.income.annualReports[0].grossProfit / data.income.annualReports[0].totalRevenue, data.income.annualReports[1].grossProfit / data.income.annualReports[1].totalRevenue) > 0 ? "green" : "red"}`}>
                {calculateBpsChange(data.income.annualReports[0].grossProfit / data.income.annualReports[0].totalRevenue, data.income.annualReports[1].grossProfit / data.income.annualReports[1].totalRevenue).toFixed(2)} bps
              </span>
            </li>
            <li>
              <span className="metric">Gross Profit Margin (Quarterly)</span>
              <span className={`value ${calculateBpsChange(data.income.quarterlyReports[0].grossProfit / data.income.quarterlyReports[0].totalRevenue, data.income.quarterlyReports[1].grossProfit / data.income.quarterlyReports[1].totalRevenue) > 0 ? "green" : "red"}`}>
                {calculateBpsChange(data.income.quarterlyReports[0].grossProfit / data.income.quarterlyReports[0].totalRevenue, data.income.quarterlyReports[1].grossProfit / data.income.quarterlyReports[1].totalRevenue).toFixed(2)} bps
              </span>
            </li>
            <li>
              <span className="metric">EBIT Margin (Annual)</span>
              <span className={`value ${calculateBpsChange(data.income.annualReports[0].operatingIncome / data.income.annualReports[0].totalRevenue, data.income.annualReports[1].operatingIncome / data.income.annualReports[1].totalRevenue) > 0 ? "green" : "red"}`}>
                {calculateBpsChange(data.income.annualReports[0].operatingIncome / data.income.annualReports[0].totalRevenue, data.income.annualReports[1].operatingIncome / data.income.annualReports[1].totalRevenue).toFixed(2)} bps
              </span>
            </li>
            <li>
              <span className="metric">EBIT Margin (Quarterly)</span>
              <span className={`value ${calculateBpsChange(data.income.quarterlyReports[0].operatingIncome / data.income.quarterlyReports[0].totalRevenue, data.income.quarterlyReports[1].operatingIncome / data.income.quarterlyReports[1].totalRevenue) > 0 ? "green" : "red"}`}>
                {calculateBpsChange(data.income.quarterlyReports[0].operatingIncome / data.income.quarterlyReports[0].totalRevenue, data.income.quarterlyReports[1].operatingIncome / data.income.quarterlyReports[1].totalRevenue).toFixed(2)} bps
              </span>
            </li>
          </ul>
        </div>

        {/* Growth Block */}
        <div className="report-block">
          <h2>Growth <span className="circle">{getPositiveCount([
            calculateChange(data.income.annualReports[0].totalRevenue, data.income.annualReports[1].totalRevenue),
            calculateChange(data.income.quarterlyReports[0].totalRevenue, data.income.quarterlyReports[1].totalRevenue),
            calculateChange(data.income.annualReports[0].operatingIncome, data.income.annualReports[1].operatingIncome),
            calculateChange(data.income.quarterlyReports[0].operatingIncome, data.income.quarterlyReports[1].operatingIncome),
            calculateChange(data.income.annualReports[0].netIncome, data.income.annualReports[1].netIncome),
            calculateChange(data.income.quarterlyReports[0].netIncome, data.income.quarterlyReports[1].netIncome)
          ])}</span></h2>
          <ul>
            <li>
              <span className="metric">Sales (Annual)</span>
              <span className={`value ${calculateChange(data.income.annualReports[0].totalRevenue, data.income.annualReports[1].totalRevenue) > 0 ? "green" : "red"}`}>
                {calculateChange(data.income.annualReports[0].totalRevenue, data.income.annualReports[1].totalRevenue).toFixed(2)}%
              </span>
            </li>
            <li>
              <span className="metric">Sales (Quarterly)</span>
              <span className={`value ${calculateChange(data.income.quarterlyReports[0].totalRevenue, data.income.quarterlyReports[1].totalRevenue) > 0 ? "green" : "red"}`}>
                {calculateChange(data.income.quarterlyReports[0].totalRevenue, data.income.quarterlyReports[1].totalRevenue).toFixed(2)}%
              </span>
            </li>
            <li>
              <span className="metric">EBIT (Annual)</span>
              <span className={`value ${calculateChange(data.income.annualReports[0].operatingIncome, data.income.annualReports[1].operatingIncome) > 0 ? "green" : "red"}`}>
                {calculateChange(data.income.annualReports[0].operatingIncome, data.income.annualReports[1].operatingIncome).toFixed(2)}%
              </span>
            </li>
            <li>
              <span className="metric">EBIT (Quarterly)</span>
              <span className={`value ${calculateChange(data.income.quarterlyReports[0].operatingIncome, data.income.quarterlyReports[1].operatingIncome) > 0 ? "green" : "red"}`}>
                {calculateChange(data.income.quarterlyReports[0].operatingIncome, data.income.quarterlyReports[1].operatingIncome).toFixed(2)}%
              </span>
            </li>
            <li>
              <span className="metric">Net Profit (Annual)</span>
              <span className={`value ${calculateChange(data.income.annualReports[0].netIncome, data.income.annualReports[1].netIncome) > 0 ? "green" : "red"}`}>
                {calculateChange(data.income.annualReports[0].netIncome, data.income.annualReports[1].netIncome).toFixed(2)}%
              </span>
            </li>
            <li>
              <span className="metric">Net Profit (Quarterly)</span>
              <span className={`value ${calculateChange(data.income.quarterlyReports[0].netIncome, data.income.quarterlyReports[1].netIncome) > 0 ? "green" : "red"}`}>
                {calculateChange(data.income.quarterlyReports[0].netIncome, data.income.quarterlyReports[1].netIncome).toFixed(2)}%
              </span>
            </li>
          </ul>
        </div>

        {/* Indebtedness Block */}
        <div className="report-block indebtedness">
          <h2>Indebtedness <span className="circle">{getPositiveCount([
            data.balanceSheet.annualReports[0].totalCurrentAssets - data.balanceSheet.annualReports[0].totalCurrentLiabilities > 0 ? 1 : 0,
            data.overview.DebtToEquity < 0.5 ? 1 : 0,
            data.balanceSheet.annualReports[0].totalLiabilities - data.balanceSheet.annualReports[0].totalAssets < 0 ? 1 : 0,
            data.balanceSheet.annualReports[0].totalCurrentAssets - data.balanceSheet.annualReports[0].totalLiabilities > 0 ? 1 : 0,
            data.balanceSheet.annualReports[0].totalCurrentAssets / data.balanceSheet.annualReports[0].totalCurrentLiabilities > 1.5 ? 1 : 0,
            data.cashFlow.annualReports[0].operatingCashflow / 5 - data.income.annualReports[0].interestExpense > 0 ? 1 : 0
          ])}</span></h2>
          <ul>
            <li>
              <span className="metric">Working Capital &gt; 0</span>
              <span className={`value ${data.balanceSheet.annualReports[0].totalCurrentAssets - data.balanceSheet.annualReports[0].totalCurrentLiabilities > 0 ? "green" : "red"}`}>
                {data.balanceSheet.annualReports[0].totalCurrentAssets - data.balanceSheet.annualReports[0].totalCurrentLiabilities > 0 ? "✔" : "✘"}
              </span>
            </li>
            <li>
              <span className="metric">Financial Indebtedness &lt; 50%</span>
              <span className={`value ${data.overview.DebtToEquity < 0.5 ? "green" : "red"}`}>
                {data.overview.DebtToEquity < 0.5 ? "✔" : "✘"}
              </span>
            </li>
            <li>
              <span className="metric">Net Debt &lt; 0</span>
              <span className={`value ${data.balanceSheet.annualReports[0].totalLiabilities - data.balanceSheet.annualReports[0].totalAssets < 0 ? "green" : "red"}`}>
                {data.balanceSheet.annualReports[0].totalLiabilities - data.balanceSheet.annualReports[0].totalAssets < 0 ? "✔" : "✘"}
              </span>
            </li>
            <li>
              <span className="metric">Current Assets &gt; Financial Debt</span>
              <span className={`value ${data.balanceSheet.annualReports[0].totalCurrentAssets - data.balanceSheet.annualReports[0].totalLiabilities > 0 ? "green" : "red"}`}>
                {data.balanceSheet.annualReports[0].totalCurrentAssets - data.balanceSheet.annualReports[0].totalLiabilities > 0 ? "✔" : "✘"}
              </span>
            </li>
            <li>
              <span className="metric">Current Ratio &gt; 1.5</span>
              <span className={`value ${data.balanceSheet.annualReports[0].totalCurrentAssets / data.balanceSheet.annualReports[0].totalCurrentLiabilities > 1.5 ? "green" : "red"}`}>
                {data.balanceSheet.annualReports[0].totalCurrentAssets / data.balanceSheet.annualReports[0].totalCurrentLiabilities > 1.5 ? "✔" : "✘"}
              </span>
            </li>
            <li>
              <span className="metric">Net Financial Expense &lt; (EBITDA / 5)</span>
              <span className={`value ${data.cashFlow.annualReports[0].operatingCashflow / 5 - data.income.annualReports[0].interestExpense > 0 ? "green" : "red"}`}>
                {data.cashFlow.annualReports[0].operatingCashflow / 5 - data.income.annualReports[0].interestExpense > 0 ? "✔" : "✘"}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Report;