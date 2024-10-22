// src/components/DeveloperConferences.js
import React from 'react';
import './DeveloperConferences.css'; // Ensure your CSS is linked

const DeveloperConferences = () => {
  // Placeholder data for the next 5 developer conferences
  const conferences = [
    { id: 1, name: 'React Summit 2024', date: 'March 1, 2024', location: 'Amsterdam, Netherlands' },
    { id: 2, name: 'JSConf US', date: 'April 12, 2024', location: 'Miami, USA' },
    { id: 3, name: 'DockerCon 2024', date: 'May 20, 2024', location: 'San Francisco, USA' },
    { id: 4, name: 'KubeCon + CloudNativeCon', date: 'June 15, 2024', location: 'Barcelona, Spain' },
    { id: 5, name: 'Google I/O 2024', date: 'August 5, 2024', location: 'Mountain View, USA' },
  ];

  return (
    <div className="developer-conferences-container">
      <h2 className="developer-conferences-header">Upcoming Developer Conferences</h2>
      <ul className="developer-conferences-list">
        {conferences.map((conference, index) => (
          <li key={conference.id} className="developer-conference-item">
            <strong>{index + 1}.</strong> {conference.name} <br />
            <span>{conference.date} - {conference.location}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeveloperConferences;
