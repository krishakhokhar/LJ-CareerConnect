import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ page, pages, onPageChange, total, limit }) => {
  if (!pages || pages <= 1) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const pageNumbers = [];
  const windowSize = 1;
  for (let i = 1; i <= pages; i += 1) {
    if (i === 1 || i === pages || Math.abs(i - page) <= windowSize) {
      pageNumbers.push(i);
    } else if (pageNumbers[pageNumbers.length - 1] !== '...') {
      pageNumbers.push('...');
    }
  }

  return (
    <div className="flex flex-col-reverse items-center justify-between gap-3 border-t border-ink-100 px-1 py-4 sm:flex-row">
      <p className="text-xs text-ink-400">
        Showing <span className="font-semibold text-ink-600">{start}-{end}</span> of{' '}
        <span className="font-semibold text-ink-600">{total}</span>
      </p>
      <div className="flex items-center gap-1.5">
        <button
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink-200 text-ink-500 transition-colors hover:bg-ink-50 disabled:opacity-40"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          <ChevronLeft size={16} />
        </button>
        {pageNumbers.map((p, idx) =>
          p === '...' ? (
            <span key={`dots-${idx}`} className="px-1 text-ink-300">
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`h-8 w-8 rounded-lg text-xs font-semibold transition-colors ${
                p === page ? 'bg-ink-950 text-white' : 'text-ink-500 hover:bg-ink-100'
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink-200 text-ink-500 transition-colors hover:bg-ink-50 disabled:opacity-40"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
