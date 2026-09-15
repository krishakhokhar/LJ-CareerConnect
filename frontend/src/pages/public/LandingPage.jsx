import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Target,
  ClipboardCheck,
  GraduationCap,
  Award,
  Building2,
  BarChart3,
  Search,
  FileCheck2,
  Users,
  Trophy,
  CheckCircle2,
  Star,
  Quote,
} from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';

const STATS = [
  { label: 'Students', value: '3,200+' },
  { label: 'Companies', value: '180+' },
  { label: 'Jobs Posted', value: '950+' },
  { label: 'Placements', value: '1,400+' },
];

const FEATURES = [
  { icon: Target, title: 'Smart Job Matching', desc: 'AI-driven match scores connect students to roles that fit their actual skills, not just keywords.' },
  { icon: ClipboardCheck, title: 'Placement Management', desc: 'End-to-end placement drive coordination for the placement office, from eligibility to offers.' },
  { icon: GraduationCap, title: 'Internship Tracking', desc: 'Students discover, apply and track internships while recruiters manage the full pipeline.' },
  { icon: Award, title: 'Skill Development', desc: 'Structured skill and certification tracking that feeds directly into career recommendations.' },
  { icon: Building2, title: 'Recruiter Portal', desc: 'A dedicated workspace for recruiters to post roles, review applicants and schedule interviews.' },
  { icon: BarChart3, title: 'Career Analytics', desc: 'Real-time dashboards on placements, applications and hiring trends for every stakeholder.' },
];

const STEPS = [
  { label: 'Student', icon: Users, desc: 'Creates a profile with skills, projects and resume.' },
  { label: 'Discover', icon: Search, desc: 'Finds AI-matched jobs, internships and placement drives.' },
  { label: 'Apply', icon: FileCheck2, desc: 'Applies in one click with a tracked application timeline.' },
  { label: 'Interview', icon: ClipboardCheck, desc: 'Gets scheduled and prepped for recruiter interviews.' },
  { label: 'Get Hired', icon: Trophy, desc: 'Receives offers and joins the alumni network.' },
];

const TESTIMONIALS = [
  { name: 'Aarav Shah', role: 'B.Tech CE, Placed at Skyline Innovations', quote: 'The AI match score helped me focus on roles I actually had a shot at. I could see exactly which skills to improve.' },
  { name: 'Ananya Mehta', role: 'MCA, Placed at Vertex Analytics', quote: 'Tracking every application status in one place removed so much guesswork from placement season.' },
  { name: 'Priya Desai', role: 'HR Lead, Bluewave Softworks', quote: 'The recruiter portal made shortlisting candidates dramatically faster with skill-based match scores.' },
];

const Section = ({ id, className = '', children }) => (
  <section id={id} className={`page-shell py-20 sm:py-24 ${className}`}>
    {children}
  </section>
);

const SectionHeading = ({ eyebrow, title, subtitle, center = true }) => (
  <div className={`mx-auto max-w-2xl ${center ? 'text-center' : ''} animate-fade-in`}>
    {eyebrow && (
      <span className="badge-brand mb-4 inline-flex">
        <Sparkles size={13} /> {eyebrow}
      </span>
    )}
    <h2 className="font-display text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">{title}</h2>
    {subtitle && <p className="mt-4 text-base leading-relaxed text-ink-500">{subtitle}</p>}
  </div>
);

const LandingPage = () => {
  return (
    <div className="bg-paper-100">
      <PublicNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl" />
        <div className="page-shell relative py-20 sm:py-28">
          <div className="mx-auto max-w-3xl text-center animate-slide-up">
            <span className="badge-brand mb-6 inline-flex">
              <Sparkles size={13} /> AI-Powered Placement Platform
            </span>
            <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-ink-950 sm:text-6xl">
              Connect Talent With <span className="text-brand-500">Opportunity</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-500">
              A modern university placement platform connecting students, recruiters and placement teams — powered by intelligent matching and real-time analytics.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/register?role=student" className="btn-primary px-6 py-3 text-base">
                Explore Opportunities <ArrowRight size={18} />
              </Link>
              <Link to="/register?role=recruiter" className="btn-outline px-6 py-3 text-base">
                For Recruiters
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="border-y border-ink-100 bg-white">
        <div className="page-shell grid grid-cols-2 gap-6 py-12 sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="text-center animate-fade-in">
              <p className="font-display text-3xl font-extrabold text-ink-950 sm:text-4xl">{s.value}</p>
              <p className="mt-1 text-sm font-medium text-ink-400">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature cards */}
      <Section id="features">
        <SectionHeading
          eyebrow="Platform"
          title="Everything placement teams and students need"
          subtitle="A single platform spanning job discovery, placement drives, internships, skill development and recruiter collaboration."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="card-hover p-6 animate-slide-up">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <f.icon size={22} />
              </div>
              <h3 className="mt-4 font-display text-base font-bold text-ink-950">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* AI section */}
      <section className="bg-ink-950">
        <Section id="ai-section" className="!py-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="animate-slide-up">
              <span className="badge-brand mb-5 inline-flex">
                <Sparkles size={13} /> Career Intelligence
              </span>
              <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">AI-Powered Career Intelligence</h2>
              <p className="mt-4 text-base leading-relaxed text-ink-400">
                Every student profile is analyzed against live job requirements to surface the roles, skills and learning priorities that matter most.
              </p>
              <ul className="mt-7 space-y-4">
                {[
                  ['Resume Matching', 'Deterministic AI match scores between student skills and job requirements.'],
                  ['Skill Gap Analysis', 'See exactly which skills separate you from your target role.'],
                  ['Career Recommendations', 'Personalized role suggestions based on course, skills and projects.'],
                ].map(([title, desc]) => (
                  <li key={title} className="flex gap-3">
                    <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-brand-400" />
                    <div>
                      <p className="font-semibold text-white">{title}</p>
                      <p className="text-sm text-ink-400">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="animate-fade-in rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-lift backdrop-blur">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-white">Frontend Developer @ Skyline Innovations</p>
                <span className="badge-brand">87% Strong Match</span>
              </div>
              <div className="mt-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">Matched Skills</p>
                <div className="flex flex-wrap gap-2">
                  {['React', 'JavaScript', 'HTML', 'CSS'].map((s) => (
                    <span key={s} className="rounded-full bg-brand-500/15 px-3 py-1 text-xs font-medium text-brand-300">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">Missing Skills</p>
                <div className="flex flex-wrap gap-2">
                  {['TypeScript', 'Testing'].map((s) => (
                    <span key={s} className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-ink-300">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[87%] rounded-full bg-gradient-to-r from-brand-500 to-brand-300" />
              </div>
            </div>
          </div>
        </Section>
      </section>

      {/* How it works */}
      <Section id="how-it-works">
        <SectionHeading eyebrow="Process" title="How It Works" subtitle="From profile creation to offer letter, every step is tracked in one place." />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((step, i) => (
            <div key={step.label} className="relative animate-slide-up">
              <div className="card-hover flex flex-col items-center p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink-950 text-brand-400">
                  <step.icon size={22} />
                </div>
                <p className="mt-4 font-display text-sm font-bold text-ink-950">{step.label}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-400">{step.desc}</p>
              </div>
              {i < STEPS.length - 1 && (
                <ArrowRight size={16} className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-ink-300 lg:block" />
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Recruiter section */}
      <section id="recruiters" className="bg-white">
        <Section className="!py-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="order-2 grid grid-cols-2 gap-4 lg:order-1">
              {[
                ['Post Roles in Minutes', Building2],
                ['Review AI-Ranked Applicants', Target],
                ['Schedule Interviews', ClipboardCheck],
                ['Track Hiring Funnels', BarChart3],
              ].map(([label, Icon]) => (
                <div key={label} className="card-hover flex flex-col gap-3 p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-950 text-brand-400">
                    <Icon size={18} />
                  </div>
                  <p className="text-sm font-semibold text-ink-800">{label}</p>
                </div>
              ))}
            </div>
            <div id="students" className="order-1 lg:order-2 animate-slide-up">
              <span className="badge-brand mb-5 inline-flex">For Recruiters</span>
              <h2 className="font-display text-3xl font-bold text-ink-950 sm:text-4xl">Hire top campus talent, faster</h2>
              <p className="mt-4 text-base leading-relaxed text-ink-500">
                Post jobs and internships, review AI-ranked candidates, manage your hiring funnel and schedule interviews — all from a dedicated recruiter portal built for campus hiring.
              </p>
              <Link to="/register?role=recruiter" className="btn-secondary mt-7">
                Start Hiring <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </Section>
      </section>

      {/* Testimonials */}
      <Section id="about">
        <SectionHeading eyebrow="Testimonials" title="Trusted by students and recruiters" subtitle="Real outcomes from the LJ CareerConnect community." />
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="card p-6 animate-fade-in">
              <Quote size={22} className="text-brand-300" />
              <p className="mt-4 text-sm leading-relaxed text-ink-600">{t.quote}</p>
              <div className="mt-5 flex items-center gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <p className="mt-3 text-sm font-bold text-ink-950">{t.name}</p>
              <p className="text-xs text-ink-400">{t.role}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section className="!pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-ink-950 px-8 py-16 text-center sm:px-16">
          <div className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl" />
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">Ready to launch your career journey?</h2>
          <p className="mx-auto mt-4 max-w-xl text-ink-400">
            Join thousands of students and recruiters already using LJ CareerConnect for smarter, faster placements.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/register?role=student" className="btn-primary px-6 py-3 text-base">
              Get Started as a Student
            </Link>
            <Link to="/register?role=recruiter" className="btn-outline border-white/20 bg-transparent px-6 py-3 text-base text-white hover:bg-white/10">
              Get Started as a Recruiter
            </Link>
          </div>
        </div>
      </Section>

      <PublicFooter />
    </div>
  );
};

export default LandingPage;
