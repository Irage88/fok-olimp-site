const { getDb } = require('../db/db');
const { successResponse, errorResponse } = require('../utils/response');

async function getAllServices(req, res) {
    const db = getDb();
    
    try {
        return new Promise((resolve) => {
            db.all('SELECT * FROM services', [], (err, services) => {
                if (err) {
                    res.status(500).json(errorResponse('Failed to fetch services', 500));
                    resolve();
                    return;
                }
                
                // Transform to match frontend format
                const transformedServices = services.map(service => ({
                    id: service.id,
                    title: service.title,
                    badge: service.badge,
                    price: service.price,
                    image: service.image,
                    galleryImage: service.gallery_image,
                    description: service.description,
                    duration: service.duration,
                    format: service.format,
                    age: service.age,
                    level: service.level
                }));
                
                res.json(successResponse(transformedServices));
                resolve();
            });
        });
    } catch (error) {
        res.status(500).json(errorResponse('Failed to fetch services', 500));
    }
}

async function getServiceById(req, res) {
    const db = getDb();
    const { id } = req.params;
    
    try {
        return new Promise((resolve) => {
            db.get('SELECT * FROM services WHERE id = ?', [id], (err, service) => {
                if (err) {
                    res.status(500).json(errorResponse('Failed to fetch service', 500));
                    resolve();
                    return;
                }
                
                if (!service) {
                    res.status(404).json(errorResponse('Service not found', 404));
                    resolve();
                    return;
                }
                
                // Transform to match frontend format
                const transformedService = {
                    id: service.id,
                    title: service.title,
                    badge: service.badge,
                    price: service.price,
                    image: service.image,
                    galleryImage: service.gallery_image,
                    description: service.description,
                    duration: service.duration,
                    format: service.format,
                    age: service.age,
                    level: service.level
                };
                
                res.json(successResponse(transformedService));
                resolve();
            });
        });
    } catch (error) {
        res.status(500).json(errorResponse('Failed to fetch service', 500));
    }
}

module.exports = {
    getAllServices,
    getServiceById
};
