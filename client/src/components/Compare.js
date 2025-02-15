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
  const timeoutRef = useRef(null);

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
        setData1(response1.data);
        setData2(response2.data);
        setError(null);
      } else {
        setError("Invalid stock symbols. Please try again.");
      }
    } catch (err) {
      setError("Failed to fetch stock data. Please try again.");
    }
  };

  const generateChartData = (key, label) => {
    if (!data1 || !data2) return null;

    return {
      labels: ['2023/9', '2023/12', '2024/3', '2024/6', '2024/9'],
      datasets: [
        {
          label: `${data1.Symbol} - ${label}`,
          data: [12, 15, 18, 17, 20], 
          borderColor: 'yellow',
          backgroundColor: 'rgba(255, 255, 0, 0.5)',
        },
        {
          label: `${data2.Symbol} - ${label}`,
          data: [25, 30, 28, 27, 26], 
          borderColor: 'blue',
          backgroundColor: 'rgba(0, 0, 255, 0.5)',
        }
      ],
    };
  };

  return (
    <div className="compare_container">
      <h1 className="compare_title">COMPARE STOCKS</h1>

      {data1 && data2 ? (
        <>
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
                  <th className="company_name">{data1.Name}</th>
                  <th className="metric_header">Metric</th>
                  <th className="company_name">{data2.Name}</th>
                </tr>
              </thead>
              <tbody>
                <tr><td colSpan="3" className="table_category">Valuation</td></tr>
                <tr>
                  <td className="data_cell">{data1.PERatio}</td>
                  <td className="metric_name">P/E Ratio</td>
                  <td className="data_cell">{data2.PERatio}</td>
                </tr>
                <tr>
                  <td className="data_cell">{data1.PriceToBookRatio}</td>
                  <td className="metric_name">P/B Ratio</td>
                  <td className="data_cell">{data2.PriceToBookRatio}</td>
                </tr>

                <tr><td colSpan="3" className="table_category">Profitability</td></tr>
                <tr>
                  <td className="data_cell">{data1.ProfitMargin}</td>
                  <td className="metric_name">Profit Margin</td>
                  <td className="data_cell">{data2.ProfitMargin}</td>
                </tr>
                <tr>
                  <td className="data_cell">{data1.OperatingMarginTTM}</td>
                  <td className="metric_name">Operating Margin</td>
                  <td className="data_cell">{data2.OperatingMarginTTM}</td>
                </tr>

                <tr><td colSpan="3" className="table_category">Growth</td></tr>
                <tr>
                  <td className="data_cell">{data1.QuarterlyRevenueGrowthYOY}</td>
                  <td className="metric_name">Revenue Growth</td>
                  <td className="data_cell">{data2.QuarterlyRevenueGrowthYOY}</td>
                </tr>
                <tr>
                  <td className="data_cell">{data1.QuarterlyEarningsGrowthYOY}</td>
                  <td className="metric_name">Earnings Growth</td>
                  <td className="data_cell">{data2.QuarterlyEarningsGrowthYOY}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="chart_section">
            <h2>Performance Charts</h2>
            <div className="chart_grid">
              <div className="chart_container"><h3>Profit Margin</h3><Line data={generateChartData("ProfitMargin", "Profit Margin")} /></div>
              <div className="chart_container"><h3>Revenue Growth</h3><Line data={generateChartData("RevenueTTM", "Revenue Growth")} /></div>
              <div className="chart_container"><h3>Earnings Per Share</h3><Line data={generateChartData("EPS", "Earnings Per Share")} /></div>
              <div className="chart_container"><h3>Market Capitalization</h3><Line data={generateChartData("MarketCapitalization", "Market Capitalization")} /></div>
            </div>
          </div>
        </>
      ) : (
        <div className="compare_search_wrapper">
          <div className="search_group">
            <input type="text" className="compare_input" placeholder="Search Stock 1..." value={stock1} onChange={(e) => {
              setStock1(e.target.value);
              clearTimeout(timeoutRef.current);
              timeoutRef.current = setTimeout(() => fetchSuggestions(e.target.value, setSuggestions1), 300);
            }} />
            <ul className="compare_suggestions">
              {suggestions1.map((s, index) => (
                <li key={index} onClick={() => {
                  setStock1(s["1. symbol"]);
                  setSuggestions1([]);
                }}>
                  {s["1. symbol"]} - {s["2. name"]}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {!data1 || !data2 ? <button className="compare_button" onClick={fetchStockData}>Compare</button> : null}

      {error && <p className="compare_error">{error}</p>}
    </div>
  );
};

export default Compare;
