// src/components/OptionTracker.js
import React, { useState } from 'react';
import './OptionTracker.css';

const OptionTracker = () => {
  const [options, setOptions] = useState([]);
  const [newOption, setNewOption] = useState({
    company: '',
    shares: 0,
    optionPrice: 0,
    currentPrice: 0,
    expiryDate: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOption({ ...newOption, [name]: value });
  };

  const addOption = () => {
    setOptions([...options, newOption]);
    setNewOption({ company: '', shares: 0, optionPrice: 0, currentPrice: 0, expiryDate: '' });
  };

  return (
    <div className="option-tracker-container">
      <h2>Stock Option Tracker</h2>
      
      {/* Kullanıcı Giriş Formu */}
      <div className="option-input-form">
        <input
          type="text"
          name="company"
          placeholder="Company Name"
          value={newOption.company}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="shares"
          placeholder="Number of Shares"
          value={newOption.shares}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="optionPrice"
          placeholder="Option Price"
          value={newOption.optionPrice}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="currentPrice"
          placeholder="Current Price"
          value={newOption.currentPrice}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="expiryDate"
          value={newOption.expiryDate}
          onChange={handleInputChange}
        />
        <button onClick={addOption}>Add Option</button>
      </div>

      {/* Opsiyon Tablosu */}
      <table className="option-tracker-table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Shares</th>
            <th>Option Price</th>
            <th>Current Price</th>
            <th>Expiry Date</th>
            <th>Potential Profit/Loss</th>
          </tr>
        </thead>
        <tbody>
          {options.map((option, index) => {
            const potentialProfit = ((option.currentPrice - option.optionPrice) * option.shares).toFixed(2);
            return (
              <tr key={index}>
                <td>{option.company}</td>
                <td>{option.shares}</td>
                <td>${option.optionPrice}</td>
                <td>${option.currentPrice}</td>
                <td>{new Date(option.expiryDate).toLocaleDateString()}</td>
                <td style={{ color: potentialProfit >= 0 ? 'green' : 'red' }}>
                  ${potentialProfit}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default OptionTracker;
