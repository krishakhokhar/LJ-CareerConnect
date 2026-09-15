import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

const ConfirmDialog = ({ open, onClose, onConfirm, title = 'Are you sure?', message, confirmLabel = 'Confirm', danger = true, loading }) => (
  <Modal open={open} onClose={onClose} title={title} size="sm">
    <div className="flex gap-3">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${danger ? 'bg-red-50 text-red-600' : 'bg-brand-50 text-brand-600'}`}>
        <AlertTriangle size={20} />
      </div>
      <p className="text-sm text-ink-600">{message}</p>
    </div>
    <div className="mt-6 flex justify-end gap-3">
      <button className="btn-outline btn-sm" onClick={onClose} disabled={loading}>
        Cancel
      </button>
      <button className={danger ? 'btn-danger btn-sm' : 'btn-primary btn-sm'} onClick={onConfirm} disabled={loading}>
        {loading ? 'Please wait...' : confirmLabel}
      </button>
    </div>
  </Modal>
);

export default ConfirmDialog;
