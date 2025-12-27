// Load dotenv FIRST, before any other imports
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

// Validate required environment variables
if (!process.env.JWT_SECRET) {
    console.error('ERROR: JWT_SECRET is not set in .env file');
    process.exit(1);
}

const { ensureDb } = require('./db/ensureDb');
const app = require('./app');

const PORT = process.env.PORT || 3000;

// Ensure database is initialized before starting server
ensureDb()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
            console.log(`Frontend is served from ./frontend`);
        });
    })
    .catch((error) => {
        console.error('Failed to initialize database:');
        console.error('Error details:', error);
        if (error.stack) {
            console.error('Stack trace:', error.stack);
        }
        process.exit(1);
    });
