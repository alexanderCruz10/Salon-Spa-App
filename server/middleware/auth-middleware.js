/* eslint-disable no-undef */
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token from httpOnly cookie
const verifyToken = (req, res, next) => {
    try {
        // Get token from cookie
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to request
        next();
        
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired. Please login again.'
            });
        }
        
        return res.status(401).json({
            success: false,
            message: 'Invalid token.'
        });
    }
};

// Generate JWT token with 1 hour expiration
const generateToken = (user) => {
    return jwt.sign(
        {
            userId: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Token expires in 1 hour
    );
};

// Set httpOnly cookie with 1 hour expiration
const setTokenCookie = (res, token) => {
    console.log('Setting token cookie:', token ? 'Token exists' : 'No token');
    res.cookie('token', token, {
        httpOnly: true,           // Can't be accessed by JavaScript
        secure: false,            // Set to false for localhost development
        sameSite: 'lax',         // Changed from 'strict' to 'lax' for better compatibility
        maxAge: 60 * 60 * 1000   // 1 hour in milliseconds
    });
    console.log('Token cookie set successfully');
};

// Clear token cookie (for logout)
const clearTokenCookie = (res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
};

module.exports = {
    verifyToken,
    generateToken,
    setTokenCookie,
    clearTokenCookie
};
