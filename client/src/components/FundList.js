// src/components/FundList.js
import React from 'react';

const FundList = ({ funds }) => {
  return (
    <table className="fund-list">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Category</th>
          <th>Institution</th>
          <th>1M (%)</th>
          <th>3M (%)</th>
          <th>6M (%)</th>
          <th>1Y (%)</th>
          <th>5Y (%)</th>
        </tr>
      </thead>
      <tbody>
        {funds.map((fund, index) => (
          <tr key={fund.id}>
            <td>{index + 1}</td>
            <td>{fund.name}</td>
            <td>{fund.category}</td>
            <td>{fund.institution}</td>
            <td>{fund.returns['1M']}%</td>
            <td>{fund.returns['3M']}%</td>
            <td>{fund.returns['6M']}%</td>
            <td>{fund.returns['1Y']}%</td>
            <td>{fund.returns['5Y']}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FundList;
