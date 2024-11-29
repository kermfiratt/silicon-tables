import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import './Funds.css';

// Chart.js components registration
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

  const { holdings } = etfData || {};

  // Pie chart data processing
  const processHoldingsData = (holdings) => {
    if (!holdings) return { labels: [], datasets: [] };

    const threshold = 5; // 5% threshold
    let othersWeight = 0;
    const filteredHoldings = holdings
      .map((holding) => ({
        label: holding.description,
        value: parseFloat(holding.weight) * 100,
      }))
      .filter((holding) => {
        if (holding.value < threshold) {
          othersWeight += holding.value;
          return false; // Exclude small holdings
        }
        return true; // Include others
      });

    // Add "Others" category
    if (othersWeight > 0) {
      filteredHoldings.push({ label: 'Others', value: othersWeight });
    }

    return {
      labels: filteredHoldings.map((h) => h.label),
      datasets: [
        {
          data: filteredHoldings.map((h) => h.value),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
            '#4D5360',
            '#AC64AD',
            '#7494EA',
            '#F89C74',
          ],
          hoverBackgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
            '#4D5360',
            '#AC64AD',
            '#7494EA',
            '#F89C74',
          ],
        },
      ],
    };
  };

  const pieDataHoldings = processHoldingsData(holdings);

  return (
    <div className="fund-container">
      <h2>ETF Profile & Holdings</h2>

      {/* Search Bar */}
      <div className="search-bar-etf">
        <input
          type="text"
          placeholder="Enter ETF Symbol (e.g., QQQ)"
          value={etfSymbol}
          onChange={(e) => setEtfSymbol(e.target.value.toUpperCase())}
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleSearch();
          }}
        />
      </div>

      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}
      {etfData && (
        <div>
          {/* Pie Chart */}
          <div className="chart-container">
            <h3>Top Holdings Distribution</h3>
            <Pie data={pieDataHoldings} />
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
