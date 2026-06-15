import Mentor from '../models/Mentor.js';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Get all mentors
// @route   GET /api/mentors
// @access  Public
export const getMentors = async (req, res) => {
  try {
    const { expertise } = req.query;

    let query = {};
    if (expertise) {
      // Case-insensitive regex search in the expertise array
      query.expertise = { $regex: new RegExp(expertise, 'i') };
    }

    const mentors = await Mentor.find(query)
      .populate('userId', 'name email role timezone')
      .select('-googleRefreshToken -googleAccessToken'); // don't leak tokens

    res.json(mentors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching mentors' });
  }
};

// @desc    Get mentor by ID
// @route   GET /api/mentors/:id
// @access  Public
export const getMentorById = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id)
      .populate('userId', 'name email role timezone')
      .select('-googleRefreshToken -googleAccessToken');

    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    res.json(mentor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching mentor' });
  }
};

// @desc    Get current logged in mentor profile
// @route   GET /api/mentors/me
// @access  Private/Mentor
export const getMyMentorProfile = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ userId: req.user._id })
      .populate('userId', 'name email role timezone');

    if (!mentor) {
      return res.status(404).json({ message: 'Mentor profile not found' });
    }

    res.json(mentor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching mentor profile' });
  }
};

// @desc    Update mentor profile and availability
// @route   PUT /api/mentors/profile
// @access  Private/Mentor
export const updateMentorProfile = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ userId: req.user._id });

    if (!mentor) {
      return res.status(404).json({ message: 'Mentor profile not found for this user' });
    }

    const { bio, expertise, availability, unavailableDates } = req.body;

    if (bio !== undefined) mentor.bio = bio;
    if (expertise !== undefined) mentor.expertise = expertise;
    if (availability !== undefined) {
      // Input validation is handled automatically by Mongoose schema validators (e.g. HH:MM)
      mentor.availability = availability;
    }
    if (unavailableDates !== undefined) mentor.unavailableDates = unavailableDates;

    const updatedMentor = await mentor.save();

    res.json({
      _id: updatedMentor._id,
      userId: updatedMentor.userId,
      bio: updatedMentor.bio,
      expertise: updatedMentor.expertise,
      availability: updatedMentor.availability,
      unavailableDates: updatedMentor.unavailableDates,
    });
  } catch (error) {
    console.error(error);
    // If it's a Mongoose validation error, return 400
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error updating mentor profile' });
  }
};

// @desc    Onboard user as a mentor
// @route   POST /api/mentors/onboard
// @access  Private
export const onboardMentor = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'mentor') {
      return res.status(400).json({ message: 'User is already a mentor' });
    }

    const { bio, expertise, availability } = req.body;

    // Create the mentor profile
    const mentor = await Mentor.create({
      userId: user._id,
      bio: bio || '',
      expertise: expertise || [],
      availability: availability || [],
    });

    // Update user role
    user.role = 'mentor';
    await user.save();

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      timezone: user.timezone,
      token: generateToken(user._id), // new token since role changed
      mentorProfileId: mentor._id,
    });
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error during mentor onboarding' });
  }
};
