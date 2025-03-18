import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './News.css'; // Import the CSS file

const News = ({ symbol, refs, activeSection }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false); // Changed to false initially
  const [error, setError] = useState(null);
  const [dataFetched, setDataFetched] = useState(false); // Track if data has been fetched

  const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY;

  // Fetch data only when the section is active and data hasn't been fetched before
  useEffect(() => {
    if (activeSection === 'news' && !dataFetched) {
      setDataFetched(true); // Mark data as fetched
      fetchNews();
    }
  }, [activeSection, dataFetched]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${symbol}&apikey=${API_KEY}`
      );
      const data = response.data;

      if (data && data.feed) {
        setNews(data.feed.slice(0, 10)); // Limit to 10 articles
      } else {
        throw new Error('No news data available.');
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching news:', err.message);
      setError('Failed to load news.');
      setLoading(false);
    }
  };

  // Only render the wrapper if the active section is 'news'
  if (activeSection !== 'news') {
    return null; // Return null to prevent rendering
  }

  if (loading) {
    return (
      <div className="news-loading-overlay">
        <div className="loader"></div>
        <p className="loading-text">Loading news...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div id="news-section">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!news.length) {
    return (
      <div id="news-section">
        <p>No recent news available for this company.</p>
      </div>
    );
  }

  return (
    <div id="news-section" ref={refs.newsRef}>
      <h4>Recent News</h4>
      <div className="news-list">
        {news.map((article, index) => (
          <div key={index} className="news-item">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="news-title-blue"
            >
              {article.title}
            </a>
            <p className="news-date">
              {new Date(article.time_published).toLocaleDateString()}
            </p>
            <p className="news-summary">{article.summary}</p>
            {index < news.length - 1 && <hr className="news-divider" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;