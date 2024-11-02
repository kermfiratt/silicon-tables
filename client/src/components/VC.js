// src/components/VC.js
import React, { useState, useEffect } from 'react';
import VCList from './VCList';
import VCNews from './VCNews';
import './VC.css';

const VC = () => {
  const [vcData, setVcData] = useState([]);
  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    // API veya sahte veri ile VC bilgilerini çekiyoruz
    const fetchVCData = async () => {
      const data = [
        { id: 1, name: 'Sequoia Capital', investments: 130, aum: 1500000000, sectors: ['Tech', 'Health'], location: 'USA' },
        // Diğer VC verilerini ekleyin...
      ];
      setVcData(data);
    };

    const fetchVCNews = async () => {
      // Haber verilerini de buradan çekiyoruz
      const news = [
        { id: 1, title: 'Sequoia Capital invests in Startup A', date: '2023-10-15' },
        // Daha fazla haber ekleyin...
      ];
      setNewsData(news);
    };

    fetchVCData();
    fetchVCNews();
  }, []);

  return (
    <div className="vc-container">
      <h1>Venture Capital Firms</h1>
      <VCList vcData={vcData} />
      <VCNews newsData={newsData} />
    </div>
  );
};

export default VC;
