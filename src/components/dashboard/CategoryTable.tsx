'use client';
import { DEFAULT_CATEGORY_COLORS, formatAED, CATEGORY_ICONS } from '@/lib/constants';
import type { Category } from '@/lib/types';

interface CategoryTableProps {
  data: Record<Category, number>;
  categoryColors?: Record<string, string>;
  budgetLimits?: Record<string, number>;
}

export function CategoryTable({ data, categoryColors, budgetLimits }: CategoryTableProps) {
  const total = Object.values(data).reduce((s, v) => s + v, 0);
  const entries = Object.entries(data)
    .filter(([, v]) => v > 0)
    .sort(([, a], [, b]) => b - a) as [Category, number][];

  if (entries.length === 0) {
    return (
      <div className="text-center py-8">
        <p style={{ color: 'var(--text-muted)' }}>No expenses this month</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {entries.map(([cat, amount]) => {
        const color = categoryColors?.[cat] ?? DEFAULT_CATEGORY_COLORS[cat] ?? '#8B5CF6';
        const pct = total > 0 ? (amount / total) * 100 : 0;
        const limit = budgetLimits?.[cat];
        const limitPct = limit ? Math.min(100, (amount / limit) * 100) : null;
        const overBudget = limit && amount > limit;

        return (
          <div
            key={cat}
            className="card p-3 flex flex-col gap-2"
            style={{ borderLeft: `3px solid ${color}` }}
          >
            <div className="flex items-center gap-2">
              <span className="text-base">{CATEGORY_ICONS[cat]}</span>
              <span className="flex-1 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{cat}</span>
              <div className="text-right">
                <span className="text-sm font-bold" style={{ color: overBudget ? 'var(--danger)' : 'var(--text-primary)' }}>
                  {formatAED(amount)}
                </span>
                <span className="text-xs ml-1.5" style={{ color: 'var(--text-muted)' }}>
                  {pct.toFixed(0)}%
                </span>
              </div>
            </div>

            {/* Category spend bar */}
            <div className="h-1.5 rounded-full" style={{ background: 'var(--bg-elevated)' }}>
              <div
                className="h-1.5 rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, background: color }}
              />
            </div>

            {/* Budget limit bar */}
            {limitPct !== null && (
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full" style={{ background: 'var(--bg-elevated)' }}>
                  <div
                    className="h-1.5 rounded-full transition-all duration-700"
                    style={{
                      width: `${limitPct}%`,
                      background: overBudget ? 'var(--danger)' : limitPct > 75 ? 'var(--warning)' : 'var(--success)',
                    }}
                  />
                </div>
                <span className="text-[10px] shrink-0" style={{ color: overBudget ? 'var(--danger)' : 'var(--text-muted)' }}>
                  {overBudget ? 'Over!' : `${formatAED(limit! - amount)} left`}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
