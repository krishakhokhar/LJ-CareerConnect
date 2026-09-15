const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile', required: true },
    name: { type: String, required: true, trim: true },
    organization: { type: String, required: true, trim: true },
    issueDate: { type: Date },
    credentialId: { type: String, trim: true },
    credentialUrl: { type: String, trim: true },
    fileUrl: { type: String, trim: true },
    filePublicId: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Certification', certificationSchema);
