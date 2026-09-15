const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    description: { type: String, required: true },
    skills: [{ type: String, trim: true }],
    duration: { type: String, required: true, trim: true }, // e.g. "3 months"
    location: { type: String, required: true, trim: true },
    workMode: { type: String, enum: ['On-site', 'Remote', 'Hybrid'], default: 'On-site' },

    stipend: { type: Number, default: 0 },
    isPaid: { type: Boolean, default: true },

    openings: { type: Number, default: 1 },
    applicationDeadline: { type: Date, required: true },
    startDate: { type: Date },

    ppoOpportunity: { type: Boolean, default: false }, // pre-placement offer

    status: {
      type: String,
      enum: ['PUBLISHED', 'CLOSED'],
      default: 'PUBLISHED',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Internship', internshipSchema);
