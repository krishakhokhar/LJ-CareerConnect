const mongoose = require('mongoose');

const internshipApplicationSchema = new mongoose.Schema(
  {
    internship: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile', required: true },
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    status: {
      type: String,
      enum: ['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'SELECTED', 'REJECTED', 'COMPLETED'],
      default: 'APPLIED',
    },
    resumeUrl: { type: String, required: true },
    coverNote: { type: String, trim: true },

    documents: [
      {
        name: { type: String, trim: true },
        url: { type: String, trim: true },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

internshipApplicationSchema.index({ internship: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('InternshipApplication', internshipApplicationSchema);
