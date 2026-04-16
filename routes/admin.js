const express = require('express');
const router = express.Router();
const Admin = require('../src/models/Admin');
const Project = require('../src/models/Project');
const ProjectImage = require('../src/models/ProjectImage');
const Certification = require('../src/models/Certification');
const CertificationImage = require('../src/models/CertificationImage');
const ProfileBasic = require('../src/models/ProfileBasic');
const ProfileMain = require('../src/models/ProfileMain');
const Internship = require('../src/models/Internship');
const { isAuthenticated } = require('../src/middleware/auth');

// Admin Login Page
router.get('/login', (req, res) => {
  if (req.session && req.session.admin) {
    return res.redirect('/admin/dashboard');
  }
  res.render('admin/login');
});

// Admin Login POST
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.render('admin/login', { error: 'Please provide username and password' });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.render('admin/login', { error: 'Invalid credentials' });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.render('admin/login', { error: 'Invalid credentials' });
    }

    req.session.admin = admin._id;
    res.redirect('/admin/dashboard');
  } catch (error) {
    res.render('admin/login', { error: 'Server error' });
  }
});

// Admin Dashboard
router.get('/dashboard', isAuthenticated, async (req, res) => {
  try {
    const projectsDocs = await Project.find().sort({ createdAt: -1 });
    const projects = [];
    for (let project of projectsDocs) {
      const projectObj = project.toObject();
      projectObj.imageCount = await ProjectImage.countDocuments({ projectId: project._id });
      projects.push(projectObj);
    }

    const certDocs = await Certification.find().sort({ createdAt: -1 });
    const certifications = [];
    for (let cert of certDocs) {
      const certObj = cert.toObject();
      certObj.imageCount = await CertificationImage.countDocuments({ certificationId: cert._id });
      certifications.push(certObj);
    }

    const basicInfo = await ProfileBasic.findOne() || {};
    const mainInfo = await ProfileMain.findOne() || {};
    const internships = await Internship.find().sort({ start: -1 });

    res.render('admin/dashboard', { 
      projects, 
      certifications, 
      basicInfo, 
      mainInfo, 
      internships,
      query: req.query 
    });
  } catch (error) {
    res.render('admin/dashboard', { 
      error: 'Error loading dashboard', 
      projects: [], 
      certifications: [], 
      internships: [],
      query: req.query 
    });
  }
});

// Add Project Page
router.get('/add-project', isAuthenticated, (req, res) => {
  res.render('admin/add-project');
});

// Add Project POST
router.post('/add-project', isAuthenticated, async (req, res) => {
  try {
    const { title, tags, description, liveUrl, githubUrl, startDate, endDate } = req.body;

    if (!title) {
      return res.render('admin/add-project', { error: 'Title is required' });
    }

    const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : [];

    const project = new Project({
      title,
      tags: tagsArray,
      description,
      liveUrl: liveUrl || '#',
      githubUrl: githubUrl || '#',
      startDate: startDate || null,
      endDate: endDate || null,
    });

    await project.save();
    res.redirect('/admin/dashboard?success=Project added successfully');
  } catch (error) {
    res.render('admin/add-project', { error: 'Error adding project' });
  }
});

// Edit Project Page
router.get('/edit-project/:id', isAuthenticated, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.redirect('/admin/dashboard');
    }
    res.render('admin/edit-project', { project });
  } catch (error) {
    res.redirect('/admin/dashboard');
  }
});

// Edit Project POST
router.post('/edit-project/:id', isAuthenticated, async (req, res) => {
  try {
    const { title, tags, description, liveUrl, githubUrl, startDate, endDate } = req.body;

    if (!title) {
      const project = await Project.findById(req.params.id);
      return res.render('admin/edit-project', { project, error: 'Title is required' });
    }

    const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : [];

    await Project.findByIdAndUpdate(req.params.id, {
      title,
      tags: tagsArray,
      description,
      liveUrl: liveUrl || '#',
      githubUrl: githubUrl || '#',
      startDate: startDate || null,
      endDate: endDate || null,
      updatedAt: Date.now(),
    });

    res.redirect('/admin/dashboard?success=Project updated successfully');
  } catch (error) {
    res.redirect('/admin/dashboard');
  }
});

// Delete Project
router.post('/delete-project/:id', isAuthenticated, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.redirect('/admin/dashboard?success=Project deleted successfully');
  } catch (error) {
    res.redirect('/admin/dashboard');
  }
});

// Manage Project Images Page
router.get('/project/:id/images', isAuthenticated, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.redirect('/admin/dashboard');
    }
    const images = await ProjectImage.find({ projectId: req.params.id }).sort({ createdAt: -1 });
    res.render('admin/manage-images', { project, images, query: req.query });
  } catch (error) {
    res.redirect('/admin/dashboard');
  }
});

// Add Project Image POST
router.post('/project/:id/images/add', isAuthenticated, async (req, res) => {
  try {
    let { url, caption } = req.body;
    if (!url) {
      return res.redirect(`/admin/project/${req.params.id}/images?error=URL is required`);
    }

    // Auto-convert GitHub blob URLs to raw URLs
    if (url.includes('github.com') && url.includes('/blob/')) {
      url = url.replace('github.com', 'raw.githubusercontent.com')
        .replace(/\/blob\//, '/')
        .split('?')[0]; // Remove query params to get direct raw file
    }
    url = url.trim();

    const newImage = new ProjectImage({
      url,
      caption,
      projectId: req.params.id
    });

    await newImage.save();
    res.redirect(`/admin/project/${req.params.id}/images?success=Image added successfully`);
  } catch (error) {
    res.redirect(`/admin/project/${req.params.id}/images?error=Error adding image`);
  }
});

// Delete Project Image POST
router.post('/project/:projectId/images/delete/:imageId', isAuthenticated, async (req, res) => {
  try {
    const imageToDelete = await ProjectImage.findById(req.params.imageId);
    if (!imageToDelete) {
      return res.redirect(`/admin/project/${req.params.projectId}/images?error=Image not found`);
    }

    // If this image was the main image, clear the mainImage field in the project
    const project = await Project.findById(req.params.projectId);
    if (project && project.mainImage === imageToDelete.url) {
      project.mainImage = null;
      await project.save();
    }

    await ProjectImage.findByIdAndDelete(req.params.imageId);
    res.redirect(`/admin/project/${req.params.projectId}/images?success=Image deleted successfully`);
  } catch (error) {
    res.redirect(`/admin/project/${req.params.projectId}/images?error=Error deleting image`);
  }
});

// Set Project Main Image POST
router.post('/project/:projectId/images/set-main/:imageId', isAuthenticated, async (req, res) => {
  try {
    const image = await ProjectImage.findById(req.params.imageId);
    if (!image) {
      return res.redirect(`/admin/project/${req.params.projectId}/images?error=Image not found`);
    }

    await Project.findByIdAndUpdate(req.params.projectId, {
      mainImage: image.url
    });

    res.redirect(`/admin/project/${req.params.projectId}/images?success=Main image updated successfully`);
  } catch (error) {
    res.redirect(`/admin/project/${req.params.projectId}/images?error=Error setting main image`);
  }
});

// ─────────────────────────────────────────────
// CERTIFICATION ROUTES
// ─────────────────────────────────────────────

// Add Certification Page
router.get('/add-certificate', isAuthenticated, (req, res) => {
  res.render('admin/add-certificate');
});

// Add Certification POST
router.post('/add-certificate', isAuthenticated, async (req, res) => {
  try {
    const { courseName, institute, description, technologies, startDate, endDate } = req.body;

    if (!courseName || !institute) {
      return res.render('admin/add-certificate', { error: 'Course name and institute are required' });
    }

    const techArray = technologies ? technologies.split(',').map(t => t.trim()).filter(Boolean) : [];

    const cert = new Certification({
      courseName,
      institute,
      description,
      technologies: techArray,
      startDate: startDate || null,
      endDate: endDate || null,
    });

    await cert.save();
    res.redirect('/admin/dashboard?success=Certificate added successfully');
  } catch (error) {
    res.render('admin/add-certificate', { error: 'Error adding certificate' });
  }
});

// Edit Certification Page
router.get('/edit-certificate/:id', isAuthenticated, async (req, res) => {
  try {
    const cert = await Certification.findById(req.params.id);
    if (!cert) return res.redirect('/admin/dashboard');
    res.render('admin/edit-certificate', { cert });
  } catch (error) {
    res.redirect('/admin/dashboard');
  }
});

// Edit Certification POST
router.post('/edit-certificate/:id', isAuthenticated, async (req, res) => {
  try {
    const { courseName, institute, description, technologies, startDate, endDate } = req.body;

    if (!courseName || !institute) {
      const cert = await Certification.findById(req.params.id);
      return res.render('admin/edit-certificate', { cert, error: 'Course name and institute are required' });
    }

    const techArray = technologies ? technologies.split(',').map(t => t.trim()).filter(Boolean) : [];

    await Certification.findByIdAndUpdate(req.params.id, {
      courseName,
      institute,
      description,
      technologies: techArray,
      startDate: startDate || null,
      endDate: endDate || null,
      updatedAt: Date.now(),
    });

    res.redirect('/admin/dashboard?success=Certificate updated successfully');
  } catch (error) {
    res.redirect('/admin/dashboard');
  }
});

// Delete Certification
router.post('/delete-certificate/:id', isAuthenticated, async (req, res) => {
  try {
    await CertificationImage.deleteMany({ certificationId: req.params.id });
    await Certification.findByIdAndDelete(req.params.id);
    res.redirect('/admin/dashboard?success=Certificate deleted successfully');
  } catch (error) {
    res.redirect('/admin/dashboard?error=Error deleting certificate');
  }
});

// Manage Certificate Images Page
router.get('/certificate/:id/images', isAuthenticated, async (req, res) => {
  try {
    const cert = await Certification.findById(req.params.id);
    if (!cert) return res.redirect('/admin/dashboard');
    const images = await CertificationImage.find({ certificationId: req.params.id }).sort({ createdAt: -1 });
    res.render('admin/manage-cert-images', { cert, images, query: req.query });
  } catch (error) {
    res.redirect('/admin/dashboard');
  }
});

// Add Certificate Image POST
router.post('/certificate/:id/images/add', isAuthenticated, async (req, res) => {
  try {
    let { url, caption } = req.body;
    if (!url) {
      return res.redirect(`/admin/certificate/${req.params.id}/images?error=URL is required`);
    }
    // Auto-convert GitHub blob URLs
    if (url.includes('github.com') && url.includes('/blob/')) {
      url = url.replace('github.com', 'raw.githubusercontent.com').replace(/\/blob\//, '/').split('?')[0];
    }
    url = url.trim();

    const newImage = new CertificationImage({ url, caption, certificationId: req.params.id });
    await newImage.save();
    res.redirect(`/admin/certificate/${req.params.id}/images?success=Image added successfully`);
  } catch (error) {
    res.redirect(`/admin/certificate/${req.params.id}/images?error=Error adding image`);
  }
});

// Delete Certificate Image POST
router.post('/certificate/:certId/images/delete/:imageId', isAuthenticated, async (req, res) => {
  try {
    const imageToDelete = await CertificationImage.findById(req.params.imageId);
    if (!imageToDelete) {
      return res.redirect(`/admin/certificate/${req.params.certId}/images?error=Image not found`);
    }
    const cert = await Certification.findById(req.params.certId);
    if (cert && cert.mainImage === imageToDelete.url) {
      cert.mainImage = null;
      await cert.save();
    }
    await CertificationImage.findByIdAndDelete(req.params.imageId);
    res.redirect(`/admin/certificate/${req.params.certId}/images?success=Image deleted successfully`);
  } catch (error) {
    res.redirect(`/admin/certificate/${req.params.certId}/images?error=Error deleting image`);
  }
});

// Set Certificate Main Image POST
router.post('/certificate/:certId/images/set-main/:imageId', isAuthenticated, async (req, res) => {
  try {
    const image = await CertificationImage.findById(req.params.imageId);
    if (!image) {
      return res.redirect(`/admin/certificate/${req.params.certId}/images?error=Image not found`);
    }
    await Certification.findByIdAndUpdate(req.params.certId, { mainImage: image.url });
    res.redirect(`/admin/certificate/${req.params.certId}/images?success=Main image updated successfully`);
  } catch (error) {
    res.redirect(`/admin/certificate/${req.params.certId}/images?error=Error setting main image`);
  }
});

// ─────────────────────────────────────────────
// PROFILE & INTERNSHIP MANAGEMENT
// ─────────────────────────────────────────────

// Manage Basic Info
router.get('/profile/basic', isAuthenticated, async (req, res) => {
  try {
    const info = await ProfileBasic.findOne();
    res.render('admin/manage-basic', { info });
  } catch (error) {
    res.redirect('/admin/dashboard');
  }
});

router.post('/profile/basic', isAuthenticated, async (req, res) => {
  try {
    let { mainTitle, subtitle, shortBio, totalProject, yearOfExperience, mainImage } = req.body;
    
    // Auto-convert GitHub blob URLs to raw URLs
    if (mainImage && mainImage.includes('github.com') && mainImage.includes('/blob/')) {
        mainImage = mainImage.replace('github.com', 'raw.githubusercontent.com')
          .replace(/\/blob\//, '/')
          .split('?')[0];
    }

    let info = await ProfileBasic.findOne();
    
    if (info) {
      await ProfileBasic.findByIdAndUpdate(info._id, {
        mainTitle, subtitle, shortBio, totalProject, yearOfExperience, mainImage, updatedAt: Date.now()
      });
    } else {
      info = new ProfileBasic({ mainTitle, subtitle, shortBio, totalProject, yearOfExperience, mainImage });
      await info.save();
    }
    res.redirect('/admin/dashboard?success=Basic info updated');
  } catch (error) {
    res.render('admin/manage-basic', { error: 'Error updating info' });
  }
});

// Manage Main Info
router.get('/profile/main', isAuthenticated, async (req, res) => {
  try {
    const info = await ProfileMain.findOne();
    res.render('admin/manage-main', { info });
  } catch (error) {
    res.redirect('/admin/dashboard');
  }
});

router.post('/profile/main', isAuthenticated, async (req, res) => {
  try {
    let { secondaryTitle, bio, secondaryImage, internshipCount, aiProject, deployedProject, groupProjects, skills } = req.body;
    
    // Auto-convert GitHub blob URLs to raw URLs
    if (secondaryImage && secondaryImage.includes('github.com') && secondaryImage.includes('/blob/')) {
        secondaryImage = secondaryImage.replace('github.com', 'raw.githubusercontent.com')
          .replace(/\/blob\//, '/')
          .split('?')[0];
    }

    const skillsArray = skills ? skills.split(',').map(s => s.trim()).filter(Boolean) : [];
    
    let info = await ProfileMain.findOne();
    if (info) {
      await ProfileMain.findByIdAndUpdate(info._id, {
        secondaryTitle, bio, secondaryImage, internshipCount, aiProject, deployedProject, groupProjects, skills: skillsArray, updatedAt: Date.now()
      });
    } else {
      info = new ProfileMain({ 
        secondaryTitle, bio, secondaryImage, internshipCount, aiProject, deployedProject, groupProjects, skills: skillsArray 
      });
      await info.save();
    }
    res.redirect('/admin/dashboard?success=Main profile updated');
  } catch (error) {
    res.render('admin/manage-main', { error: 'Error updating profile' });
  }
});

// Add Internship
router.get('/internship/add', isAuthenticated, (req, res) => {
  res.render('admin/add-internship');
});

router.post('/internship/add', isAuthenticated, async (req, res) => {
  try {
    const { internshipName, company, role, technologies, start, end, mode } = req.body;
    const techArray = technologies ? technologies.split(',').map(t => t.trim()).filter(Boolean) : [];
    
    const internship = new Internship({
      internshipName, company, role, technologies: techArray, start, end, mode
    });
    await internship.save();
    res.redirect('/admin/dashboard?success=Internship added');
  } catch (error) {
    res.render('admin/add-internship', { error: 'Error adding internship' });
  }
});

// Edit Internship
router.get('/internship/edit/:id', isAuthenticated, async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) return res.redirect('/admin/dashboard');
    res.render('admin/edit-internship', { internship });
  } catch (error) {
    res.redirect('/admin/dashboard');
  }
});

router.post('/internship/edit/:id', isAuthenticated, async (req, res) => {
  try {
    const { internshipName, company, role, technologies, start, end, mode } = req.body;
    const techArray = technologies ? technologies.split(',').map(t => t.trim()).filter(Boolean) : [];
    
    await Internship.findByIdAndUpdate(req.params.id, {
      internshipName, company, role, technologies: techArray, start, end, mode
    });
    res.redirect('/admin/dashboard?success=Internship updated');
  } catch (error) {
    res.redirect('/admin/dashboard');
  }
});

// Delete Internship
router.post('/internship/delete/:id', isAuthenticated, async (req, res) => {
  try {
    await Internship.findByIdAndDelete(req.params.id);
    res.redirect('/admin/dashboard?success=Internship deleted');
  } catch (error) {
    res.redirect('/admin/dashboard?error=Error deleting internship');
  }
});

// ─────────────────────────────────────────────
// Admin Logout
// ─────────────────────────────────────────────
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send('Error logging out');
    }
    res.redirect('/');
  });
});

module.exports = router;
