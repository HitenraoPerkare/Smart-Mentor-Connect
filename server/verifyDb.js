import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Mentor from './models/Mentor.js';
import Booking from './models/Booking.js';

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('ERROR: MONGO_URI is not defined in the environment variables (server/.env).');
  console.log('Please create a server/.env file with a valid MONGO_URI to run the database connection test.');
  console.log('\nHowever, we can still perform offline Mongoose Schema Validation checks...');
  runOfflineValidationTests();
} else {
  runFullDatabaseTests();
}

// -------------------------------------------------------------
// Offline Schema Validation Tests (Runs without MongoDB Connection)
// -------------------------------------------------------------
function runOfflineValidationTests() {
  console.log('\n--- Running Offline Schema Validation Tests ---');

  // Test 1: Valid Student User
  try {
    const student = new User({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      role: 'student',
      timezone: 'America/New_York',
    });
    const err = student.validateSync();
    if (err) {
      console.log('❌ Valid Student User validation failed:', err.message);
    } else {
      console.log('✅ Valid Student User schema validation passed.');
    }
  } catch (e) {
    console.log('❌ Test 1 unexpected error:', e);
  }

  // Test 2: Mentor Schema - Start time after/equal to end time
  try {
    const badMentor = new Mentor({
      userId: new mongoose.Types.ObjectId(),
      bio: 'Fails validation',
      expertise: ['Node.js'],
      availability: [
        {
          dayOfWeek: 1, // Monday
          startTime: '15:00',
          endTime: '12:00', // Invalid: end time is before start time
        },
      ],
    });
    const err = badMentor.validateSync();
    if (err && err.message.includes('Start time must be before end time')) {
      console.log('✅ Invalid slot availability (startTime >= endTime) caught correctly:', err.message);
    } else {
      console.log('❌ Failed to catch invalid slot availability times.');
    }
  } catch (e) {
    console.log('❌ Test 2 unexpected error:', e);
  }

  // Test 3: Booking Schema Validation
  try {
    const validBooking = new Booking({
      mentorId: new mongoose.Types.ObjectId(),
      studentId: new mongoose.Types.ObjectId(),
      date: '2026-06-20',
      startTime: '10:00',
      endTime: '11:00',
      meetingLink: 'https://meet.google.com/abc-xyz',
      calendarEventId: 'evt123',
      status: 'confirmed',
    });
    const err = validBooking.validateSync();
    if (err) {
      console.log('❌ Valid Booking validation failed:', err.message);
    } else {
      console.log('✅ Valid Booking schema validation passed.');
    }
  } catch (e) {
    console.log('❌ Test 3 unexpected error:', e);
  }

  console.log('\nOffline validation tests completed.');
  process.exit(0);
}

// -------------------------------------------------------------
// Full Database Tests (Runs with Active MongoDB Connection)
// -------------------------------------------------------------
async function runFullDatabaseTests() {
  console.log('\n--- Running Full Database CRUD Tests with MongoDB Atlas ---');
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected successfully!');

    // Cleanup first
    await User.deleteMany({ email: { $in: ['test_student@example.com', 'test_mentor@example.com'] } });

    // 1. Create a test Student
    console.log('\nCreating a test student...');
    const studentUser = await User.create({
      name: 'Test Student',
      email: 'test_student@example.com',
      password: 'studentpassword',
      role: 'student',
      timezone: 'Asia/Kolkata',
    });

    // 2. Create a test Mentor User
    const mentorUser = await User.create({
      name: 'Test Mentor',
      email: 'test_mentor@example.com',
      password: 'mentorpassword',
      role: 'mentor',
      timezone: 'Europe/London',
    });

    // 3. Create the Mentor Profile
    const mentorProfile = await Mentor.create({
      userId: mentorUser._id,
      bio: 'Senior Full Stack Engineer with 10+ years of experience.',
      expertise: ['React', 'Node.js', 'MongoDB', 'System Design'],
      availability: [
        { dayOfWeek: 1, startTime: '09:00', endTime: '12:00' }
      ]
    });

    // 4. Create a Booking
    const booking = await Booking.create({
      mentorId: mentorProfile._id,
      studentId: studentUser._id,
      date: '2026-06-20',
      startTime: '10:00',
      endTime: '11:00',
      status: 'pending'
    });
    console.log('✅ Mentor Profile and Booking created successfully.');

    // 5. Cleanup
    console.log('\nCleaning up database test documents...');
    await Booking.deleteOne({ _id: booking._id });
    await Mentor.deleteOne({ _id: mentorProfile._id });
    await User.deleteMany({ _id: { $in: [studentUser._id, mentorUser._id] } });
    console.log('✅ Cleanup successful.');

  } catch (error) {
    console.error('❌ Database CRUD test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  }
}
