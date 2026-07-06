const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

dotenv.config({ path: './.env' });

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting: general API limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per window
  message: { message: 'Too many requests, please try again later.' }
});
app.use('/api/', apiLimiter);

// Stricter limiter for auth routes (login/register) to prevent brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 auth attempts per window
  message: { message: 'Too many login attempts, please try again later.' }
});
app.use('/api/auth', authLimiter);

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