import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Report.css";

const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY;

const Report = () => {
  const [stock, setStock] = useState("NVDA"); // Varsayılan hisse senedi
  const [suggestions, setSuggestions] = useState([]);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
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

    try {
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol.toUpperCase()}&apikey=${API_KEY}`
      );

      if (response.data && response.data.Symbol) {
        setData(response.data);
        setError(null);
      } else {
        setError("Invalid stock symbol. Please try again.");
      }
    } catch (err) {
      setError("Failed to fetch stock data. Please try again.");
    }
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

      {error && <p className="error_message">{error}</p>}

      {data && (
        <div className="report_blocks">
          {/* Karlılık Bloğu */}
          <div className="report_block">
            <h2>Karlılık</h2>
            <p>Fiscal Year: {data.FiscalYearEnd}</p>
            <div className="report_score green">✔ {data.ProfitMargin ? `${(data.ProfitMargin * 100).toFixed(2)}%` : "N/A"}</div>
            <ul>
              <li className={data.ProfitMargin > 0 ? "green" : "red"}>Net Kar Marjı: {data.ProfitMargin ? `${(data.ProfitMargin * 100).toFixed(2)}%` : "N/A"}</li>
              <li className={data.OperatingMarginTTM > 0 ? "green" : "red"}>Faaliyet Kar Marjı: {data.OperatingMarginTTM ? `${(data.OperatingMarginTTM * 100).toFixed(2)}%` : "N/A"}</li>
            </ul>
          </div>

          {/* Büyüme Bloğu */}
          <div className="report_block">
            <h2>Büyüme</h2>
            <p>Latest Quarter: {data.LatestQuarter}</p>
            <div className="report_score red">📉 {data.QuarterlyRevenueGrowthYOY ? `${(data.QuarterlyRevenueGrowthYOY * 100).toFixed(2)}%` : "N/A"}</div>
            <ul>
              <li className={data.QuarterlyRevenueGrowthYOY > 0 ? "green" : "red"}>Satış Büyümesi: {data.QuarterlyRevenueGrowthYOY ? `${(data.QuarterlyRevenueGrowthYOY * 100).toFixed(2)}%` : "N/A"}</li>
              <li className={data.QuarterlyEarningsGrowthYOY > 0 ? "green" : "red"}>Kâr Büyümesi: {data.QuarterlyEarningsGrowthYOY ? `${(data.QuarterlyEarningsGrowthYOY * 100).toFixed(2)}%` : "N/A"}</li>
            </ul>
          </div>

          {/* Borçluluk Bloğu */}
          <div className="report_block">
            <h2>Borçluluk</h2>
            <p>Debt to Equity Ratio: {data.DebtToEquityTTM ? data.DebtToEquityTTM : "N/A"}</p>
            <div className="report_score orange">⚠ Debt: {data.MarketCapitalization ? `$${(data.MarketCapitalization / 1e9).toFixed(1)}B` : "N/A"}</div>
            <ul>
              <li className={data.PriceToBookRatio < 3 ? "green" : "red"}>P/B Ratio: {data.PriceToBookRatio ? data.PriceToBookRatio : "N/A"}</li>
              <li className={data.PriceToSalesRatioTTM < 5 ? "green" : "red"}>P/S Ratio: {data.PriceToSalesRatioTTM ? data.PriceToSalesRatioTTM : "N/A"}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Report;
