import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Mentor from './models/Mentor.js';
import Booking from './models/Booking.js';
import { createBooking } from './controllers/bookingController.js';

dotenv.config();

const mockRes = () => {
  const res = {};
  res.status = (statusCode) => {
    res.statusCode = statusCode;
    return res;
  };
  res.json = (data) => {
    res.data = data;
    return res;
  };
  return res;
};

const testBookings = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to DB');

    // Clean up previous runs
    await User.deleteMany({ email: { $in: ['mentor_book@test.com', 'student_book@test.com'] } });
    
    // 1. Setup Data
    const mentorUser = await User.create({ name: 'MB', email: 'mentor_book@test.com', password: 'password', role: 'mentor' });
    const studentUser = await User.create({ name: 'SB', email: 'student_book@test.com', password: 'password', role: 'student' });
    
    // Ensure Mentor profile
    let mentorProfile = await Mentor.findOne({ userId: mentorUser._id });
    if (!mentorProfile) mentorProfile = await Mentor.create({ userId: mentorUser._id });

    // Clean bookings
    await Booking.deleteMany({ mentorId: mentorProfile._id });

    // Monday (1) 09:00 - 12:00
    mentorProfile.availability = [{ dayOfWeek: 1, startTime: '09:00', endTime: '12:00' }];
    mentorProfile.unavailableDates = ['2024-05-13']; // May 13 is a Monday, but it's blocked!
    await mentorProfile.save();

    console.log('✅ Setup Complete');

    // Helper to test controller
    const testCreateBooking = async (date, startTime, endTime) => {
      const req = {
        user: { _id: studentUser._id },
        body: { mentorId: mentorProfile._id, date, startTime, endTime }
      };
      const res = mockRes();
      await createBooking(req, res);
      return res;
    };

    // 2. Test 1: Blocked Date
    let res = await testCreateBooking('2024-05-13', '10:00', '11:00');
    if (res.statusCode === 400 && res.data.message.includes('not available on this date')) {
      console.log('✅ Test 1 Passed: Blocked date correctly rejected');
    } else {
      console.error('❌ Test 1 Failed:', res);
    }

    // 3. Test 2: Outside weekly availability (Wrong day - Tuesday)
    res = await testCreateBooking('2024-05-14', '10:00', '11:00');
    if (res.statusCode === 400 && res.data.message.includes("outside of mentor's regular availability")) {
      console.log('✅ Test 2 Passed: Wrong day correctly rejected');
    } else {
      console.error('❌ Test 2 Failed:', res);
    }

    // 4. Test 3: Success Booking (Next Monday)
    res = await testCreateBooking('2024-05-20', '09:30', '10:30');
    if (res.statusCode === 201) {
      console.log('✅ Test 3 Passed: Valid booking successfully created');
    } else {
      console.error('❌ Test 3 Failed:', res);
    }

    // 5. Test 4: Conflict Overlap (Starts during existing)
    res = await testCreateBooking('2024-05-20', '10:00', '11:00');
    if (res.statusCode === 409 && res.data.message.includes('already booked')) {
      console.log('✅ Test 4 Passed: Overlapping booking correctly rejected (Conflict 1)');
    } else {
      console.error('❌ Test 4 Failed:', res);
    }

    // 6. Test 5: Conflict Overlap (Completely engulfs existing)
    res = await testCreateBooking('2024-05-20', '09:00', '11:00');
    if (res.statusCode === 409) {
      console.log('✅ Test 5 Passed: Overlapping booking correctly rejected (Conflict 2)');
    } else {
      console.error('❌ Test 5 Failed:', res);
    }

    // 7. Test 6: Back-to-back success
    res = await testCreateBooking('2024-05-20', '10:30', '11:30');
    if (res.statusCode === 201) {
      console.log('✅ Test 6 Passed: Back-to-back booking allowed');
    } else {
      console.error('❌ Test 6 Failed:', res);
    }

    // Cleanup
    await User.deleteMany({ email: { $in: ['mentor_book@test.com', 'student_book@test.com'] } });
    await Mentor.deleteOne({ _id: mentorProfile._id });
    await Booking.deleteMany({ mentorId: mentorProfile._id });

    process.exit(0);
  } catch (error) {
    console.error('Error in tests:', error);
    process.exit(1);
  }
};

testBookings();
