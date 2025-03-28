const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000; // Use Heroku's port or default to 5000

// Middleware
app.use(cors());
app.use(express.json());

// Redirect HTTP to HTTPS
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});

// Redirect root domain (finfact.io) to www.finfact.io
app.use((req, res, next) => {
  if (req.hostname === 'finfact.io') {
    res.redirect(`https://www.finfact.io${req.url}`);
  } else {
    next();
  }
});

// Serve static files from the React app (after building)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// Example API route
app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from the server!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});