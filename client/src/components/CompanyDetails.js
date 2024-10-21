import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // To get the company symbol from URL params
import axios from 'axios';

const CompanyDetails = () => {
  const { symbol } = useParams(); // Get the company symbol from the URL (e.g., "AAPL")
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const API_URL = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${process.env.REACT_APP_API_KEY}`;
        console.log('API Key:', process.env.REACT_APP_API_KEY);

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
    <div>
      {companyData ? (
        <div>
          <h1>{companyData.name}</h1>
          <p>Industry: {companyData.finnhubIndustry}</p>
          <p>CEO: {companyData.ceo}</p>
          <p>Website: <a href={companyData.weburl} target="_blank" rel="noopener noreferrer">{companyData.weburl}</a></p>
          {/* Add more company details as needed */}
        </div>
      ) : (
        <p>No company data available.</p>
      )}
    </div>
  );
};

export default CompanyDetails;
