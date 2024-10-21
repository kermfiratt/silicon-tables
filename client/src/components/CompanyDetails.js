import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './CompanyDetalis.css'; // For block styling

const CompanyDetails = () => {
  const { symbol } = useParams(); // Get the company symbol from URL
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const API_URL = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${process.env.REACT_APP_API_KEY}`;
        const response = await axios.get(API_URL);
        setCompanyData(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch company data.');
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [symbol]);

  if (loading) return <p>Loading company data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="company-details">
      <h1>{companyData.name}</h1>
      
      <div className="grid-container">
        {/* Block for Industry */}
        <div className="block">
          <h3>Industry</h3>
          <p>{companyData.finnhubIndustry || 'N/A'}</p>
        </div>

        {/* Block for CEO */}
        <div className="block">
          <h3>CEO</h3>
          <p>{companyData.ceo || 'N/A'}</p>
        </div>

        {/* Block for Headquarters */}
        <div className="block">
          <h3>Headquarters</h3>
          <p>{companyData.headquarter || 'N/A'}</p>
        </div>

        {/* Block for Website */}
        <div className="block">
          <h3>Website</h3>
          <p>
            <a href={companyData.weburl} target="_blank" rel="noopener noreferrer">
              {companyData.weburl}
            </a>
          </p>
        </div>

        {/* Block for Market Capitalization */}
        <div className="block">
          <h3>Market Capitalization</h3>
          <p>{companyData.marketCapitalization ? `$${companyData.marketCapitalization}` : 'N/A'}</p>
        </div>

        {/* Add more blocks as needed */}
      </div>
    </div>
  );
};

export default CompanyDetails;
