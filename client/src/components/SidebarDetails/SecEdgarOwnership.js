import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SecEdgarOwnership.css';

const SecEdgarOwnership = () => {
  const [ownershipData, setOwnershipData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOwnershipData = async () => {
      try {
        const response = await axios.get('http://localhost:7600/api/sec/def14a');
        setOwnershipData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching SEC EDGAR data:', err.message);
        setError('Failed to fetch SEC EDGAR data.');
        setLoading(false);
      }
    };

    fetchOwnershipData();
  }, []);

  if (loading) return <p>Loading SEC EDGAR ownership data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="ownership-container">
      <h4 className="table-title">Ownership of Securities</h4>
      <table className="ownership-table">
        <thead>
          <tr>
            <th>Name and Address</th>
            <th>Shares</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>
          {ownershipData.map((owner, index) => (
            <tr key={index}>
              <td>{owner.nameAndAddress}</td>
              <td>{owner.shares}</td>
              <td>{owner.percentage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SecEdgarOwnership;
