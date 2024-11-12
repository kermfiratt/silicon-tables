// server.js
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

// Endpoint to get the CIK based on the symbol
const cikMapping = {
    AAPL: '0000320193', // Apple
    MSFT: '0000789019', // Microsoft
};

app.get('/api/get-cik/:symbol', (req, res) => {
    const { symbol } = req.params;
    const cik = cikMapping[symbol.toUpperCase()];

    if (cik) {
        res.json({ cik });
    } else {
        res.status(404).json({ error: 'CIK not found for symbol' });
    }
});

// Endpoint to get financial data based on CIK
app.get('/api/financials/:cik', async (req, res) => {
    const { cik } = req.params;
    try {
        const response = await axios.get(`https://data.sec.gov/api/xbrl/companyfacts/CIK${cik}.json`, {
            headers: {
                'User-Agent': 'YourAppName (your-email@example.com)',
                'Accept-Encoding': 'gzip, deflate, br',
            },
        });
        
        if (response.data) {
            res.json(response.data);
        } else {
            res.status(404).json({ error: 'No data found for this CIK' });
        }
    } catch (error) {
        console.error('Error fetching financial data:', error.message);

        if (error.response) {
            res.status(error.response.status).json({ error: error.response.statusText });
        } else {
            res.status(500).json({ error: 'Failed to fetch financial data' });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
