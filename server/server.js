const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

dotenv.config({ path: './.env' });

const app = express();

// CORS must come first — every response, including errors and rate-limit rejections,
// must carry proper CORS headers or the browser reports a misleading CORS error.
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://hse-event-training-tracker-1.onrender.com'
  ],
  credentials: true
}));

// Security middleware
app.use(helmet());

const skipOptions = (req) => req.method === 'OPTIONS';

// Rate limiting: general API limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  skip: skipOptions,
  message: { message: 'Too many requests, please try again later.' }
});
app.use('/api/', apiLimiter);

// Stricter limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  skip: skipOptions,
  message: { message: 'Too many login attempts, please try again later.' }
});
app.use('/api/auth', authLimiter);

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