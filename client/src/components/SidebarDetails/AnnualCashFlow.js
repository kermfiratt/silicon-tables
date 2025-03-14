import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AnnualCashFlow.css'; // Import the CSS file

const AnnualCashFlow = ({ symbol, refs, activeSection }) => {
  const [cashFlowData, setCashFlowData] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY;

  const formatValue = (value) => {
    if (value === null || value === undefined || isNaN(value)) return 'N/A';
    return value.toLocaleString();
  };

  useEffect(() => {
    const fetchCashFlowData = async () => {
      try {
        const response = await axios.get(
          `https://www.alphavantage.co/query?function=CASH_FLOW&symbol=${symbol}&apikey=${API_KEY}`
        );
        const data = response.data;

        if (data && data.annualReports) {
          const sortedAnnualReports = data.annualReports.sort((a, b) =>
            b.fiscalDateEnding.localeCompare(a.fiscalDateEnding)
          );

          setCashFlowData(sortedAnnualReports);

          // Extract unique years from cash flow data
          const uniqueYears = Array.from(
            new Set(sortedAnnualReports.map((report) => report.fiscalDateEnding.slice(0, 4)))
          );
          setYears(uniqueYears);

          // Set the latest year as default
          const latestYear = uniqueYears[0];
          setSelectedYear(latestYear);

          // Filter cash flow data for the latest year
          const filtered = sortedAnnualReports.filter((report) =>
            report.fiscalDateEnding.startsWith(latestYear)
          );
          setFilteredData(filtered);
        } else {
          throw new Error('No cash flow data available.');
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching cash flow data:', err.message);
        setError('Failed to load cash flow data.');
        setLoading(false);
      }
    };

    fetchCashFlowData();
  }, [symbol, API_KEY]);

  // Filter cash flow data when selectedYear changes
  useEffect(() => {
    if (selectedYear && cashFlowData.length > 0) {
      const filtered = cashFlowData.filter((report) =>
        report.fiscalDateEnding.startsWith(selectedYear)
      );
      setFilteredData(filtered);
    }
  }, [selectedYear, cashFlowData]);





 // Only render the wrapper if the active section is 'annual cash flow'
 if (activeSection !== 'annualCashFlow') {
  return null; // Return null to prevent rendering
}




  if (loading) {
    return (
      <div className="annual-cash-flow-section">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading cash flow data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="annual-cash-flow-section">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!cashFlowData.length) {
    return (
      <div className="annual-cash-flow-section">
        <p>No annual cash flow data available for this company.</p>
      </div>
    );
  }

  return (
    <div className="annual-cash-flow-section" ref={refs.annualCashFlowRef}>
      {activeSection === 'annualCashFlow' && (
        <div>
          <h4>Annual Cash Flow</h4>
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
          <table className="annual-cash-flow-section">
            <thead>
              <tr>
                <th>Fiscal Date Ending</th>
                <th>Operating Cash Flow</th>
                <th>Capital Expenditures</th>
                <th>Free Cash Flow</th>
                <th>Cash Flow from Financing</th>
                <th>Cash Flow from Investment</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((report, index) => (
                <tr key={index}>
                  <td>{report.fiscalDateEnding}</td>
                  <td>{formatValue(report.operatingCashflow)}</td>
                  <td>{formatValue(report.capitalExpenditures)}</td>
                  <td>{formatValue(report.freeCashFlow)}</td>
                  <td>{formatValue(report.cashflowFromFinancing)}</td>
                  <td>{formatValue(report.cashflowFromInvestment)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AnnualCashFlow;