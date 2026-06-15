import Booking from '../models/Booking.js';
import Mentor from '../models/Mentor.js';
import User from '../models/User.js';
import { createCalendarEvent, checkCalendarConflicts } from '../services/GoogleCalendar/googleCalendarService.js';

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
  try {
    const { mentorId, date, startTime, endTime } = req.body;
    const studentId = req.user._id;

    if (!mentorId || !date || !startTime || !endTime) {
      return res.status(400).json({ message: 'Please provide mentorId, date, startTime, and endTime' });
    }

    if (startTime >= endTime) {
      return res.status(400).json({ message: 'Start time must be before end time' });
    }

    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    // 1. Check Date-Specific Availability
    if (mentor.unavailableDates && mentor.unavailableDates.includes(date)) {
      return res.status(400).json({ message: 'Mentor is not available on this date' });
    }

    // 2. Check Weekly Availability Slot Match
    // Parse YYYY-MM-DD as UTC to avoid local timezone shifts changing the day
    const dayOfWeek = new Date(`${date}T00:00:00Z`).getUTCDay();
    
    const availableSlots = mentor.availability.filter((slot) => slot.dayOfWeek === dayOfWeek);
    let isWithinAvailableSlot = false;

    for (const slot of availableSlots) {
      // String comparison works directly for HH:MM format
      if (startTime >= slot.startTime && endTime <= slot.endTime) {
        isWithinAvailableSlot = true;
        break;
      }
    }

    if (!isWithinAvailableSlot) {
      return res.status(400).json({ message: "Requested time is outside of mentor's regular availability" });
    }

    // 3. Conflict Detection
    const existingBookings = await Booking.find({
      mentorId,
      date,
      status: { $ne: 'cancelled' },
    });

    for (const b of existingBookings) {
      // Overlap logic: (Start A < End B) and (End A > Start B)
      if (startTime < b.endTime && endTime > b.startTime) {
        return res.status(409).json({ message: 'Time slot is already booked' });
      }
    }

    const studentUser = await User.findById(studentId);
    const mentorUser = await User.findById(mentor.userId);

    if (studentUser && studentUser.googleRefreshToken) {
      try {
        const hasConflict = await checkCalendarConflicts(
          {
            accessToken: studentUser.googleAccessToken,
            refreshToken: studentUser.googleRefreshToken,
          },
          date,
          startTime,
          endTime
        );
        if (hasConflict) {
          return res.status(409).json({ message: 'You already have an event scheduled on your Google Calendar at this time.' });
        }
      } catch (err) {
        console.error('Failed to check student calendar conflicts:', err.message);
      }
    }

    // 4. Create Booking
    const booking = await Booking.create({
      mentorId,
      studentId,
      date,
      startTime,
      endTime,
    });

    // 5. Optionally create a Google Calendar Event and Meet link
    // We do this AFTER saving the booking so a Google API failure doesn't block booking creation
    if (mentorUser && mentorUser.googleRefreshToken) {
      try {
        const { eventId, meetingLink } = await createCalendarEvent(
          {
            accessToken: mentorUser.googleAccessToken,
            refreshToken: mentorUser.googleRefreshToken,
          },
          {
            date,
            startTime,
            endTime,
            studentName: studentUser?.name || 'Student',
            studentEmail: studentUser?.email || null,
            mentorName: mentorUser?.name || 'Mentor',
          }
        );

        // Update the booking with the Meet link
        booking.meetingLink = meetingLink;
        booking.calendarEventId = eventId;
        booking.status = 'confirmed'; // Auto-confirm when Meet link is generated
        await booking.save();
      } catch (calendarError) {
        // Don't fail the booking if calendar creation fails — log and continue
        console.error('Google Calendar event creation failed (booking still saved):', calendarError.message);
      }
    }

    res.status(201).json(booking);
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error creating booking' });
  }
};


// @desc    Get user's bookings (as student or mentor)
// @route   GET /api/bookings
// @access  Private
export const getMyBookings = async (req, res) => {
  try {
    let query = { studentId: req.user._id };

    // If user is a mentor, also get bookings where they are the mentor
    if (req.user.role === 'mentor') {
      const mentorProfile = await Mentor.findOne({ userId: req.user._id });
      if (mentorProfile) {
        // Fetch bookings where user is EITHER the student OR the mentor
        query = {
          $or: [
            { studentId: req.user._id },
            { mentorId: mentorProfile._id }
          ]
        };
      }
    }

    const bookings = await Booking.find(query)
      .populate('mentorId', 'bio expertise')
      .populate('studentId', 'name email timezone')
      .sort({ date: 1, startTime: 1 });

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching bookings' });
  }
};
