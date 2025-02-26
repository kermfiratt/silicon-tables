// src/components/Employement.js
import React, { useEffect, useState } from 'react';
import './Employement.css';
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

const Employement = () => {
  const [unemploymentData, setUnemploymentData] = useState([]);
  const [hovered, setHovered] = useState(false);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchUnemploymentData = async () => {
      const apiKey = process.env.REACT_APP_ALPHA_VANTAGE_KEY; // Use environment variable
      const response = await fetch(
        `https://www.alphavantage.co/query?function=UNEMPLOYMENT&apikey=${apiKey}`
      );
      const data = await response.json();

      if (data && data.data) {
        // Get the last 5 unemployment data points for the block
        const lastFiveData = data.data.slice(0, 5).map((item) => ({
          ...item,
          formattedDate: formatDate(item.date), // Format the date
        }));
        setUnemploymentData(lastFiveData);

        // Get the last 13 unemployment data points for the hover chart
        const lastThirteenData = data.data.slice(0, 13).map((item) => ({
          ...item,
          formattedDate: formatDate(item.date), // Format the date
        }));
        prepareChartData(lastThirteenData);
      }
    };

    fetchUnemploymentData();
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
          label: 'Unemployment Rate (%)',
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
        text: 'Last 13 Months Unemployment Rate',
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
    <div className="unemployment-container">
      <div
        className="unemployment-header"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <h2>US Unemployment Rate</h2>
        {hovered && chartData && (
          <div className="hover-chart">
            <Line data={chartData} options={options} />
          </div>
        )}
      </div>
      <ul className="unemployment-list">
        {unemploymentData.map((item, index) => (
          <li key={index} className="unemployment-item">
            <span className="month-name">{item.formattedDate}</span>
            <span className="unemployment-value">{item.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Employement;