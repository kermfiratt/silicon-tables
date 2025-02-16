import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Compare.css';
import Chart from 'chart.js/auto';
import { Line } from 'react-chartjs-2';

const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY;

const Compare = () => {
  const [stock1, setStock1] = useState('NVDA');
  const [stock2, setStock2] = useState('INTC');
  const [suggestions1, setSuggestions1] = useState([]);
  const [suggestions2, setSuggestions2] = useState([]);
  const [data1, setData1] = useState(null);
  const [data2, setData2] = useState(null);
  const [error, setError] = useState(null);
  const timeoutRef1 = useRef(null);
  const timeoutRef2 = useRef(null);

  useEffect(() => {
    fetchStockData();
  }, []);

  const fetchSuggestions = async (query, setSuggestions) => {
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
      console.error('Error fetching suggestions:', err);
    }
  };

  const fetchStockData = async () => {
    if (!stock1.trim() || !stock2.trim()) {
      setError("Please enter two stocks to compare.");
      return;
    }

    try {
      const [overview1, overview2, earnings1, earnings2, balance1, balance2] = await Promise.all([
        axios.get(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${stock1}&apikey=${API_KEY}`),
        axios.get(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${stock2}&apikey=${API_KEY}`),
        axios.get(`https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=${stock1}&apikey=${API_KEY}`),
        axios.get(`https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=${stock2}&apikey=${API_KEY}`),
        axios.get(`https://www.alphavantage.co/query?function=BALANCE_SHEET&symbol=${stock1}&apikey=${API_KEY}`),
        axios.get(`https://www.alphavantage.co/query?function=BALANCE_SHEET&symbol=${stock2}&apikey=${API_KEY}`)
      ]);

      setData1({ overview: overview1.data, earnings: earnings1.data, balance: balance1.data });
      setData2({ overview: overview2.data, earnings: earnings2.data, balance: balance2.data });
      setError(null);
    } catch (err) {
      setError("Failed to fetch stock data. Please try again.");
    }
  };

  const formatNumber = (num) => {
    if (!num) return 'N/A';
    num = parseFloat(num);
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    if (num <= -1e9) return (num / 1e9).toFixed(2) + "B";
    if (num <= -1e6) return (num / 1e6).toFixed(2) + "M";
    return num.toFixed(2);
  };

  const isBetter = (val1, val2, higherIsBetter = true) => {
    if (val1 === "N/A" || val2 === "N/A") return "";
    const num1 = parseFloat(val1);
    const num2 = parseFloat(val2);
    if (higherIsBetter) {
      return num1 > num2 ? "better" : "worse";
    } else {
      return num1 < num2 ? "better" : "worse";
    }
  };

  const calculateScore = (data1, data2) => {
    let score = 0;
    const metrics = [...valuationMetrics, ...profitMetrics, ...earningsMetrics];
    metrics.forEach(metric => {
      const val1 = data1.overview[metric.key];
      const val2 = data2.overview[metric.key];
      if (val1 !== "N/A" && val2 !== "N/A") {
        if (parseFloat(val1) > parseFloat(val2)) {
          score += 1;
        } else if (parseFloat(val1) < parseFloat(val2)) {
          score -= 1;
        }
      }
    });
    return score;
  };

  const valuationMetrics = [
    { name: "P/E Ratio", key: "PERatio" },
    { name: "P/B Ratio", key: "PriceToBookRatio" },
    { name: "PEG Ratio", key: "PEGRatio" },
    { name: "Book Value", key: "BookValue" },
    { name: "Dividend Per Share", key: "DividendPerShare" },
    { name: "EPS", key: "EPS" }
  ];

  const profitMetrics = [
    { name: "Profit Margin", key: "ProfitMargin" },
    { name: "Operating Margin", key: "OperatingMarginTTM" },
    { name: "Return on Assets", key: "ReturnOnAssetsTTM" },
    { name: "Return on Equity", key: "ReturnOnEquityTTM" },
    { name: "Revenue", key: "RevenueTTM" },
    { name: "Gross Profit", key: "GrossProfitTTM" }
  ];

  const earningsMetrics = [
    { name: "Total Revenue", key: "totalRevenue" },
    { name: "Gross Profit", key: "grossProfit" },
    { name: "Operating Income", key: "operatingIncome" },
    { name: "Cost of Revenue", key: "costOfRevenue" },
    { name: "R&D Expenses", key: "researchAndDevelopment" },
    { name: "Operating Expenses", key: "operatingExpenses" }
  ];

  const formatLabel = (label) => {
    return label.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  return (
    <div className="compare_container">
      <h1 className="compare_title">COMPARE STOCKS</h1>

      <div className="compare_search_wrapper">
        <input type="text" className="compare_input" placeholder="Search Stock 1..." value={stock1} 
          onChange={(e) => { setStock1(e.target.value); clearTimeout(timeoutRef1.current);
            timeoutRef1.current = setTimeout(() => fetchSuggestions(e.target.value, setSuggestions1), 300); }} />
        <input type="text" className="compare_input" placeholder="Search Stock 2..." value={stock2} 
          onChange={(e) => { setStock2(e.target.value); clearTimeout(timeoutRef2.current);
            timeoutRef2.current = setTimeout(() => fetchSuggestions(e.target.value, setSuggestions2), 300); }} />
      </div>

      <button className="compare_button" onClick={fetchStockData}>Compare</button>

      {data1 && data2 ? (
        <>
          <div className="company_score compare_header">
            <span className={calculateScore(data1, data2) > 0 ? "score good" : "score bad"}>
              {calculateScore(data1, data2)}
            </span>
            <span className="company_name">{data1.overview.Name}</span>
            <span className="company_name">{data2.overview.Name}</span>
            <span className={calculateScore(data2, data1) > 0 ? "score good" : "score bad"}>
              {calculateScore(data2, data1)}
            </span>
          </div>

          <div className="compare_table_wrapper">
            <div className="compare_category">
              <h3 className="category_title">Valuation</h3>
              {valuationMetrics.map(metric => (
                <div key={metric.key} className="metric_row">
                  <span className={`metric_value ${isBetter(data1.overview[metric.key], data2.overview[metric.key])}`}>
                    {formatNumber(data1.overview[metric.key])}
                  </span>
                  <span className="metric_name">{metric.name}</span>
                  <span className={`metric_value ${isBetter(data2.overview[metric.key], data1.overview[metric.key])}`}>
                    {formatNumber(data2.overview[metric.key])}
                  </span>
                </div>
              ))}
            </div>

            <div className="compare_category">
              <h3 className="category_title">Profitability</h3>
              {profitMetrics.map(metric => (
                <div key={metric.key} className="metric_row">
                  <span className={`metric_value ${isBetter(data1.overview[metric.key], data2.overview[metric.key])}`}>
                    {formatNumber(data1.overview[metric.key])}
                  </span>
                  <span className="metric_name">{metric.name}</span>
                  <span className={`metric_value ${isBetter(data2.overview[metric.key], data1.overview[metric.key])}`}>
                    {formatNumber(data2.overview[metric.key])}
                  </span>
                </div>
              ))}
            </div>

            <div className="compare_category">
              <h3 className="category_title">Annual Earnings</h3>
              {earningsMetrics.map(metric => (
                <div key={metric.key} className="metric_row">
                  <span className={`metric_value ${isBetter(data1.earnings.annualReports[0][metric.key], data2.earnings.annualReports[0][metric.key])}`}>
                    {formatNumber(data1.earnings.annualReports[0][metric.key])}
                  </span>
                  <span className="metric_name">{metric.name}</span>
                  <span className={`metric_value ${isBetter(data2.earnings.annualReports[0][metric.key], data1.earnings.annualReports[0][metric.key])}`}>
                    {formatNumber(data2.earnings.annualReports[0][metric.key])}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="chart_section">
            <h2>Performance Charts</h2>
            <div className="chart_grid">
              {["totalAssets", "cashAndCashEquivalentsAtCarryingValue", "currentDebt", "inventory", "goodwill", "totalNonCurrentLiabilities"].map(metric => (
                <div key={metric} className="chart_container">
                  <h3>{formatLabel(metric)}</h3>
                  <Line
                    data={{
                      labels: data1.balance.quarterlyReports.slice(0, 5).map(report => report.fiscalDateEnding),
                      datasets: [
                        {
                          label: `${data1.overview.Symbol} - ${formatLabel(metric)}`,
                          data: data1.balance.quarterlyReports.slice(0, 5).map(report => parseFloat(report[metric] || 0)),
                          borderColor: 'yellow',
                          backgroundColor: 'rgba(255, 255, 0, 0.5)',
                        },
                        {
                          label: `${data2.overview.Symbol} - ${formatLabel(metric)}`,
                          data: data2.balance.quarterlyReports.slice(0, 5).map(report => parseFloat(report[metric] || 0)),
                          borderColor: 'blue',
                          backgroundColor: 'rgba(0, 0, 255, 0.5)',
                        }
                      ],
                    }}
                    options={{
                      scales: {
                        y: {
                          ticks: {
                            callback: function(value) {
                              return formatNumber(value);
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}

      {error && <p className="compare_error">{error}</p>}
    </div>
  );
};

export default Compare;