// src/components/Portfolio.js
import React, { useState } from 'react';
import './Portfolio.css';

const Portfolio = () => {
  const [assets, setAssets] = useState([
    { symbol: 'HKP', name: 'Hedef Portföy', price: 3.215878, change: 0.80, total: 321587.80 },
    { symbol: 'MACKO', name: 'Mackolik Internet', price: 82.35, change: 1.29, total: 184546.35 },
    { symbol: 'YYLGD', name: 'Yayla Agro Gıda', price: 9.71, change: 2.21, total: 101857.90 },
  ]);

  const [newSymbol, setNewSymbol] = useState('');
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCost, setNewCost] = useState('');

  const handleAddAsset = () => {
    if (newSymbol && newName && newPrice && newCost) {
      const total = parseFloat(newPrice) * parseFloat(newCost);
      const newAsset = {
        symbol: newSymbol.toUpperCase(),
        name: newName,
        price: parseFloat(newPrice),
        change: 0, // Yeni eklenen varlık için değişim yüzdesi başlangıçta 0 olabilir.
        total: total
      };
      setAssets([...assets, newAsset]);
      setNewSymbol('');
      setNewName('');
      setNewPrice('');
      setNewCost('');
    }
  };

  const handleRemoveAsset = (symbol) => {
    setAssets(assets.filter((asset) => asset.symbol !== symbol));
  };

  return (
    <div className="portfolio-container">
      <h1 className="portfolio-title">My Portfolio</h1>
      <div className="portfolio-summary">
        <span>Total Value</span>
        <h2>₺{assets.reduce((sum, asset) => sum + asset.total, 0).toLocaleString()}</h2>
        <p>+₺7,652.12 (Today)</p>
      </div>
      
      <div className="assets-list">
        {assets.map((asset, index) => (
          <div key={index} className="asset-item">
            <div className="asset-info">
              <span className="asset-symbol">{asset.symbol}</span>
              <span className="asset-name">{asset.name}</span>
            </div>
            <div className="asset-details">
              <span className="asset-price">₺{asset.price.toFixed(2)}</span>
              <span className={`asset-change ${asset.change >= 0 ? 'positive' : 'negative'}`}>
                %{asset.change.toFixed(2)}
              </span>
              <span className="asset-total">₺{asset.total.toLocaleString()}</span>
              <button className="remove-button" onClick={() => handleRemoveAsset(asset.symbol)}>Remove</button>
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
          placeholder="Price"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Cost"
          value={newCost}
          onChange={(e) => setNewCost(e.target.value)}
        />
        <button onClick={handleAddAsset}>Add Asset</button>
      </div>
    </div>
  );
};

export default Portfolio;
