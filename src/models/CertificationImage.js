const mongoose = require('mongoose');

const certificationImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    default: '',
  },
  certificationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Certification',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('CertificationImage', certificationImageSchema);
