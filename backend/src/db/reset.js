const fs = require('fs');
const path = require('path');
const { initDb } = require('./init');

// Use DB_PATH from environment or fallback to local path
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../../database.sqlite');

async function resetDatabase() {
    console.log('⚠️  Database reset will DELETE ALL users/bookings/contacts data.');
    console.log('⚠️  Stop the server before running this script.');
    console.log('');

    try {
        // Check if database file exists
        if (fs.existsSync(DB_PATH)) {
            // Remove the database file
            fs.unlinkSync(DB_PATH);
            console.log('Database file removed');
        } else {
            console.log('Database file does not exist, proceeding with initialization');
        }

        // Re-initialize the database using existing init logic
        await initDb();

        console.log('');
        console.log('✅ Database removed and re-initialized successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error resetting database:', error);
        process.exit(1);
    }
}

resetDatabase();


