require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 7600;

app.use(cors());
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.send('Apollo Free Plan API Proxy and SEC EDGAR Proxy are running.');
});

// Fetch SEC EDGAR DEF 14A document and filter ownership data
app.get('/api/sec/def14a', async (req, res) => {
  const secEdgarUrl =
    'https://www.sec.gov/Archives/edgar/data/51143/000110465924032641/tm2329614-d3_def14a.htm';

  try {
    const response = await axios.get(secEdgarUrl, {
      headers: {
        'User-Agent': 'MyAppName (your-email@example.com)', // Replace with your details
      },
    });

    const $ = cheerio.load(response.data);

    // Extract the "Ownership of Securities" table
    const ownershipTable = $('*:contains("Ownership of Securities")')
      .nextUntil('table')
      .next('table');

    if (!ownershipTable.length) {
      console.error('No table found for "Ownership of Securities"');
      throw new Error('Ownership of Securities table not found.');
    }

    const ownershipData = [];

    ownershipTable.find('tr').each((rowIndex, row) => {
      if (rowIndex === 0) return; // Skip header row

      const cells = $(row).find('td');

      const nameAndAddress = $(cells[1]).find('span').first().text().trim();
      const shares = $(cells[4]).text().trim();
      const percentage = $(cells[7]).text().trim();

      if (nameAndAddress || shares || percentage) {
        ownershipData.push({
          nameAndAddress: nameAndAddress || 'N/A',
          shares: shares || 'N/A',
          percentage: percentage || 'N/A',
        });
      }
    });

    if (ownershipData.length === 0) {
      throw new Error('No valid ownership data found in the SEC filing.');
    }

    res.status(200).json(ownershipData);
  } catch (error) {
    console.error('Error fetching or filtering SEC EDGAR data:', error.message);
    res.status(500).json({
      error: 'Failed to fetch or filter SEC EDGAR data',
      details: error.message,
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
