// src/components/SidebarDetails/Financials.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './Financials.css';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Financials = ({ symbol }) => {
  const [financialData, setFinancialData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [companyName, setCompanyName] = useState('');

  // Fetch CIK dynamically based on symbol
  const fetchCIK = async (symbol) => {
    try {
      const response = await axios.get(`http://localhost:7600/api/get-cik/${symbol}`);
      return response.data.cik;
    } catch (error) {
      console.error('Error fetching CIK:', error.message);
      return null;
    }
  };

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        const cik = await fetchCIK(symbol);
        if (!cik) {
          console.error('CIK not found for symbol:', symbol);
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:7600/api/financials/${cik}`);
        const data = response.data;

        // Parse financial data for key metrics
        const getLastFourQuarters = (metricData) =>
          metricData
            .sort((a, b) => new Date(b.end) - new Date(a.end))
            .slice(0, 4)
            .map((item) => ({
              date: item.end,
              value: item.val,
            }));

        const revenue = getLastFourQuarters(data.revenue);
        const grossProfit = getLastFourQuarters(data.grossProfit);
        const netIncome = getLastFourQuarters(data.netIncome);
        const assets = getLastFourQuarters(data.assets);
        const liabilities = getLastFourQuarters(data.liabilities);
        const equity = getLastFourQuarters(data.equity);

        const quarters = revenue.map((rev, index) => ({
          date: rev.date,
          revenue: rev.value,
          grossProfit: grossProfit[index]?.value || 0,
          netIncome: netIncome[index]?.value || 0,
          assets: assets[index]?.value || 0,
          liabilities: liabilities[index]?.value || 0,
          equity: equity[index]?.value || 0,
          revenueChange:
            index > 0 ? (((rev.value - revenue[index - 1].value) / revenue[index - 1].value) * 100).toFixed(2) : null,
        }));

        setFinancialData(quarters);
        setCompanyName(data.entityName || symbol);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching financial data:', error.message);
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, [symbol]);

  if (loading) return <p>Loading financial data...</p>;
  if (!financialData.length) return <p>No financial data available for this company.</p>;

  return (
    <div className="financials-container">
      <h3>Quarterly Financial Overview for {companyName}</h3>
      <div className="financials-block">
        <h4>Summary Income Statement</h4>
        <table className="financials-table">
          <thead>
            <tr>
              <th>Metric</th>
              {financialData.map((item) => (
                <th key={item.date}>{new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Sales</td>
              {financialData.map((item) => (
                <td key={item.date}>{item.revenue.toLocaleString()}</td>
              ))}
            </tr>
            <tr>
              <td>Gross Profit</td>
              {financialData.map((item) => (
                <td key={item.date}>{item.grossProfit.toLocaleString()}</td>
              ))}
            </tr>
            <tr>
              <td>Net Income</td>
              {financialData.map((item) => (
                <td key={item.date}>{item.netIncome.toLocaleString()}</td>
              ))}
            </tr>
            <tr>
              <td>Revenue Change (%)</td>
              {financialData.map((item) => (
                <td
                  key={item.date}
                  className={item.revenueChange >= 0 ? 'positive-change' : 'negative-change'}
                >
                  {item.revenueChange ? `${item.revenueChange}%` : '-'}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="financials-block">
        <h4>Summary Balance Sheet</h4>
        <table className="financials-table">
          <thead>
            <tr>
              <th>Metric</th>
              {financialData.map((item) => (
                <th key={item.date}>{new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Assets</td>
              {financialData.map((item) => (
                <td key={item.date}>{item.assets.toLocaleString()}</td>
              ))}
            </tr>
            <tr>
              <td>Liabilities</td>
              {financialData.map((item) => (
                <td key={item.date}>{item.liabilities.toLocaleString()}</td>
              ))}
            </tr>
            <tr>
              <td>Equity</td>
              {financialData.map((item) => (
                <td key={item.date}>{item.equity.toLocaleString()}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="chart-container">
        <Bar
          data={{
            labels: financialData.map((item) => new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })),
            datasets: [
              { label: 'Sales', data: financialData.map((item) => item.revenue), backgroundColor: 'rgba(75, 192, 192, 0.6)' },
              { label: 'Gross Profits', data: financialData.map((item) => item.grossProfit), backgroundColor: 'rgba(153, 102, 255, 0.6)' },
              { label: 'Net Income', data: financialData.map((item) => item.netIncome), backgroundColor: 'rgba(255, 159, 64, 0.6)' },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              title: { display: true, text: `${companyName} Quarterly Metrics` },
            },
            scales: {
              y: {
                beginAtZero: true,
                title: { display: true, text: 'Value in USD' },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Financials;