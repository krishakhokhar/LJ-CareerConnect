const mongoose = require('mongoose');

const alumniSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile' }, // optional link if alumni was a platform user
    name: { type: String, required: true, trim: true },
    graduationYear: { type: Number, required: true },
    course: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },

    company: { type: String, required: true, trim: true },
    jobRole: { type: String, required: true, trim: true },
    salaryPackage: { type: Number, required: true, min: 0 }, // annual, in LPA-equivalent units
    employmentType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Self-employed', 'Entrepreneur'],
      default: 'Full-time',
    },
    joiningDate: { type: Date, required: true },

    email: { type: String, trim: true, lowercase: true },
    linkedinUrl: { type: String, trim: true },

    isDemoData: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Alumni', alumniSchema);
