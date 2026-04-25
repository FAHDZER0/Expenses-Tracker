export type Category =
  | 'Food & Drinks'
  | 'Transport'
  | 'Bills & Utilities'
  | 'Shopping'
  | 'Health'
  | 'Others';

export interface Expense {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  amount: number;
  category: Category;
  notes: string | null;
  is_recurring: boolean;
  created_at: string;
}

export interface Salary {
  id: string;
  user_id: string;
  month: string; // YYYY-MM
  amount: number;
  created_at: string;
}

export interface BudgetLimit {
  id: string;
  user_id: string;
  month: string; // YYYY-MM
  category: Category;
  limit_amount: number;
}

export interface CategoryColor {
  id: string;
  user_id: string;
  category: Category;
  color: string;
}

export interface DayTotal {
  date: string;
  total: number;
}

export interface CategoryTotal {
  category: Category;
  total: number;
}
