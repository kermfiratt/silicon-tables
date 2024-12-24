const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 7600;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Silicon Numbers API running');
});

app.get('/api/search', async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const response = await axios.get(
      `https://api.crunchbase.com/v4/data/entities`,
      {
        params: {
          query,
          user_key: process.env.REACT_APP_CRUNCHBASE_API_KEY, // Use your Crunchbase API Key
        },
      }
    );

    if (!response.data || !response.data.entities) {
      return res.status(404).json({ error: 'No data found for the given query' });
    }

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data from Crunchbase:', error.message);
    res.status(500).json({ error: 'Failed to fetch data from Crunchbase' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
