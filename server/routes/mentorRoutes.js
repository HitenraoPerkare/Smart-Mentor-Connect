import express from 'express';
import {
  getMentors,
  getMentorById,
  updateMentorProfile,
} from '../controllers/mentorController.js';
import { protect, mentor } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getMentors);
router.route('/profile').put(protect, mentor, updateMentorProfile);
router.route('/:id').get(getMentorById); // Make sure :id is below /profile

export default router;
