const express = require('express');
const router = express.Router();
const Enrolment = require('../models/Enrolment');
const Event = require('../models/Event');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// POST enrol employee in event (anyone can register)
router.post('/', auth, async (req, res) => {
  try {
    const { employee, employeeId, event, department } = req.body;
    
    if (!employee || !employeeId || !event || !department) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const eventExists = await Event.findById(event);
    if (!eventExists) return res.status(404).json({ message: 'Event not found' });

    const alreadyEnrolled = await Enrolment.findOne({ event, employeeId });
    if (alreadyEnrolled) {
      return res.status(400).json({ message: 'Already enrolled in this event' });
    }

    const count = await Enrolment.countDocuments({ event });
    if (count >= eventExists.capacity) {
      return res.status(400).json({ message: 'Event is full' });
    }

    const enrolment = await Enrolment.create({ 
      employee, 
      employeeId, 
      event, 
      department 
    });

    res.status(201).json(enrolment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET enrolments for an event (admin/manager only)
router.get('/event/:eventId', auth, role('admin', 'manager'), async (req, res) => {
  try {
    const enrolments = await Enrolment.find({ event: req.params.eventId })
      .populate('event', 'title date');
    res.json(enrolments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all enrolments (admin/manager only)
router.get('/', auth, role('admin', 'manager'), async (req, res) => {
  try {
    const enrolments = await Enrolment.find()
      .populate('event', 'title date');
    res.json(enrolments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH update enrolment status (admin/manager only)
router.patch('/:id', auth, role('admin', 'manager'), async (req, res) => {
  try {
    const { status } = req.body;
    const enrolment = await Enrolment.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    if (!enrolment) return res.status(404).json({ message: 'Enrolment not found' });
    res.json(enrolment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE enrolment (admin/manager only)
router.delete('/:id', auth, role('admin', 'manager'), async (req, res) => {
  try {
    await Enrolment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Enrolment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;