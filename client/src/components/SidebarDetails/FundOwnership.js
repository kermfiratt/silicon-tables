// src/components/SidebarDetails/FundOwnership.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './FundOwnership.css';

const FundOwnership = ({ symbol, setView }) => {
  const [fundData, setFundData] = useState(null);
  const API_KEY = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    const fetchFundData = async () => {
      try {
        const response = await axios.get(`https://finnhub.io/api/v1/stock/fund-ownership?symbol=${symbol}&token=${API_KEY}`);
        setFundData(response.data);
      } catch (error) {
        console.error("Error fetching fund ownership data:", error);
        // Placeholder data
        setFundData([
          { fundName: "Sample Fund 1", sharesOwned: "15,000", ownershipPercentage: "25%", value: "$500,000" },
          { fundName: "Sample Fund 2", sharesOwned: "10,000", ownershipPercentage: "10%", value: "$200,000" }
        ]);
      }
    };

    fetchFundData();
  }, [symbol, API_KEY]);

  return (
    <div className="fund-ownership-container">
      {/* General ve Stock butonları */}
      <div className="ownership-switch-container">
        <span className="switch-option" onClick={() => setView("general")}>General</span>
        <span className="switch-option" onClick={() => setView("stock")}>Stock</span>
      </div>

      <h3>Fon Sahipliği</h3>
      <table className="fund-ownership-table">
        <thead>
          <tr>
            <th>Fon Adı</th>
            <th>Sahip Olduğu Hisseler</th>
            <th>Sahiplik Oranı</th>
            <th>Değer</th>
          </tr>
        </thead>
        <tbody>
          {fundData ? fundData.map((fund, index) => (
            <tr key={index}>
              <td>{fund.fundName}</td>
              <td>{fund.sharesOwned}</td>
              <td>{fund.ownershipPercentage}</td>
              <td>{fund.value}</td>
            </tr>
          )) : (
            <tr>
              <td colSpan="4">Veri yükleniyor...</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FundOwnership;
