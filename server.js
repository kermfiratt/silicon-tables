require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const axios = require('axios');

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
  res.send('Apollo Free Plan API Proxy is running.');
});

// Fetch organization details by ID
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

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
