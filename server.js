const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 7600;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Silicon Numbers API running');
});

app.get('/search', (req, res) => {
    const { query } = req.query;
    const results = [
        { name: 'Apple' },
        { name: 'Google' },
        { name: 'Microsoft' },
    ].filter(company => company.name.toLowerCase().includes(query.toLowerCase()));

    res.json(results);
});

app.get('/company/:name', (req, res) => {
    const { name } = req.params;

    const companies = {
        Apple: {
            name: 'Apple',
            marketCap: '2.3T',
            revenue: '274.5B',
            employees: '147,000',
            chartData: {
                dates: ['2023-01-01', '2023-02-01', '2023-03-01', '2023-04-01'],
                prices: [150, 155, 160, 165]
            }
        },
        Google: {
            name: 'Google',
            marketCap: '1.5T',
            revenue: '182.5B',
            employees: '135,301',
            chartData: {
                dates: ['2023-01-01', '2023-02-01', '2023-03-01', '2023-04-01'],
                prices: [2700, 2800, 2900, 3000]
            }
        },
    };

    const company = companies[name] || null;

    if (company) {
        res.json(company);
    } else {
        res.status(404).json({ message: 'Company not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
