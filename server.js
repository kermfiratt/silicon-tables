const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 7600;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Silicon Numbers API running');
});

// Load CIK mapping from JSON file
let cikMapping = {};
fs.readFile('cik-mapping.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error loading CIK mappings:', err);
    } else {
        cikMapping = JSON.parse(data);
    }
});

// Endpoint to get CIK based on symbol
app.get('/api/get-cik/:symbol', (req, res) => {
    const { symbol } = req.params;
    const cik = cikMapping[symbol.toUpperCase()];

    if (cik) {
        res.json({ cik });
    } else {
        res.status(404).json({ error: 'CIK not found for symbol' });
    }
});

// Endpoint to fetch ownership data from SEC EDGAR
app.get('/api/ownership/:cik', async (req, res) => {
    const { cik } = req.params;

    try {
        console.log(`Fetching ownership data for CIK: ${cik}`);
        const response = await axios.get(`https://data.sec.gov/api/xbrl/companyfacts/CIK${cik}.json`, {
            headers: {
                'User-Agent': 'YourAppName (your-email@example.com)',
                'Accept-Encoding': 'gzip, deflate, br',
            },
        });

        const ownershipData = response.data?.facts?.['dei']?.['EntityCommonStockSharesOutstanding']?.units?.['shares'];

        if (!ownershipData) {
            res.status(404).json({ error: 'Ownership data not found' });
        } else {
            res.json(ownershipData);
        }
    } catch (error) {
        console.error('Error fetching ownership data:', error.message);
        res.status(500).json({ error: 'Failed to fetch ownership data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
