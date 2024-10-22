// src/components/StockNews.js
import React from 'react';
import './StockNews.css';

const StockNews = () => {
  // Placeholder data for daily stock news
  const news = [
    { id: 1, title: 'Apple stock rises as new iPhone sales surpass expectations', date: 'October 22, 2024' },
    { id: 2, title: 'Tesla posts record earnings for Q3, 2024', date: 'October 22, 2024' },
    { id: 3, title: 'Microsoft boosts cloud division, stock jumps 5%', date: 'October 21, 2024' },
    { id: 4, title: 'Amazon shares drop after CEO resigns', date: 'October 21, 2024' },
    { id: 5, title: 'Meta explores new VR technology, stock climbs 3%', date: 'October 20, 2024' }
  ];

  return (
    <div className="stock-news-container">
      <h2 className="stock-news-header">Daily Stock News</h2>
      <ul className="stock-news-list">
        {news.map((item) => (
          <li key={item.id} className="stock-news-item">
            <strong>{item.date}</strong> - {item.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StockNews;
