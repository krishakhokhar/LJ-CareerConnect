/**
 * Realistic DEMO data for LJ CareerConnect. Clearly marked as demo data per
 * project requirements - no real companies' current vacancies are implied.
 */

const DEMO_RESUME_URL =
  'https://res.cloudinary.com/demo/image/upload/v1/sample-resume-placeholder.pdf';

const COMPANIES = [
  { name: 'Nexora Technologies', industry: 'IT Services', location: 'Ahmedabad, Gujarat', size: '201-500', website: 'https://nexora-demo.example.com', description: 'A mid-size software services company delivering web and cloud solutions for enterprise clients.' },
  { name: 'Bluewave Softworks', industry: 'Product', location: 'Bengaluru, Karnataka', size: '51-200', website: 'https://bluewave-demo.example.com', description: 'A fast-growing SaaS product company building analytics tools for retail businesses.' },
  { name: 'Vertex Analytics', industry: 'Data & AI', location: 'Pune, Maharashtra', size: '201-500', website: 'https://vertex-demo.example.com', description: 'Specializes in data engineering, machine learning and business intelligence solutions.' },
  { name: 'Skyline Innovations', industry: 'Product', location: 'Hyderabad, Telangana', size: '501-1000', website: 'https://skyline-demo.example.com', description: 'Builds developer tools and cloud infrastructure products used by startups worldwide.' },
  { name: 'Orbit Digital', industry: 'Digital Marketing & Tech', location: 'Ahmedabad, Gujarat', size: '51-200', website: 'https://orbit-demo.example.com', description: 'Full-service digital agency combining design, engineering and marketing.' },
  { name: 'Cascade Systems', industry: 'Enterprise Software', location: 'Mumbai, Maharashtra', size: '1000+', website: 'https://cascade-demo.example.com', description: 'A large enterprise software provider serving banking and finance clients.' },
  { name: 'Fern Robotics', industry: 'Robotics & IoT', location: 'Pune, Maharashtra', size: '51-200', website: 'https://fern-demo.example.com', description: 'Designs embedded systems and IoT solutions for industrial automation.' },
  { name: 'Lumen Health Tech', industry: 'HealthTech', location: 'Gandhinagar, Gujarat', size: '201-500', website: 'https://lumen-demo.example.com', description: 'Builds digital health platforms connecting patients, doctors and hospitals.' },
  { name: 'Northbridge Consulting', industry: 'IT Consulting', location: 'Remote', size: '1000+', website: 'https://northbridge-demo.example.com', description: 'Global consulting firm delivering technology transformation for Fortune 500 clients.' },
  { name: 'Pixel Forge Studios', industry: 'Design & Product', location: 'Surat, Gujarat', size: '1-50', website: 'https://pixelforge-demo.example.com', description: 'A boutique product design and frontend engineering studio.' },
];

const DEPARTMENTS = ['Computer Engineering', 'Information Technology', 'Computer Science', 'Electronics & Communication', 'Mechanical Engineering'];
const COURSES = ['B.Tech', 'M.Tech', 'MCA', 'BCA', 'MBA'];

const FIRST_NAMES = ['Aarav', 'Vivaan', 'Aditi', 'Diya', 'Krishna', 'Ishaan', 'Ananya', 'Sara', 'Reyansh', 'Myra', 'Arjun', 'Kiara', 'Vihaan', 'Anika', 'Aryan', 'Navya', 'Dhruv', 'Pari', 'Kabir', 'Riya'];
const LAST_NAMES = ['Shah', 'Patel', 'Mehta', 'Sharma', 'Gupta', 'Desai', 'Trivedi', 'Joshi', 'Verma', 'Chawla', 'Rana', 'Kapoor', 'Bhatt', 'Modi', 'Agarwal'];

const SKILL_POOL = [
  { name: 'JavaScript', category: 'Programming' },
  { name: 'Python', category: 'Programming' },
  { name: 'Java', category: 'Programming' },
  { name: 'C++', category: 'Programming' },
  { name: 'React', category: 'Frontend' },
  { name: 'HTML', category: 'Frontend' },
  { name: 'CSS', category: 'Frontend' },
  { name: 'Tailwind CSS', category: 'Frontend' },
  { name: 'Redux', category: 'Frontend' },
  { name: 'Node.js', category: 'Backend' },
  { name: 'Express', category: 'Backend' },
  { name: 'REST API', category: 'Backend' },
  { name: 'MongoDB', category: 'Database' },
  { name: 'SQL', category: 'Database' },
  { name: 'MySQL', category: 'Database' },
  { name: 'Git', category: 'Tools' },
  { name: 'Docker', category: 'Tools' },
  { name: 'AWS', category: 'Tools' },
  { name: 'Figma', category: 'Tools' },
  { name: 'Communication', category: 'Soft Skills' },
  { name: 'Teamwork', category: 'Soft Skills' },
  { name: 'Problem Solving', category: 'Soft Skills' },
];

const CERT_TEMPLATES = [
  { name: 'React - The Complete Guide', organization: 'Udemy' },
  { name: 'Full Stack Web Development', organization: 'Coursera' },
  { name: 'AWS Cloud Practitioner', organization: 'Amazon Web Services' },
  { name: 'Data Structures & Algorithms', organization: 'GeeksforGeeks' },
  { name: 'Python for Data Science', organization: 'edX' },
  { name: 'Google UX Design', organization: 'Google' },
];

const JOB_TEMPLATES = [
  {
    title: 'Frontend Developer',
    skills: ['JavaScript', 'React', 'HTML', 'CSS', 'Git'],
    jobType: 'Full-time',
    workMode: 'Hybrid',
    salaryMin: 400000,
    salaryMax: 700000,
    description: 'Build responsive, high-performance user interfaces for our flagship web application using React and modern frontend tooling.',
    responsibilities: ['Develop reusable UI components', 'Collaborate with designers and backend engineers', 'Optimize application performance', 'Write unit tests for UI components'],
    requirements: ['Strong fundamentals in JavaScript and CSS', 'Experience with React or similar frameworks', 'Familiarity with Git workflows'],
    qualification: 'B.Tech/BCA/MCA in Computer Science or related field',
  },
  {
    title: 'Backend Developer',
    skills: ['Node.js', 'Express', 'MongoDB', 'REST API', 'Git'],
    jobType: 'Full-time',
    workMode: 'On-site',
    salaryMin: 450000,
    salaryMax: 800000,
    description: 'Design and build scalable backend services and REST APIs powering our core products.',
    responsibilities: ['Design database schemas', 'Build and maintain REST APIs', 'Ensure application security and performance', 'Write integration tests'],
    requirements: ['Solid understanding of Node.js and Express', 'Experience with MongoDB or SQL databases', 'Understanding of REST API design principles'],
    qualification: 'B.Tech/BCA/MCA in Computer Science or related field',
  },
  {
    title: 'Full Stack Developer',
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'REST API'],
    jobType: 'Full-time',
    workMode: 'Hybrid',
    salaryMin: 500000,
    salaryMax: 900000,
    description: 'Work across the stack to build and ship features end-to-end, from UI to database.',
    responsibilities: ['Build features across frontend and backend', 'Participate in code reviews', 'Collaborate with product managers', 'Debug and resolve production issues'],
    requirements: ['Experience with the MERN stack', 'Comfortable working across the stack', 'Strong problem-solving skills'],
    qualification: 'B.Tech/M.Tech/MCA in Computer Science or related field',
  },
  {
    title: 'Software Engineer Intern',
    skills: ['Java', 'C++', 'Problem Solving', 'Git'],
    jobType: 'Internship',
    workMode: 'On-site',
    salaryMin: 150000,
    salaryMax: 300000,
    description: 'Join our engineering team as an intern and contribute to real production features under mentorship.',
    responsibilities: ['Assist in feature development', 'Write clean, tested code', 'Participate in daily standups', 'Learn our engineering practices'],
    requirements: ['Strong fundamentals in data structures and algorithms', 'Familiarity with at least one programming language', 'Eagerness to learn'],
    qualification: 'Pursuing B.Tech/BCA/MCA',
  },
  {
    title: 'QA Engineer',
    skills: ['Manual Testing', 'SQL', 'Communication'],
    jobType: 'Full-time',
    workMode: 'On-site',
    salaryMin: 350000,
    salaryMax: 600000,
    description: 'Ensure product quality through rigorous manual and automated testing across our platform.',
    responsibilities: ['Write and execute test cases', 'Log and track bugs', 'Collaborate with developers on fixes', 'Maintain test documentation'],
    requirements: ['Understanding of software testing lifecycle', 'Basic SQL knowledge', 'Attention to detail'],
    qualification: 'B.Tech/BCA/MCA in Computer Science or related field',
  },
  {
    title: 'Data Analyst',
    skills: ['SQL', 'Python', 'Communication'],
    jobType: 'Full-time',
    workMode: 'Hybrid',
    salaryMin: 400000,
    salaryMax: 650000,
    description: 'Analyze business data to generate actionable insights for stakeholders across the company.',
    responsibilities: ['Build dashboards and reports', 'Analyze trends in business data', 'Present findings to stakeholders', 'Maintain data pipelines'],
    requirements: ['Strong SQL skills', 'Experience with Python for data analysis', 'Good communication skills'],
    qualification: 'B.Tech/BSc/MSc in relevant field',
  },
  {
    title: 'UI/UX Designer',
    skills: ['Figma', 'Communication', 'Problem Solving'],
    jobType: 'Full-time',
    workMode: 'Remote',
    salaryMin: 350000,
    salaryMax: 600000,
    description: 'Design intuitive, elegant user experiences for our web and mobile products.',
    responsibilities: ['Create wireframes and prototypes', 'Conduct user research', 'Collaborate with engineering on implementation', 'Maintain design systems'],
    requirements: ['Proficiency in Figma', 'Portfolio demonstrating UX process', 'Strong visual design sense'],
    qualification: 'Degree in Design or related field',
  },
  {
    title: 'DevOps Engineer',
    skills: ['Docker', 'AWS', 'Git'],
    jobType: 'Full-time',
    workMode: 'On-site',
    salaryMin: 500000,
    salaryMax: 850000,
    description: 'Manage cloud infrastructure and CI/CD pipelines to support reliable, scalable deployments.',
    responsibilities: ['Maintain CI/CD pipelines', 'Manage cloud infrastructure on AWS', 'Monitor system reliability', 'Automate deployment processes'],
    requirements: ['Experience with Docker and AWS', 'Understanding of CI/CD concepts', 'Scripting skills'],
    qualification: 'B.Tech in Computer Science or related field',
  },
];

const INTERNSHIP_TEMPLATES = [
  { title: 'Frontend Development Intern', skills: ['JavaScript', 'React', 'CSS'], duration: '3 months', stipend: 12000 },
  { title: 'Backend Development Intern', skills: ['Node.js', 'Express', 'MongoDB'], duration: '6 months', stipend: 15000 },
  { title: 'Data Analytics Intern', skills: ['Python', 'SQL'], duration: '3 months', stipend: 10000 },
  { title: 'UI/UX Design Intern', skills: ['Figma', 'Communication'], duration: '3 months', stipend: 8000 },
  { title: 'Software Testing Intern', skills: ['Manual Testing', 'SQL'], duration: '2 months', stipend: 8000 },
];

const ALUMNI_TEMPLATES = [
  { company: 'Nexora Technologies', jobRole: 'Software Engineer', salaryPackage: 6.5 },
  { company: 'Bluewave Softworks', jobRole: 'Frontend Developer', salaryPackage: 7.2 },
  { company: 'Vertex Analytics', jobRole: 'Data Analyst', salaryPackage: 5.8 },
  { company: 'Skyline Innovations', jobRole: 'Full Stack Developer', salaryPackage: 9.0 },
  { company: 'Cascade Systems', jobRole: 'Software Engineer II', salaryPackage: 12.5 },
  { company: 'Northbridge Consulting', jobRole: 'Technology Analyst', salaryPackage: 8.4 },
  { company: 'Fern Robotics', jobRole: 'Embedded Systems Engineer', salaryPackage: 6.9 },
  { company: 'Lumen Health Tech', jobRole: 'Backend Developer', salaryPackage: 7.8 },
  { company: 'Orbit Digital', jobRole: 'UI/UX Designer', salaryPackage: 5.5 },
  { company: 'Pixel Forge Studios', jobRole: 'Product Designer', salaryPackage: 6.2 },
  { company: 'Nexora Technologies', jobRole: 'QA Engineer', salaryPackage: 5.2 },
  { company: 'Skyline Innovations', jobRole: 'DevOps Engineer', salaryPackage: 10.5 },
];

module.exports = {
  DEMO_RESUME_URL,
  COMPANIES,
  DEPARTMENTS,
  COURSES,
  FIRST_NAMES,
  LAST_NAMES,
  SKILL_POOL,
  CERT_TEMPLATES,
  JOB_TEMPLATES,
  INTERNSHIP_TEMPLATES,
  ALUMNI_TEMPLATES,
};
