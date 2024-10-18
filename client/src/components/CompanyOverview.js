import React from 'react';
import './CompanyOverview.css';

const CompanyOverview = ({ company }) => {
  return (
    <div className="block company-overview"> {/* Using .block for equal sizing */}
      <img src={company.logoUrl} alt={`${company.name} logo`} className="company-logo" />
      <h3>{company.name}</h3>
      <p><strong>Ticker:</strong> {company.ticker}</p>
      <p><strong>Stock Price:</strong> {company.stockPrice ? `$${company.stockPrice.toFixed(2)}` : 'N/A'}</p>
      <p><strong>Stock Change:</strong> {company.stockChange ? `${company.stockChange}%` : 'N/A'}</p>
      <p><strong>Market Cap:</strong> {company.marketCap || 'N/A'}</p>
      <p><strong>Industry:</strong> {company.industry || 'N/A'}</p>
    </div>
  );
};

export default CompanyOverview;
