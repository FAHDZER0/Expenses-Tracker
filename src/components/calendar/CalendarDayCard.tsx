'use client';
import { useRouter } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { formatAED } from '@/lib/constants';
import { spendIntensity } from '@/lib/utils';

interface CalendarDayCardProps {
  date: string;
  total: number;
  maxTotal: number;
  isToday?: boolean;
}

const INTENSITY_COLORS = {
  low:     { bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.3)',  dot: '#10b981' },
  medium:  { bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)',  dot: '#f59e0b' },
  high:    { bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.3)',   dot: '#ef4444' },
  extreme: { bg: 'rgba(239,68,68,0.2)',   border: 'rgba(239,68,68,0.5)',   dot: '#ef4444' },
};

export function CalendarDayCard({ date, total, maxTotal, isToday }: CalendarDayCardProps) {
  const router = useRouter();
  const intensity = total > 0 ? spendIntensity(total, maxTotal) : 'low';
  const colors = total > 0 ? INTENSITY_COLORS[intensity] : null;
  const day = format(parseISO(date), 'd');
  const weekday = format(parseISO(date), 'EEE');

  return (
    <button
      onClick={() => router.push(`/daily?date=${date}`)}
      className="card flex items-center gap-4 px-4 py-3 w-full text-left transition-all duration-150 active:scale-[0.98]"
      style={{
        background: colors ? colors.bg : 'var(--bg-card)',
        borderColor: colors ? colors.border : 'var(--border)',
        ...(isToday ? { boxShadow: '0 0 0 2px var(--accent)' } : {}),
      }}
      aria-label={`${date}: ${formatAED(total)}`}
    >
      {/* Date column */}
      <div className="flex flex-col items-center w-12 shrink-0">
        <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{weekday}</span>
        <span
          className="text-xl font-bold leading-none mt-0.5"
          style={{ color: isToday ? 'var(--accent)' : 'var(--text-primary)' }}
        >
          {day}
        </span>
      </div>

      {/* Spend bar */}
      <div className="flex-1">
        {total > 0 ? (
          <div className="h-2 rounded-full" style={{ background: 'var(--bg-elevated)' }}>
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (total / maxTotal) * 100)}%`,
                background: colors?.dot ?? 'var(--accent)',
              }}
            />
          </div>
        ) : (
          <div className="h-2 rounded-full" style={{ background: 'var(--bg-elevated)' }} />
        )}
      </div>

      {/* Amount */}
      <div className="text-right shrink-0">
        {total > 0 ? (
          <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            {formatAED(total)}
          </span>
        ) : (
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>—</span>
        )}
      </div>

      {/* Dot indicator */}
      {total > 0 && (
        <div className="w-2 h-2 rounded-full shrink-0" style={{ background: colors?.dot }} />
      )}
    </button>
  );
}
