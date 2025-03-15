import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './About.css'; // Import the CSS file

const About = ({ symbol, refs, activeSection }) => {
  const [companyOverview, setCompanyOverview] = useState({});
  const [loading, setLoading] = useState(false); // Changed to false initially
  const [error, setError] = useState(null);
  const [dataFetched, setDataFetched] = useState(false); // Track if data has been fetched

  const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY;

  // Fetch data only when the section is active and data hasn't been fetched before
  useEffect(() => {
    if (activeSection === 'about' && !dataFetched) {
      setDataFetched(true); // Mark data as fetched
      fetchCompanyOverview();
    }
  }, [activeSection, dataFetched]);

  const fetchCompanyOverview = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`
      );
      const data = response.data;

      if (data && data.Description) {
        setCompanyOverview(data);
      } else {
        throw new Error('No company overview data available.');
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching company overview:', err.message);
      setError('Failed to load company overview.');
      setLoading(false);
    }
  };

  // Only render the wrapper if the active section is 'about'
  if (activeSection !== 'about') {
    return null; // Return null to prevent rendering
  }

  if (loading) {
    return (
      <div className="about-company-block">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading company overview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="about-company-block">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!companyOverview.Description) {
    return (
      <div className="about-company-block">
        <p>No company overview data available for this company.</p>
      </div>
    );
  }

  return (
    <div className="about-company-block" ref={refs.aboutRef}>
      <h4>About The Company</h4>
      <div>{companyOverview.Description}</div>
    </div>
  );
};

export default About;