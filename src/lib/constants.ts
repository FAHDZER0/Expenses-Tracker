import type { Category } from './types';

export const CATEGORIES: Category[] = [
  'Food & Drinks',
  'Transport',
  'Bills & Utilities',
  'Shopping',
  'Health',
  'Others',
];

export const DEFAULT_CATEGORY_COLORS: Record<Category, string> = {
  'Food & Drinks': '#F59E0B',
  'Transport': '#3B82F6',
  'Bills & Utilities': '#EF4444',
  'Shopping': '#EC4899',
  'Health': '#10B981',
  'Others': '#8B5CF6',
};

export const CATEGORY_ICONS: Record<Category, string> = {
  'Food & Drinks': '🍔',
  'Transport': '🚗',
  'Bills & Utilities': '💡',
  'Shopping': '🛍️',
  'Health': '❤️',
  'Others': '📦',
};

export const formatAED = (amount: number): string =>
  new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
