// /metlife-TEN-Hackathon/backend/src/routes/auth.routes.js
import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import pool from '../config/database.js';

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        const user = await User.create({ email, password, firstName, lastName });

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValid = await User.verifyPassword(password, user.password_hash);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Get current user profile
router.get('/me', authenticate, async (req, res) => {
    res.json({
        id: req.user.id,
        email: req.user.email,
        firstName: req.user.first_name,
        lastName: req.user.last_name
    });
});

// Get full user profile with preferences
router.get('/profile', authenticate, async (req, res) => {
    try {
        const profile = await User.getProfile(req.user.id);
        res.json(profile);
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// Update user profile
router.put('/profile', authenticate, async (req, res) => {
    try {
        const { learningStyle, studyGoals, preferredStudyTimes, languagePreference, timezone } = req.body;

        const updatedProfile = await User.updateProfile(req.user.id, {
            learningStyle,
            studyGoals,
            preferredStudyTimes,
            languagePreference,
            timezone
        });

        res.json(updatedProfile);
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

export default router;
// Update notification preferences
router.put('/notifications', authenticate, async (req, res) => {
    try {
        const { emailNotifications, studyReminders } = req.body;
        
        const result = await pool.query(
            `UPDATE users 
             SET notification_preferences = $1
             WHERE id = $2
             RETURNING notification_preferences`,
            [JSON.stringify({ email: emailNotifications, study_reminders: studyReminders }), req.user.id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Notification update error:', error);
        res.status(500).json({ error: 'Failed to update notification preferences' });
    }
});

// Send test study reminder
router.post('/test-reminder', authenticate, async (req, res) => {
    try {
        const emailService = (await import('../services/email.service.js')).default;
        const result = await emailService.sendStudyReminder(
            req.user.email,
            req.user.first_name || 'Student'
        );
        res.json(result);
    } catch (error) {
        console.error('Test reminder error:', error);
        res.status(500).json({ error: 'Failed to send test reminder' });
    }
});
