const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  description: {
    type: String,
    default: '',
  },
  liveUrl: {
    type: String,
    default: '#',
  },
  githubUrl: {
    type: String,
    default: '#',
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

module.exports = mongoose.model('Project', projectSchema);
