require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 7600;

app.use(cors());
app.use(express.json());

const APOLLO_API_KEY = process.env.APOLLO_API_KEY;

if (!APOLLO_API_KEY) {
  console.error('APOLLO_API_KEY is not set. Please check your .env file.');
  process.exit(1);
}

// Root endpoint
app.get('/', (req, res) => {
  res.send('Apollo Free Plan API Proxy and SEC EDGAR Proxy are running.');
});

// Fetch organization details by ID (Apollo API)
app.get('/api/organization/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Organization ID is required.' });
  }

  try {
    const response = await axios.get(
      `https://api.apollo.io/v1/organizations/${id}`,
      {
        headers: {
          Authorization: `Bearer ${APOLLO_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching organization data from Apollo API:');
    if (error.response) {
      console.error('Response Data:', error.response.data);
      console.error('Status Code:', error.response.status);
    } else if (error.request) {
      console.error('No Response Received:', error.request);
    } else {
      console.error('Error Message:', error.message);
    }

    res.status(500).json({
      error: 'Failed to fetch organization data from Apollo API',
      details: error.response?.data || error.message,
    });
  }
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

    // Parse the HTML response with cheerio
    const $ = cheerio.load(response.data);

    // Extract the "Ownership of Securities" table
    const ownershipSection = $('*:contains("Ownership of Securities")')
      .nextUntil('table')
      .next('table'); // Adjust selector if the structure is different

    // Parse table rows to extract names and percentages
    const ownershipData = [];
    ownershipSection.find('tr').each((index, row) => {
      const columns = $(row).find('td');
      if (columns.length >= 2) {
        const name = $(columns[0]).text().trim();
        const percentage = $(columns[1]).text().trim();
        if (name && percentage) {
          ownershipData.push({ name, percentage });
        }
      }
    });

    if (ownershipData.length === 0) {
      throw new Error('No ownership data found in the SEC filing.');
    }

    res.status(200).json(ownershipData);
  } catch (error) {
    console.error('Error fetching or filtering SEC EDGAR data:');
    if (error.response) {
      console.error('Response Data:', error.response.data);
      console.error('Status Code:', error.response.status);
    } else if (error.request) {
      console.error('No Response Received:', error.request);
    } else {
      console.error('Error Message:', error.message);
    }

    res.status(500).json({
      error: 'Failed to fetch or filter SEC EDGAR data',
      details: error.response?.data || error.message,
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
