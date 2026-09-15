import { useRef, useState } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';

const FileDropzone = ({ accept = '.pdf', label = 'Upload file', hint, onFileSelect, fileName, onClear }) => {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (files) => {
    if (files?.[0]) onFileSelect(files[0]);
  };

  return (
    <div>
      {label && <label className="field-label">{label}</label>}
      {fileName ? (
        <div className="flex items-center justify-between rounded-xl border border-ink-200 bg-paper-50 px-4 py-3">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <FileText size={18} className="shrink-0 text-brand-600" />
            <span className="truncate text-sm font-medium text-ink-700">{fileName}</span>
          </div>
          {onClear && (
            <button type="button" onClick={onClear} className="text-ink-400 hover:text-red-500">
              <X size={16} />
            </button>
          )}
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors ${
            dragging ? 'border-brand-400 bg-brand-50' : 'border-ink-200 bg-paper-50 hover:border-ink-300'
          }`}
        >
          <UploadCloud size={26} className="text-ink-400" />
          <p className="text-sm font-medium text-ink-600">Click to upload or drag and drop</p>
          {hint && <p className="text-xs text-ink-400">{hint}</p>}
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      )}
    </div>
  );
};

export default FileDropzone;
