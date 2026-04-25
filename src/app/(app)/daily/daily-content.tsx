'use client';
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ExpenseList } from '@/components/expenses/ExpenseList';
import { useExpensesByDate } from '@/hooks/useExpenses';
import { useCategoryColors } from '@/hooks/useBudgetLimits';
import { todayYMD } from '@/lib/utils';
import { format, parseISO, addDays, subDays } from 'date-fns';

export default function DailyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [date, setDate] = useState(searchParams.get('date') ?? todayYMD());

  const { data: expenses = [], isLoading } = useExpensesByDate(date);
  const { data: colorRows = [] } = useCategoryColors();
  const categoryColors = Object.fromEntries(colorRows.map(c => [c.category, c.color]));

  const goDay = (delta: number) => {
    const base = parseISO(date);
    const next = format(delta > 0 ? addDays(base, 1) : subDays(base, 1), 'yyyy-MM-dd');
    setDate(next);
    router.replace(`/daily?date=${next}`);
  };

  const dateLabel = date === todayYMD()
    ? 'Today'
    : format(parseISO(date), 'EEEE, MMM d');

  return (
    <>
      <PageHeader
        title="Daily View"
        subtitle={dateLabel}
        right={
          <div className="flex items-center gap-1">
            <button onClick={() => goDay(-1)} className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors active:scale-90" style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)' }} aria-label="Previous day">
              <ChevronLeft size={18} />
            </button>
            <input type="date" value={date} onChange={e => { setDate(e.target.value); router.replace(`/daily?date=${e.target.value}`); }} className="sr-only" id="daily-date-picker" max={todayYMD()} />
            <label htmlFor="daily-date-picker" className="w-9 h-9 flex items-center justify-center rounded-xl cursor-pointer transition-colors" style={{ background: 'var(--bg-elevated)', color: 'var(--accent)', fontSize: 18 }}>📅</label>
            <button onClick={() => goDay(1)} disabled={date >= todayYMD()} className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors active:scale-90 disabled:opacity-30" style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)' }} aria-label="Next day">
              <ChevronRight size={18} />
            </button>
          </div>
        }
      />
      <div className="px-4 py-4 max-w-lg mx-auto">
        {isLoading ? (
          <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin" style={{ color: 'var(--accent)' }} /></div>
        ) : expenses.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">💸</div>
            <p className="text-lg font-semibold" style={{ color: 'var(--text-secondary)' }}>No expenses</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Tap + Add to record one</p>
          </div>
        ) : (
          <ExpenseList expenses={expenses} categoryColors={categoryColors} showDailyTotal />
        )}
      </div>
    </>
  );
}
