import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, getDaysInMonth } from 'date-fns';
import type { Expense, Category } from './types';

export const toYMD = (date: Date): string => format(date, 'yyyy-MM-dd');
export const toYM = (date: Date): string => format(date, 'yyyy-MM');
export const todayYMD = (): string => toYMD(new Date());
export const currentYM = (): string => toYM(new Date());

export const parseYM = (month: string): Date => parseISO(`${month}-01`);
export const parseYMD = (date: string): Date => parseISO(date);

export const monthLabel = (month: string): string =>
  format(parseYM(month), 'MMMM yyyy');

export const prevMonth = (month: string): string => {
  const d = parseYM(month);
  d.setMonth(d.getMonth() - 1);
  return toYM(d);
};

export const nextMonth = (month: string): string => {
  const d = parseYM(month);
  d.setMonth(d.getMonth() + 1);
  return toYM(d);
};

export const daysInMonth = (month: string): string[] => {
  const start = startOfMonth(parseYM(month));
  const end = endOfMonth(parseYM(month));
  return eachDayOfInterval({ start, end }).map(toYMD);
};

export const groupExpensesByDate = (expenses: Expense[]): Record<string, Expense[]> => {
  return expenses.reduce((acc, e) => {
    if (!acc[e.date]) acc[e.date] = [];
    acc[e.date].push(e);
    return acc;
  }, {} as Record<string, Expense[]>);
};

export const sumExpenses = (expenses: Expense[]): number =>
  expenses.reduce((s, e) => s + Number(e.amount), 0);

export const sumByCategory = (expenses: Expense[]): Record<Category, number> => {
  return expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + Number(e.amount);
    return acc;
  }, {} as Record<Category, number>);
};

export const exportToCSV = (expenses: Expense[], filename: string): void => {
  const headers = ['Date', 'Amount (AED)', 'Category', 'Notes', 'Recurring'];
  const rows = expenses.map(e => [
    e.date,
    e.amount.toString(),
    e.category,
    e.notes ?? '',
    e.is_recurring ? 'Yes' : 'No',
  ]);
  const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const spendIntensity = (amount: number, max: number): 'low' | 'medium' | 'high' | 'extreme' => {
  if (max === 0) return 'low';
  const ratio = amount / max;
  if (ratio < 0.25) return 'low';
  if (ratio < 0.5) return 'medium';
  if (ratio < 0.75) return 'high';
  return 'extreme';
};

export const getDaysInMonthCount = (month: string): number =>
  getDaysInMonth(parseYM(month));
