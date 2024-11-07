// src/components/SidebarDetails/Ownership.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Ownership.css';

const Ownership = ({ symbol, setView }) => {
  const [ownershipData, setOwnershipData] = useState(null);
  const API_KEY = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    const fetchOwnershipData = async () => {
      try {
        const response = await axios.get(`https://finnhub.io/api/v1/stock/ownership?symbol=${symbol}&token=${API_KEY}`);
        setOwnershipData(response.data);
      } catch (error) {
        console.error("Error fetching ownership data:", error);
        setOwnershipData([
          { name: "Placeholder Corp", capitalShare: "10,000", capitalPercentage: "20%", votingPercentage: "15%" },
          { name: "Sample Inc.", capitalShare: "5,000", capitalPercentage: "10%", votingPercentage: "5%" }
        ]);
      }
    };

    fetchOwnershipData();
  }, [symbol, API_KEY]);

  return (
    <div className="ownership-container">
      {/* Switch butonları */}
      <div className="ownership-switch-container">
        <span className="switch-option" onClick={() => setView("general")}>General</span>
        <span className="switch-option" onClick={() => setView("stock")}>Stock</span>
      </div>

      <h3>Sermaye Sahipliği</h3>
      <div className="ownership-charts">
        <div className="chart">
          <h4>Sermaye Payları</h4>
        </div>
        <div className="chart">
          <h4>Oy Hakkı Oranları</h4>
        </div>
      </div>
      <table className="ownership-table">
        <thead>
          <tr>
            <th>Ortağın Adı-Soyadı/Ticaret Unvanı</th>
            <th>Sermayedeki Payı (TL)</th>
            <th>Sermayedeki Pay (%)</th>
            <th>Oy Hakkı Oranı (%)</th>
          </tr>
        </thead>
        <tbody>
          {ownershipData ? ownershipData.map((owner, index) => (
            <tr key={index}>
              <td>{owner.name}</td>
              <td>{owner.capitalShare}</td>
              <td>{owner.capitalPercentage}</td>
              <td>{owner.votingPercentage}</td>
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

export default Ownership;
