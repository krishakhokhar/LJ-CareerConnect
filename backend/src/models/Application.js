const mongoose = require('mongoose');

const STATUS_FLOW = ['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED'];

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile', required: true },
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    status: {
      type: String,
      enum: STATUS_FLOW,
      default: 'APPLIED',
    },
    statusHistory: [
      {
        status: { type: String, enum: STATUS_FLOW },
        changedAt: { type: Date, default: Date.now },
        note: { type: String, trim: true },
      },
    ],

    matchScore: { type: Number, default: 0, min: 0, max: 100 },
    matchedSkills: [{ type: String }],
    missingSkills: [{ type: String }],

    resumeUrl: { type: String, required: true },
    coverNote: { type: String, trim: true },

    recruiterNotes: { type: String, trim: true },
  },
  { timestamps: true }
);

applicationSchema.index({ job: 1, student: 1 }, { unique: true });

applicationSchema.pre('save', function trackHistory(next) {
  if (this.isNew || this.isModified('status')) {
    this.statusHistory.push({ status: this.status, changedAt: new Date() });
  }
  next();
});

module.exports = mongoose.model('Application', applicationSchema);
module.exports.STATUS_FLOW = STATUS_FLOW;
