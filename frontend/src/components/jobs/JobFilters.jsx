import { Search, SlidersHorizontal, X } from 'lucide-react';
import { JOB_TYPES } from '../../utils/constants';

const JobFilters = ({ filters, onChange, onReset }) => {
  const set = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="card space-y-4 p-5">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 font-display text-sm font-bold text-ink-950">
          <SlidersHorizontal size={15} /> Filters
        </p>
        <button onClick={onReset} className="flex items-center gap-1 text-xs font-medium text-ink-400 hover:text-red-500">
          <X size={12} /> Reset
        </button>
      </div>

      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
        <input
          className="input pl-9"
          placeholder="Search title, skill..."
          value={filters.search || ''}
          onChange={(e) => set('search', e.target.value)}
        />
      </div>

      <div>
        <label className="field-label">Job Type</label>
        <select className="select" value={filters.jobType || ''} onChange={(e) => set('jobType', e.target.value)}>
          <option value="">All types</option>
          {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div>
        <label className="field-label">Location</label>
        <input className="input" placeholder="e.g. Ahmedabad" value={filters.location || ''} onChange={(e) => set('location', e.target.value)} />
      </div>

      <div>
        <label className="field-label">Minimum Salary (₹)</label>
        <input type="number" className="input" placeholder="e.g. 400000" value={filters.minSalary || ''} onChange={(e) => set('minSalary', e.target.value)} />
      </div>

      <div>
        <label className="field-label">Skills (comma separated)</label>
        <input className="input" placeholder="React, Node.js" value={filters.skills || ''} onChange={(e) => set('skills', e.target.value)} />
      </div>

      <div>
        <label className="field-label">Sort By</label>
        <select className="select" value={filters.sort || '-createdAt'} onChange={(e) => set('sort', e.target.value)}>
          <option value="-createdAt">Newest First</option>
          <option value="applicationDeadline">Deadline (soonest)</option>
          <option value="-salaryMax">Salary (highest)</option>
        </select>
      </div>
    </div>
  );
};

export default JobFilters;
