const mongoose = require('mongoose');

const InternshipSchema = new mongoose.Schema({
  internshipName: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  technologies: {
    type: [String],
    default: []
  },
  start: {
    type: String,
    required: true
  },
  end: {
    type: String,
    default: 'Present'
  },
  mode: {
    type: String,
    enum: ['Remote', 'In-office', 'Hybrid', 'Freelance'],
    default: 'Remote'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Internship', InternshipSchema);
