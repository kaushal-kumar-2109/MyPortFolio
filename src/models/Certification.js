const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
  },
  institute: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  technologies: {
    type: [String],
    default: [],
  },
  mainImage: {
    type: String,
    default: null,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Certification', certificationSchema);
