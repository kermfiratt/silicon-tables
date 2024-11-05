// src/components/ProductHuntTop5.js
import React from 'react';
import './ProductHuntTop5.css';

const ProductHuntTop5 = () => {
  // Placeholder data for the top gaining startups of the day
  const startups = [
    { id: 1, name: 'GreenTech Solutions', gain_percentage: 12.5 },
    { id: 2, name: 'BioFuture', gain_percentage: 10.2 },
    { id: 3, name: 'Quantum AI', gain_percentage: 9.8 },
    { id: 4, name: 'NeuralNet Labs', gain_percentage: 8.9 },
    { id: 5, name: 'Eco Innovations', gain_percentage: 8.3 },
    { id: 6, name: 'UrbanSolar', gain_percentage: 7.7 },
    { id: 7, name: 'AgroNova', gain_percentage: 7.3 },
  ];

  // Get the current date formatted (e.g., 22 October 2024)
  const currentDate = new Date().toLocaleDateString('en-US', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="product-hunt-container">
      <div className="product-hunt-left">
        <span>{currentDate}</span>
      </div>
      <div className="product-hunt-right">
        <h2 className="product-hunt-header">Top Gaining Startups of the Day</h2>
        <ul className="product-hunt-list">
          {startups.map((startup, index) => (
            <li key={startup.id} className="product-hunt-item">
              <span className="product-rank">{index + 1}.</span>
              <span className="product-name">{startup.name}</span>
              <span className="product-votes">+{startup.gain_percentage}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductHuntTop5;
