const mongoose = require('mongoose');

const placementDriveSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    driveName: { type: String, required: true, trim: true },
    jobRole: { type: String, required: true, trim: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },

    driveDate: { type: Date, required: true },
    driveTime: { type: String, trim: true },
    mode: { type: String, enum: ['Online', 'On-campus'], default: 'On-campus' },
    venue: { type: String, trim: true },

    eligibility: {
      minCgpa: { type: Number, default: 0 },
      courses: [{ type: String, trim: true }],
      departments: [{ type: String, trim: true }],
      maxBacklogs: { type: Number, default: 0 },
      graduationYear: [{ type: Number }],
    },
    requiredSkills: [{ type: String, trim: true }],

    salaryPackage: { type: String, trim: true },
    openings: { type: Number, default: 1 },
    applicationDeadline: { type: Date, required: true },
    description: { type: String, trim: true },

    status: {
      type: String,
      enum: ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'],
      default: 'UPCOMING',
    },

    registeredStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PlacementDrive', placementDriveSchema);
