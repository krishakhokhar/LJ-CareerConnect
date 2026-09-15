const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    logo: { type: String, default: '' },
    website: { type: String, trim: true },
    description: { type: String, trim: true },
    location: { type: String, trim: true },
    industry: { type: String, trim: true },
    size: { type: String, enum: ['1-50', '51-200', '201-500', '501-1000', '1000+', ''], default: '' },
    isVerified: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Company', companySchema);
