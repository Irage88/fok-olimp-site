const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Use DB_PATH from environment or fallback to local path
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../../database.sqlite');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

async function ensureDb() {
    return new Promise((resolve, reject) => {
        // Open database connection
        const db = new sqlite3.Database(DB_PATH, (err) => {
            if (err) {
                console.error('Error opening database:', err);
                console.error('Database path:', DB_PATH);
                reject(err);
                return;
            }
        });
        
        // Enable foreign keys
        db.run('PRAGMA foreign_keys = ON');
        
        // Check if users table exists
        db.get(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='users'",
            [],
            (err, row) => {
                if (err) {
                    console.error('Error checking database:', err);
                    db.close();
                    reject(err);
                    return;
                }
                
                if (!row) {
                    // Table doesn't exist, initialize database
                    console.log('Database tables not found. Initializing...');
                    const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
                    
                    db.exec(schema, (err) => {
                        if (err) {
                            console.error('Error creating schema:', err);
                            db.close();
                            reject(err);
                            return;
                        }
                        
                        console.log('Database schema created successfully');
                        
                        // Seed services
                        const servicesData = require('./seed-services.json');
                        const stmt = db.prepare(`
                            INSERT OR REPLACE INTO services (id, title, badge, price, image, gallery_image, description, duration, format, age, level)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        `);
                        
                        servicesData.forEach(service => {
                            stmt.run(
                                service.id,
                                service.title,
                                service.badge || null,
                                service.price || null,
                                service.image || null,
                                service.galleryImage || null,
                                service.description || null,
                                service.duration || null,
                                service.format || null,
                                service.age || null,
                                service.level || null
                            );
                        });
                        
                        stmt.finalize((err) => {
                            if (err) {
                                console.error('Error seeding services:', err);
                                db.close();
                                reject(err);
                                return;
                            }
                            
                            console.log('Services seeded successfully');
                            db.close();
                            resolve();
                        });
                    });
                } else {
                    // Database already initialized
                    console.log('Database already initialized');
                    db.close();
                    resolve();
                }
            }
        );
    });
}

module.exports = { ensureDb };
