// SidebarDetails/BalanceSheet.js
import React, { useEffect, useState } from 'react';
import './BalanceSheet.css';

const BalanceSheet = () => {
  const [balanceSheet, setBalanceSheet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const symbol = 'AAPL'; // Şirket sembolü dinamik olabilir
  const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY;

  useEffect(() => {
    const fetchBalanceSheet = async () => {
      try {
        const response = await fetch(
          `https://www.alphavantage.co/query?function=BALANCE_SHEET&symbol=${symbol}&apikey=${API_KEY}`
        );
        const data = await response.json();

        if (data['quarterlyReports']) {
          const reports = data['quarterlyReports'].slice(0, 4); // Son 4 çeyrek
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
                <td>{parseInt(report.totalAssets).toLocaleString()}</td>
                <td>{parseInt(report.totalLiabilities).toLocaleString()}</td>
                <td>{parseInt(report.totalShareholderEquity).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BalanceSheet;
