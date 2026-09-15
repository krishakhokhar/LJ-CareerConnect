/**
 * Calculates student profile completion percentage across weighted sections.
 * Weights sum to 100.
 */
const SECTION_WEIGHTS = {
  personal: 15,
  academic: 15,
  contact: 10,
  skills: 20,
  certifications: 10,
  experience: 10,
  projects: 10,
  resume: 10,
};

const calculateProfileCompletion = (profile) => {
  if (!profile) return 0;
  let score = 0;

  const hasValue = (v) => v !== undefined && v !== null && String(v).trim() !== '';

  // Personal
  if (hasValue(profile.fullName) && hasValue(profile.dateOfBirth) && hasValue(profile.gender)) {
    score += SECTION_WEIGHTS.personal;
  } else if (hasValue(profile.fullName)) {
    score += SECTION_WEIGHTS.personal * 0.5;
  }

  // Academic
  if (hasValue(profile.course) && hasValue(profile.department) && hasValue(profile.semester) && hasValue(profile.graduationYear)) {
    score += SECTION_WEIGHTS.academic;
  } else if (hasValue(profile.course)) {
    score += SECTION_WEIGHTS.academic * 0.5;
  }

  // Contact
  if (hasValue(profile.phone) && hasValue(profile.address)) {
    score += SECTION_WEIGHTS.contact;
  } else if (hasValue(profile.phone)) {
    score += SECTION_WEIGHTS.contact * 0.6;
  }

  // Skills
  if (Array.isArray(profile.skills) && profile.skills.length >= 5) {
    score += SECTION_WEIGHTS.skills;
  } else if (Array.isArray(profile.skills) && profile.skills.length > 0) {
    score += SECTION_WEIGHTS.skills * (profile.skills.length / 5);
  }

  // Certifications
  if (Array.isArray(profile.certifications) && profile.certifications.length > 0) {
    score += SECTION_WEIGHTS.certifications;
  }

  // Experience
  if (Array.isArray(profile.experience) && profile.experience.length > 0) {
    score += SECTION_WEIGHTS.experience;
  }

  // Projects
  if (Array.isArray(profile.projects) && profile.projects.length > 0) {
    score += SECTION_WEIGHTS.projects;
  }

  // Resume
  if (profile.resume && profile.resume.resumeUrl) {
    score += SECTION_WEIGHTS.resume;
  }

  return Math.round(Math.min(score, 100));
};

module.exports = calculateProfileCompletion;
