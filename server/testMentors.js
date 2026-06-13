import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Mentor from './models/Mentor.js';

dotenv.config();

const testMentors = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to DB');

    // Clean up
    await User.deleteMany({ email: 'mentor_test@example.com' });

    // 1. Register a new mentor user
    const newUser = await User.create({
      name: 'Mentor Test',
      email: 'mentor_test@example.com',
      password: 'password123',
      role: 'mentor',
      timezone: 'Asia/Kolkata',
    });
    console.log('✅ Mentor User registered');

    // 2. Mock auth controller creating the profile
    const newMentor = await Mentor.create({ userId: newUser._id });
    console.log('✅ Mentor Profile created automatically');

    // 3. Update the mentor's profile (simulating the updateMentorProfile controller)
    const mentorProfile = await Mentor.findOne({ userId: newUser._id });
    mentorProfile.bio = 'Expert in Node.js and React';
    mentorProfile.expertise = ['Node.js', 'React', 'MongoDB'];
    mentorProfile.availability = [
      { dayOfWeek: 1, startTime: '09:00', endTime: '12:00' }, // Monday 9am - 12pm
      { dayOfWeek: 3, startTime: '14:00', endTime: '16:00' }, // Wednesday 2pm - 4pm
    ];
    await mentorProfile.save();
    console.log('✅ Mentor Profile updated with bio, expertise, and availability');

    // 4. Test Validation (End time before start time)
    try {
      mentorProfile.availability.push({ dayOfWeek: 5, startTime: '15:00', endTime: '14:00' });
      await mentorProfile.save();
      console.error('❌ Validation failed to catch invalid time slots');
    } catch (err) {
      console.log('✅ Validation correctly caught invalid time slots (end time before start time)');
    }

    // 5. Test getMentors filter
    const foundMentors = await Mentor.find({ expertise: { $regex: new RegExp('react', 'i') } }).populate('userId', 'name role');
    if (foundMentors.length > 0) {
      console.log('✅ Successfully searched mentors by expertise');
    } else {
      console.error('❌ Failed to search mentors by expertise');
    }

    // Cleanup
    await User.findByIdAndDelete(newUser._id);
    await Mentor.findByIdAndDelete(mentorProfile._id);
    console.log('✅ Cleanup done');

    process.exit(0);
  } catch (error) {
    console.error('Error in test:', error);
    process.exit(1);
  }
};

testMentors();
