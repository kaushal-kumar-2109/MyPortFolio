const mongoose = require('mongoose');

const ProfileBasicSchema = new mongoose.Schema({
  mainTitle: {
    type: String,
    required: true,
    default: 'Web Developer'
  },
  subtitle: {
    type: String,
    default: 'Full Stack Developer'
  },
  shortBio: {
    type: String,
    default: 'Passionate about building scalable and efficient web applications.'
  },
  totalProject: {
    type: String,
    default: '0'
  },
  yearOfExperience: {
    type: String,
    default: '0'
  },
  mainImage: {
    type: String,
    default: null
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ProfileBasic', ProfileBasicSchema);
