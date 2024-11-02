// src/components/VCNews.js
import React from 'react';

const VCNews = ({ newsData }) => {
  return (
    <div className="vc-news">
      <h2>Recent Funded Startups</h2>
      <ul>
        {newsData.map((news) => (
          <li key={news.id}>
            <strong>{news.title}</strong> - <span>{news.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VCNews;
