import React from 'react';
import './VestingSchedule.css';

const VestingSchedule = ({ stockOptions }) => {
  return (
    <div className="vesting-schedule">
      <h3>Vesting Takvimi</h3>
      <table className="vesting-table">
        <thead>
          <tr>
            <th>Şirket</th>
            <th>Tip</th>
            <th>Vested Miktar</th>
            <th>Toplam Miktar</th>
            <th>Vesting Tarihi</th>
          </tr>
        </thead>
        <tbody>
          {stockOptions.map((option) => (
            <tr key={option.id}>
              <td>{option.name}</td>
              <td>{option.type}</td>
              <td>{option.vested}</td>
              <td>{option.total}</td>
              <td>{option.vestingDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VestingSchedule;
