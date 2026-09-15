const normalize = (str) => String(str || '').trim().toLowerCase();

/**
 * Deterministic AI-style match score between a student's skill set and a job's
 * required skills. Weighted overlap + bonus for experience/qualification alignment.
 * Always returns the same score for the same inputs (no randomness).
 */
const calculateMatchScore = (studentSkills = [], jobSkills = [], options = {}) => {
  const studentSet = new Set((studentSkills || []).map(normalize).filter(Boolean));
  const jobSet = [...new Set((jobSkills || []).map(normalize).filter(Boolean))];

  if (jobSet.length === 0) {
    return { score: 0, matchedSkills: [], missingSkills: [] };
  }

  const matched = jobSet.filter((skill) => studentSet.has(skill));
  const missing = jobSet.filter((skill) => !studentSet.has(skill));

  let skillScore = (matched.length / jobSet.length) * 80;

  // Bonus points: extra relevant skills beyond requirements (capped)
  const extraSkills = [...studentSet].filter((s) => !jobSet.includes(s));
  const bonus = Math.min(extraSkills.length * 1.5, 10);

  // Experience alignment bonus
  let experienceBonus = 0;
  if (options.studentExperienceCount !== undefined) {
    experienceBonus = options.studentExperienceCount > 0 ? 10 : 0;
  }

  const total = Math.round(Math.min(skillScore + bonus + experienceBonus, 100));

  return {
    score: total,
    matchedSkills: matched,
    missingSkills: missing,
  };
};

module.exports = calculateMatchScore;
