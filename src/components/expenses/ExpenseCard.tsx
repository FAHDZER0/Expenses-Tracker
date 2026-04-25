'use client';
import { useState } from 'react';
import { Pencil, Trash2, RefreshCw } from 'lucide-react';
import { formatAED, DEFAULT_CATEGORY_COLORS, CATEGORY_ICONS } from '@/lib/constants';
import { useDeleteExpense } from '@/hooks/useExpenses';
import { Modal } from '@/components/ui/Modal';
import { ExpenseForm } from './ExpenseForm';
import toast from 'react-hot-toast';
import type { Expense } from '@/lib/types';
import { format, parseISO } from 'date-fns';

interface ExpenseCardProps {
  expense: Expense;
  categoryColors?: Record<string, string>;
}

export function ExpenseCard({ expense, categoryColors }: ExpenseCardProps) {
  const deleteExpense = useDeleteExpense();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const color = categoryColors?.[expense.category] ?? DEFAULT_CATEGORY_COLORS[expense.category] ?? '#8B5CF6';
  const icon = CATEGORY_ICONS[expense.category] ?? '📦';

  const handleDelete = async () => {
    try {
      await deleteExpense.mutateAsync(expense.id);
      toast.success('Deleted');
      setDeleteOpen(false);
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <>
      <div
        className="card flex items-center gap-3 px-4 py-3 expense-card-enter"
        style={{ borderLeft: `3px solid ${color}` }}
      >
        {/* Category icon */}
        <div
          className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0 text-lg"
          style={{ background: `${color}20` }}
        >
          {icon}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
              {expense.category}
            </span>
            {expense.is_recurring && (
              <RefreshCw size={11} style={{ color: 'var(--accent)', flexShrink: 0 }} />
            )}
          </div>
          {expense.notes ? (
            <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{expense.notes}</p>
          ) : (
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {format(parseISO(expense.date), 'h:mm a')}
            </p>
          )}
        </div>

        {/* Amount + actions */}
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            {formatAED(expense.amount)}
          </span>
          <button
            onClick={() => setEditOpen(true)}
            className="flex items-center justify-center w-9 h-9 rounded-xl transition-all active:scale-90 ml-1"
            style={{ color: 'var(--text-muted)', background: 'var(--bg-elevated)' }}
            aria-label="Edit expense"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => setDeleteOpen(true)}
            className="flex items-center justify-center w-9 h-9 rounded-xl transition-all active:scale-90"
            style={{ color: 'var(--danger)', background: 'var(--danger-dim)' }}
            aria-label="Delete expense"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Edit modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Expense">
        <ExpenseForm expense={expense} onSuccess={() => setEditOpen(false)} />
      </Modal>

      {/* Delete confirm */}
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete Expense">
        <div className="px-5 py-4 flex flex-col gap-4">
          <p style={{ color: 'var(--text-secondary)' }}>
            Remove <strong>{expense.category}</strong> — {formatAED(expense.amount)}? This cannot be undone.
          </p>
          <div className="flex gap-3">
            <button className="btn-ghost flex-1" onClick={() => setDeleteOpen(false)}>Cancel</button>
            <button
              className="flex-1 btn-danger"
              onClick={handleDelete}
              disabled={deleteExpense.isPending}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
