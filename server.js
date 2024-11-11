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

// New endpoint to retrieve CIK based on symbol
app.get('/api/get-cik/:symbol', async (req, res) => {
    const { symbol } = req.params;
    try {
        const response = await axios.get(`https://data.sec.gov/submissions/CIK${symbol}.json`, {
            headers: {
                'User-Agent': 'Your App Name (your-email@example.com)',
                'Accept-Encoding': 'gzip, deflate, br',
            },
        });
        const cik = response.data.cik;
        res.json({ cik });
    } catch (error) {
        console.error('Error fetching CIK:', error);
        res.status(500).json({ error: 'Failed to fetch CIK' });
    }
});

// Endpoint to fetch financial data based on CIK
app.get('/api/financials/:cik', async (req, res) => {
    const { cik } = req.params;
    try {
        const response = await axios.get(`https://data.sec.gov/api/xbrl/companyfacts/CIK${cik}.json`, {
            headers: {
                'User-Agent': 'Your App Name (your-email@example.com)',
                'Accept-Encoding': 'gzip, deflate, br',
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching financial data:', error);
        res.status(500).json({ error: 'Failed to fetch financial data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
