require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 7600;

app.use(cors());
app.use(express.json());




// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
