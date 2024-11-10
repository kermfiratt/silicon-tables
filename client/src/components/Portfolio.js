// src/components/Portfolio.js
import React, { useState } from 'react';
import axios from 'axios';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './Portfolio.css';

const Portfolio = () => {
  const [assets, setAssets] = useState([
    { symbol: 'HKP', name: 'Hedef Portföy', price: 3.21, change: 0.80, total: 3215.80, cost: 3.0, amount: 1000 },
    { symbol: 'MACKO', name: 'Mackolik Internet', price: 82.35, change: 1.29, total: 8235.35, cost: 80.0, amount: 100 },
    { symbol: 'YYLGD', name: 'Yayla Agro Gıda', price: 9.71, change: 2.21, total: 971.00, cost: 9.0, amount: 500 },
  ]);

  const [newSymbol, setNewSymbol] = useState('');
  const [newName, setNewName] = useState('');
  const [newCost, setNewCost] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [expandedAsset, setExpandedAsset] = useState(null);

  const API_KEY = process.env.REACT_APP_API_KEY;

  const handleAddAsset = async () => {
    if (!newSymbol || !newName || !newCost || !newAmount) return;

    try {
      const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${newSymbol.toUpperCase()}&token=${API_KEY}`);
      const price = response.data.c;

      if (price) {
        const amount = parseFloat(newAmount);
        const cost = parseFloat(newCost);
        const total = price * amount;
        const newAsset = {
          symbol: newSymbol.toUpperCase(),
          name: newName,
          price: parseFloat(price),
          change: ((price - response.data.pc) / response.data.pc * 100).toFixed(2),
          total: total.toFixed(2),
          cost: cost,
          amount: amount,
        };
        setAssets([...assets, newAsset]);
        setNewSymbol('');
        setNewName('');
        setNewCost('');
        setNewAmount('');
      }
    } catch (error) {
      console.error("Error fetching stock price:", error);
    }
  };

  const handleRemoveAsset = (symbol) => {
    setAssets(assets.filter((asset) => asset.symbol !== symbol));
  };

  const toggleExpandAsset = (symbol) => {
    setExpandedAsset(expandedAsset === symbol ? null : symbol);
  };

  return (
    <div className="portfolio-container">
      <h1 className="portfolio-title">My Portfolio</h1>
      <div className="portfolio-summary">
        <span>Total Value</span>
        <h2>${assets.reduce((sum, asset) => sum + parseFloat(asset.total), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
        <p>+7,652.12 (Today)</p>
      </div>
      
      <div className="assets-list">
        {assets.map((asset, index) => (
          <div key={index} className="asset-item">
            <div className="asset-header" onClick={() => toggleExpandAsset(asset.symbol)}>
              <div className="asset-info">
                <span className="asset-symbol">{asset.symbol}</span>
                <span className="asset-name">{asset.name}</span>
              </div>
              <span className="asset-toggle">
                {expandedAsset === asset.symbol ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </div>
            <div className="asset-details">
              <div className="detail-item">
                <span className="label">Current:</span> 
                <span className="value">${asset.price.toFixed(2)}</span>
              </div>
              <div className="detail-item">
                <span className="label">Today:</span> 
                <span className={`value ${asset.change >= 0 ? 'positive' : 'negative'}`}>
                  {asset.change >= 0 ? '+' : ''}{asset.change}%
                </span>
              </div>
              <div className="detail-item">
                <span className="label">Total:</span> 
                <span className="value">${parseFloat(asset.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              {expandedAsset === asset.symbol && (
                <div className="asset-expanded">
                  <div className="detail-item">
                    <span className="label">Total Gain/Loss:</span> 
                    <span className="value">
                      ${((asset.price - asset.cost) * asset.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <button className="remove-button" onClick={() => handleRemoveAsset(asset.symbol)}>Remove</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="add-asset-form">
        <input
          type="text"
          placeholder="Symbol"
          value={newSymbol}
          onChange={(e) => setNewSymbol(e.target.value)}
        />
        <input
          type="text"
          placeholder="Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Cost per Share"
          value={newCost}
          onChange={(e) => setNewCost(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={newAmount}
          onChange={(e) => setNewAmount(e.target.value)}
        />
        <button onClick={handleAddAsset}>Add Asset</button>
      </div>
    </div>
  );
};

export default Portfolio;
