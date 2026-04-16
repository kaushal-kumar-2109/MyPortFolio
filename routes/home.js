const express = require('express');
const router = express.Router();
const Project = require('../src/models/Project');
const ProjectImage = require('../src/models/ProjectImage');
const Certification = require('../src/models/Certification');
const CertificationImage = require('../src/models/CertificationImage');
const ProfileBasic = require('../src/models/ProfileBasic');
const ProfileMain = require('../src/models/ProfileMain');
const Internship = require('../src/models/Internship');

// Route for /MyPort/home
router.get('/home', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    const certifications = await Certification.find().sort({ createdAt: -1 });
    const basicInfo = await ProfileBasic.findOne();
    const mainInfo = await ProfileMain.findOne();
    const internships = await Internship.find().sort({ updatedAt: -1 });
    
    res.render('home', { 
      projects, 
      certifications, 
      basicInfo: basicInfo || {}, 
      mainInfo: mainInfo || {}, 
      internships: internships || [] 
    });
  } catch (error) {
    res.render('home', { 
      projects: [], 
      certifications: [], 
      basicInfo: {}, 
      mainInfo: {}, 
      internships: [] 
    });
  }
});

// Route for Project Details
router.get('/project/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.redirect('/MyPort/home');
    }
    const images = await ProjectImage.find({ projectId: req.params.id }).sort({ createdAt: -1 });
    res.render('project-details', { project, images });
  } catch (error) {
    res.redirect('/MyPort/home');
  }
});

// Route for Certification Details
router.get('/certificate/:id', async (req, res) => {
  try {
    const cert = await Certification.findById(req.params.id);
    if (!cert) {
      return res.redirect('/MyPort/home');
    }
    const images = await CertificationImage.find({ certificationId: req.params.id }).sort({ createdAt: -1 });
    res.render('cert-details', { cert, images });
  } catch (error) {
    res.redirect('/MyPort/home');
  }
});

module.exports = router;