const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    description: { type: String, required: true },
    responsibilities: [{ type: String, trim: true }],
    requirements: [{ type: String, trim: true }],
    skills: [{ type: String, trim: true, required: true }],
    qualification: { type: String, trim: true },
    experienceRequired: { type: String, trim: true, default: 'Freshers welcome' },

    location: { type: String, required: true, trim: true },
    jobType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Internship', 'Contract'],
      required: true,
    },
    workMode: { type: String, enum: ['On-site', 'Remote', 'Hybrid'], default: 'On-site' },

    salaryMin: { type: Number, required: true, min: 0 },
    salaryMax: { type: Number, required: true, min: 0 },

    openings: { type: Number, required: true, min: 1, default: 1 },
    applicationDeadline: { type: Date, required: true },

    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'CLOSED'],
      default: 'PUBLISHED',
    },

    applicantsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

jobSchema.index({ title: 'text', skills: 'text', location: 'text' });

module.exports = mongoose.model('Job', jobSchema);
