import { google } from 'googleapis';

const createOAuth2Client = () => {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
};

// Generate the Google consent page URL
export const getAuthUrl = (userId) => {
  const oauth2Client = createOAuth2Client();
  const scopes = [
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/calendar.readonly',
  ];
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',   // ensures we get a refresh token
    prompt: 'consent',        // forces consent screen every time so we always get refresh token
    scope: scopes,
    state: userId,
  });
};

// Exchange authorization code for tokens
export const getTokens = async (code) => {
  const oauth2Client = createOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
};

// Create a calendar event with a Google Meet link
export const createCalendarEvent = async ({ accessToken, refreshToken }, bookingDetails) => {
  const oauth2Client = createOAuth2Client();

  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const { date, startTime, endTime, studentName, studentEmail, mentorName } = bookingDetails;

  // Build ISO datetime strings (assume UTC for now; timezone conversion handled in Phase 6)
  const startDateTime = new Date(`${date}T${startTime}:00.000Z`).toISOString();
  const endDateTime = new Date(`${date}T${endTime}:00.000Z`).toISOString();

  const event = {
    summary: `Mentorship Session: ${mentorName} & ${studentName}`,
    description: `Scheduled mentorship session via Smart Mentor Connect.`,
    start: {
      dateTime: startDateTime,
      timeZone: 'UTC',
    },
    end: {
      dateTime: endDateTime,
      timeZone: 'UTC',
    },
    attendees: studentEmail ? [{ email: studentEmail }] : [],
    conferenceData: {
      createRequest: {
        requestId: `smc-${Date.now()}`,
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    },
  };

  const response = await calendar.events.insert({
    calendarId: 'primary',
    resource: event,
    conferenceDataVersion: 1, // Required to generate a Meet link
    sendUpdates: 'all',       // Sends email invites to attendees
  });

  return {
    eventId: response.data.id,
    meetingLink: response.data.hangoutLink || null,
  };
};

// Check for calendar conflicts
export const checkCalendarConflicts = async ({ accessToken, refreshToken }, date, startTime, endTime) => {
  const oauth2Client = createOAuth2Client();

  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const startDateTime = new Date(`${date}T${startTime}:00.000Z`).toISOString();
  const endDateTime = new Date(`${date}T${endTime}:00.000Z`).toISOString();

  const response = await calendar.freebusy.query({
    requestBody: {
      timeMin: startDateTime,
      timeMax: endDateTime,
      timeZone: 'UTC',
      items: [{ id: 'primary' }],
    },
  });

  const busySlots = response.data.calendars.primary.busy;
  return busySlots && busySlots.length > 0;
};
