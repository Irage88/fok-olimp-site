const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Use DB_PATH from environment or fallback to local path
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../../database.sqlite');

let db = null;

function getDb() {
    if (!db) {
        db = new sqlite3.Database(DB_PATH, (err) => {
            if (err) {
                console.error('Error opening database:', err);
                console.error('Database path:', DB_PATH);
                throw err;
            }
        });
        // Enable foreign keys
        db.run('PRAGMA foreign_keys = ON', (err) => {
            if (err) {
                console.error('Error enabling foreign keys:', err);
            }
        });
    }
    return db;
}

function closeDb() {
    if (db) {
        db.close((err) => {
            if (err) {
                console.error('Error closing database:', err);
            }
        });
        db = null;
    }
}

module.exports = {
    getDb,
    closeDb
};
