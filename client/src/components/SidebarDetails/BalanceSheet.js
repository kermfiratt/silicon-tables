import React, { useEffect, useState } from 'react';
import './BalanceSheet.css';

const BalanceSheet = ({ symbol, refs, activeSection }) => {
  const [balanceSheet, setBalanceSheet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
    if (activeSection === 'balanceSheet') {
      const fetchBalanceSheet = async () => {
        try {
          const response = await fetch(
            `https://www.alphavantage.co/query?function=BALANCE_SHEET&symbol=${symbol}&apikey=${API_KEY}`
          );
          const data = await response.json();

          if (data['quarterlyReports']) {
            const reports = data['quarterlyReports'].slice(0, 5); // Last 5 quarters
            setBalanceSheet(reports);
          } else {
            setError('No balance sheet data available');
          }
        } catch (error) {
          setError('Failed to fetch balance sheet data.');
        } finally {
          setLoading(false);
        }
      };

      fetchBalanceSheet();
    }
  }, [symbol, API_KEY, activeSection]);

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

  // Function to get the quarter label (Q1, Q2, Q3, Q4)
  const getQuarterLabel = (fiscalDateEnding) => {
    const date = new Date(fiscalDateEnding);
    const month = date.getMonth() + 1; // Months are 0-indexed
    if (month >= 1 && month <= 3) return 'Q1';
    if (month >= 4 && month <= 6) return 'Q2';
    if (month >= 7 && month <= 9) return 'Q3';
    return 'Q4';
  };

  // Only render the wrapper if the active section is 'balanceSheet'
  if (activeSection !== 'balanceSheet') {
    return null; // Return null to prevent rendering
  }

  if (loading) {
    return (
      <div className="balance-sheet-wrapper">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading balance sheet data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="balance-sheet-wrapper">
        <p className="error">{error}</p>
      </div>
    );
  }

  if (!balanceSheet) {
    return (
      <div className="balance-sheet-wrapper">
        <p>No balance sheet data available for this company.</p>
      </div>
    );
  }

  return (
    <div className="balance-sheet-wrapper" ref={refs.balanceSheetRef}>
      <h1 className="balance-sheet-header">Balance Sheet</h1>
      <div className="balance-sheet-container">
        {tableCategories.map((category, index) => (
          <div key={index} className="table-category">
            <h3>{category.title}</h3>
            <table className="balance-sheet-table">
              <thead>
                <tr>
                  <th>Quarter</th>
                  <th>Period</th>
                  {category.fields.map((field, idx) => (
                    <th key={idx}>{field.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {balanceSheet.map((report, idx) => (
                  <tr key={idx}>
                    <td>{getQuarterLabel(report.fiscalDateEnding)}</td>
                    <td>{report.fiscalDateEnding}</td>
                    {category.fields.map((field, idx) => (
                      <td key={idx}>
                        {field.format(parseInt(report[field.key] || 0, 10))}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BalanceSheet;