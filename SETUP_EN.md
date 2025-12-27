# Installation and Setup Guide

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Creating .env File](#creating-env-file)
- [Database Initialization](#database-initialization)
- [Starting Backend](#starting-backend)
- [Accessing Frontend](#accessing-frontend)
- [Troubleshooting](#troubleshooting)
- [Resetting Database](#resetting-database)

## Requirements

- **Node.js** version 14.0.0 or higher
- **npm** (installed with Node.js)
- **Windows PowerShell** (for executing commands)

Check Node.js version:
```powershell
node --version
```

If Node.js is not installed, download and install it from the [official website](https://nodejs.org/).

## Installation

1. **Open PowerShell** and navigate to the project directory:
   ```powershell
   cd D:\Practic\test\test_3\project
   ```

2. **Navigate to backend directory:**
   ```powershell
   cd backend
   ```

3. **Install dependencies:**
   ```powershell
   npm install
   ```

   This command will install all necessary packages specified in `package.json`:
   - express
   - sqlite3
   - bcryptjs
   - jsonwebtoken
   - dotenv
   - cors
   - nodemon (for development)

## Creating .env File

1. **Create `.env` file** in the `backend` directory (in the same folder where `package.json` is located).

2. **Add the following content to the file:**
   ```env
   PORT=3000
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

3. **IMPORTANT:** Replace the `JWT_SECRET` value with a strong random key. In production, use a long random string (minimum 32 characters).

   Example of generating a secret key in PowerShell:
   ```powershell
   -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
   ```

## Database Initialization

After installing dependencies and creating the `.env` file, run:

```powershell
npm run init-db
```

This command will:
- Create `database.sqlite` file in the `backend` directory
- Create all necessary tables (users, services, bookings, contacts, notifications)
- Populate the `services` table with initial data from `seed-services.json`

**Note:** On server startup, the database is automatically initialized if tables don't exist. This ensures the application works on Render Free Plan where the database may be reset.

If the command executed successfully, you will see a message about successful database initialization.

## Starting Backend

### Development Mode (with auto-reload)

```powershell
npm run dev
```

The server will start using `nodemon`, which automatically reloads the server when files change.

### Production Mode

```powershell
npm start
```

The server will be available at: `http://localhost:3000`

You should see a message in the console that the server is running on port 3000.

## Accessing Frontend

Frontend is automatically served by the Express server as static files from the `/frontend` directory.

After starting the backend, open in your browser:

- **Home page:** `http://localhost:3000/` or `http://localhost:3000/index.html`
- **Registration:** `http://localhost:3000/register` or `http://localhost:3000/register.html`
- **Login:** `http://localhost:3000/login` or `http://localhost:3000/login.html`
- **Dashboard:** `http://localhost:3000/dashboard` or `http://localhost:3000/dashboard.html`
- **Services:** `http://localhost:3000/services` or `http://localhost:3000/services.html`
- **Contacts:** `http://localhost:3000/contacts` or `http://localhost:3000/contacts.html`

**Note:** Application supports clean URLs without `.html` extension. Old URLs with `.html` automatically redirect to clean URLs.

## Troubleshooting

### Error: "npm is not recognized as a command"

**Problem:** Node.js is not installed or not added to PATH.

**Solution:**
1. Install Node.js from the [official website](https://nodejs.org/)
2. Restart PowerShell after installation
3. Verify installation: `node --version` and `npm --version`

### PowerShell Script Execution Error

**Problem:** PowerShell execution policy blocks script execution.

**Solution:**
Run in PowerShell as administrator:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Error: "JWT_SECRET is required"

**Problem:** `.env` file is not created or does not contain `JWT_SECRET` variable.

**Solution:**
1. Make sure the `.env` file is located in the `backend` directory
2. Verify that the file contains the line `JWT_SECRET=...`
3. Restart the server after creating/modifying `.env`

### SQLite Database Errors

**Problem:** Errors when creating or accessing `database.sqlite`.

**Solution:**
1. Make sure you have write permissions in the `backend` directory
2. Delete the existing `database.sqlite` file (if present) and run `npm run init-db` again
3. Verify that the `backend` directory exists and is accessible

### Port 3000 Already in Use

**Problem:** Another process is using port 3000.

**Solution:**
1. Change the port in the `.env` file to another one (e.g., `PORT=3001`)
2. Or terminate the process using port 3000:
   ```powershell
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

### Modules Not Found After Installation

**Problem:** Dependencies did not install correctly.

**Solution:**
1. Delete the `node_modules` directory and `package-lock.json` file
2. Run `npm install` again
3. Make sure you are in the `backend` directory

## Resetting Database

If you need to reset the database and start fresh:

1. **Stop the server** (if it's running) — press `Ctrl+C` in the terminal

2. **Run the database reset script:**
   ```powershell
   cd backend
   npm run reset-db
   ```

3. **Start the server again:**
   ```powershell
   npm start
   ```

**Warning:** This will delete all data (users, bookings, messages). Use only for development and testing. The script will automatically delete the database and recreate it with initial service data.

## Verification

After successful installation and startup, verify:

1. **Server is running:** Console should show a message about startup on port 3000
2. **Database is created:** The `backend/database.sqlite` file should exist
3. **Frontend is accessible:** Open `http://localhost:3000/` in browser
4. **API is working:** Open `http://localhost:3000/api/services` in browser — should return JSON with list of services

## Additional Information

- **Token Storage:** JWT tokens are stored in browser `localStorage` with key `token`
- **Database:** SQLite file is located at `backend/database.sqlite`
- **Logs:** Errors and information are output to the console where the server is running


