/* eslint-disable no-undef */
const express = require('express');
const { verifyToken } = require('../middleware/auth-middleware');

const router = express.Router();

// GET /api/auth/me - Check current user's authentication status
router.get('/me', verifyToken, (req, res) => {
    // If verifyToken middleware passes, user is authenticated
    // req.user contains the decoded JWT payload
    res.json({
        success: true,
        isAuthenticated: true,
        userId: req.user.userId,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
    });
});

module.exports = router;
