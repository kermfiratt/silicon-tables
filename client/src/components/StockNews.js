// src/components/StockNews.js
import React, { useState, useEffect } from 'react';
import './StockNews.css';

const StockNews = () => {
  const [news, setNews] = useState([]);
  const [visibleNews, setVisibleNews] = useState(5); // Controls how many articles are shown initially
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStockNews = async () => {
      try {
        const response = await fetch(
          `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&topics=financial_markets&apikey=${process.env.REACT_APP_ALPHA_VANTAGE_KEY}`
        );
        const data = await response.json();

        if (data.feed) {
          const filteredNews = data.feed.filter(
            (item) => item.title !== 'Before you continue' // Exclude irrelevant entries
          );
          setNews(filteredNews);
        } else {
          setError('No news data found.');
        }
      } catch (error) {
        setError('Error fetching stock news.');
      }
    };

    fetchStockNews();
  }, []);

  const handleShowMore = () => {
    setVisibleNews((prev) => prev + 5); // Show 5 more articles each time the button is clicked
  };

  if (error) {
    return (
      <div className="stock-news-container">
        <h2 className="stock-news-header">General Stock News</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="stock-news-container">
      <h2 className="stock-news-header">General Stock News</h2>
      <ul className="stock-news-list">
        {news.slice(0, visibleNews).map((item, index) => (
          <li key={index} className="stock-news-item">
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              {item.title}
            </a>
            <p>{item.summary.slice(0, 100)}...</p> {/* Shortened summary */}
          </li>
        ))}
      </ul>
      {visibleNews < news.length && (
        <button className="load-more-button-stock" onClick={handleShowMore}>
          Show More
        </button>
      )}
    </div>
  );
};

export default StockNews;
