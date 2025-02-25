import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Report.css";

const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY;

const Report = () => {
  const [stock, setStock] = useState("NVDA"); // Default stock
  const [suggestions, setSuggestions] = useState([]);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state
  const timeoutRef = useRef(null);

  useEffect(() => {
    fetchStockData("NVDA");
  }, []);

  const fetchSuggestions = async (query) => {
    if (!query.trim()) return;

    try {
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${API_KEY}`
      );

      if (response.data["bestMatches"]) {
        setSuggestions(response.data["bestMatches"].slice(0, 5));
      } else {
        setSuggestions([]);
      }
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    }
  };

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

  return (
    <div className="report_container">
      <h1 className="report_title">Report</h1>

      <div className="search_section">
        <div className="search_group">
          <input
            type="text"
            className="search_input"
            placeholder="Search Stock..."
            value={stock}
            onChange={(e) => {
              setStock(e.target.value);
              clearTimeout(timeoutRef.current);
              timeoutRef.current = setTimeout(() => fetchSuggestions(e.target.value), 300);
            }}
          />
          <ul className="search_suggestions">
            {suggestions.map((s, index) => (
              <li key={index} onClick={() => {
                setStock(s["1. symbol"]);
                fetchStockData(s["1. symbol"]);
                setSuggestions([]);
              }}>
                {s["1. symbol"]} - {s["2. name"]}
              </li>
            ))}
          </ul>
        </div>
        <button className="search_button" onClick={() => fetchStockData(stock)}>Search</button>
      </div>

      {loading && <div className="loading">Loading...</div>}

      {error && <p className="error_message">{error}</p>}

      {data && (
        <div className="report_blocks">
          {/* Profit Block */}
          <div className="report_block">
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
          <div className="report_block">
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
          <div className="report_block indebtedness">
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
      )}
    </div>
  );
};

export default Report;