import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Sparkles, Target, TrendingUp, Compass, CheckCircle2, XCircle, Lightbulb } from 'lucide-react';
import aiService from '../../services/ai.service';
import jobService from '../../services/job.service';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import { SelectField } from '../../components/forms/FormField';
import { getErrorMessage } from '../../services/api';

const TABS = [
  { id: 'match', label: 'Resume-Job Match', icon: Target },
  { id: 'gap', label: 'Skill Gap Analysis', icon: TrendingUp },
  { id: 'recommend', label: 'Career Recommendation', icon: Compass },
];

const ScoreRing = ({ score, label }) => {
  const circumference = 2 * Math.PI * 46;
  return (
    <div className="relative flex h-32 w-32 shrink-0 items-center justify-center">
      <svg className="h-32 w-32 -rotate-90">
        <circle cx="64" cy="64" r="46" strokeWidth="10" className="fill-none stroke-ink-100" />
        <circle
          cx="64" cy="64" r="46" strokeWidth="10" strokeLinecap="round"
          className="fill-none stroke-brand-500 transition-all duration-700"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - score / 100)}
        />
      </svg>
      <div className="absolute text-center">
        <p className="font-display text-2xl font-extrabold text-ink-950">{score}%</p>
        <p className="text-[10px] font-medium text-ink-400">{label}</p>
      </div>
    </div>
  );
};

const SkillPills = ({ title, skills, tone }) => (
  <div>
    <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-500">
      {tone === 'good' ? <CheckCircle2 size={13} className="text-brand-600" /> : <XCircle size={13} className="text-ink-400" />}
      {title}
    </p>
    <div className="flex flex-wrap gap-1.5">
      {skills.length === 0 ? (
        <span className="text-xs text-ink-300">None</span>
      ) : (
        skills.map((s) => <span key={s} className={tone === 'good' ? 'badge-brand' : 'badge-neutral'}>{s}</span>)
      )}
    </div>
  </div>
);

const JobMatchTab = () => {
  const [jobs, setJobs] = useState([]);
  const [jobId, setJobId] = useState('');
  const [result, setResult] = useState(null);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    jobService.getJobs({ limit: 50 }).then((d) => setJobs(d.jobs)).catch(() => {}).finally(() => setLoadingJobs(false));
  }, []);

  const handleAnalyze = async () => {
    if (!jobId) return toast.error('Please select a job first.');
    setAnalyzing(true);
    try {
      const data = await aiService.jobMatch(jobId);
      setResult(data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-end">
        <SelectField
          label="Select a job to analyze"
          className="flex-1"
          value={jobId}
          onChange={(e) => setJobId(e.target.value)}
          disabled={loadingJobs}
        >
          <option value="">{loadingJobs ? 'Loading jobs...' : 'Choose a job'}</option>
          {jobs.map((j) => <option key={j._id} value={j._id}>{j.title} — {j.company?.name}</option>)}
        </SelectField>
        <button onClick={handleAnalyze} disabled={analyzing} className="btn-primary sm:mb-0.5"><Sparkles size={15} /> {analyzing ? 'Analyzing...' : 'Analyze Match'}</button>
      </div>

      {result && (
        <div className="card animate-slide-up p-6">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <ScoreRing score={result.score} label={result.matchLabel} />
            <div className="flex-1 space-y-5">
              <p className="text-sm leading-relaxed text-ink-600">{result.explanation}</p>
              <div className="grid gap-5 sm:grid-cols-2">
                <SkillPills title="Matched Skills" skills={result.matchedSkills} tone="good" />
                <SkillPills title="Missing Skills" skills={result.missingSkills} tone="bad" />
              </div>
              {result.recommendedSkills?.length > 0 && (
                <div className="rounded-xl bg-paper-100 p-4">
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-ink-600"><Lightbulb size={13} /> Recommended to learn next</p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.recommendedSkills.map((s) => <span key={s} className="badge-amber">{s}</span>)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SkillGapTab = () => {
  const [roles, setRoles] = useState([]);
  const [role, setRole] = useState('');
  const [result, setResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    aiService.getRoles().then(setRoles).catch(() => {});
  }, []);

  const handleAnalyze = async () => {
    if (!role) return toast.error('Please select a target role.');
    setAnalyzing(true);
    try {
      const data = await aiService.skillGap(role);
      setResult(data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-end">
        <SelectField label="Target career role" className="flex-1" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">Choose a target role</option>
          {roles.map((r) => <option key={r} value={r}>{r}</option>)}
        </SelectField>
        <button onClick={handleAnalyze} disabled={analyzing} className="btn-primary sm:mb-0.5"><Sparkles size={15} /> {analyzing ? 'Analyzing...' : 'Analyze Gap'}</button>
      </div>

      {result && (
        <div className="card animate-slide-up p-6">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <ScoreRing score={result.readiness} label="Readiness" />
            <div className="flex-1 space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Target Role</p>
                <p className="font-display text-lg font-bold text-ink-950">{result.targetRole}</p>
              </div>
              <p className="text-sm leading-relaxed text-ink-600">{result.summary}</p>
              <div className="grid gap-5 sm:grid-cols-2">
                <SkillPills title="Current Skills" skills={result.currentSkills} tone="good" />
                <SkillPills title="Skill Gap" skills={result.skillGap} tone="bad" />
              </div>
              {result.recommendedPriorities?.length > 0 && (
                <div className="rounded-xl bg-paper-100 p-4">
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-ink-600"><Lightbulb size={13} /> Recommended learning priorities</p>
                  <ol className="space-y-1.5">
                    {result.recommendedPriorities.map((p, i) => (
                      <li key={p} className="flex items-center gap-2 text-sm text-ink-700">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 text-[10px] font-bold text-brand-700">{i + 1}</span>
                        {p}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CareerRecommendTab = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await aiService.careerRecommendation();
      setResult(data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <div className="flex h-52 items-center justify-center"><Spinner size={24} /></div>;
  if (!result) return <EmptyState title="Couldn't load recommendations" />;

  return (
    <div className="space-y-6">
      <div className="card border-brand-200 bg-brand-50/50 p-5">
        <p className="flex items-center gap-2 text-sm font-semibold text-brand-800"><Sparkles size={15} /> Career Insight</p>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-700">{result.insight}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {result.recommendations.map((rec, i) => (
          <div key={rec.role} className="card p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {i === 0 && <span className="badge-brand">Best Fit</span>}
                <p className="font-display text-base font-bold text-ink-950">{rec.role}</p>
              </div>
              <span className="font-display text-lg font-extrabold text-brand-600">{rec.score}%</span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-ink-100">
              <div className="h-full rounded-full bg-brand-500" style={{ width: `${rec.score}%` }} />
            </div>
            {rec.matchedSkills?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {rec.matchedSkills.slice(0, 5).map((s) => <span key={s} className="badge-neutral">{s}</span>)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const CareerAI = () => {
  const [tab, setTab] = useState('match');

  return (
    <div>
      <PageHeader title="Career AI" subtitle="AI-powered insights to guide your career journey." />

      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
              tab === t.id ? 'bg-ink-950 text-white' : 'bg-white text-ink-500 border border-ink-200 hover:border-ink-300'
            }`}
          >
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'match' && <JobMatchTab />}
      {tab === 'gap' && <SkillGapTab />}
      {tab === 'recommend' && <CareerRecommendTab />}
    </div>
  );
};

export default CareerAI;
