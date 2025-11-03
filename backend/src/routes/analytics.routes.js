// /metlife-TEN-Hackathon/backend/src/routes/analytics.routes.js
import express from 'express';
import { authenticate } from '../middleware/auth.js';
import StudySession from '../models/StudySession.js';

const router = express.Router();

// Get user study statistics
router.get('/stats', authenticate, async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 7;
        const stats = await StudySession.getUserStats(req.user.id, days);
        res.json(stats);
    } catch (error) {
        console.error('Stats fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

// Get daily activity
router.get('/activity', authenticate, async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 30;
        const activity = await StudySession.getDailyActivity(req.user.id, days);
        res.json(activity);
    } catch (error) {
        console.error('Activity fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch activity' });
    }
});

export default router;
