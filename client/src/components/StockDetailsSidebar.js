// src/components/StockDetailsSidebar.js
import React from 'react';
import './StockDetailsSidebar.css';

const StockDetailsSidebar = ({ symbol, setOwnershipView }) => {
  return (
    <div className="stock-details-sidebar">
      <h2>Şirket İsmi</h2>
      <ul>
        <li onClick={setOwnershipView}>Ownership</li> {/* setOwnershipView çağrısı */}
        <li>Fund Ownership</li>
        <li>Financials</li>
        <li>Revenue Breakdown</li>
        <li>Price Metrics</li>
        <li>Historical Market Cap</li>
        <li>Peers</li>
      </ul>
    </div>
  );
};

export default StockDetailsSidebar;
