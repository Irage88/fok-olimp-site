const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../utils/errors');
const { errorResponse } = require('../utils/response');

function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json(errorResponse('No token provided', 401));
        }
        
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        
        if (!token) {
            return res.status(401).json(errorResponse('No token provided', 401));
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, email }
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json(errorResponse('Invalid or expired token', 401));
        }
        return res.status(401).json(errorResponse('Authentication failed', 401));
    }
}

module.exports = authMiddleware;
