import express from 'express';
import { generateAuthUrl, oauthCallback } from '../controllers/calendarController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/calendar/auth - Get Google OAuth URL (Private)
router.get('/auth', protect, generateAuthUrl);

// GET /api/calendar/callback - Google redirects here after consent
// Note: This is called by Google directly, not the client, so no JWT here.
// The userId is passed via the `state` query param by the frontend.
router.get('/callback', oauthCallback);

export default router;
