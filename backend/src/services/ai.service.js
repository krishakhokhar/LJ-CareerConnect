const env = require('../config/env');
const calculateMatchScore = require('../utils/matchScore');
const { ROLE_SKILL_MAP, ALL_ROLES } = require('./roleSkillMap');

const isGeminiConfigured = Boolean(env.GEMINI_API_KEY);
const GEMINI_MODEL = 'gemini-1.5-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

/**
 * Calls the Gemini API with a text prompt and expects a JSON object back.
 * Returns null on any failure so callers can gracefully fall back to the
 * local deterministic engine - the app must always work in demo mode.
 */
const callGeminiJSON = async (prompt) => {
  if (!isGeminiConfigured) return null;
  try {
    const response = await fetch(`${GEMINI_URL}?key=${env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4, responseMimeType: 'application/json' },
      }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.warn('Gemini call failed, falling back to local AI engine:', error.message);
    return null;
  }
};

const normalizeSkillList = (skills = []) => skills.map((s) => String(s).trim()).filter(Boolean);

/**
 * Feature 1: AI Resume -> Job Matching
 */
const jobMatch = async ({ studentSkills, jobSkills, jobTitle, studentExperienceCount = 0 }) => {
  const skills = normalizeSkillList(studentSkills);
  const required = normalizeSkillList(jobSkills);
  const { score, matchedSkills, missingSkills } = calculateMatchScore(skills, required, {
    studentExperienceCount,
  });

  const recommendedSkills = missingSkills.slice(0, 5);

  let explanation = `Based on your profile, you match ${matchedSkills.length} of ${required.length} required skills for ${jobTitle || 'this role'}.`;
  if (matchedSkills.length > 0) {
    explanation += ` Your strengths in ${matchedSkills.slice(0, 3).join(', ')} align well with this position.`;
  }
  if (missingSkills.length > 0) {
    explanation += ` Consider strengthening ${missingSkills.slice(0, 3).join(', ')} to improve your fit.`;
  }

  if (isGeminiConfigured) {
    const aiResult = await callGeminiJSON(
      `You are a career advisor. A student has skills: [${skills.join(', ')}]. ` +
        `A job "${jobTitle || ''}" requires skills: [${required.join(', ')}]. ` +
        `Respond ONLY with strict JSON: {"explanation": "2-3 sentence explanation of why this job matches or doesn't match the student, encouraging tone"}`
    );
    if (aiResult?.explanation) explanation = aiResult.explanation;
  }

  let matchLabel = 'Low Match';
  if (score >= 80) matchLabel = 'Strong Match';
  else if (score >= 60) matchLabel = 'Good Match';
  else if (score >= 40) matchLabel = 'Moderate Match';

  return {
    score,
    matchLabel,
    matchedSkills,
    missingSkills,
    recommendedSkills,
    explanation,
    source: isGeminiConfigured ? 'gemini' : 'local',
  };
};

/**
 * Feature 2: AI Skill Gap Analysis
 */
const skillGapAnalysis = async ({ currentSkills, targetRole }) => {
  const skills = normalizeSkillList(currentSkills);
  const requiredForRole = ROLE_SKILL_MAP[targetRole] || ROLE_SKILL_MAP['Software Developer'];
  const currentSet = new Set(skills.map((s) => s.toLowerCase()));

  const skillGap = requiredForRole.filter((s) => !currentSet.has(s.toLowerCase()));
  const possessed = requiredForRole.filter((s) => currentSet.has(s.toLowerCase()));
  const readiness = Math.round((possessed.length / requiredForRole.length) * 100);

  let recommendedPriorities = skillGap.slice(0, 4);
  let summary = `You already have ${possessed.length} of ${requiredForRole.length} core skills for ${targetRole}. Focus on closing the remaining gap to become job-ready.`;

  if (isGeminiConfigured) {
    const aiResult = await callGeminiJSON(
      `A student targets the role "${targetRole}" and currently has skills: [${skills.join(', ')}]. ` +
        `The core skills for this role are: [${requiredForRole.join(', ')}]. ` +
        `Respond ONLY with strict JSON: {"summary": "encouraging 2 sentence summary", "priorities": ["skill1","skill2","skill3"]}`
    );
    if (aiResult?.summary) summary = aiResult.summary;
    if (Array.isArray(aiResult?.priorities) && aiResult.priorities.length) {
      recommendedPriorities = aiResult.priorities;
    }
  }

  return {
    targetRole,
    currentSkills: skills,
    requiredSkills: requiredForRole,
    matchedSkills: possessed,
    skillGap,
    readiness,
    recommendedPriorities,
    summary,
    source: isGeminiConfigured ? 'gemini' : 'local',
  };
};

/**
 * Feature 3: Career Recommendation
 */
const careerRecommendation = async ({ course, skills, certifications = [], projects = [], experience = [] }) => {
  const studentSkills = normalizeSkillList(skills);

  const scored = ALL_ROLES.map((role) => {
    const required = ROLE_SKILL_MAP[role];
    const { score, matchedSkills, missingSkills } = calculateMatchScore(studentSkills, required, {
      studentExperienceCount: experience.length,
    });
    return { role, score, matchedSkills, missingSkills };
  }).sort((a, b) => b.score - a.score);

  const bonusFromCerts = Math.min(certifications.length * 2, 10);
  const bonusFromProjects = Math.min(projects.length * 2, 10);

  const topRoles = scored.slice(0, 4).map((r) => ({
    ...r,
    score: Math.min(100, Math.round(r.score + bonusFromCerts * 0.3 + bonusFromProjects * 0.3)),
  }));

  let insight = `Based on your ${course || 'academic background'}, skills, ${certifications.length} certification(s) and ${projects.length} project(s), ${topRoles[0]?.role || 'Software Developer'} is your strongest career fit.`;

  if (isGeminiConfigured) {
    const aiResult = await callGeminiJSON(
      `A student is pursuing "${course}" with skills: [${studentSkills.join(', ')}], ` +
        `${certifications.length} certifications and ${projects.length} projects. ` +
        `Top matched roles: [${topRoles.map((r) => r.role).join(', ')}]. ` +
        `Respond ONLY with strict JSON: {"insight": "2-3 sentence encouraging career insight"}`
    );
    if (aiResult?.insight) insight = aiResult.insight;
  }

  return {
    recommendations: topRoles,
    insight,
    source: isGeminiConfigured ? 'gemini' : 'local',
  };
};

module.exports = {
  isGeminiConfigured,
  jobMatch,
  skillGapAnalysis,
  careerRecommendation,
};
