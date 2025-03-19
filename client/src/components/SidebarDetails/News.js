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

  // Function to parse the API's date format (YYYYMMDDTHHMMSS)
  const parseDate = (dateString) => {
    const year = dateString.slice(0, 4);
    const month = dateString.slice(4, 6);
    const day = dateString.slice(6, 8);
    const hour = dateString.slice(9, 11);
    const minute = dateString.slice(11, 13);
    const second = dateString.slice(13, 15);
    return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
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
            {/* Image and Date Container */}
            <div className="news-image-container">
              {article.banner_image && (
                <img
                  src={article.banner_image}
                  alt={article.title}
                  className="news-image"
                />
              )}
              <p className="news-date">
                {parseDate(article.time_published).toLocaleString()}
              </p>
            </div>

            {/* Content Container */}
            <div className="news-content">
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="news-title-blue"
              >
                {article.title}
              </a>
              <p className="news-summary">{article.summary}</p>
            </div>

            {/* Divider between news items */}
            {index < news.length - 1 && <hr className="news-divider" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;