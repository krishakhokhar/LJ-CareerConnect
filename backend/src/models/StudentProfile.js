const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    organization: { type: String, required: true, trim: true },
    type: { type: String, enum: ['Internship', 'Part-time', 'Full-time', 'Freelance', 'Volunteer'], default: 'Internship' },
    startDate: { type: Date },
    endDate: { type: Date },
    isCurrent: { type: Boolean, default: false },
    description: { type: String, trim: true },
  },
  { _id: true }
);

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    techStack: [{ type: String, trim: true }],
    projectUrl: { type: String, trim: true },
    repoUrl: { type: String, trim: true },
  },
  { _id: true }
);

const studentProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

    // Personal
    fullName: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['Male', 'Female', 'Other', ''], default: '' },
    profilePhoto: { type: String, default: '' },

    // Academic
    studentId: { type: String, required: true, unique: true, trim: true },
    course: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    semester: { type: Number, required: true, min: 1, max: 12 },
    graduationYear: { type: Number, required: true },
    cgpa: { type: Number, min: 0, max: 10 },

    // Contact
    phone: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },

    // Portfolio (skills & certifications live in their own collections - see Skill.js / Certification.js)
    experience: [experienceSchema],
    projects: [projectSchema],

    // Resume
    resume: {
      resumeUrl: { type: String, default: '' },
      publicId: { type: String, default: '' },
      fileName: { type: String, default: '' },
      uploadedAt: { type: Date },
    },

    // Social / links
    linkedinUrl: { type: String, trim: true },
    githubUrl: { type: String, trim: true },
    portfolioUrl: { type: String, trim: true },

    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],

    profileCompletion: { type: Number, default: 0, min: 0, max: 100 },

    isPlaced: { type: Boolean, default: false },
  },
  { timestamps: true }
);

studentProfileSchema.index({ fullName: 'text' });

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
