const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Enrolment = require('../models/Enrolment');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { sendEventCancellationEmail } = require('../utils/mailer');

// GET all events (any logged-in user - Employee, Manager, Admin)
router.get('/', auth, async (req, res) => {
  try {
    const events = await Event.find().populate('createdBy', 'name');

    const eventsWithCounts = await Promise.all(
      events.map(async (event) => {
        const registeredCount = await Enrolment.countDocuments({ event: event._id });
        return {
          ...event.toObject(),
          registeredCount
        };
      })
    );

    res.json(eventsWithCounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single event (any logged-in user)
router.get('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'name');
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const registeredCount = await Enrolment.countDocuments({ event: event._id });

    res.json({ ...event.toObject(), registeredCount });
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

// DELETE event (admin or manager only) - cascades to enrolments and notifies employees
router.delete('/:id', auth, role('admin', 'manager'), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const enrolments = await Enrolment.find({ event: event._id });

    for (const enrolment of enrolments) {
      try {
        await sendEventCancellationEmail({
          toEmail: enrolment.email,
          employeeName: enrolment.employee,
          eventTitle: event.title,
          eventDate: event.date
        });
      } catch (mailErr) {
        console.error(`Failed to send cancellation email to ${enrolment.email}:`, mailErr.message);
      }
    }

    await Enrolment.deleteMany({ event: event._id });
    await Event.findByIdAndDelete(req.params.id);

    res.json({ message: 'Event and related registrations deleted', notifiedCount: enrolments.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;