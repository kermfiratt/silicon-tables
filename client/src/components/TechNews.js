// src/components/TechNews.js
import React from 'react';
import './TechNews.css';

const TechNews = () => {
  // Placeholder data for tech news
  const techNews = [
    { id: 1, title: 'Apple Announces New MacBook Pro', date: 'October 22, 2024' },
    { id: 2, title: 'Google Unveils AI-Powered Search Update', date: 'October 21, 2024' },
    { id: 3, title: 'Meta Introduces Horizon Workrooms 2.0', date: 'October 20, 2024' },
    { id: 4, title: 'Microsoft Launches Windows 12 Beta', date: 'October 19, 2024' },
    { id: 5, title: 'Tesla Opens New Gigafactory in Texas', date: 'October 18, 2024' },
  ];

  return (
    <div className="tech-news-container">
      <h2 className="tech-news-header">Daily Tech News</h2>
      <ul className="tech-news-list">
        {techNews.map((news) => (
          <li key={news.id} className="tech-news-item">
            <strong>{news.date}</strong> - {news.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TechNews;
