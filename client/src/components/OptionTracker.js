// src/components/OptionTracker.js
import React, { useState, useEffect } from 'react';
import './OptionTracker.css';

const OptionTracker = () => {
  const [options, setOptions] = useState([]);
  const [newOption, setNewOption] = useState({
    company: '',
    shares: 0,
    optionPrice: 0,
    currentPrice: 0,
    expiryDate: '',
    vestingStartDate: '',
    vestingPeriod: 12,  // Vesting period in months
    totalVestingDuration: 48  // Total vesting duration in months
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOption({ ...newOption, [name]: value });
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
      vestingPeriod: 12,
      totalVestingDuration: 48
    });
  };

  const calculateVestedShares = (vestingStartDate, shares, totalVestingDuration) => {
    const start = new Date(vestingStartDate);
    const now = new Date();
    const monthsSinceStart = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
    const vestedPercentage = Math.min(monthsSinceStart / totalVestingDuration, 1); // Cap at 100%
    return Math.floor(vestedPercentage * shares);
  };

  const estimateTax = (profit) => {
    const taxRate = 0.2; // Assume a flat 20% tax rate
    return (profit * taxRate).toFixed(2);
  };

  return (
    <div className="option-tracker-container">
      <h2>Stock Option & Equity Tracker</h2>
      
      <div className="option-input-form">
        <table className="input-table">
          <tbody>
            <tr>
              <td><label>Company Name:</label></td>
              <td><input type="text" name="company" value={newOption.company} onChange={handleInputChange} /></td>
            </tr>
            <tr>
              <td><label>Number of Shares:</label></td>
              <td><input type="number" name="shares" value={newOption.shares} onChange={handleInputChange} /></td>
            </tr>
            <tr>
              <td><label>Option Price ($):</label></td>
              <td><input type="number" name="optionPrice" value={newOption.optionPrice} onChange={handleInputChange} /></td>
            </tr>
            <tr>
              <td><label>Current Price ($):</label></td>
              <td><input type="number" name="currentPrice" value={newOption.currentPrice} onChange={handleInputChange} /></td>
            </tr>
            <tr>
              <td><label>Expiry Date:</label></td>
              <td><input type="date" name="expiryDate" value={newOption.expiryDate} onChange={handleInputChange} /></td>
            </tr>
            <tr>
              <td><label>Vesting Start Date:</label></td>
              <td><input type="date" name="vestingStartDate" value={newOption.vestingStartDate} onChange={handleInputChange} /></td>
            </tr>
            <tr>
              <td><label>Total Vesting Duration (months):</label></td>
              <td><input type="number" name="totalVestingDuration" value={newOption.totalVestingDuration} onChange={handleInputChange} /></td>
            </tr>
          </tbody>
        </table>
        <button onClick={addOption}>Add Option</button>
      </div>

      <table className="option-tracker-table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Shares</th>
            <th>Vested Shares</th>
            <th>Option Price</th>
            <th>Current Price</th>
            <th>Current Value</th>
            <th>Potential Profit/Loss</th>
            <th>Tax Estimate</th>
            <th>Expiry Date</th>
          </tr>
        </thead>
        <tbody>
          {options.map((option, index) => {
            const vestedShares = calculateVestedShares(option.vestingStartDate, option.shares, option.totalVestingDuration);
            const potentialProfit = ((option.currentPrice - option.optionPrice) * vestedShares).toFixed(2);
            const taxEstimate = estimateTax(potentialProfit);
            const currentValue = (option.currentPrice * vestedShares).toFixed(2);
            
            return (
              <tr key={index}>
                <td>{option.company}</td>
                <td>{option.shares}</td>
                <td>{vestedShares}</td>
                <td>${option.optionPrice}</td>
                <td>${option.currentPrice}</td>
                <td>${currentValue}</td>
                <td style={{ color: potentialProfit >= 0 ? 'green' : 'red' }}>
                  ${potentialProfit}
                </td>
                <td>${taxEstimate}</td>
                <td>{new Date(option.expiryDate).toLocaleDateString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default OptionTracker;
