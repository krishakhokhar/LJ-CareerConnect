const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema(
  {
    application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile', required: true },
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    scheduledDate: { type: Date, required: true },
    scheduledTime: { type: String, required: true }, // "10:30 AM"
    interviewType: {
      type: String,
      enum: ['Online', 'In-person', 'Telephonic'],
      default: 'Online',
    },
    meetingLink: { type: String, trim: true },
    location: { type: String, trim: true },
    notes: { type: String, trim: true },
    round: { type: String, trim: true, default: 'Round 1' },

    status: {
      type: String,
      enum: ['SCHEDULED', 'COMPLETED', 'CANCELLED'],
      default: 'SCHEDULED',
    },
    feedback: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Interview', interviewSchema);
