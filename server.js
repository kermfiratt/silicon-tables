require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 7600;

app.use(cors());
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.send('SEC EDGAR Proxy is running.');
});

// Fetch SEC EDGAR DEF 14A data
app.get('/api/sec/def14a', async (req, res) => {
  const companyCIK = '0000051143'; // Update with the correct CIK
  const url = `https://data.sec.gov/submissions/CIK${companyCIK}.json`;

  try {
    // Fetch filings data from SEC
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'YourAppName (your-email@example.com)', // Replace with your details
      },
    });

    const filings = response.data.filings.recent;
    const def14aIndex = filings.form.findIndex((form) => form === 'DEF 14A');

    if (def14aIndex === -1) {
      return res.status(404).json({ error: 'No DEF 14A filing found for this company.' });
    }

    // Retrieve DEF 14A filing URL
    const filingUrl = `https://www.sec.gov${filings.primaryDocument[def14aIndex]}`;
    const filingResponse = await axios.get(filingUrl, {
      headers: {
        'User-Agent': 'YourAppName (your-email@example.com)', // Replace with your details
      },
    });

    // Parse the filing HTML to extract table data
    const filingHtml = filingResponse.data;
    const ownershipData = [];
    const tableRegex = /Ownership of Securities.*?<table.*?>(.*?)<\/table>/gs;
    const match = tableRegex.exec(filingHtml);

    if (match) {
      const tableHtml = match[1];
      const rows = tableHtml.match(/<tr.*?>(.*?)<\/tr>/gs);

      if (rows && rows.length > 1) {
        rows.slice(1).forEach((row) => {
          const columns = row.match(/<td.*?>(.*?)<\/td>/gs);
          if (columns && columns.length >= 3) {
            ownershipData.push({
              name: columns[0].replace(/<.*?>/g, '').trim(),
              shares: columns[1].replace(/<.*?>/g, '').trim(),
              percentage: columns[2].replace(/<.*?>/g, '').trim(),
            });
          }
        });
      }
    } else {
      throw new Error('Unable to locate Ownership of Securities table.');
    }

    res.json(ownershipData);
  } catch (error) {
    console.error('Error fetching SEC EDGAR data:', error.message);
    res.status(500).json({
      error: 'Failed to fetch SEC EDGAR data',
      details: error.message,
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
