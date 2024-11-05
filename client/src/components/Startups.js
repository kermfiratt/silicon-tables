// src/components/Startups.js
import React, { useState } from 'react';
import './Startups.css';

const placeholderStartups = [
  { name: 'Techify', sector: 'Technology', funding: '$10M', founded: 2018 },
  { name: 'HealthPlus', sector: 'Healthcare', funding: '$15M', founded: 2019 },
  { name: 'EcoGreen', sector: 'Environment', funding: '$5M', founded: 2020 },
  { name: 'EduSmart', sector: 'Education', funding: '$8M', founded: 2017 },
  { name: 'TasteTerra', sector: 'Technology', funding: '$32M', founded: 2013 },
  // Add more placeholder data as needed
];

const Startups = () => {
  const [sortOption, setSortOption] = useState('');
  const [filterOption, setFilterOption] = useState('');

  const sortedStartups = [...placeholderStartups].sort((a, b) => {
    if (sortOption === 'funding') {
      return parseInt(b.funding.replace('$', '')) - parseInt(a.funding.replace('$', ''));
    } else if (sortOption === 'founded') {
      return b.founded - a.founded;
    }
    return 0;
  });

  const filteredStartups = sortedStartups.filter((startup) =>
    filterOption ? startup.sector === filterOption : true
  );

  return (
    <div className="startups-container">
      <h2>Top 20 Startups</h2>

      <div className="filter-sort-container">
        <select onChange={(e) => setSortOption(e.target.value)}>
          <option value="">Sort by</option>
          <option value="funding">Funding Amount</option>
          <option value="founded">Founded Year</option>
        </select>

        <select onChange={(e) => setFilterOption(e.target.value)}>
          <option value="">Filter by Sector</option>
          <option value="Technology">Technology</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Environment">Environment</option>
          <option value="Education">Education</option>
        </select>
      </div>

      <table className="startups-table">
        <thead>
          <tr>
            <th>Startup Name</th>
            <th>Sector</th>
            <th>Funding</th>
            <th>Founded</th>
          </tr>
        </thead>
        <tbody>
          {filteredStartups.map((startup, index) => (
            <tr key={index}>
              <td>{startup.name}</td>
              <td>{startup.sector}</td>
              <td>{startup.funding}</td>
              <td>{startup.founded}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Startups;
