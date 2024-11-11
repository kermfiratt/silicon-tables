// src/components/SidebarDetails/Financials.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Financials = ({ symbol }) => {
  const [financialData, setFinancialData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [companyName, setCompanyName] = useState('');

  // Hardcoded CIKs for common companies
  const companyCIKs = {
    AAPL: '0000320193',
    MSFT: '0000789019',
    // Add other companies as needed
  };

  const fetchCIK = (symbol) => {
    return companyCIKs[symbol.toUpperCase()] || null;
  };

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        const cik = fetchCIK(symbol);
        if (!cik) {
          console.error('CIK not found for symbol:', symbol);
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:7600/api/financials/${cik}`);

        const data = response.data;

        // Parse financial data for key metrics
        const revenue = data.facts['us-gaap']['Revenues']?.units['USD'] || [];
        const grossProfit = data.facts['us-gaap']['GrossProfit']?.units['USD'] || [];
        const netIncome = data.facts['us-gaap']['NetIncomeLoss']?.units['USD'] || [];
        const assets = data.facts['us-gaap']['Assets']?.units['USD'] || [];

        // Sort the data by date in descending order and take only the latest 4 quarters
        const quarters = revenue
          .sort((a, b) => new Date(b.end) - new Date(a.end))
          .slice(0, 4)
          .map(item => ({
            date: item.end,
            revenue: item.val,
            grossProfit: grossProfit.find(gp => gp.end === item.end)?.val || 0,
            netIncome: netIncome.find(ni => ni.end === item.end)?.val || 0,
            assets: assets.find(a => a.end === item.end)?.val || 0,
          }));

        setFinancialData(quarters);
        setCompanyName(data.entityName || symbol); // Set company name if available
        setLoading(false);
      } catch (error) {
        console.error('Error fetching financial data:', error);
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, [symbol]);

  const chartData = financialData.length
    ? {
        labels: financialData.map(item => new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })),
        datasets: [
          {
            label: 'Revenue',
            data: financialData.map(item => item.revenue),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
          },
          {
            label: 'Gross Profit',
            data: financialData.map(item => item.grossProfit),
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
          },
          {
            label: 'Net Income',
            data: financialData.map(item => item.netIncome),
            backgroundColor: 'rgba(255, 159, 64, 0.6)',
          },
          {
            label: 'Assets',
            data: financialData.map(item => item.assets),
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
          },
        ],
      }
    : {};

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: `${companyName} Quarterly Financial Data` },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Value in USD' },
      },
    },
  };

  if (loading) return <p>Loading financial data...</p>;

  if (!financialData.length) return <p>No financial data available for this company.</p>;

  return (
    <div className="financials-container">
      <h3>Quarterly Financial Overview for {companyName}</h3>
      <div className="chart-container">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default Financials;
