const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
// require('dotenv').config();
require('@dotenvx/dotenvx').config()

const connectDatabase = require('./config/db');
const app = express();
const PORT = process.env.PORT || 3000;

const Contact = require('./models/Contact');
const { sendContactNotification } = require('./utils/mailer');

// Initialize server
async function startServer() {
  try {
    // Connect to MongoDB
    await connectDatabase();

    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '../views'));

    app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    app.use(express.static(path.join(__dirname, '../public')));

    app.use(
      session({
        secret: process.env.SESSION_SECRET || 'your-secret-key',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
          mongoUrl: process.env.MONGO_CLUSTER_URL || process.env.MONGO_CLUSTER_SRV_URL,
          collectionName: 'sessions',
          ttl: 30 * 60 // 30 minutes in seconds
        }),
        cookie: {
          secure: process.env.NODE_ENV === 'production',
          httpOnly: true,
          maxAge: 1000 * 60 * 30, // 30 minutes in milliseconds
        },
      })
    );

    // Global middleware to pass session info to all views
    app.use((req, res, next) => {
      res.locals.admin = req.session.admin || null;
      next();
    });

    const homeRoutes = require('../routes/home');
    const adminRoutes = require('../routes/admin');

    app.get('/MyPort/success', (req, res) => {
      res.render('success');
    });

    app.use('/MyPort', homeRoutes);
    app.use('/admin', adminRoutes);

    app.get('/', (req, res) => {
      res.redirect('/MyPort/home');
    });

    app.post('/contact', async (req, res) => {
      try {
        const { name, email, phone, message } = req.body;
        const newContact = new Contact({
          name,
          email,
          phone: phone || '',
          message
        });
        await newContact.save();

        // Send Email Notification (Non-blocking)
        sendContactNotification({ name, email, phone, message });

        res.redirect('/MyPort/success');
      } catch (error) {
        console.error('Error saving contact message:', error);
        res.redirect('/MyPort/home?error=Failed to send message. Please try again.');
      }
    });

    // 404 Handler (Catch all unknown routes)
    app.use((req, res) => {
      res.status(404).render('404');
    });

    // Global Error Handler to prevent crashes
    app.use((err, req, res, next) => {
      console.error('⚠️ Server Error:', err.message);
      
      // Pass the error message to the view
      const errorMessage = (err.name === 'SyntaxError' && err.message.includes('ejs')) 
        ? `Template Error: ${err.message}` 
        : err.message || 'Internal Server Error';

      res.status(500).render('error', { message: errorMessage });
    });

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();

module.exports = app;