import React, { useEffect, useState } from 'react';
import './BalanceSheet.css';

const BalanceSheet = ({ symbol }) => {
  const [balanceSheet, setBalanceSheet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY;

  // Function to format large numbers
  const formatLargeNumber = (num) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`; // Billions
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`; // Millions
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`; // Thousands
    return num.toLocaleString(); // Standard format
  };

  useEffect(() => {
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
  }, [symbol, API_KEY]);

  return (
    <div className="balance-sheet-container">
      <h2>Balance Sheet</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          <table className="balance-sheet-table">
            <thead>
              <tr>
                <th>Quarter</th>
                <th>Total Assets</th>
                <th>Total Liabilities</th>
                <th>Total Equity</th>
              </tr>
            </thead>
            <tbody>
              {balanceSheet.map((report, index) => (
                <tr key={index}>
                  <td>{report.fiscalDateEnding}</td>
                  <td>{formatLargeNumber(parseInt(report.totalAssets))}</td>
                  <td>{formatLargeNumber(parseInt(report.totalLiabilities))}</td>
                  <td>{formatLargeNumber(parseInt(report.totalShareholderEquity))}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Additional Data</h3>
          <table className="balance-sheet-table">
            <thead>
              <tr>
                <th>Quarter</th>
                <th>Current Assets</th>
                <th>Current Liabilities</th>
                <th>Retained Earnings</th>
                <th>Cash and Cash Equivalents</th>
              </tr>
            </thead>
            <tbody>
              {balanceSheet.map((report, index) => (
                <tr key={index}>
                  <td>{report.fiscalDateEnding}</td>
                  <td>{formatLargeNumber(parseInt(report.totalCurrentAssets || 0))}</td>
                  <td>{formatLargeNumber(parseInt(report.totalCurrentLiabilities || 0))}</td>
                  <td>{formatLargeNumber(parseInt(report.retainedEarnings || 0))}</td>
                  <td>{formatLargeNumber(parseInt(report.cashAndCashEquivalentsAtCarryingValue || 0))}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Long-term Data</h3>
          <table className="balance-sheet-table">
            <thead>
              <tr>
                <th>Quarter</th>
                <th>Long-term Debt</th>
                <th>Net Tangible Assets</th>
              </tr>
            </thead>
            <tbody>
              {balanceSheet.map((report, index) => (
                <tr key={index}>
                  <td>{report.fiscalDateEnding}</td>
                  <td>{formatLargeNumber(parseInt(report.longTermDebt || 0))}</td>
                  <td>{formatLargeNumber(parseInt(report.netTangibleAssets || 0))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default BalanceSheet;
