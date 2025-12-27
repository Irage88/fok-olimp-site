const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Use DB_PATH from environment or fallback to local path
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../../database.sqlite');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

async function ensureDb() {
    return new Promise((resolve, reject) => {
        try {
            // Open database connection (SQLite will create file if it doesn't exist)
            const db = new sqlite3.Database(DB_PATH, (err) => {
                if (err) {
                    console.error('Error opening database:', err);
                    console.error('Database path:', DB_PATH);
                    reject(err);
                    return;
                }
            });
            
            // Enable foreign keys
            db.run('PRAGMA foreign_keys = ON', (err) => {
                if (err) {
                    console.error('Error enabling foreign keys:', err);
                    db.close();
                    reject(err);
                    return;
                }
            });
            
            // Always ensure tables exist (CREATE TABLE IF NOT EXISTS is safe)
            const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
            
            db.exec(schema, (err) => {
                if (err) {
                    console.error('Error creating schema:', err);
                    db.close();
                    reject(err);
                    return;
                }
                
                console.log('Tables ensured');
                
                // Check if services table is empty and seed if needed
                db.get('SELECT COUNT(*) as count FROM services', [], (err, row) => {
                    if (err) {
                        console.error('Error checking services count:', err);
                        db.close();
                        reject(err);
                        return;
                    }
                    
                    if (row.count === 0) {
                        // Services table is empty, seed it
                        console.log('Services table is empty. Seeding services...');
                        const servicesData = require('./seed-services.json');
                        const stmt = db.prepare(`
                            INSERT INTO services (id, title, badge, price, image, gallery_image, description, duration, format, age, level)
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
                            
                            console.log('Services seeded');
                            db.close();
                            console.log('DB ready');
                            resolve();
                        });
                    } else {
                        // Services already exist
                        db.close();
                        console.log('DB ready');
                        resolve();
                    }
                });
            });
        } catch (error) {
            console.error('Failed to ensure database:', error);
            reject(error);
        }
    });
}

module.exports = { ensureDb };
