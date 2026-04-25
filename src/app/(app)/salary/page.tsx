'use client';
import { useState } from 'react';
import { Loader2, Pencil, Trash2, Check } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { useSalaries, useUpsertSalary, useDeleteSalary } from '@/hooks/useSalary';
import { currentYM, monthLabel } from '@/lib/utils';
import { formatAED } from '@/lib/constants';
import toast from 'react-hot-toast';

export default function SalaryPage() {
  const { data: salaries = [], isLoading } = useSalaries();
  const upsert = useUpsertSalary();
  const deleteSalary = useDeleteSalary();

  const [month, setMonth] = useState(currentYM());
  const [amount, setAmount] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState('');

  const existing = salaries.find(s => s.month === month);

  const handleSave = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error('Enter a valid amount');
      return;
    }
    try {
      await upsert.mutateAsync({ month, amount: parseFloat(amount) });
      toast.success(existing ? 'Salary updated!' : 'Salary saved!');
      setAmount('');
    } catch {
      toast.error('Failed to save');
    }
  };

  const handleEditSave = async (id: string, origMonth: string) => {
    if (!editAmount || isNaN(Number(editAmount))) return;
    try {
      await upsert.mutateAsync({ month: origMonth, amount: parseFloat(editAmount) });
      toast.success('Updated!');
      setEditingId(null);
    } catch {
      toast.error('Failed to update');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSalary.mutateAsync(id);
      toast.success('Deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const inputStyle = { background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' };

  return (
    <>
      <PageHeader title="Salary" subtitle="Monthly income" />

      <div className="px-4 py-4 max-w-lg mx-auto flex flex-col gap-5">
        {/* Entry form */}
        <div className="card p-4 flex flex-col gap-4">
          <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            {existing ? 'Update' : 'Set'} Salary
          </h2>

          <div>
            <label className="form-label" htmlFor="salary-month">Month</label>
            <input
              id="salary-month"
              type="month"
              value={month}
              onChange={e => setMonth(e.target.value)}
              className="form-input"
              style={inputStyle}
              max={currentYM()}
            />
          </div>

          {existing && (
            <div
              className="flex items-center justify-between px-4 py-3 rounded-xl"
              style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent)' }}
            >
              <span className="text-sm" style={{ color: 'var(--accent)' }}>Current: {formatAED(existing.amount)}</span>
            </div>
          )}

          <div>
            <label className="form-label" htmlFor="salary-amount">Amount (AED)</label>
            <div className="flex gap-0">
              <span className="flex items-center px-4 rounded-l-xl text-sm font-bold border border-r-0 shrink-0" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--accent)', minHeight: 48 }}>AED</span>
              <input
                id="salary-amount"
                type="number"
                inputMode="decimal"
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="form-input rounded-l-none flex-1"
                style={{ ...inputStyle, borderLeft: 'none' }}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            className="btn-primary w-full"
            disabled={upsert.isPending}
          >
            {upsert.isPending ? <Loader2 size={16} className="animate-spin" /> : null}
            {existing ? 'Update Salary' : 'Save Salary'}
          </button>
        </div>

        {/* History */}
        <div className="flex flex-col gap-2">
          <h2 className="section-title px-1">History</h2>
          {isLoading ? (
            <div className="flex justify-center py-8"><Loader2 size={24} className="animate-spin" style={{ color: 'var(--accent)' }} /></div>
          ) : salaries.length === 0 ? (
            <div className="text-center py-8">
              <p style={{ color: 'var(--text-muted)' }}>No salary records yet</p>
            </div>
          ) : (
            salaries.map(s => (
              <div key={s.id} className="card flex items-center gap-3 px-4 py-3">
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{monthLabel(s.month)}</p>
                  {editingId === s.id ? (
                    <input
                      type="number"
                      value={editAmount}
                      onChange={e => setEditAmount(e.target.value)}
                      className="form-input mt-1 text-sm py-1"
                      style={inputStyle}
                      autoFocus
                    />
                  ) : (
                    <p className="text-base font-bold" style={{ color: 'var(--accent)' }}>{formatAED(s.amount)}</p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {editingId === s.id ? (
                    <button onClick={() => handleEditSave(s.id, s.month)} className="w-9 h-9 flex items-center justify-center rounded-xl" style={{ color: 'var(--success)', background: 'rgba(16,185,129,0.1)' }}>
                      <Check size={16} />
                    </button>
                  ) : (
                    <button onClick={() => { setEditingId(s.id); setEditAmount(String(s.amount)); }} className="w-9 h-9 flex items-center justify-center rounded-xl" style={{ color: 'var(--text-muted)', background: 'var(--bg-elevated)' }}>
                      <Pencil size={14} />
                    </button>
                  )}
                  <button onClick={() => handleDelete(s.id)} className="w-9 h-9 flex items-center justify-center rounded-xl" style={{ color: 'var(--danger)', background: 'var(--danger-dim)' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
