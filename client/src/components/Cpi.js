import React, { useEffect, useState } from 'react';
import './Cpi.css';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Cpi = () => {
  const [cpiData, setCpiData] = useState([]);
  const [hovered, setHovered] = useState(false);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchCpiData = async () => {
      const apiKey = process.env.REACT_APP_ALPHA_VANTAGE_KEY; // Use environment variable
      const response = await fetch(
        `https://www.alphavantage.co/query?function=CPI&interval=monthly&apikey=${apiKey}`
      );
      const data = await response.json();

      if (data && data.data) {
        // Sort data by date in descending order (most recent first)
        const sortedData = data.data.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Get the latest 3 months for the block
        const latestThreeData = sortedData.slice(0, 3).map((item) => ({
          ...item,
          formattedDate: formatDate(item.date), // Format the date
        }));
        setCpiData(latestThreeData);

        // Get the latest 13 months for the hover chart
        const latestThirteenData = sortedData.slice(0, 13).map((item) => ({
          ...item,
          formattedDate: formatDate(item.date), // Format the date
        }));
        prepareChartData(latestThirteenData);
      }
    };

    fetchCpiData();
  }, []);

  // Function to format the date as "MM / YYYY"
  const formatDate = (dateString) => {
    const [year, month] = dateString.split('-'); // Split the date string
    return `${month} / ${year}`; // Format as "MM / YYYY"
  };

  // Prepare data for the chart
  const prepareChartData = (data) => {
    const chartData = {
      labels: data.map((item) => item.formattedDate).reverse(),
      datasets: [
        {
          label: 'Consumer Price Index (CPI)',
          data: data.map((item) => item.value).reverse(),
          borderColor: '#4caf50', // Green line
          backgroundColor: 'rgba(76, 175, 80, 0.1)', // Light green fill
          pointBackgroundColor: '#4caf50', // Green points
          pointBorderColor: '#fff', // White border for points
          pointHoverBackgroundColor: '#fff', // White hover background
          pointHoverBorderColor: '#4caf50', // Green hover border
          borderWidth: 2, // Thicker line
          pointRadius: 4, // Larger points
          pointHoverRadius: 6, // Larger hover points
          fill: true, // Fill under the line
        },
      ],
    };
    setChartData(chartData);
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#fff', // White legend text
        },
      },
      title: {
        display: true,
        text: 'Last 13 Months Consumer Price Index (CPI)', // Hover chart title
        color: '#fff', // White title text
        font: {
          size: 16,
        },
      },
      tooltip: {
        backgroundColor: '#2e2e2e', // Dark tooltip background
        titleColor: '#4caf50', // Green tooltip title
        bodyColor: '#fff', // White tooltip text
        borderColor: '#4caf50', // Green tooltip border
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: '#444', // Darker grid lines
        },
        ticks: {
          color: '#fff', // White x-axis labels
        },
      },
      y: {
        grid: {
          color: '#444', // Darker grid lines
        },
        ticks: {
          color: '#fff', // White y-axis labels
        },
      },
    },
  };

  return (
    <div className="cpi-container">
      <div
        className="cpi-header"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <h2>US Consumer Price Index (CPI)</h2>
        {hovered && chartData && (
          <div className="hover-chart">
            <Line data={chartData} options={options} />
          </div>
        )}
      </div>
      <ul className="cpi-list">
        {cpiData.map((item, index) => (
          <li key={index} className="cpi-item">
            <span className="month-name">{item.formattedDate}</span>
            <span className="cpi-value">{item.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Cpi;