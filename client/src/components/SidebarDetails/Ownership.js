import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Ownership.css';

const Ownership = ({ symbol, setView }) => {
    const [ownershipData, setOwnershipData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOwnershipData = async () => {
            try {
                console.log(`Fetching CIK for symbol: ${symbol}`);
                const cikResponse = await axios.get(`http://localhost:7600/api/get-cik/${symbol}`);
                const { cik } = cikResponse.data;

                console.log(`Fetched CIK: ${cik}`);
                const ownershipResponse = await axios.get(`http://localhost:7600/api/ownership/${cik}`);
                setOwnershipData(ownershipResponse.data);
                setError('');
            } catch (err) {
                console.error('Error fetching ownership data:', err);
                setError(
                    err.response?.status === 404
                        ? 'Ownership data not available for this company.'
                        : 'Failed to fetch ownership data.'
                );
                setOwnershipData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOwnershipData();
    }, [symbol]);

    if (loading) return <p>Loading ownership data...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="ownership-container">
            <div className="ownership-switch-container">
                <span className="switch-option" onClick={() => setView('general')}>General</span>
                <span className="switch-option" onClick={() => setView('stock')}>Stock</span>
            </div>

            <h3>Ownership Information</h3>
            <div className="ownership-charts">
                <div className="chart">
                    <h4>Capital Shares</h4>
                </div>
                <div className="chart">
                    <h4>Voting Rights</h4>
                </div>
            </div>
            <table className="ownership-table">
                <thead>
                    <tr>
                        <th>Owner Name</th>
                        <th>Shares Outstanding</th>
                        <th>Capital Percentage</th>
                        <th>Voting Rights (%)</th>
                    </tr>
                </thead>
                <tbody>
                    {ownershipData.length > 0 ? (
                        ownershipData.map((owner, index) => (
                            <tr key={index}>
                                <td>{owner.name || 'Unknown'}</td>
                                <td>{owner.shares || 'N/A'}</td>
                                <td>{owner.percentage || 'N/A'}</td>
                                <td>{owner.votingRights || 'N/A'}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No ownership data available.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Ownership;
