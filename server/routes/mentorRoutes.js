import express from 'express';
import {
  getMentors,
  getMentorById,
  updateMentorProfile,
  onboardMentor,
  getMyMentorProfile,
} from '../controllers/mentorController.js';
import { protect, mentor } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getMentors);
router.route('/onboard').post(protect, onboardMentor);
router.route('/me').get(protect, mentor, getMyMentorProfile);
router.route('/profile').put(protect, mentor, updateMentorProfile);
router.route('/:id').get(getMentorById); // Make sure :id is below /profile and /me

export default router;
