import mongoose from 'mongoose';

const availabilitySlotSchema = new mongoose.Schema({
  dayOfWeek: {
    type: Number,
    required: true,
    min: [0, 'Day of week must be between 0 (Sunday) and 6 (Saturday)'],
    max: [6, 'Day of week must be between 0 (Sunday) and 6 (Saturday)'],
  },
  startTime: {
    type: String,
    required: true,
    match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Please enter a valid start time in HH:MM format (24-hour)'],
  },
  endTime: {
    type: String,
    required: true,
    match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Please enter a valid end time in HH:MM format (24-hour)'],
  },
});

const mentorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    bio: {
      type: String,
      default: '',
    },
    skills: {
      type: [String],
      default: [],
    },
    availability: {
      type: [availabilitySlotSchema],
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be more than 5'],
    },
  },
  {
    timestamps: true,
  }
);

// Add validator to ensure startTime is before endTime
mentorSchema.path('availability').validate(function (slots) {
  for (const slot of slots) {
    const [startH, startM] = slot.startTime.split(':').map(Number);
    const [endH, endM] = slot.endTime.split(':').map(Number);
    const startVal = startH * 60 + startM;
    const endVal = endH * 60 + endM;
    if (startVal >= endVal) {
      return false;
    }
  }
  return true;
}, 'Start time must be before end time for all availability slots.');

const Mentor = mongoose.model('Mentor', mentorSchema);
export default Mentor;
