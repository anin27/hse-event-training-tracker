const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

dotenv.config({ path: './.env' });

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://hse-event-training-tracker-1.onrender.com'
  ],
  credentials: true
}));

app.use(helmet());

// Only rate-limit state-changing requests and preflight — routine polling (GET)
// should never be throttled, since it carries no brute-force or abuse risk.
const skipReadsAndOptions = (req) => req.method === 'OPTIONS' || req.method === 'GET';

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2000,
  skip: skipReadsAndOptions,
  message: { message: 'Too many requests, please try again later.' }
});
app.use('/api/', apiLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  skip: (req) => req.method === 'OPTIONS',
  skipSuccessfulRequests: true,
  message: { message: 'Too many login attempts, please try again later.' }
});
app.use('/api/auth', authLimiter);

app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/enrolments', require('./routes/enrolments'));

app.get('/', (req, res) => {
  res.json({ message: 'HSE Tracker API running' });
});

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