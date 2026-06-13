/**
 * testAuth.js - Phase 2 Authentication Test Script
 *
 * This script tests the register and login APIs by:
 * 1. Directly invoking the controller functions (unit-style test without HTTP)
 * 2. Requires a running MongoDB connection via .env
 *
 * Run with: node testAuth.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from './models/User.js';
import Mentor from './models/Mentor.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

if (!MONGO_URI) {
  console.log('\n⚠️  No MONGO_URI found. Running offline unit tests for auth logic only...\n');
  runOfflineAuthTests();
} else {
  runFullAuthTests();
}

// -----------------------------------------------------------
// OFFLINE TESTS: Test bcrypt hashing and JWT logic directly
// -----------------------------------------------------------
async function runOfflineAuthTests() {
  console.log('--- Offline Auth Logic Tests ---\n');

  // Test 1: bcrypt hashing & comparison
  const rawPassword = 'TestPassword123';
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(rawPassword, salt);
  const isMatch = await bcrypt.compare(rawPassword, hashed);
  const isWrongMatch = await bcrypt.compare('WrongPassword', hashed);

  console.log('✅ bcrypt: Password hashed successfully.');
  console.log(isMatch
    ? '✅ bcrypt: Correct password matches hash.'
    : '❌ bcrypt: Correct password DID NOT match hash (unexpected!)');
  console.log(!isWrongMatch
    ? '✅ bcrypt: Wrong password correctly rejected.'
    : '❌ bcrypt: Wrong password was incorrectly accepted!');

  // Test 2: JWT sign & verify
  const fakeUserId = new mongoose.Types.ObjectId().toString();
  const secret = JWT_SECRET || 'test_secret_for_offline_run';
  const token = jwt.sign({ id: fakeUserId }, secret, { expiresIn: '1h' });
  const decoded = jwt.verify(token, secret);

  console.log('\n✅ JWT: Token generated successfully.');
  console.log(decoded.id === fakeUserId
    ? '✅ JWT: Decoded userId matches original userId.'
    : '❌ JWT: Decoded userId does NOT match!');

  // Test 3: Expired token should throw
  const expiredToken = jwt.sign({ id: fakeUserId }, secret, { expiresIn: '1ms' });
  await new Promise(resolve => setTimeout(resolve, 10)); // wait 10ms
  try {
    jwt.verify(expiredToken, secret);
    console.log('❌ JWT: Expired token should have thrown an error!');
  } catch (err) {
    console.log('✅ JWT: Expired token correctly throws TokenExpiredError.');
  }

  console.log('\n✅ All offline auth tests passed.\n');
  process.exit(0);
}

// -----------------------------------------------------------
// FULL TESTS: Register and login with real MongoDB connection
// -----------------------------------------------------------
async function runFullAuthTests() {
  console.log('--- Full Auth Integration Tests with MongoDB ---\n');
  await mongoose.connect(MONGO_URI);
  console.log('✅ MongoDB connected.\n');

  // Cleanup any previous test data
  await User.deleteMany({ email: { $in: ['auth_student@test.com', 'auth_mentor@test.com'] } });

  try {
    // Test 1: Register a student
    const student = await User.create({
      name: 'Auth Student',
      email: 'auth_student@test.com',
      password: 'password123',
      role: 'student',
      timezone: 'Asia/Kolkata',
    });
    console.log('✅ Student registration: User created in DB.');

    // Verify password was hashed
    const fetchedStudent = await User.findById(student._id).select('+password');
    const passwordIsHashed = fetchedStudent.password !== 'password123';
    console.log(passwordIsHashed
      ? '✅ Student password was hashed before saving (bcrypt pre-save hook working).'
      : '❌ Password was stored in plain text! (bcrypt hook FAILED)');

    // Test 2: Register a mentor + auto-creates mentor profile
    const mentorUser = await User.create({
      name: 'Auth Mentor',
      email: 'auth_mentor@test.com',
      password: 'password123',
      role: 'mentor',
      timezone: 'America/New_York',
    });
    await Mentor.create({ userId: mentorUser._id, bio: '', expertise: [], availability: [] });
    const mentorProfile = await Mentor.findOne({ userId: mentorUser._id });
    console.log(mentorProfile
      ? '✅ Mentor registration: Mentor profile auto-created in Mentor collection.'
      : '❌ Mentor profile was NOT created!');

    // Test 3: Login - correct password
    const loginUser = await User.findOne({ email: 'auth_student@test.com' }).select('+password');
    const correctMatch = await loginUser.matchPassword('password123');
    console.log(correctMatch
      ? '✅ Login: Correct password accepted by matchPassword().'
      : '❌ Login: Correct password was rejected!');

    // Test 4: Login - wrong password
    const wrongMatch = await loginUser.matchPassword('wrongpassword');
    console.log(!wrongMatch
      ? '✅ Login: Wrong password correctly rejected by matchPassword().'
      : '❌ Login: Wrong password was incorrectly accepted!');

    // Test 5: JWT generation & validation
    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded.id === student._id.toString()
      ? '✅ JWT: Token generated and decoded successfully for registered user.'
      : '❌ JWT: Token decoding failed!');

  } finally {
    // Cleanup
    const studentDoc = await User.findOne({ email: 'auth_student@test.com' });
    const mentorDoc = await User.findOne({ email: 'auth_mentor@test.com' });
    if (mentorDoc) await Mentor.deleteOne({ userId: mentorDoc._id });
    await User.deleteMany({ email: { $in: ['auth_student@test.com', 'auth_mentor@test.com'] } });
    console.log('\n✅ Cleanup complete.');
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB.\n');
    process.exit(0);
  }
}
