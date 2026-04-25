'use client';
import { formatAED } from '@/lib/constants';
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react';

interface SummaryCardsProps {
  income: number;
  expenses: number;
  lastMonthSavings: number;
}

export function SummaryCards({ income, expenses, lastMonthSavings }: SummaryCardsProps) {
  const savings = income - expenses;
  const cumulativeSavings = lastMonthSavings + savings;
  const savingsRate = income > 0 ? (savings / income) * 100 : 0;

  const cards = [
    {
      label: 'Income',
      value: income,
      icon: TrendingUp,
      color: '#10b981',
      bg: 'rgba(16,185,129,0.1)',
    },
    {
      label: 'Expenses',
      value: expenses,
      icon: TrendingDown,
      color: '#ef4444',
      bg: 'rgba(239,68,68,0.1)',
    },
    {
      label: 'Savings',
      value: savings,
      icon: PiggyBank,
      color: savings >= 0 ? '#6366f1' : '#f59e0b',
      bg: savings >= 0 ? 'rgba(99,102,241,0.1)' : 'rgba(245,158,11,0.1)',
    },
    {
      label: 'Cumulative',
      value: cumulativeSavings,
      icon: Wallet,
      color: cumulativeSavings >= 0 ? '#3b82f6' : '#ef4444',
      bg: 'rgba(59,130,246,0.1)',
      subtitle: `${savingsRate.toFixed(0)}% savings rate`,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {cards.map(({ label, value, icon: Icon, color, bg, subtitle }) => (
        <div
          key={label}
          className="stat-card"
          style={{ background: bg, border: `1px solid ${color}30` }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{label}</span>
            <Icon size={16} style={{ color }} />
          </div>
          <span
            className="text-base font-bold leading-tight"
            style={{ color: value < 0 ? 'var(--danger)' : 'var(--text-primary)' }}
          >
            {formatAED(Math.abs(value))}
            {value < 0 && <span className="text-xs ml-1" style={{ color: 'var(--danger)' }}>deficit</span>}
          </span>
          {subtitle && (
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{subtitle}</span>
          )}
        </div>
      ))}
    </div>
  );
}
