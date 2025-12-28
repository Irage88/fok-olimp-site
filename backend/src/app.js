const express = require('express');
const path = require('path');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/profile.routes');
const servicesRoutes = require('./routes/services.routes');
const bookingsRoutes = require('./routes/bookings.routes');
const contactsRoutes = require('./routes/contacts.routes');
const notificationsRoutes = require('./routes/notifications.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes (must be before static and page routes)
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/notifications', notificationsRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Frontend path
const frontendPath = path.join(__dirname, '../../frontend');

// Clean URL routes (serve HTML files without .html extension)
// Must be BEFORE express.static to take precedence
app.get('/', (req, res) => {
    console.log("Serving page:", req.path);
    res.sendFile(path.join(frontendPath, 'index.html'));
});

app.get('/about', (req, res) => {
    console.log("Serving page:", req.path);
    res.sendFile(path.join(frontendPath, 'about.html'));
});

app.get('/services', (req, res) => {
    console.log("Serving page:", req.path);
    res.sendFile(path.join(frontendPath, 'services.html'));
});

app.get('/service', (req, res) => {
    console.log("Serving page:", req.path);
    res.sendFile(path.join(frontendPath, 'service.html'));
});

app.get('/service/:id', (req, res) => {
    res.sendFile(path.join(frontendPath, 'service.html'));
});

app.get('/contacts', (req, res) => {
    console.log("Serving page:", req.path);
    res.sendFile(path.join(frontendPath, 'contacts.html'));
});

app.get('/register', (req, res) => {
    console.log("Serving page:", req.path);
    res.sendFile(path.join(frontendPath, 'register.html'));
});

app.get('/login', (req, res) => {
    console.log("Serving page:", req.path);
    res.sendFile(path.join(frontendPath, 'login.html'));
});

app.get('/dashboard', (req, res) => {
    console.log("Serving page:", req.path);
    res.sendFile(path.join(frontendPath, 'dashboard.html'));
});

app.get('/gto', (req, res) => {
    res.sendFile(path.join(frontendPath, 'gto.html'));
});

// Redirects from .html paths to clean paths
app.get('/index.html', (req, res) => {
    res.redirect(301, '/');
});

app.get('/about.html', (req, res) => {
    res.redirect(301, '/about');
});

app.get('/services.html', (req, res) => {
    res.redirect(301, '/services');
});

app.get('/service.html', (req, res) => {
    // If there's an id query param, redirect to clean URL
    if (req.query.id) {
        res.redirect(301, `/service/${req.query.id}`);
    } else {
        res.redirect(301, '/service');
    }
});

app.get('/contacts.html', (req, res) => {
    res.redirect(301, '/contacts');
});

app.get('/register.html', (req, res) => {
    res.redirect(301, '/register');
});

app.get('/login.html', (req, res) => {
    res.redirect(301, '/login');
});

app.get('/dashboard.html', (req, res) => {
    res.redirect(301, '/dashboard');
});

app.get('/gto.html', (req, res) => {
    res.redirect(301, '/gto');
});

// Serve static files from frontend directory (CSS, JS, images, etc.)
// Must be AFTER clean URL routes so they don't intercept page requests
app.use(express.static(frontendPath));

// Catch-all: serve index.html for SPA routing (if needed)
// For now, we'll let Express serve static files normally

module.exports = app;
