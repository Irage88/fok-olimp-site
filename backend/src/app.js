const express = require('express');
const path = require('path');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/profile.routes');
const servicesRoutes = require('./routes/services.routes');
const bookingsRoutes = require('./routes/bookings.routes');
const contactsRoutes = require('./routes/contacts.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from frontend directory
const frontendPath = path.join(__dirname, '../../frontend');
app.use(express.static(frontendPath));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/contacts', contactsRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Catch-all: serve index.html for SPA routing (if needed)
// For now, we'll let Express serve static files normally

module.exports = app;
