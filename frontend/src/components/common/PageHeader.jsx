const PageHeader = ({ title, subtitle, actions, className = '' }) => (
  <div className={`mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${className}`}>
    <div>
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </div>
    {actions && <div className="flex shrink-0 flex-wrap items-center gap-2.5">{actions}</div>}
  </div>
);

export default PageHeader;
