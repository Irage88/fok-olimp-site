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
- ✅ **Notifications System** — Personal notifications for registration, bookings, and profile updates
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
   http://localhost:3000
   ```
   
   Or use clean URLs without `.html` extension:
   - `http://localhost:3000/` — home
   - `http://localhost:3000/register` — registration
   - `http://localhost:3000/login` — login
   - `http://localhost:3000/dashboard` — dashboard
   - `http://localhost:3000/services` — services
   - `http://localhost:3000/contacts` — contacts

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

### Notifications
- `GET /api/notifications` — Get all notifications of the current user (requires authentication)
- `POST /api/notifications/read-all` — Mark all notifications as read (requires authentication)

**Note:** API base URL is determined automatically:
- Locally: `http://localhost:3000/api`
- On Render: `https://your-app.onrender.com/api`

## Testing Checklist

- [ ] **Registration:** Create a new user through the registration form
- [ ] **Login:** Log in to the system with registered credentials
- [ ] **Booking:** Create a service booking with date and time
- [ ] **Dashboard:** Check display of user name and booking history
- [ ] **Profile Update:** Change email or phone in profile settings
- [ ] **Logout:** Log out of the system and verify that dashboard access is blocked
- [ ] **Route Protection:** Try to open `/dashboard` without authorization (should redirect to login page)
- [ ] **Notifications:** Check notifications appear after registration, booking creation, and profile update
- [ ] **Mark All Notifications:** Use "Mark All" button in notifications section

## Deployment

### Uploading Project to GitHub

1. **Initialize Git repository:**
   ```powershell
   git init
   ```

2. **Add all files:**
   ```powershell
   git add .
   ```

3. **Create first commit:**
   ```powershell
   git commit -m "Initial commit"
   ```

4. **Create repository on GitHub** and add remote:
   ```powershell
   git remote add origin https://github.com/your-username/repository-name.git
   ```

5. **Push code to GitHub:**
   ```powershell
   git branch -M main
   git push -u origin main
   ```

### Deployment to Render (Free Plan)

1. **Create account on [Render.com](https://render.com)** and connect your GitHub repository

2. **Create new Web Service:**
   - Select your repository from GitHub
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

3. **Configure environment variables:**
   - `JWT_SECRET` — your secret key for JWT (use a strong random key, minimum 32 characters)
   - `NODE_ENV` — `production`
   - `DB_PATH` — not required (database is automatically created on startup)

4. **Important — Render Free Plan:**
   - **No Persistent Disk** — SQLite database is stored in ephemeral storage
   - Database is automatically recreated on each deployment/restart
   - All data (users, bookings, notifications) will be deleted on service restart
   - This is normal behavior for Render Free plan
   - For production, consider using paid plan with Persistent Disk or external DB (PostgreSQL)

5. **After deployment:**
   - Database is automatically initialized on first server startup
   - Tables are created automatically, services are populated from seed data
   - No additional actions required

6. **Clean URLs:**
   - Application uses clean URLs without `.html`:
   - `https://your-app.onrender.com/` — home
   - `https://your-app.onrender.com/register` — registration
   - `https://your-app.onrender.com/login` — login
   - `https://your-app.onrender.com/dashboard` — dashboard
   - Old URLs with `.html` automatically redirect to clean URLs

**Notes:**
- On Render Free plan, services may "sleep" after inactivity. First request may take a few seconds to wake the service.
- API base URL is determined automatically based on current domain (no configuration needed).
- For testing, you can create test accounts, but remember that data is not persisted between restarts on Free plan.

## Documentation

- **[SETUP.en.md](./SETUP.en.md)** — Detailed installation and setup guide
- **[IMPLEMENTATION_SUMMARY.en.md](./IMPLEMENTATION_SUMMARY.en.md)** — Project implementation report

### Russian Documentation

- **[README.md](./README.md)** — Обзор проекта (на русском)
- **[SETUP.md](./SETUP.md)** — Руководство по установке (на русском)
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** — Отчёт о реализации (на русском)




