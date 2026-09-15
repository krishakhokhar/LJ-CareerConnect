const mongoose = require('mongoose');

const recruiterProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    recruiterName: { type: String, required: true, trim: true },
    designation: { type: String, trim: true, default: 'HR Recruiter' },
    officialEmail: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    isApproved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RecruiterProfile', recruiterProfileSchema);
