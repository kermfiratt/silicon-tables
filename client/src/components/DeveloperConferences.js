// src/components/DeveloperConferences.js
import React from 'react';
import './DeveloperConferences.css';

const DeveloperConferences = () => {
  // Placeholder data for recently funded startups
  const startups = [
    { id: 1, name: 'Figma', amount: '$200M', date: 'February 2024' },
    { id: 2, name: 'Notion', amount: '$150M', date: 'March 2024' },
    { id: 3, name: 'Robinhood', amount: '$100M', date: 'March 2024' },
    { id: 4, name: 'Plaid', amount: '$300M', date: 'April 2024' },
    { id: 5, name: 'Stripe', amount: '$600M', date: 'April 2024' },
  ];

  return (
    <div className="developer-conferences-container">
      <h2 className="developer-conferences-header">Recently Funded Startups</h2>
      <ul className="developer-conferences-list">
        {startups.map((startup, index) => (
          <li key={startup.id} className="developer-conference-item">
            <strong>{index + 1}.</strong> {startup.name} <br />
            <span>{startup.amount} - {startup.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeveloperConferences;
