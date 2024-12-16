// src/components/TechNews.js
import React, { useState, useEffect } from 'react';
import './TechNews.css';

const TechNews = () => {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleNews, setVisibleNews] = useState(10); // Show 10 articles initially
  const [selectedCategory, setSelectedCategory] = useState('technology'); // Default category

  const categories = [
    { label: 'Technology', value: 'technology' },
    { label: 'Finance', value: 'finance' },
    { label: 'Blockchain', value: 'blockchain' },
    { label: 'Earnings', value: 'earnings' },
    { label: 'IPO', value: 'ipo' },
    { label: 'Mergers & Acquisitions', value: 'mergers_and_acquisitions' },
    { label: 'Real Estate', value: 'real_estate' },
  ];

  const fetchNews = async (category) => {
    const apiKey = process.env.REACT_APP_ALPHA_VANTAGE_KEY;
    const url = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&topics=${category}&limit=50&apikey=${apiKey}`;

    try {
      setIsLoading(true);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const filteredNews = data.feed.filter((item) => item.title !== 'Before you continue');

      if (filteredNews.length > 0) {
        setNews(filteredNews);
      } else {
        setError('No relevant news data found.');
        setNews([]);
      }
    } catch (err) {
      setError(`Failed to fetch news data: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(selectedCategory);
  }, [selectedCategory]);

  const handleLoadMore = () => setVisibleNews((prev) => prev + 10);
  const handleShowLess = () => setVisibleNews(10);
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setVisibleNews(10);
    setError(null);
  };

  return (
    <div className="tech-news-container">
      <h2 className="news-header-newyork">Daily News</h2>
      <div className="category-selector">
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="news-category-dropdown"
        >
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      {isLoading && <p>Loading news...</p>}
      {error && <p className="error-message">{error}</p>}

      {!isLoading && !error && (
        <>
          <ul className="tech-news-list">
            {news.slice(0, visibleNews).map((item, index) => (
              <li key={index} className="tech-news-item">
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  <strong>{item.source}</strong>: {item.title}
                </a>
                <p>{item.summary.slice(0, 100)}...</p>
              </li>
            ))}
          </ul>
          {news.length > 10 && (
            <div className="load-more-wrapper">
              {visibleNews < news.length && (
                <button className="load-more-button" onClick={handleLoadMore}>
                  Show More
                </button>
              )}
              {visibleNews > 10 && (
                <button className="load-less-button" onClick={handleShowLess}>
                  Show Less
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TechNews;
