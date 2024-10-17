import React, { useEffect, useRef, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import './CompanyDetalis.css';

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const CompanyDetails = () => {
  const [companyData, setCompanyData] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const mockData = {
      Apple: {
        name: 'Apple Inc.',
        financials: {
          revenue: '274.5B',
          marketCap: '2.3T',
          employees: '147,000'
        },
        quarterlySales: [120, 130, 140, 150],
        quarterlyProfit: [40, 60, 80, 100],
        shareholders: {
          'Tim Cook': 6,
          'Vanguard Group': 8,
          'BlackRock': 7
        },
        news: [
          { title: 'Apple iPhone 15 Released', date: '2023-09-20' },
          { title: 'Apple Stock Reaches New High', date: '2023-10-10' },
          { title: 'Apple Plans Major Investments in AI', date: '2023-11-01' }
        ]
      }
    };

    setCompanyData(mockData['Apple']);
  }, []);

  // Data for the sales chart
  const salesData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: 'Quarterly Sales (in billions)',
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        data: companyData ? companyData.quarterlySales : []
      }
    ]
  };

  // Data for the profit chart
  const profitData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: 'Quarterly Profit (in millions)',
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        data: companyData ? companyData.quarterlyProfit : []
      }
    ]
  };

  // Data for the shareholders pie chart
  const pieData = {
    labels: companyData ? Object.keys(companyData.shareholders) : [],
    datasets: [
      {
        label: 'Shareholders',
        data: companyData ? Object.values(companyData.shareholders) : [],
        backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe'],
        hoverBackgroundColor: ['#ff6384', '#36a2eb', '#cc65fe']
      }
    ]
  };

  // Options to show the labels inside the chart
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false, // Disable default aspect ratio to allow custom width/height
    plugins: {
      legend: {
        display: true,
        position: 'bottom', // Display the legend at the bottom
        labels: {
          color: 'white', // Adjust label color for better visibility
          font: {
            size: 14
          }
        }
      },
      tooltip: {
        enabled: true
      }
    }
  };

  return companyData ? (
    <div className="company-details">
      <h2>{companyData.name} Financial Overview</h2>
      <div className="financial-summary">
        <p><strong>Revenue:</strong> ${companyData.financials.revenue}</p>
        <p><strong>Market Cap:</strong> ${companyData.financials.marketCap}</p>
        <p><strong>Employees:</strong> {companyData.financials.employees}</p>
      </div>

      <div className="charts">
        <div className="chart">
          <Bar ref={chartRef} data={salesData} />
        </div>
        <div className="chart">
          <Bar ref={chartRef} data={profitData} />
        </div>
      </div>

      <div className="shareholders">
        <h3>Top Shareholders</h3>
        <div className="chart-small"> {/* Adjusted for 1/4 size */}
          <div style={{ width: '300px', height: '300px' }}> {/* Adjust size to 1/4 */}
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>
      </div>

      <div className="news">
        <h3>Latest News</h3>
        <ul>
          {companyData.news.map((newsItem, index) => (
            <li key={index}><strong>{newsItem.date}</strong> - {newsItem.title}</li>
          ))}
        </ul>
      </div>
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default CompanyDetails;
