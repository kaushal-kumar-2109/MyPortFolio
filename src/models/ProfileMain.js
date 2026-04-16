const mongoose = require('mongoose');

const ProfileMainSchema = new mongoose.Schema({
  secondaryTitle: {
    type: String,
    default: 'About Me'
  },
  bio: {
    type: String,
    default: 'I am a dedicated developer...'
  },
  secondaryImage: {
    type: String,
    default: null
  },
  internshipCount: {
    type: Number,
    default: 0
  },
  aiProject: {
    type: Number,
    default: 0
  },
  deployedProject: {
    type: Number,
    default: 0
  },
  groupProjects: {
    type: Number,
    default: 0
  },
  skills: {
    type: [String],
    default: []
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ProfileMain', ProfileMainSchema);
