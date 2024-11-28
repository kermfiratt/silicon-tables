import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import './Funds.css';

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Fund = () => {
  const ALPHA_VANTAGE_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY;
  const [etfSymbol, setEtfSymbol] = useState('QQQ'); // Default ETF
  const [etfData, setEtfData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchETFData = async () => {
    setLoading(true);
    setError(null);

    try {
      const API_URL = `https://www.alphavantage.co/query?function=ETF_PROFILE&symbol=${etfSymbol}&apikey=${ALPHA_VANTAGE_KEY}`;
      const response = await axios.get(API_URL);

      if (response.data) {
        setEtfData(response.data);
      } else {
        throw new Error('No data found for the given ETF symbol.');
      }
    } catch (err) {
      console.error('Error fetching ETF data:', err);
      setError('Failed to fetch ETF data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchETFData();
  }, []);

  const handleSearch = () => {
    fetchETFData();
  };

  const { net_assets, net_expense_ratio, portfolio_turnover, dividend_yield, asset_allocation, holdings } = etfData || {};

  // Pie chart data for asset allocation
  const pieData = {
    labels: asset_allocation ? Object.keys(asset_allocation) : [],
    datasets: [
      {
        data: asset_allocation
          ? Object.values(asset_allocation).map((value) => parseFloat(value) * 100)
          : [],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  };

  return (
    <div className="fund-container">
      <h2>ETF Profile & Holdings</h2>

      {/* Search Function */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter ETF Symbol (e.g., QQQ)"
          value={etfSymbol}
          onChange={(e) => setEtfSymbol(e.target.value.toUpperCase())}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}
      {etfData && (
        <div>
          {/* Pie Chart */}
          <div className="chart-container">
            <h3>Asset Allocation</h3>
            <Pie data={pieData} />
          </div>

          {/* ETF Metrics */}
          <div className="etf-metrics">
            <p><strong>Net Assets:</strong> ${parseFloat(net_assets).toLocaleString()}</p>
            <p><strong>Expense Ratio:</strong> {(parseFloat(net_expense_ratio) * 100).toFixed(2)}%</p>
            <p><strong>Portfolio Turnover:</strong> {(parseFloat(portfolio_turnover) * 100).toFixed(2)}%</p>
            <p><strong>Dividend Yield:</strong> {(parseFloat(dividend_yield) * 100).toFixed(2)}%</p>
          </div>

          {/* ETF Holdings Table */}
          <div className="holdings-table">
            <h3>Top Holdings</h3>
            <table>
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Description</th>
                  <th>Weight (%)</th>
                </tr>
              </thead>
              <tbody>
                {holdings &&
                  holdings.map((holding, index) => (
                    <tr key={index}>
                      <td>{holding.symbol}</td>
                      <td>{holding.description}</td>
                      <td>{(parseFloat(holding.weight) * 100).toFixed(2)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fund;
