const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile', required: true },
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['Programming', 'Frontend', 'Backend', 'Database', 'Tools', 'Soft Skills'],
      default: 'Programming',
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
  },
  { timestamps: true }
);

skillSchema.index({ student: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Skill', skillSchema);
