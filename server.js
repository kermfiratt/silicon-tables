require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 7600;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Crunchbase API key and base URL
const CRUNCHBASE_API_KEY = process.env.CRUNCHBASE_API_KEY; // Updated key to match .env file
const CRUNCHBASE_BASE_URL = 'https://api.crunchbase.com/api/v4';

// Root endpoint
app.get('/', (req, res) => {
  res.send('Silicon Numbers API is running.');
});

// Proxy endpoint for organization search
app.post('/api/search', async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const response = await axios.post(
      `${CRUNCHBASE_BASE_URL}/searches/organizations`,
      {
        query: {
          field: 'identifier.name',
          operator: 'contains',
          value: query,
        },
        limit: 5,
      },
      {
        headers: {
          'x-cb-user-key': CRUNCHBASE_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json(response.data.data);
  } catch (error) {
    console.error('Error fetching data from Crunchbase (Search):', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch data from Crunchbase' });
  }
});

// Proxy endpoint for organization details
app.get('/api/details/:permalink', async (req, res) => {
  const { permalink } = req.params;

  try {
    const response = await axios.get(
      `${CRUNCHBASE_BASE_URL}/entities/organizations/${permalink}`,
      {
        headers: {
          'x-cb-user-key': CRUNCHBASE_API_KEY,
        },
      }
    );

    const details = {
      name: response.data.properties?.name || 'Not Available',
      shortDescription: response.data.properties?.short_description || 'Not Available',
      website: response.data.properties?.website_url || 'Not Available',
      linkedin: response.data.properties?.linkedin || 'Not Available',
      facebook: response.data.properties?.facebook || 'Not Available',
      twitter: response.data.properties?.twitter || 'Not Available',
    };

    res.json(details);
  } catch (error) {
    console.error('Error fetching details from Crunchbase (Details):', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch details from Crunchbase' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
