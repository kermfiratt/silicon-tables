import React, { useEffect, useState } from 'react';
import './Employement.css'; // Use Commodities.css
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
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchUnemploymentData = async () => {
      const apiKey = process.env.REACT_APP_ALPHA_VANTAGE_KEY; // Use environment variable
      const response = await fetch(
        `https://www.alphavantage.co/query?function=UNEMPLOYMENT&apikey=${apiKey}`
      );
      const data = await response.json();

      if (data && data.data) {
        // Sort data by date in descending order (most recent first)
        const sortedData = data.data.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Get the latest 13 months for the chart
        const latestThirteenData = sortedData.slice(0, 13).map((item) => ({
          ...item,
          formattedDate: formatDate(item.date), // Format the date
        }));
        prepareChartData(latestThirteenData);
      }
    };

    fetchUnemploymentData();
  }, []);

  // Function to format the date as "MM / YY"
  const formatDate = (dateString) => {
    const [year, month] = dateString.split('-'); // Split the date string
    const shortYear = year.slice(-2); // Get the last two digits of the year
    return `${month} / ${shortYear}`; // Format as "MM / YY"
  };

  // Prepare data for the chart
  const prepareChartData = (data) => {
    const chartData = {
      labels: data.map((item) => item.formattedDate).reverse(),
      datasets: [
        {
          label: '', // Empty label to remove legend
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
        display: false, // Hide the legend
      },
      title: {
        display: false, // Hide the title
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
          font: {
            size: 10, // Smaller font size for x-axis labels
          },
        },
      },
      y: {
        grid: {
          color: '#444', // Darker grid lines
        },
        ticks: {
          color: '#fff', // White y-axis labels
          font: {
            size: 10, // Smaller font size for y-axis labels
          },
        },
      },
    },
  };

  return (
    <div className="recent-vc-funds-container">
      <div className="recent-vc-funds-header">
        <h2>US Unemployment Rate</h2>
      </div>
      <div className="chart-block">
        {chartData && <Line data={chartData} options={options} />}
      </div>
    </div>
  );
};

export default Employement;