import User from '../models/User.js';
import { getAuthUrl, getTokens } from '../services/GoogleCalendar/googleCalendarService.js';

// @desc    Get Google OAuth2 authorization URL
// @route   GET /api/calendar/auth
// @access  Private
export const generateAuthUrl = (req, res) => {
  try {
    const url = getAuthUrl(req.user._id.toString());
    res.json({ authUrl: url });
  } catch (error) {
    console.error('Error generating Google Auth URL:', error);
    res.status(500).json({ message: 'Error generating Google Auth URL' });
  }
};

// @desc    Handle Google OAuth2 callback and store tokens
// @route   GET /api/calendar/callback
// @access  Private (state carries the JWT user ID)
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

    // Save tokens to the user's profile
    const user = await User.findById(state);
    if (!user) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    user.googleAccessToken = tokens.access_token;
    user.googleRefreshToken = tokens.refresh_token || user.googleRefreshToken;
    await user.save();

    // Redirect the user back to the frontend with a success message
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    res.redirect(`${clientUrl}/profile?google=connected`);
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    res.status(500).json({ message: 'Google OAuth callback failed' });
  }
};
