-- ============================================================
-- Expense Tracker — Supabase SQL Schema
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- EXPENSES
create table public.expenses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  date date not null,
  amount numeric(10,2) not null check (amount >= 0),
  category text not null check (category in (
    'Food & Drinks','Transport','Bills & Utilities','Shopping','Health','Others'
  )),
  notes text,
  is_recurring boolean default false not null,
  created_at timestamptz default now() not null
);

-- SALARIES
create table public.salaries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  month text not null, -- YYYY-MM
  amount numeric(10,2) not null check (amount >= 0),
  created_at timestamptz default now() not null,
  unique(user_id, month)
);

-- BUDGET LIMITS
create table public.budget_limits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  month text not null, -- YYYY-MM
  category text not null,
  limit_amount numeric(10,2) not null check (limit_amount >= 0),
  created_at timestamptz default now() not null,
  unique(user_id, month, category)
);

-- CATEGORY COLORS
create table public.category_colors (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  category text not null,
  color text not null,
  created_at timestamptz default now() not null,
  unique(user_id, category)
);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.expenses enable row level security;
alter table public.salaries enable row level security;
alter table public.budget_limits enable row level security;
alter table public.category_colors enable row level security;

-- EXPENSES policies
create policy "expenses_select" on public.expenses for select using (auth.uid() = user_id);
create policy "expenses_insert" on public.expenses for insert with check (auth.uid() = user_id);
create policy "expenses_update" on public.expenses for update using (auth.uid() = user_id);
create policy "expenses_delete" on public.expenses for delete using (auth.uid() = user_id);

-- SALARIES policies
create policy "salaries_select" on public.salaries for select using (auth.uid() = user_id);
create policy "salaries_insert" on public.salaries for insert with check (auth.uid() = user_id);
create policy "salaries_update" on public.salaries for update using (auth.uid() = user_id);
create policy "salaries_delete" on public.salaries for delete using (auth.uid() = user_id);

-- BUDGET LIMITS policies
create policy "budget_select" on public.budget_limits for select using (auth.uid() = user_id);
create policy "budget_insert" on public.budget_limits for insert with check (auth.uid() = user_id);
create policy "budget_update" on public.budget_limits for update using (auth.uid() = user_id);
create policy "budget_delete" on public.budget_limits for delete using (auth.uid() = user_id);

-- CATEGORY COLORS policies
create policy "colors_select" on public.category_colors for select using (auth.uid() = user_id);
create policy "colors_insert" on public.category_colors for insert with check (auth.uid() = user_id);
create policy "colors_update" on public.category_colors for update using (auth.uid() = user_id);
create policy "colors_delete" on public.category_colors for delete using (auth.uid() = user_id);
