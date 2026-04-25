'use client';
import { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Download, Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { CategoryTable } from '@/components/dashboard/CategoryTable';
import { DonutChart } from '@/components/dashboard/DonutChart';
import { SpendingTrendChart } from '@/components/dashboard/SpendingTrendChart';
import { useExpensesByMonth } from '@/hooks/useExpenses';
import { useSalaryForMonth } from '@/hooks/useSalary';
import { useBudgetLimits, useCategoryColors } from '@/hooks/useBudgetLimits';
import { currentYM, prevMonth, nextMonth, monthLabel, daysInMonth, groupExpensesByDate, sumExpenses, sumByCategory, exportToCSV } from '@/lib/utils';
import { formatAED } from '@/lib/constants';
import type { Category } from '@/lib/types';

export default function SummaryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [month, setMonth] = useState(searchParams.get('month') ?? currentYM());
  const prev = prevMonth(month);

  const { data: expenses = [], isLoading } = useExpensesByMonth(month);
  const { data: prevExpenses = [] } = useExpensesByMonth(prev);
  const { data: salary } = useSalaryForMonth(month);
  const { data: prevSalary } = useSalaryForMonth(prev);
  const { data: budgetRows = [] } = useBudgetLimits(month);
  const { data: colorRows = [] } = useCategoryColors();

  const categoryColors = Object.fromEntries(colorRows.map(c => [c.category, c.color]));
  const budgetLimits = Object.fromEntries(budgetRows.map(b => [b.category, b.limit_amount]));

  const income = salary?.amount ?? 0;
  const totalExpenses = useMemo(() => sumExpenses(expenses), [expenses]);
  const categoryTotals = useMemo(() => sumByCategory(expenses), [expenses]);
  const prevIncome = prevSalary?.amount ?? 0;
  const prevExpensesTotal = useMemo(() => sumExpenses(prevExpenses), [prevExpenses]);
  const prevSavings = prevIncome - prevExpensesTotal;

  const days = useMemo(() => daysInMonth(month), [month]);
  const byDate = useMemo(() => groupExpensesByDate(expenses), [expenses]);
  const trendData = useMemo(() => days.map(d => ({ date: d, total: sumExpenses(byDate[d] ?? []) })), [days, byDate]);

  const nav = (dir: 'prev' | 'next') => {
    const m = dir === 'prev' ? prevMonth(month) : nextMonth(month);
    setMonth(m); router.replace(`/summary?month=${m}`);
  };

  return (
    <>
      <PageHeader
        title="Summary"
        subtitle={monthLabel(month)}
        right={
          <div className="flex items-center gap-1">
            <button onClick={() => { exportToCSV(expenses, `expenses-${month}.csv`); }} className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors active:scale-90" style={{ background: 'var(--bg-elevated)', color: 'var(--accent)' }} aria-label="Export CSV"><Download size={16} /></button>
            <button onClick={() => nav('prev')} className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors active:scale-90" style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)' }}><ChevronLeft size={18} /></button>
            <button onClick={() => nav('next')} disabled={month >= currentYM()} className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors active:scale-90 disabled:opacity-30" style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)' }}><ChevronRight size={18} /></button>
          </div>
        }
      />
      <div className="px-4 py-4 max-w-lg mx-auto flex flex-col gap-5">
        {isLoading ? (
          <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin" style={{ color: 'var(--accent)' }} /></div>
        ) : (
          <>
            <SummaryCards income={income} expenses={totalExpenses} lastMonthSavings={prevSavings} />
            <section className="card p-4">
              <h2 className="section-title mb-3">By Category</h2>
              <DonutChart data={categoryTotals as Record<Category, number>} categoryColors={categoryColors} />
            </section>
            <section className="card p-4">
              <h2 className="section-title mb-3">Daily Spending</h2>
              <SpendingTrendChart data={trendData} />
            </section>
            <section className="card p-4">
              <h2 className="section-title mb-3">Category Breakdown</h2>
              <CategoryTable data={categoryTotals as Record<Category, number>} categoryColors={categoryColors} budgetLimits={budgetLimits} />
            </section>
            {prevExpensesTotal > 0 && (
              <section className="card p-4">
                <h2 className="section-title mb-3">vs Last Month</h2>
                {[
                  { label: 'Expenses', curr: totalExpenses, prev: prevExpensesTotal },
                  { label: 'Income', curr: income, prev: prevIncome },
                  { label: 'Savings', curr: income - totalExpenses, prev: prevSavings },
                ].map(({ label, curr, prev: p }) => {
                  const diff = curr - p;
                  const pct = p !== 0 ? ((curr - p) / Math.abs(p)) * 100 : 0;
                  const positive = label === 'Savings' ? diff >= 0 : diff <= 0;
                  return (
                    <div key={label} className="flex items-center justify-between py-2.5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{label}</span>
                      <div className="text-right">
                        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{formatAED(Math.abs(curr))}</span>
                        <span className="text-xs ml-2" style={{ color: diff === 0 ? 'var(--text-muted)' : positive ? 'var(--success)' : 'var(--danger)' }}>
                          {diff >= 0 ? '+' : ''}{pct.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </section>
            )}
          </>
        )}
      </div>
    </>
  );
}
