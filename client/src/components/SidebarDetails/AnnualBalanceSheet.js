import React, { useEffect, useState } from 'react';
import './AnnualBalanceSheet.css';

const AnnualBalanceSheet = ({ symbol }) => {
  const [balanceSheet, setBalanceSheet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedYear, setSelectedYear] = useState(null); // Default to null initially
  const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY;

  // Function to format large numbers, including negative values
  const formatLargeNumber = (num) => {
    if (!num || isNaN(num)) return 'N/A';
    const absNum = Math.abs(num); // Handle negative numbers
    if (absNum >= 1e9) return `${(num / 1e9).toFixed(1)}B`; // Billions
    if (absNum >= 1e6) return `${(num / 1e6).toFixed(1)}M`; // Millions
    if (absNum >= 1e3) return `${(num / 1e3).toFixed(1)}K`; // Thousands
    return num.toLocaleString(); // Standard format
  };

  useEffect(() => {
    const fetchBalanceSheet = async () => {
      try {
        const response = await fetch(
          `https://www.alphavantage.co/query?function=BALANCE_SHEET&symbol=${symbol}&apikey=${API_KEY}`
        );
        const data = await response.json();

        if (data['annualReports']) {
          setBalanceSheet(data['annualReports']);

          // Set the default selected year to the latest year
          const latestYear = new Date(data['annualReports'][0].fiscalDateEnding).getFullYear();
          setSelectedYear(latestYear);
        } else {
          setError('No annual balance sheet data available');
        }
      } catch (error) {
        setError('Failed to fetch annual balance sheet data.');
      } finally {
        setLoading(false);
      }
    };

    fetchBalanceSheet();
  }, [symbol, API_KEY]);

  // Get unique years from the annual reports
  const getAvailableYears = () => {
    if (!balanceSheet) return [];
    return balanceSheet
      .map((report) => new Date(report.fiscalDateEnding).getFullYear())
      .filter((year, index, self) => self.indexOf(year) === index) // Remove duplicates
      .sort((a, b) => b - a); // Sort in descending order
  };

  // Filter reports by selected year
  const filteredReports = balanceSheet
    ? balanceSheet.filter(
        (report) => new Date(report.fiscalDateEnding).getFullYear() === selectedYear
      )
    : [];

  // Define categorized fields for each table
  const tableCategories = [
    {
      title: 'Current Assets',
      fields: [
        { key: 'totalCurrentAssets', label: 'Total Current Assets', format: formatLargeNumber },
        { key: 'cashAndCashEquivalentsAtCarryingValue', label: 'Cash & Equivalents', format: formatLargeNumber },
        { key: 'inventory', label: 'Inventory', format: formatLargeNumber },
        { key: 'currentNetReceivables', label: 'Net Receivables', format: formatLargeNumber },
      ],
    },
    {
      title: 'Non-Current Assets',
      fields: [
        { key: 'totalNonCurrentAssets', label: 'Total Non-Current Assets', format: formatLargeNumber },
        { key: 'propertyPlantEquipment', label: 'PP&E', format: formatLargeNumber },
        { key: 'intangibleAssets', label: 'Intangible Assets', format: formatLargeNumber },
        { key: 'goodwill', label: 'Goodwill', format: formatLargeNumber },
        { key: 'longTermInvestments', label: 'Long-term Investments', format: formatLargeNumber },
      ],
    },
    {
      title: 'Liabilities',
      fields: [
        { key: 'totalLiabilities', label: 'Total Liabilities', format: formatLargeNumber },
        { key: 'totalCurrentLiabilities', label: 'Current Liabilities', format: formatLargeNumber },
        { key: 'currentAccountsPayable', label: 'Accounts Payable', format: formatLargeNumber },
        { key: 'deferredRevenue', label: 'Deferred Revenue', format: formatLargeNumber },
        { key: 'currentDebt', label: 'Current Debt', format: formatLargeNumber },
        { key: 'longTermDebt', label: 'Long-term Debt', format: formatLargeNumber },
      ],
    },
    {
      title: 'Equity',
      fields: [
        { key: 'totalShareholderEquity', label: 'Shareholder Equity', format: formatLargeNumber },
        { key: 'retainedEarnings', label: 'Retained Earnings', format: formatLargeNumber },
        { key: 'commonStockSharesOutstanding', label: 'Shares Outstanding', format: formatLargeNumber },
      ],
    },
  ];

  return (
    <div className="annual-balance-sheet-wrapper">
      <h1 className="annual-balance-sheet-header">Annual Balance Sheet</h1>
      <div className="annual-balance-sheet-container">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <>
            <div className="year-selector">
              <label htmlFor="year-select">Select Year:</label>
              <select
                id="year-select"
                value={selectedYear || ''}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              >
                {getAvailableYears().map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {filteredReports.length > 0 ? (
              tableCategories.map((category, index) => (
                <div key={index} className="table-category">
                  <h3>{category.title}</h3>
                  <table className="annual-balance-sheet-table">
                    <thead>
                      <tr>
                        <th>Year</th>
                        {category.fields.map((field, idx) => (
                          <th key={idx}>{field.label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReports.map((report, idx) => (
                        <tr key={idx}>
                          <td>{new Date(report.fiscalDateEnding).getFullYear()}</td>
                          {category.fields.map((field, idx) => (
                            <td key={idx}>
                              {field.format(parseInt(report[field.key] || 0))}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))
            ) : (
              <p>No data available for the selected year.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AnnualBalanceSheet;