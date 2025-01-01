require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 7600;

app.use(cors());
app.use(express.json());

const TRACXN_API_KEY = process.env.TRACXN_API_KEY;

if (!TRACXN_API_KEY) {
  console.error('TRACXN_API_KEY is not set. Please check your .env file.');
  process.exit(1);
}

// Root endpoint
app.get('/', (req, res) => {
  res.send('Tracxn API Proxy is running.');
});

// Proxy endpoint to search for companies and fetch their details
app.post('/api/search', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Company name is required.' });
  }

  console.log(`Searching for company: ${name}`);

  try {
    // Step 1: Use Companies Name Search API to get id and domain
    const searchResponse = await axios.post(
      'https://platform.tracxn.com/api/2.2/playground/companies/search',
      {
        filter: { companyName: [name] },
      },
      {
        headers: {
          accessToken: TRACXN_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!searchResponse.data || searchResponse.data.length === 0) {
      return res.status(404).json({ error: 'Company not found.' });
    }

    const companyId = searchResponse.data[0].id; // Extract the id from the response
    console.log(`Found company ID: ${companyId}`);

    // Step 2: Use Companies API to fetch detailed company information
    const detailsResponse = await axios.get(
      `https://platform.tracxn.com/api/2.2/playground/companies/${companyId}`,
      {
        headers: {
          accessToken: TRACXN_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json(detailsResponse.data);
  } catch (error) {
    console.error('Error fetching data from Tracxn API:');
    if (error.response) {
      console.error('Response Data:', error.response.data);
      console.error('Status Code:', error.response.status);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      console.error('No Response Received:', error.request);
    } else {
      console.error('Error Message:', error.message);
    }

    res.status(500).json({
      error: 'Failed to fetch data from Tracxn API',
      details: error.response?.data || error.message,
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
