const fs = require('fs');
const path = require('path');
const { getDb, closeDb } = require('./db');
const servicesData = require('./seed-services.json');

// Use DB_PATH from environment or fallback to local path
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../../database.sqlite');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

async function initDb() {
    try {
        // Read schema
        const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
        
        // Get database instance
        const db = getDb();
        
        // Run schema
        return new Promise((resolve, reject) => {
            db.exec(schema, (err) => {
                if (err) {
                    console.error('Error creating schema:', err);
                    reject(err);
                    return;
                }
                
                console.log('Database schema created successfully');
                
                // Seed services
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
                        reject(err);
                        return;
                    }
                    
                    console.log('Services seeded successfully');
                    closeDb();
                    resolve();
                });
            });
        });
    } catch (error) {
        console.error('Error initializing database:', error);
        closeDb();
        process.exit(1);
    }
}

// Export for reuse in reset script
module.exports = { initDb };

// Run directly when called as script
if (require.main === module) {
    initDb();
}
