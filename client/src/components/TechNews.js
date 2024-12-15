// src/components/TechNews.js
import React, { useState, useEffect } from 'react';
import './TechNews.css';

const TechNews = () => {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleNews, setVisibleNews] = useState(5); // Show 5 articles initially

  const fetchTechNews = async () => {
    const apiKey = process.env.REACT_APP_ALPHA_VANTAGE_KEY; // Use the correct environment variable
    const url = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&topics=technology&limit=50&apikey=${apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data); // Debug the response

      // Filter the news to exclude articles with the title "Before you continue"
      const filteredNews = data.feed.filter((item) => item.title !== 'Before you continue');

      if (filteredNews.length > 0) {
        setNews(filteredNews);
      } else {
        setError('No relevant news data found.');
      }
    } catch (err) {
      setError(`Failed to fetch news data: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTechNews();
  }, []);

  const handleLoadMore = () => {
    setVisibleNews((prev) => prev + 5); // Show 5 more articles
  };

  return (
    <div className="tech-news-container">
      <h2 className="tech-news-header">Technology News</h2>

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
                <p>{item.summary.slice(0, 100)}...</p> {/* Shortened the explanation */}
              </li>
            ))}
          </ul>
          {news.length > 5 && (
            <div className="load-more-wrapper">
              <button className="load-more-button" onClick={handleLoadMore}>
                Show More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TechNews;
