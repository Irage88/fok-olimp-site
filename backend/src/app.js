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

// Serve static files from frontend directory
const frontendPath = path.join(__dirname, '../../frontend');
app.use(express.static(frontendPath));

// API routes
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

// Clean URL routes (serve HTML files without .html extension)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/about.html'));
});

app.get('/services', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/services.html'));
});

app.get('/service', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/service.html'));
});

app.get('/contacts', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/contacts.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/register.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/login.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dashboard.html'));
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
    res.redirect(301, '/service');
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

// Catch-all: serve index.html for SPA routing (if needed)
// For now, we'll let Express serve static files normally

module.exports = app;
