import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
    <div>
      <h4>Ownership of Securities</h4>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>
          {ownershipData.map((owner, index) => (
            <tr key={index}>
              <td>{owner.name}</td>
              <td>{owner.percentage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SecEdgarOwnership;
