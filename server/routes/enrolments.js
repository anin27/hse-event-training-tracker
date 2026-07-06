const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Enrolment = require('../models/Enrolment');
const Event = require('../models/Event');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { sendRegistrationConfirmation } = require('../utils/mailer');

// POST enrol employee in event (anyone can register)
router.post(
  '/',
  auth,
  [
    body('employee').trim().notEmpty().withMessage('Employee name is required').isLength({ max: 100 }),
    body('employeeId').trim().notEmpty().withMessage('Employee ID is required').isLength({ max: 50 }),
    body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('event').trim().notEmpty().withMessage('Event is required').isMongoId().withMessage('Invalid event ID'),
    body('status').optional().isIn(['pending', 'completed', 'no_show']).withMessage('Invalid status')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const { employee, employeeId, email, event, department, status } = req.body;

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
        email,
        event,
        department,
        status: status || 'pending'
      });

      try {
        await sendRegistrationConfirmation({
          toEmail: email,
          employeeName: employee,
          eventTitle: eventExists.title,
          eventDate: eventExists.date,
          location: eventExists.location
        });
      } catch (mailErr) {
        console.error('Failed to send confirmation email:', mailErr.message);
      }

      res.status(201).json(enrolment);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

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

// GET all enrolments (any logged-in user - Employee, Manager, Admin)
router.get('/', auth, async (req, res) => {
  try {
    const enrolments = await Enrolment.find()
      .populate('event', 'title date');
    res.json(enrolments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH update enrolment status (admin/manager only)
router.patch(
  '/:id',
  auth,
  role('admin', 'manager'),
  [
    body('status').isIn(['pending', 'completed', 'no_show']).withMessage('Invalid status')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

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
  }
);

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