import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Mentor from './models/Mentor.js';

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('ERROR: MONGO_URI is not defined in the environment variables (backend/.env).');
  console.log('Please create a backend/.env file with a valid MONGO_URI to run the database connection test.');
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

  // Test 2: Invalid Email Format
  try {
    const invalidUser = new User({
      name: 'Bad Email User',
      email: 'invalid-email-format',
      password: 'password123',
      role: 'student',
      timezone: 'UTC',
    });
    const err = invalidUser.validateSync();
    if (err && err.errors.email) {
      console.log('✅ Invalid email format caught correctly:', err.errors.email.message);
    } else {
      console.log('❌ Failed to catch invalid email format.');
    }
  } catch (e) {
    console.log('❌ Test 2 unexpected error:', e);
  }

  // Test 3: Mentor Schema - Start time after/equal to end time
  try {
    const badMentor = new Mentor({
      user: new mongoose.Types.ObjectId(),
      bio: 'Fails validation',
      skills: ['Node.js'],
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
    console.log('❌ Test 3 unexpected error:', e);
  }

  // Test 4: Mentor Schema - Invalid time format
  try {
    const badTimeMentor = new Mentor({
      user: new mongoose.Types.ObjectId(),
      bio: 'Fails format validation',
      skills: ['Node.js'],
      availability: [
        {
          dayOfWeek: 1,
          startTime: '9:00', // Should be 09:00
          endTime: '17:00',
        },
      ],
    });
    const err = badTimeMentor.validateSync();
    if (err && err.errors['availability.0.startTime']) {
      console.log('✅ Invalid time format (9:00 instead of 09:00) caught correctly:', err.errors['availability.0.startTime'].message);
    } else {
      console.log('❌ Failed to catch invalid time format.');
    }
  } catch (e) {
    console.log('❌ Test 4 unexpected error:', e);
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

    // Clear any previous test users if they exist
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
    console.log('✅ Student created:', studentUser.name, `(ID: ${studentUser._id})`);

    // 2. Create a test Mentor User
    console.log('\nCreating a test mentor user...');
    const mentorUser = await User.create({
      name: 'Test Mentor',
      email: 'test_mentor@example.com',
      password: 'mentorpassword',
      role: 'mentor',
      timezone: 'Europe/London',
    });
    console.log('✅ Mentor User created:', mentorUser.name, `(ID: ${mentorUser._id})`);

    // 3. Create the Mentor Profile
    console.log('\nCreating mentor profile...');
    const mentorProfile = await Mentor.create({
      user: mentorUser._id,
      bio: 'Senior Full Stack Engineer with 10+ years of experience.',
      skills: ['React', 'Node.js', 'MongoDB', 'System Design'],
      availability: [
        {
          dayOfWeek: 1, // Monday
          startTime: '09:00',
          endTime: '12:00',
        },
        {
          dayOfWeek: 3, // Wednesday
          startTime: '14:00',
          endTime: '17:00',
        },
      ],
      rating: 4.8,
    });
    console.log('✅ Mentor Profile created successfully.');

    // 4. Query the Mentor Profile and populate user details
    console.log('\nQuerying mentor profile (populating user)...');
    const queriedMentor = await Mentor.findOne({ user: mentorUser._id }).populate('user');
    console.log('✅ Queried Mentor Profile:');
    console.log('  Name:', queriedMentor.user.name);
    console.log('  Email:', queriedMentor.user.email);
    console.log('  Timezone:', queriedMentor.user.timezone);
    console.log('  Skills:', queriedMentor.skills.join(', '));
    console.log('  Availability Slots:');
    queriedMentor.availability.forEach((slot) => {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      console.log(`    - ${days[slot.dayOfWeek]} from ${slot.startTime} to ${slot.endTime}`);
    });

    // 5. Cleanup
    console.log('\nCleaning up database test documents...');
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
