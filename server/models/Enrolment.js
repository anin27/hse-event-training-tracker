const mongoose = require('mongoose');

const enrolmentSchema = new mongoose.Schema({
  employee: { 
    type: String, 
    required: true 
  },
  employeeId: { 
    type: String, 
    required: true 
  },
  event: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Event', 
    required: true 
  },
  department: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'attended', 'completed', 'no_show'], 
    default: 'pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Enrolment', enrolmentSchema);