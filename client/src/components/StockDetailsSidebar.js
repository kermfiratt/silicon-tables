// src/components/StockDetailsSidebar.js
import React from 'react';
import './StockDetailsSidebar.css';

const StockDetailsSidebar = ({ symbol, setOwnershipView, setFundOwnershipView, setFinancialsView, setRevenueBreakdownView, setPriceMetricsView, activeSection }) => {
  return (
    <div className="stock-details-sidebar">
      <h2>Şirket İsmi</h2>
      <ul>
        <li
          onClick={setOwnershipView}
          className={activeSection === 'ownership' ? 'active' : ''}
        >
          Ownership
        </li>
        <li
          onClick={setFundOwnershipView}
          className={activeSection === 'fundOwnership' ? 'active' : ''}
        >
          Fund Ownership
        </li>
        <li
          onClick={setFinancialsView}
          className={activeSection === 'financials' ? 'active' : ''}
        >
          Financials
        </li>
        <li
          onClick={setRevenueBreakdownView}
          className={activeSection === 'revenueBreakdown' ? 'active' : ''}
        >
          Revenue Breakdown
        </li>
        <li
          onClick={setPriceMetricsView}
          className={activeSection === 'priceMetrics' ? 'active' : ''}
        >
          Price Metrics
        </li>
        <li
          className={activeSection === 'historicalMarketCap' ? 'active' : ''}
        >
          Historical Market Cap
        </li>
        <li
          className={activeSection === 'peers' ? 'active' : ''}
        >
          Peers
        </li>
      </ul>
    </div>
  );
};

export default StockDetailsSidebar;
