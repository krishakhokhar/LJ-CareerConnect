/**
 * Local knowledge base used by the deterministic AI fallback engine.
 * Maps career roles to their core expected skills. This keeps AI Career
 * features (skill gap analysis, career recommendation) fully functional
 * in "demo mode" when no GEMINI_API_KEY is configured.
 */
const ROLE_SKILL_MAP = {
  'Frontend Developer': ['HTML', 'CSS', 'JavaScript', 'React', 'Responsive Design', 'Git'],
  'React Developer': ['React', 'JavaScript', 'Redux', 'REST API', 'Git', 'HTML', 'CSS'],
  'Full Stack Developer': ['JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'REST API', 'Git'],
  'Backend Developer': ['Node.js', 'Express', 'MongoDB', 'SQL', 'REST API', 'Authentication', 'Git'],
  'Software Developer': ['Data Structures', 'Algorithms', 'OOP', 'Git', 'Problem Solving', 'Java'],
  'QA Engineer': ['Manual Testing', 'Automation Testing', 'Selenium', 'Test Cases', 'Bug Tracking', 'SQL'],
  'Data Analyst': ['Excel', 'SQL', 'Python', 'Data Visualization', 'Statistics', 'Power BI'],
  'Data Scientist': ['Python', 'Machine Learning', 'Statistics', 'Pandas', 'NumPy', 'SQL'],
  'DevOps Engineer': ['Linux', 'Docker', 'CI/CD', 'AWS', 'Git', 'Scripting'],
  'Mobile App Developer': ['React Native', 'JavaScript', 'Flutter', 'REST API', 'Git', 'Mobile UI'],
  'UI/UX Designer': ['Figma', 'Wireframing', 'User Research', 'Prototyping', 'Design Systems'],
  'Cloud Engineer': ['AWS', 'Azure', 'Docker', 'Kubernetes', 'Linux', 'Networking'],
};

const ALL_ROLES = Object.keys(ROLE_SKILL_MAP);

module.exports = { ROLE_SKILL_MAP, ALL_ROLES };
