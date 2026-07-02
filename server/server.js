const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv')

dotenv.config({path: './.env'});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/enrolments', require('./routes/enrolments'));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'HSE Tracker API running' });
});

// Connect MongoDB & Start Server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✓ MongoDB connected');
    app.listen(process.env.PORT || 5000, () => {
      console.log('✓ Server running on port 5000');
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
  });