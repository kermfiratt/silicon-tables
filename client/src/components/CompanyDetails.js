// src/components/CompanyDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './CompanyDetalis.css';

const CompanyDetails = () => {
  const { symbol } = useParams();
  const [companyData, setCompanyData] = useState({});
  const [news, setNews] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isStockView, setIsStockView] = useState(false); // State for switch
  const API_KEY = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const profileResponse = await axios.get(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${API_KEY}`);
        const priceResponse = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`);
        const recommendationsResponse = await axios.get(`https://finnhub.io/api/v1/stock/recommendation?symbol=${symbol}&token=${API_KEY}`);

        setCompanyData({ ...profileResponse.data, ...priceResponse.data });
        setRecommendations(recommendationsResponse.data);

        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const newsResponse = await axios.get(`https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${startDate}&to=${endDate}&token=${API_KEY}`);
        setNews(newsResponse.data.slice(0, 20));

        setLoading(false);
      } catch (error) {
        console.error('Error fetching company data:', error);
        setError('Failed to fetch company data.');
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [symbol, API_KEY]);

  const toggleView = () => {
    setIsStockView((prev) => !prev);
  };

  if (loading) return <p>Loading company data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="company-details">
      <h2>{companyData.name || "Company Name"}</h2>
      
      {/* Apple-style switch button */}
      <div className="switch-container">
        <span className={!isStockView ? "switch-option active" : "switch-option"} onClick={() => setIsStockView(false)}>General</span>
        <span className={isStockView ? "switch-option active" : "switch-option"} onClick={() => setIsStockView(true)}>Stock</span>
      </div>

      <div className="grid-container">
        {isStockView ? (
          <>
            <div className="block">
              <div className="block-header">Stock Profile</div>
              <div className="block-content">
                <p><strong>Current Price:</strong> {companyData.c ? `$${companyData.c}` : 'N/A'}</p>
                <p><strong>High Price:</strong> {companyData.h ? `$${companyData.h}` : 'N/A'}</p>
                <p><strong>Low Price:</strong> {companyData.l ? `$${companyData.l}` : 'N/A'}</p>
              </div>
            </div>

            <div className="block">
              <div className="block-header">Analyst Recommendations</div>
              <div className="block-content">
                {recommendations.length > 0 ? (
                  <p><strong>Buy:</strong> {recommendations[0].buy || 'N/A'} | 
                     <strong> Hold:</strong> {recommendations[0].hold || 'N/A'} | 
                     <strong> Sell:</strong> {recommendations[0].sell || 'N/A'}</p>
                ) : <p>No recommendations available.</p>}
              </div>
            </div>

            <div className="block">
              <div className="block-header">Market Performance</div>
              <div className="block-content">
                <p><strong>Market Cap:</strong> {companyData.marketCapitalization ? `$${companyData.marketCapitalization.toLocaleString()}` : 'N/A'}</p>
                <p><strong>IPO Date:</strong> {companyData.ipo || 'N/A'}</p>
              </div>
            </div>

            <div className="block">
              <div className="block-header">Exchange Info</div>
              <div className="block-content">
                <p><strong>Currency:</strong> {companyData.currency || 'N/A'}</p>
                <p><strong>Exchange:</strong> {companyData.exchange || 'N/A'}</p>
              </div>
            </div>


            <div className="block">
              <div className="block-header">Previous Close</div>
              <div className="block-content">
                <p>{companyData.pc ? `$${companyData.pc}` : 'N/A'}</p>
              </div>
            </div>

            <div className="block">
              <div className="block-header">52-Week High</div>
              <div className="block-content">
                <p>{companyData.high52 ? `$${companyData.high52}` : 'N/A'}</p>
              </div>
            </div>

            <div className="block">
              <div className="block-header">52-Week Low</div>
              <div className="block-content">
                <p>{companyData.low52 ? `$${companyData.low52}` : 'N/A'}</p>
              </div>
            </div>

            <div className="block">
              <div className="block-header">Volume</div>
              <div className="block-content">
                <p>{companyData.volume || 'N/A'}</p>
              </div>
            </div>

            <div className="block">
              <div className="block-header">Dividend Yield</div>
              <div className="block-content">
                <p>{companyData.dividendYield || 'N/A'}</p>
              </div>
            </div>

            <div className="block">
              <div className="block-header">P/E Ratio</div>
              <div className="block-content">
                <p>{companyData.peRatio || 'N/A'}</p>
              </div>
              </div>

          </>
        ) : (
          <>
            <div className="block">
              <div className="block-header">Profile</div>
              <div className="block-content">
                <p><strong>Industry:</strong> {companyData.finnhubIndustry || 'N/A'}</p>
                <p><strong>Country:</strong> {companyData.country || 'N/A'}</p>
                <p><strong>Website:</strong> 
                  <a href={companyData.weburl} target="_blank" rel="noopener noreferrer">
                    {companyData.weburl || 'N/A'}
                  </a>
                </p>
              </div>
            </div>

            <div className="block">
              <div className="block-header">Financials</div>
              <div className="block-content">
                <p><strong>Market Cap:</strong> {companyData.marketCapitalization ? `$${companyData.marketCapitalization.toLocaleString()}` : 'N/A'}</p>
                <p><strong>Shares Outstanding:</strong> {companyData.shareOutstanding || 'N/A'}</p>
              </div>
            </div>

            <div className="block">
              <div className="block-header">Stock Price</div>
              <div className="block-content">
                <p><strong>Current Price:</strong> {companyData.c ? `$${companyData.c}` : 'N/A'}</p>
                <p><strong>High Price:</strong> {companyData.h ? `$${companyData.h}` : 'N/A'}</p>
                <p><strong>Low Price:</strong> {companyData.l ? `$${companyData.l}` : 'N/A'}</p>
              </div>
            </div>

            <div className="block">
              <div className="block-header">Employees</div>
              <div className="block-content">
                <p>{companyData.employeeTotal || 'N/A'}</p>
              </div>
            </div>

            <div className="block">
              <div className="block-header">Location</div>
              <div className="block-content">
                <p>{companyData.country || 'N/A'}</p>
              </div>
            </div>

            <div className="block">
              <div className="block-header">Additional Info</div>
              <div className="block-content">
                <p><strong>Currency:</strong> {companyData.currency || 'N/A'}</p>
                <p><strong>Exchange:</strong> {companyData.exchange || 'N/A'}</p>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="news-block">
        <h3 className="news-header">Recent News</h3>
        <div className="news-list">
          {news.length > 0 ? (
            news.map((article, index) => (
              <div key={index} className="news-item">
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="news-title">
                  {article.headline}
                </a>
                <p className="news-date">{new Date(article.datetime * 1000).toLocaleDateString()}</p>
                <p className="news-summary">{article.summary}</p>
                {index < news.length - 1 && <hr className="news-divider" />}
              </div>
            ))
          ) : (
            <p>No recent news available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
