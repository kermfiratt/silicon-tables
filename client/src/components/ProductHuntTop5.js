import React from 'react';
import './ProductHuntTop5.css';

const ProductHuntTop5 = () => {
  // Placeholder data for the top 5 products of the day
  const products = [
    { id: 1, name: 'AI based phone', votes_count: 120 },
    { id: 2, name: 'Revolutionary design', votes_count: 98 },
    { id: 3, name: 'Innovative AI', votes_count: 134 },
    { id: 4, name: 'Next-gen writng', votes_count: 90 },
    { id: 5, name: 'Best-in-class robot', votes_count: 110 },
    { id: 6, name: 'Robotic Fabrics', votes_count: 160 },
    { id: 7, name: 'Full Self Drive', votes_count: 172 },
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
        <h2 className="product-hunt-header">Top 5 Products of the Day</h2>
        <ul className="product-hunt-list">
          {products.map((product, index) => (
            <li key={product.id} className="product-hunt-item">
              <span className="product-rank">{index + 1}.</span>
              <span className="product-name">{product.name}</span>
              <span className="product-votes">{product.votes_count} votes</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductHuntTop5;
