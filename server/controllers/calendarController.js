import Mentor from '../models/Mentor.js';
import { getAuthUrl, getTokens } from '../services/GoogleCalendar/googleCalendarService.js';

// @desc    Get Google OAuth2 authorization URL
// @route   GET /api/calendar/auth
// @access  Private/Mentor
export const generateAuthUrl = (req, res) => {
  try {
    const url = getAuthUrl();
    res.json({ authUrl: url });
  } catch (error) {
    console.error('Error generating Google Auth URL:', error);
    res.status(500).json({ message: 'Error generating Google Auth URL' });
  }
};

// @desc    Handle Google OAuth2 callback and store tokens
// @route   GET /api/calendar/callback
// @access  Private/Mentor (state carries the JWT user ID)
export const oauthCallback = async (req, res) => {
  try {
    const { code, state } = req.query;

    if (!code) {
      return res.status(400).json({ message: 'Authorization code missing from Google callback' });
    }

    // Exchange code for tokens
    const tokens = await getTokens(code);

    // `state` holds the mentor's userId passed from the frontend before redirecting
    if (!state) {
      return res.status(400).json({ message: 'State (userId) missing from callback' });
    }

    // Save tokens to the mentor's profile
    const mentor = await Mentor.findOne({ userId: state });
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor profile not found' });
    }

    mentor.googleAccessToken = tokens.access_token;
    mentor.googleRefreshToken = tokens.refresh_token || mentor.googleRefreshToken;
    await mentor.save();

    // Redirect the user back to the frontend with a success message
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    res.redirect(`${clientUrl}/dashboard?google=connected`);
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    res.status(500).json({ message: 'Google OAuth callback failed' });
  }
};
