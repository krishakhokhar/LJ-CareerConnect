export const TextField = ({ label, error, required, className = '', ...props }) => (
  <div className={className}>
    {label && (
      <label className="field-label">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <input className={`input ${error ? 'input-error' : ''}`} {...props} />
    {error && <p className="field-error">{error}</p>}
  </div>
);

export const TextAreaField = ({ label, error, required, className = '', rows = 4, ...props }) => (
  <div className={className}>
    {label && (
      <label className="field-label">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <textarea rows={rows} className={`textarea ${error ? 'input-error' : ''}`} {...props} />
    {error && <p className="field-error">{error}</p>}
  </div>
);

export const SelectField = ({ label, error, required, className = '', children, ...props }) => (
  <div className={className}>
    {label && (
      <label className="field-label">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <select className={`select ${error ? 'input-error' : ''}`} {...props}>
      {children}
    </select>
    {error && <p className="field-error">{error}</p>}
  </div>
);
