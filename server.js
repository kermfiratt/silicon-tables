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

// New endpoint to retrieve the CIK based on the symbol
app.get('/api/get-cik/:symbol', async (req, res) => {
    const { symbol } = req.params;
    try {
        // Replace this with the actual endpoint for retrieving the CIK
        const response = await axios.get(`https://api.example.com/get-cik?symbol=${symbol}`, {
            headers: {
                'User-Agent': 'YourAppName (your-email@example.com)',
                'Accept-Encoding': 'gzip, deflate, br'
            }
        });

        if (response.data && response.data.cik) {
            res.json({ cik: response.data.cik });
        } else {
            console.error(`CIK not found in API response for symbol: ${symbol}`);
            res.status(404).json({ error: 'CIK not found' });
        }
    } catch (error) {
        console.error('Error fetching CIK:', error.message);
        res.status(500).json({ error: 'Failed to retrieve CIK' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
