// src/components/CompanyDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import StockDetailsSidebar from './StockDetailsSidebar'; // Second sidebar component
import Ownership from './SidebarDetails/Ownership'; // Ownership component
import FundOwnership from './SidebarDetails/FundOwnership'; // FundOwnership component
import Financials from './SidebarDetails/Financials'; // Financials component
import RevenueBreakdown from './SidebarDetails/RevenueBreakdown'; // RevenueBreakdown component
import PriceMetrics from './SidebarDetails/PriceMetrics'; // PriceMetrics component
import HistoricalMarketCap from './SidebarDetails/HistoricalMarketCap'; // HistoricalMarketCap component
import Peers from './SidebarDetails/Peers'; // Peers component
import './CompanyDetalis.css';

const CompanyDetails = () => {
  const { symbol } = useParams();
  const [companyData, setCompanyData] = useState({});
  const [news, setNews] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isStockView, setIsStockView] = useState(true); // Default to stock
  const [isOwnershipView, setIsOwnershipView] = useState(false);
  const [isFundOwnershipView, setIsFundOwnershipView] = useState(false);
  const [isFinancialsView, setIsFinancialsView] = useState(false);
  const [isRevenueBreakdownView, setIsRevenueBreakdownView] = useState(false);
  const [isPriceMetricsView, setIsPriceMetricsView] = useState(false);
  const [isHistoricalMarketCapView, setIsHistoricalMarketCapView] = useState(false);
  const [isPeersView, setIsPeersView] = useState(false);
  const [isNewsView, setIsNewsView] = useState(false); // New state for News view

  const API_KEY = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    if (symbol) {
      localStorage.setItem('latestCompany', symbol);
    }
  }, [symbol]);

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

  const toggleView = (view) => {
    setIsStockView(view === 'stock');
    setIsOwnershipView(view === 'ownership');
    setIsFundOwnershipView(view === 'fundOwnership');
    setIsFinancialsView(view === 'financials');
    setIsRevenueBreakdownView(view === 'revenueBreakdown');
    setIsPriceMetricsView(view === 'priceMetrics');
    setIsHistoricalMarketCapView(view === 'historicalMarketCap');
    setIsPeersView(view === 'peers');
    setIsNewsView(view === 'news');
  };

  if (loading) {
    return (
      <div className="loading-animation">
        <div className="spinner"></div>
        <p>Loading company data...</p>
      </div>
    );
  }

  if (error) return <p>{error}</p>;

  return (
    <div className={`company-details-container ${isStockView || isOwnershipView || isFundOwnershipView || isFinancialsView || isRevenueBreakdownView || isPriceMetricsView || isHistoricalMarketCapView || isPeersView || isNewsView ? 'sidebar-visible' : ''}`}>
      <div className="company-details">
        <h2>{companyData.name || "Company Name"}</h2>

        {isOwnershipView ? (
          <Ownership symbol={symbol} setView={toggleView} />
        ) : isFundOwnershipView ? (
          <FundOwnership symbol={symbol} setView={toggleView} />
        ) : isFinancialsView ? (
          <Financials symbol={symbol} setView={toggleView} />
        ) : isRevenueBreakdownView ? (
          <RevenueBreakdown symbol={symbol} setView={toggleView} />
        ) : isPriceMetricsView ? (
          <PriceMetrics symbol={symbol} setView={toggleView} />
        ) : isHistoricalMarketCapView ? (
          <HistoricalMarketCap symbol={symbol} setView={toggleView} />
        ) : isPeersView ? (
          <Peers symbol={symbol} setView={toggleView} />
        ) : isNewsView ? (
          <div className="news-page">
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
                  </div>
                ))
              ) : (
                <p>No recent news available.</p>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="switch-container">
              <span
                className={isNewsView ? "switch-option active" : "switch-option"}
                onClick={() => toggleView('news')}
              >
                News
              </span>
              <span
                className={isStockView ? "switch-option active" : "switch-option"}
                onClick={() => toggleView('stock')}
              >
                Stock
              </span>
            </div>
          </>
        )}
      </div>

      {(isStockView || isOwnershipView || isFundOwnershipView || isFinancialsView || isRevenueBreakdownView || isPriceMetricsView || isHistoricalMarketCapView || isPeersView || isNewsView) && (
        <StockDetailsSidebar
          symbol={symbol}
          setOwnershipView={() => toggleView('ownership')}
          setFundOwnershipView={() => toggleView('fundOwnership')}
          setFinancialsView={() => toggleView('financials')}
          setRevenueBreakdownView={() => toggleView('revenueBreakdown')}
          setPriceMetricsView={() => toggleView('priceMetrics')}
          setHistoricalMarketCapView={() => toggleView('historicalMarketCap')}
          setPeersView={() => toggleView('peers')}
          setNewsView={() => toggleView('news')} // Added News toggle
          activeSection={
            isOwnershipView ? 'ownership' :
            isFundOwnershipView ? 'fundOwnership' :
            isFinancialsView ? 'financials' :
            isRevenueBreakdownView ? 'revenueBreakdown' :
            isPriceMetricsView ? 'priceMetrics' :
            isHistoricalMarketCapView ? 'historicalMarketCap' :
            isPeersView ? 'peers' :
            isNewsView ? 'news' : ''
          }
        />
      )}
    </div>
  );
};

export default CompanyDetails;
