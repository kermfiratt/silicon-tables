import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './QuarterlyEarnings.css'; // Import the CSS file

const QuarterlyEarnings = ({ symbol, refs, activeSection }) => {
  const [quarterlyEarnings, setQuarterlyEarnings] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [filteredEarnings, setFilteredEarnings] = useState([]);
  const [loading, setLoading] = useState(false); // Changed to false initially
  const [error, setError] = useState(null);
  const [dataFetched, setDataFetched] = useState(false); // Track if data has been fetched

  const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY;

  const formatValue = (value) => {
    if (value === null || value === undefined || isNaN(value)) return 'N/A';
    return value.toLocaleString();
  };

  // Fetch data only when the section is active and data hasn't been fetched before
  useEffect(() => {
    if (activeSection === 'quarterlyEarnings' && !dataFetched) {
      setDataFetched(true); // Mark data as fetched
      fetchEarningsData();
    }
  }, [activeSection, dataFetched]);

  const fetchEarningsData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=EARNINGS&symbol=${symbol}&apikey=${API_KEY}`
      );
      const data = response.data;

      console.log('API Response:', data);

      if (data.Note) {
        throw new Error('API rate limit exceeded. Please try again later.');
      }

      if (data && data.quarterlyEarnings) {
        setQuarterlyEarnings(data.quarterlyEarnings);

        // Extract unique years from earnings data
        const uniqueYears = Array.from(
          new Set(data.quarterlyEarnings.map((e) => e.fiscalDateEnding.slice(0, 4)))
        );
        setYears(uniqueYears);

        // Set the latest year as default
        const latestYear = uniqueYears[0];
        setSelectedYear(latestYear);

        // Filter earnings for the latest year
        const filtered = data.quarterlyEarnings.filter((e) =>
          e.fiscalDateEnding.startsWith(latestYear)
        );
        setFilteredEarnings(filtered);
      } else {
        throw new Error('No quarterly earnings data available.');
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching quarterly earnings:', err.message);
      setError(err.message);
      setLoading(false);
    }
  };

  // Filter earnings when selectedYear changes
  useEffect(() => {
    if (selectedYear && quarterlyEarnings.length > 0) {
      const filtered = quarterlyEarnings.filter((e) =>
        e.fiscalDateEnding.startsWith(selectedYear)
      );
      setFilteredEarnings(filtered);
    }
  }, [selectedYear, quarterlyEarnings]);

  // Only render the wrapper if the active section is 'quarterlyEarnings'
  if (activeSection !== 'quarterlyEarnings') {
    return null; // Return null to prevent rendering
  }

  if (loading) {
    return (
      <div className="quarterly-earnings-loading-overlay">
        <div className="loader"></div>
        <p className="loading-text">Loading earnings data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quarterly-earnings-section">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!quarterlyEarnings.length) {
    return (
      <div className="quarterly-earnings-section">
        <p>No quarterly earnings data available for this company.</p>
      </div>
    );
  }

  return (
    <div className="quarterly-earnings-section" ref={refs.quarterlyEarningsRef}>
      {activeSection === 'quarterlyEarnings' && (
        <div>
          <h4>Quarterly Earnings</h4>
          <div className="year-selector">
            <label htmlFor="year-select">Select Year:</label>
            <select
              id="year-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <table className="quarterly-earnings-table">
            <thead>
              <tr>
                <th>Fiscal Date Ending</th>
                <th>Reported Date</th>
                <th>Reported EPS</th>
                <th>Estimated EPS</th>
                <th>Surprise</th>
                <th>Surprise Percentage</th>
                <th>Report Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredEarnings.map((earning, index) => (
                <tr key={index}>
                  <td>{earning.fiscalDateEnding}</td>
                  <td>{earning.reportedDate}</td>
                  <td>{formatValue(earning.reportedEPS)}</td>
                  <td>{formatValue(earning.estimatedEPS)}</td>
                  <td>{formatValue(earning.surprise)}</td>
                  <td>{formatValue(earning.surprisePercentage)}</td>
                  <td>{earning.reportTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default QuarterlyEarnings;