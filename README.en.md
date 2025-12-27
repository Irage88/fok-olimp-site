# FOK "Olimp" — Service Booking System

## Table of Contents

- [Project Description](#project-description)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Main API Endpoints](#main-api-endpoints)
- [Testing Checklist](#testing-checklist)
- [Documentation](#documentation)

## Project Description

Web application for the "Olimp" sports complex that allows users to view available services, register, log in, book services, and manage their bookings through a personal dashboard.

## Key Features

- ✅ **Registration and Login** — Authentication system using JWT tokens
- ✅ **Protected Dashboard** — Access only for authorized users
- ✅ **Booking History** — Personal booking history for each user
- ✅ **Profile Update** — Ability to change email and phone in settings
- ✅ **Services Catalog** — View all available services of the sports complex
- ✅ **Contact Form** — Send messages through the contact form

## Tech Stack

- **Backend:** Node.js + Express
- **Database:** SQLite
- **Authentication:** JWT (tokens stored in localStorage with key `token`)
- **Frontend:** HTML, CSS, JavaScript (static frontend)
- **Date Format:** DD.MM.YYYY
- **Time Format:** HH:MM

## Project Structure

```
project/
├── backend/          # Backend application (Node.js + Express)
│   ├── src/
│   │   ├── controllers/   # Controllers for request handling
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Middleware (authentication)
│   │   ├── db/            # Database operations
│   │   └── utils/         # Utility functions
│   └── database.sqlite    # SQLite database file
│
└── frontend/         # Frontend application (static HTML/CSS/JS)
    ├── index.html
    ├── login.html
    ├── register.html
    ├── dashboard.html
    ├── services.html
    ├── service.html
    ├── contacts.html
    ├── css/
    ├── js/
    └── assets/
```

## Quick Start

1. **Navigate to backend directory:**
   ```powershell
   cd backend
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Create `.env` file** in the `backend` directory (see [Environment Variables](#environment-variables) section)

4. **Initialize database:**
   ```powershell
   npm run init-db
   ```

5. **Start the server:**
   ```powershell
   npm start
   ```
   Or for development mode with auto-reload:
   ```powershell
   npm run dev
   ```

6. **Open in browser:**
   ```
   http://localhost:3000/index.html
   ```

For detailed installation and setup instructions, see [SETUP.en.md](./SETUP.en.md).

## Environment Variables

Create a `.env` file in the `backend` directory with the following content:

```env
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

**IMPORTANT:** Replace `JWT_SECRET` with a strong random key before deploying to production!

## Main API Endpoints

### Authentication
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login to the system
- `GET /api/auth/me` — Get current user data (requires authentication)

### Profile
- `PATCH /api/profile` — Update profile (email, phone) (requires authentication)

### Services
- `GET /api/services` — Get list of all services
- `GET /api/services/:id` — Get service by ID

### Bookings
- `POST /api/bookings` — Create a booking (requires authentication)
- `GET /api/bookings/me` — Get all bookings of the current user (requires authentication)
- `DELETE /api/bookings/:id` — Delete a booking (requires authentication)

### Contacts
- `POST /api/contacts` — Send a message through the contact form

All API requests use base URL: `http://localhost:3000/api`

## Testing Checklist

- [ ] **Registration:** Create a new user through the registration form
- [ ] **Login:** Log in to the system with registered credentials
- [ ] **Booking:** Create a service booking with date and time
- [ ] **Dashboard:** Check display of user name and booking history
- [ ] **Profile Update:** Change email or phone in profile settings
- [ ] **Logout:** Log out of the system and verify that dashboard access is blocked
- [ ] **Route Protection:** Try to open `/dashboard.html` without authorization (should redirect to login page)

## Documentation

- **[SETUP.en.md](./SETUP.en.md)** — Detailed installation and setup guide
- **[IMPLEMENTATION_SUMMARY.en.md](./IMPLEMENTATION_SUMMARY.en.md)** — Project implementation report

### Russian Documentation

- **[README.md](./README.md)** — Обзор проекта (на русском)
- **[SETUP.md](./SETUP.md)** — Руководство по установке (на русском)
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** — Отчёт о реализации (на русском)




