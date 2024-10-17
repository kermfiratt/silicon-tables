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
          employees: '147,000',
          establishYear: 1976,
          ceo: 'Tim Cook',
          headquarters: 'Cupertino, California',
          industry: 'Technology',
          website: 'https://www.apple.com'
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
        ],
        upcomingEvents: [
          { title: 'Apple Developer Conference', date: '2024-06-05' },
          { title: 'New Product Launch', date: '2024-09-10' }
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

  // Options for pie chart
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: 'white',
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
      
      {/* Block Layout */}
      <div className="grid-container">
        
        {/* Block for Financial Summary */}
        <div className="block financial-summary">
          <h3>Company Details</h3>
          <p><strong>Revenue:</strong> ${companyData.financials.revenue}</p>
          <p><strong>Market Cap:</strong> ${companyData.financials.marketCap}</p>
          <p><strong>Employees:</strong> {companyData.financials.employees}</p>
          <p><strong>Founded:</strong> {companyData.financials.establishYear}</p>
        </div>

        {/* Block for Sales Chart */}
        <div className="block chart-block">
          <h3>Quarterly Sales</h3>
          <Bar ref={chartRef} data={salesData} />
        </div>

        {/* Block for Profit Chart */}
        <div className="block chart-block">
          <h3>Quarterly Profit</h3>
          <Bar ref={chartRef} data={profitData} />
        </div>

        {/* Block for Shareholders Chart */}
        <div className="block chart-block">
          <h3>Shareholder Distribution</h3>
          <div style={{ height: '300px', margin: '0 auto' }}>
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>

        {/* Block for CEO Information */}
        <div className="block additional-info">
          <h3>CEO</h3>
          <p>{companyData.financials.ceo}</p>
        </div>

        {/* Block for Headquarters */}
        <div className="block additional-info">
          <h3>Headquarters</h3>
          <p>{companyData.financials.headquarters}</p>
        </div>

        {/* Block for Industry */}
        <div className="block additional-info">
          <h3>Industry</h3>
          <p>{companyData.financials.industry}</p>
        </div>

        {/* Block for Website */}
        <div className="block additional-info">
          <h3>Website</h3>
          <p><a href={companyData.financials.website} target="_blank" rel="noopener noreferrer">{companyData.financials.website}</a></p>
        </div>

        {/* Block for Latest News */}
        <div className="block news-block">
          <h3>Latest News</h3>
          <ul>
            {companyData.news.map((newsItem, index) => (
              <li key={index}><strong>{newsItem.date}</strong> - {newsItem.title}</li>
            ))}
          </ul>
        </div>

        {/* Block for Upcoming Events */}
        <div className="block new-block">
          <h3>Upcoming Events</h3>
          <ul>
            {companyData.upcomingEvents.map((event, index) => (
              <li key={index}><strong>{event.date}</strong> - {event.title}</li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default CompanyDetails;
