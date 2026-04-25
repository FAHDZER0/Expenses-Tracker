'use client';
import { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { CalendarDayCard } from '@/components/calendar/CalendarDayCard';
import { useExpensesByMonth } from '@/hooks/useExpenses';
import { currentYM, daysInMonth, groupExpensesByDate, sumExpenses, prevMonth, nextMonth, monthLabel, toYMD } from '@/lib/utils';
import { formatAED } from '@/lib/constants';

export default function CalendarContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [month, setMonth] = useState(searchParams.get('month') ?? currentYM());

  const { data: expenses = [], isLoading } = useExpensesByMonth(month);
  const byDate = useMemo(() => groupExpensesByDate(expenses), [expenses]);
  const days = useMemo(() => daysInMonth(month), [month]);
  const today = toYMD(new Date());

  const dayTotals = useMemo(() =>
    days.map(d => ({ date: d, total: sumExpenses(byDate[d] ?? []) })),
    [days, byDate]
  );
  const maxTotal = Math.max(...dayTotals.map(d => d.total), 1);
  const monthTotal = dayTotals.reduce((s, d) => s + d.total, 0);

  const nav = (dir: 'prev' | 'next') => {
    const m = dir === 'prev' ? prevMonth(month) : nextMonth(month);
    setMonth(m); router.replace(`/calendar?month=${m}`);
  };

  return (
    <>
      <PageHeader
        title="Calendar"
        subtitle={monthLabel(month)}
        right={
          <div className="flex items-center gap-1">
            <button onClick={() => nav('prev')} className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors active:scale-90" style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)' }} aria-label="Previous month"><ChevronLeft size={18} /></button>
            <button onClick={() => nav('next')} disabled={month >= currentYM()} className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors active:scale-90 disabled:opacity-30" style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)' }} aria-label="Next month"><ChevronRight size={18} /></button>
          </div>
        }
      />
      <div className="px-4 py-4 max-w-lg mx-auto">
        <div className="rounded-2xl p-4 mb-4 flex items-center justify-between" style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent)' }}>
          <div>
            <p className="text-xs font-medium" style={{ color: 'var(--accent)' }}>Month Total</p>
            <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{formatAED(monthTotal)}</p>
          </div>
          <div className="text-3xl">📅</div>
        </div>
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          {[{ label: 'Low', color: '#10b981' }, { label: 'Medium', color: '#f59e0b' }, { label: 'High', color: '#ef4444' }].map(({ label, color }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</span>
            </div>
          ))}
        </div>
        {isLoading ? (
          <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin" style={{ color: 'var(--accent)' }} /></div>
        ) : (
          <div className="flex flex-col gap-2">
            {dayTotals.map(({ date, total }) => (
              <CalendarDayCard key={date} date={date} total={total} maxTotal={maxTotal} isToday={date === today} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
