const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// Register
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
    body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['employee', 'manager', 'admin']).withMessage('Invalid role')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const { name, email, password, role } = req.body;

      const exists = await User.findOne({ email });
      if (exists) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hashed, role });

      const token = jwt.sign(
        { id: user._id, role: user.role, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({ token, role: user.role, name: user.name });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Login
router.post(
  '/login',
  [
    body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user._id, role: user.role, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({ token, role: user.role, name: user.name });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;