'use client';
import { useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, LogOut, Download, Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { useAuth } from '@/hooks/useAuth';
import { useBudgetLimits, useUpsertBudgetLimit, useCategoryColors, useUpsertCategoryColor } from '@/hooks/useBudgetLimits';
import { useExpensesByMonth } from '@/hooks/useExpenses';
import { CATEGORIES, DEFAULT_CATEGORY_COLORS, formatAED } from '@/lib/constants';
import { currentYM, exportToCSV } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { Category } from '@/lib/types';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [month] = useState(currentYM());

  const { data: budgetRows = [] } = useBudgetLimits(month);
  const { data: colorRows = [] } = useCategoryColors();
  const { data: expenses = [] } = useExpensesByMonth(month);

  const upsertBudget = useUpsertBudgetLimit();
  const upsertColor = useUpsertCategoryColor();

  const budgetMap = Object.fromEntries(budgetRows.map(b => [b.category, b.limit_amount]));
  const colorMap = Object.fromEntries(colorRows.map(c => [c.category, c.color]));

  const [budgetInputs, setBudgetInputs] = useState<Record<string, string>>({});

  const handleBudgetSave = async (cat: Category) => {
    const val = parseFloat(budgetInputs[cat] ?? String(budgetMap[cat] ?? 0));
    if (isNaN(val) || val < 0) { toast.error('Invalid amount'); return; }
    try {
      await upsertBudget.mutateAsync({ month, category: cat, limit_amount: val });
      toast.success('Budget limit saved');
    } catch { toast.error('Failed to save'); }
  };

  const handleColorChange = async (cat: Category, color: string) => {
    try {
      await upsertColor.mutateAsync({ category: cat, color });
    } catch { /* silent */ }
  };

  const cardStyle = { background: 'var(--bg-card)', border: '1px solid var(--border)' };

  return (
    <>
      <PageHeader title="Settings" subtitle="Preferences & budget" />

      <div className="px-4 py-4 max-w-lg mx-auto flex flex-col gap-5">

        {/* Theme toggle */}
        <section className="card p-4">
          <h2 className="section-title mb-3">Appearance</h2>
          <div className="flex gap-3">
            {(['dark', 'light'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all active:scale-95"
                style={{
                  background: theme === t ? 'var(--accent)' : 'var(--bg-elevated)',
                  color: theme === t ? '#fff' : 'var(--text-secondary)',
                  border: `1px solid ${theme === t ? 'var(--accent)' : 'var(--border)'}`,
                }}
              >
                {t === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </section>

        {/* Budget limits */}
        <section className="card p-4">
          <h2 className="section-title mb-1">Monthly Budget Limits</h2>
          <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>Set spending caps per category for {month}</p>
          <div className="flex flex-col gap-3">
            {CATEGORIES.map(cat => {
              const color = colorMap[cat] ?? DEFAULT_CATEGORY_COLORS[cat];
              const current = budgetMap[cat];
              const inputVal = budgetInputs[cat] ?? (current != null ? String(current) : '');
              return (
                <div key={cat} className="flex items-center gap-3">
                  <div className="w-2 h-8 rounded-full shrink-0" style={{ background: color }} />
                  <span className="text-sm flex-1 truncate" style={{ color: 'var(--text-secondary)' }}>{cat}</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      inputMode="decimal"
                      placeholder="0"
                      value={inputVal}
                      onChange={e => setBudgetInputs(p => ({ ...p, [cat]: e.target.value }))}
                      className="form-input w-28 text-sm py-2"
                      style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                      min="0"
                    />
                    <button
                      onClick={() => handleBudgetSave(cat)}
                      className="w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold transition-all active:scale-90"
                      style={{ background: 'var(--accent)', color: '#fff' }}
                    >
                      ✓
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Category colors */}
        <section className="card p-4">
          <h2 className="section-title mb-3">Category Colors</h2>
          <div className="grid grid-cols-2 gap-3">
            {CATEGORIES.map(cat => {
              const color = colorMap[cat] ?? DEFAULT_CATEGORY_COLORS[cat];
              return (
                <label key={cat} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="color"
                    value={color}
                    onChange={e => handleColorChange(cat, e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                    style={{ background: 'none' }}
                    aria-label={`Color for ${cat}`}
                  />
                  <span className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{cat}</span>
                </label>
              );
            })}
          </div>
        </section>

        {/* Export */}
        <section className="card p-4">
          <h2 className="section-title mb-3">Export Data</h2>
          <button
            onClick={() => { exportToCSV(expenses, `expenses-${month}.csv`); toast.success('CSV downloaded'); }}
            className="btn-ghost w-full border"
            style={{ borderColor: 'var(--border)' }}
          >
            <Download size={16} />
            Export {month} to CSV
          </button>
        </section>

        {/* Account */}
        <section className="card p-4 flex flex-col gap-3">
          <h2 className="section-title">Account</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Signed in as <span style={{ color: 'var(--text-primary)' }}>{user?.email}</span></p>
          <button
            onClick={signOut}
            className="btn-danger w-full justify-center"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </section>
      </div>
    </>
  );
}
