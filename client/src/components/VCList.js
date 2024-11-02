// src/components/VCList.js
import React from 'react';

const VCList = ({ vcData }) => {
  return (
    <table className="vc-list">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Investments</th>
          <th>AUM ($)</th>
          <th>Top Sectors</th>
          <th>Location</th>
        </tr>
      </thead>
      <tbody>
        {vcData.map((vc, index) => (
          <tr key={vc.id}>
            <td>{index + 1}</td>
            <td>{vc.name}</td>
            <td>{vc.investments}</td>
            <td>{vc.aum.toLocaleString()}</td>
            <td>{vc.sectors.join(', ')}</td>
            <td>{vc.location}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default VCList;
