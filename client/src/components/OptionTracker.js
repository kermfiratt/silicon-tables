import React, { useState } from 'react';
import './OptionTracker.css';
import { Bar, Line } from 'react-chartjs-2';
import axios from 'axios';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement);

const OptionTracker = () => {
  const [options, setOptions] = useState([]);
  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [newOption, setNewOption] = useState({
    company: '',
    shares: 0,
    optionPrice: 0,
    currentPrice: 0,
    expiryDate: '',
    vestingStartDate: '',
    totalVestingDuration: 48,
  });

  const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY;

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setNewOption({ ...newOption, [name]: value });

    if (name === 'company' && value.length > 1) {
      try {
        const response = await axios.get(
          `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${value}&apikey=${API_KEY}`
        );
        setAutocompleteResults(response.data.bestMatches || []);
      } catch (error) {
        console.error('Error fetching autocomplete:', error);
      }
    }
  };

  const handleAutocompleteSelect = async (symbol, name) => {
    setNewOption({ ...newOption, company: name });

    try {
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
      );
      const price = response.data['Global Quote']?.['05. price'] || 0;
      setNewOption((prev) => ({ ...prev, currentPrice: parseFloat(price).toFixed(2) }));
    } catch (error) {
      console.error('Error fetching stock price:', error);
    }
    setAutocompleteResults([]);
  };

  const addOption = () => {
    setOptions([...options, newOption]);
    setNewOption({
      company: '',
      shares: 0,
      optionPrice: 0,
      currentPrice: 0,
      expiryDate: '',
      vestingStartDate: '',
      totalVestingDuration: 48,
    });
  };

  const calculateVestedShares = (startDate, shares, duration) => {
    const start = new Date(startDate);
    const now = new Date();
    const elapsedMonths =
      (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
    const percentage = Math.min(elapsedMonths / duration, 1);
    return Math.floor(shares * percentage);
  };

  const calculateChartData = () => {
    const labels = options.map((opt) => opt.company);
    const vestedShares = options.map((opt) =>
      calculateVestedShares(opt.vestingStartDate, opt.shares, opt.totalVestingDuration)
    );
    const potentialProfits = options.map(
      (opt) =>
        (opt.currentPrice - opt.optionPrice) *
        calculateVestedShares(opt.vestingStartDate, opt.shares, opt.totalVestingDuration)
    );

    return { labels, vestedShares, potentialProfits };
  };

  const { labels, vestedShares, potentialProfits } = calculateChartData();

  return (
    <div className="option-tracker-container">
      <h2>Stock Option & Equity Tracker</h2>
      <div className="option-input-form">
        <table>
          <tbody>
            <tr>
              <td>Company Name:</td>
              <td>
                <input type="text" name="company" value={newOption.company} onChange={handleInputChange} />
                {autocompleteResults.length > 0 && (
                  <ul className="autocomplete-dropdown">
                    {autocompleteResults.map((item, index) => (
                      <li
                        key={index}
                        onClick={() =>
                          handleAutocompleteSelect(item['1. symbol'], item['2. name'])
                        }
                      >
                        {item['2. name']} ({item['1. symbol']})
                      </li>
                    ))}
                  </ul>
                )}
              </td>
            </tr>
            <tr>
              <td>Shares:</td>
              <td><input type="number" name="shares" value={newOption.shares} onChange={handleInputChange} /></td>
            </tr>
            <tr>
              <td>Option Price ($):</td>
              <td><input type="number" name="optionPrice" value={newOption.optionPrice} onChange={handleInputChange} /></td>
            </tr>
            <tr>
              <td>Current Price ($):</td>
              <td><input type="number" name="currentPrice" value={newOption.currentPrice} readOnly /></td>
            </tr>
            <tr>
              <td>Vesting Start Date:</td>
              <td><input type="date" name="vestingStartDate" value={newOption.vestingStartDate} onChange={handleInputChange} /></td>
            </tr>
            <tr>
              <td>Expiry Date:</td>
              <td><input type="date" name="expiryDate" value={newOption.expiryDate} onChange={handleInputChange} /></td>
            </tr>
          </tbody>
        </table>
        <button onClick={addOption}>Add Option</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Company</th>
            <th>Shares</th>
            <th>Vested Shares</th>
            <th>Option Price</th>
            <th>Current Price</th>
            <th>Potential Profit</th>
          </tr>
        </thead>
        <tbody>
          {options.map((opt, idx) => {
            const vested = calculateVestedShares(opt.vestingStartDate, opt.shares, opt.totalVestingDuration);
            const profit = ((opt.currentPrice - opt.optionPrice) * vested).toFixed(2);
            return (
              <tr key={idx}>
                <td>{opt.company}</td>
                <td>{opt.shares}</td>
                <td>{vested}</td>
                <td>${opt.optionPrice}</td>
                <td>${opt.currentPrice}</td>
                <td style={{ color: profit > 0 ? 'green' : 'red' }}>${profit}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="charts">
        <div>
          <Bar
            data={{
              labels,
              datasets: [{ label: 'Vested Shares', data: vestedShares, backgroundColor: '#4caf50' }],
            }}
          />
        </div>
        <div>
          <Line
            data={{
              labels,
              datasets: [{ label: 'Potential Profit', data: potentialProfits, borderColor: 'blue', backgroundColor: 'rgba(0, 0, 255, 0.2)' }],
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default OptionTracker;
