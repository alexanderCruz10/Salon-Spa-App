/* eslint-disable no-undef */
const router = require('express').Router();
const UserModel = require('../models/user-model');
const bcrypt = require('bcryptjs');
const { generateToken, setTokenCookie, clearTokenCookie, verifyToken } = require('../middleware/auth-middleware');

router.post('/register',  async (req, res) => {
    // Logic for user registration
    try {
        //Check if user already exists, if yes return error
        const existingUser = await UserModel.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        //hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;

        //Create a new user 
        const newUser = await UserModel.create(req.body);
        
        // Generate JWT token with 1-hour expiration
        const token = generateToken(newUser);
        
        // Set httpOnly cookie with 1-hour expiration
        setTokenCookie(res, token);
        
        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false, 
            message: error.message
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        console.log('Login attempt with:', req.body);
        
        // Check if user exists
        const user = await UserModel.findOne({ email: req.body.email });
        if (!user) {
            console.log('User not found:', req.body.email);
            return res.status(400).json({
                success: false,
                message: 'User does not exist'
            });
        }

        // Check if password is correct
        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordCorrect) {
            console.log('Invalid password for user:', req.body.email);
            return res.status(400).json({
                success: false,
                message: 'Invalid password'
            });
        }

        //check if user role is is equal to request role
        if (user.role !== req.body.role) {
            console.log('Role mismatch for user:', req.body.email);
            return res.status(403).json({
                success: false,
                message: 'Access denied: role mismatch'
            });
        }

        console.log('Login successful for user:', req.body.email);
        
        // Generate JWT token with 1-hour expiration
        const token = generateToken(user);
        
        // Set httpOnly cookie with 1-hour expiration
        setTokenCookie(res, token);
        
        // Login successful
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.post('/logout', async (req, res) => {
    try {
        // Clear the JWT cookie
        clearTokenCookie(res);
        
        return res.status(200).json({
            success: true,
            message: 'Logout successful'
        });
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;