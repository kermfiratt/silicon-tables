// src/components/RecentVCFunds.js
import React from 'react';
import './RecentVCFunds.css';

const RecentVCFunds = () => {
  // Placeholder data for recent VC funds
  const funds = [
    { id: 1, startup: 'Startup Alpha', amount: '$5M' },
    { id: 2, startup: 'Beta Tech', amount: '$3.2M' },
    { id: 3, startup: 'Gamma Innovations', amount: '$7M' },
    { id: 4, startup: 'Delta AI', amount: '$4.5M' },
    { id: 5, startup: 'Epsilon Ventures', amount: '$2M' },
  ];

  return (
    <div className="recent-vc-funds-container">
      <h3 className="recent-vc-funds-header">Recent VC Funds</h3>
      <ul className="recent-vc-funds-list">
        {funds.map((fund) => (
          <li key={fund.id} className="recent-vc-funds-item">
            <span className="startup-name">{fund.startup}</span>
            <span className="fund-amount">{fund.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentVCFunds;
