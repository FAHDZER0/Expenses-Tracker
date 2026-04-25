'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';
import { todayYMD } from '@/lib/utils';
import { useAddExpense, useUpdateExpense } from '@/hooks/useExpenses';
import type { Expense, Category } from '@/lib/types';

interface ExpenseFormProps {
  expense?: Expense;
  onSuccess?: () => void;
}

export function ExpenseForm({ expense, onSuccess }: ExpenseFormProps) {
  const router = useRouter();
  const addExpense = useAddExpense();
  const updateExpense = useUpdateExpense();

  const [date, setDate] = useState(expense?.date ?? todayYMD());
  const [amount, setAmount] = useState(expense ? String(expense.amount) : '');
  const [category, setCategory] = useState<Category>(expense?.category ?? 'Food & Drinks');
  const [notes, setNotes] = useState(expense?.notes ?? '');
  const [isRecurring, setIsRecurring] = useState(expense?.is_recurring ?? false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!expense;
  const isPending = addExpense.isPending || updateExpense.isPending;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) e.amount = 'Enter a valid amount';
    if (!date) e.date = 'Date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      date,
      amount: parseFloat(amount),
      category,
      notes: notes.trim(),
      is_recurring: isRecurring,
    };

    try {
      if (isEditing) {
        await updateExpense.mutateAsync({ id: expense.id, payload });
        toast.success('Expense updated!');
      } else {
        await addExpense.mutateAsync(payload);
        toast.success('Expense added!');
        setAmount('');
        setNotes('');
        setDate(todayYMD());
      }
      onSuccess?.();
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  };

  const inputStyle = {
    background: 'var(--bg-elevated)',
    borderColor: 'var(--border)',
    color: 'var(--text-primary)',
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-4 py-4">
      {/* Date */}
      <div>
        <label className="form-label" htmlFor="expense-date">Date</label>
        <input
          id="expense-date"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="form-input"
          style={inputStyle}
          max={todayYMD()}
        />
        {errors.date && <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>{errors.date}</p>}
      </div>

      {/* Amount */}
      <div>
        <label className="form-label" htmlFor="expense-amount">Amount</label>
        <div className="flex items-stretch gap-0">
          <span
            className="flex items-center px-4 rounded-l-xl text-sm font-bold border-r-0 border shrink-0"
            style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--accent)', minHeight: 48 }}
          >
            AED
          </span>
          <input
            id="expense-amount"
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
        {errors.amount && <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>{errors.amount}</p>}
      </div>

      {/* Category */}
      <div>
        <label className="form-label" htmlFor="expense-category">Category</label>
        <select
          id="expense-category"
          value={category}
          onChange={e => setCategory(e.target.value as Category)}
          className="form-input appearance-none"
          style={inputStyle}
        >
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Notes */}
      <div>
        <label className="form-label" htmlFor="expense-notes">Notes <span style={{ color: 'var(--text-muted)' }}>(optional)</span></label>
        <textarea
          id="expense-notes"
          placeholder="Add a note..."
          value={notes}
          onChange={e => setNotes(e.target.value)}
          className="form-input resize-none"
          style={{ ...inputStyle, minHeight: 80 }}
          rows={3}
        />
      </div>

      {/* Recurring */}
      <label
        className="flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-colors active:scale-[0.98]"
        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
      >
        <div className="relative flex-shrink-0">
          <input
            id="expense-recurring"
            type="checkbox"
            checked={isRecurring}
            onChange={e => setIsRecurring(e.target.checked)}
            className="sr-only"
          />
          <div
            className="w-12 h-6 rounded-full transition-all duration-200"
            style={{ background: isRecurring ? 'var(--accent)' : 'var(--border)' }}
          >
            <div
              className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200"
              style={{ transform: isRecurring ? 'translateX(26px)' : 'translateX(2px)' }}
            />
          </div>
        </div>
        <div>
          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Recurring expense</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Auto-populates each month</p>
        </div>
      </label>

      {/* Submit */}
      <button
        type="submit"
        className="btn-primary w-full mt-2"
        disabled={isPending}
      >
        {isPending ? <Loader2 size={18} className="animate-spin" /> : null}
        {isEditing ? 'Save Changes' : 'Add Expense'}
      </button>
    </form>
  );
}
