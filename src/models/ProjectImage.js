const mongoose = require('mongoose');

const projectImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    default: '',
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ProjectImage', projectImageSchema);
