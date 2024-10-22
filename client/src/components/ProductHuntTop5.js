// src/components/ProductHuntTop5.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProductHuntTop5.css';

const ProductHuntTop5 = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://api.producthunt.com/v1/posts', {
          headers: {
            Authorization: `Bearer YOUR_PRODUCT_HUNT_API_KEY`,
          },
          params: {
            per_page: 5, // Fetch top 5 products
          },
        });
        setProducts(response.data.posts);
      } catch (error) {
        console.error('Error fetching Product Hunt data:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="product-hunt-container">
      <h2>Top 5 Products on Product Hunt</h2>
      {products.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <ul className="product-list">
          {products.map((product) => (
            <li key={product.id} className="product-item">
              <a href={product.redirect_url} target="_blank" rel="noopener noreferrer">
                <img src={product.thumbnail.image_url} alt={product.name} className="product-thumbnail" />
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p>{product.tagline}</p>
                  <span>{product.votes_count} votes</span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductHuntTop5;
