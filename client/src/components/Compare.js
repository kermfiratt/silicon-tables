import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Compare.css';

const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY;

const Compare = () => {
  const [stock1, setStock1] = useState('NVDA'); // Default: NVIDIA
  const [stock2, setStock2] = useState('INTC'); // Default: Intel
  const [suggestions1, setSuggestions1] = useState([]);
  const [suggestions2, setSuggestions2] = useState([]);
  const [data1, setData1] = useState(null);
  const [data2, setData2] = useState(null);
  const [error, setError] = useState(null);
  const timeoutRef = useRef(null);

  // Fetch default comparison data when the page loads
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
      const response1 = await axios.get(
        `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${stock1.toUpperCase()}&apikey=${API_KEY}`
      );
      const response2 = await axios.get(
        `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${stock2.toUpperCase()}&apikey=${API_KEY}`
      );

      if (response1.data && response2.data && response1.data.Symbol && response2.data.Symbol) {
        setData1({
          symbol: response1.data.Symbol,
          name: response1.data.Name || "N/A",
          marketCap: response1.data.MarketCapitalization || "N/A",
          peRatio: parseFloat(response1.data.PERatio) || 0,
          revenue: parseFloat(response1.data.RevenueTTM) || 0,
          eps: parseFloat(response1.data.EPS) || 0,
          profitMargin: parseFloat(response1.data.ProfitMargin) || 0,
          operatingMargin: parseFloat(response1.data.OperatingMarginTTM) || 0,
          returnOnAssets: parseFloat(response1.data.ReturnOnAssetsTTM) || 0,
          returnOnEquity: parseFloat(response1.data.ReturnOnEquityTTM) || 0,
          debtToEquity: parseFloat(response1.data.DebtEquityRatio) || 0,
        });

        setData2({
          symbol: response2.data.Symbol,
          name: response2.data.Name || "N/A",
          marketCap: response2.data.MarketCapitalization || "N/A",
          peRatio: parseFloat(response2.data.PERatio) || 0,
          revenue: parseFloat(response2.data.RevenueTTM) || 0,
          eps: parseFloat(response2.data.EPS) || 0,
          profitMargin: parseFloat(response2.data.ProfitMargin) || 0,
          operatingMargin: parseFloat(response2.data.OperatingMarginTTM) || 0,
          returnOnAssets: parseFloat(response2.data.ReturnOnAssetsTTM) || 0,
          returnOnEquity: parseFloat(response2.data.ReturnOnEquityTTM) || 0,
          debtToEquity: parseFloat(response2.data.DebtEquityRatio) || 0,
        });

        setError(null);
      } else {
        setError("Invalid stock symbols. Please try again.");
      }
    } catch (err) {
      setError("Failed to fetch stock data. Please try again.");
    }
  };

  return (
    <div className="compare_container">
      <h1 className="compare_title">Compare</h1>

      {data1 && data2 ? (
        <div className="compare_result">
          <button className="compare_reset" onClick={() => {
            setStock1('');
            setStock2('');
            setData1(null);
            setData2(null);
          }}>Compare Another</button>

          <table className="compare_table">
            <thead>
              <tr>
                <th>{data1.name}</th>
                <th>Metric</th>
                <th>{data2.name}</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Market Cap", key: "marketCap" },
                { label: "P/E Ratio", key: "peRatio" },
                { label: "Revenue (TTM)", key: "revenue" },
                { label: "EPS", key: "eps" },
                { label: "Profit Margin", key: "profitMargin" },
                { label: "Operating Margin", key: "operatingMargin" },
                { label: "Return on Assets", key: "returnOnAssets" },
                { label: "Return on Equity", key: "returnOnEquity" },
                { label: "Debt to Equity Ratio", key: "debtToEquity" },
              ].map((metric, index) => (
                <tr key={index}>
                  <td className={data1[metric.key] > data2[metric.key] ? "better" : "worse"}>
                    {data1[metric.key]}
                  </td>
                  <td>{metric.label}</td>
                  <td className={data2[metric.key] > data1[metric.key] ? "better" : "worse"}>
                    {data2[metric.key]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="compare_search_wrapper">
          <div className="search_group">
            <input
              type="text"
              className="compare_input"
              placeholder="Search Stock 1..."
              value={stock1}
              onChange={(e) => {
                setStock1(e.target.value);
                clearTimeout(timeoutRef.current);
                timeoutRef.current = setTimeout(() => fetchSuggestions(e.target.value, setSuggestions1), 300);
              }}
            />
            <ul className="compare_suggestions">
              {suggestions1.map((s, index) => (
                <li key={index} onClick={() => {
                  setStock1(s["1. symbol"]);
                  setSuggestions1([]); // Close suggestions
                }}>
                  {s["1. symbol"]} - {s["2. name"]}
                </li>
              ))}
            </ul>
          </div>

          <div className="compare_divider"></div>

          <div className="search_group">
            <input
              type="text"
              className="compare_input"
              placeholder="Search Stock 2..."
              value={stock2}
              onChange={(e) => {
                setStock2(e.target.value);
                clearTimeout(timeoutRef.current);
                timeoutRef.current = setTimeout(() => fetchSuggestions(e.target.value, setSuggestions2), 300);
              }}
            />
            <ul className="compare_suggestions">
              {suggestions2.map((s, index) => (
                <li key={index} onClick={() => {
                  setStock2(s["1. symbol"]);
                  setSuggestions2([]); // Close suggestions
                }}>
                  {s["1. symbol"]} - {s["2. name"]}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {!data1 || !data2 ? (
        <button className="compare_button" onClick={fetchStockData}>Compare</button>
      ) : null}

      {error && <p className="compare_error">{error}</p>}
    </div>
  );
};

export default Compare;
