const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// GET all events (any logged-in user)
router.get('/', auth, async (req, res) => {
  try {
    const events = await Event.find().populate('createdBy', 'name');
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single event
router.get('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'name');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create event (admin or manager only)
router.post('/', auth, role('admin', 'manager'), async (req, res) => {
  try {
    const { title, description, date, location, capacity, category } = req.body;
    
    if (!title || !description || !date || !location || !capacity || !category) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const event = await Event.create({
      title, description, date, location, capacity, category,
      createdBy: req.user.id
    });
    
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update event (admin or manager only)
router.put('/:id', auth, role('admin', 'manager'), async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE event (admin or manager only)
router.delete('/:id', auth, role('admin', 'manager'), async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;