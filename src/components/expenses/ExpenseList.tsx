'use client';
import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { CATEGORIES, formatAED } from '@/lib/constants';
import { sumExpenses } from '@/lib/utils';
import { ExpenseCard } from './ExpenseCard';
import type { Expense, Category } from '@/lib/types';

interface ExpenseListProps {
  expenses: Expense[];
  categoryColors?: Record<string, string>;
  showDailyTotal?: boolean;
}

type SortKey = 'time' | 'amount_asc' | 'amount_desc';

export function ExpenseList({ expenses, categoryColors, showDailyTotal }: ExpenseListProps) {
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState<Category | 'All'>('All');
  const [sort, setSort] = useState<SortKey>('time');

  const filtered = useMemo(() => {
    let list = [...expenses];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(e =>
        e.notes?.toLowerCase().includes(q) || e.category.toLowerCase().includes(q)
      );
    }
    if (filterCat !== 'All') list = list.filter(e => e.category === filterCat);
    if (sort === 'amount_desc') list.sort((a, b) => b.amount - a.amount);
    else if (sort === 'amount_asc') list.sort((a, b) => a.amount - b.amount);
    else list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return list;
  }, [expenses, search, filterCat, sort]);

  const total = sumExpenses(filtered);

  return (
    <div className="flex flex-col gap-3">
      {showDailyTotal && (
        <div
          className="flex items-center justify-between px-4 py-3 rounded-2xl"
          style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent)' }}
        >
          <span className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
            {filterCat === 'All' ? 'Daily Total' : filterCat}
          </span>
          <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            {formatAED(total)}
          </span>
        </div>
      )}

      {/* Search bar */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
        <input
          type="search"
          placeholder="Search notes or category..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="form-input pl-9 pr-9"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X size={14} style={{ color: 'var(--text-muted)' }} />
          </button>
        )}
      </div>

      {/* Filters row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {/* Sort selector */}
        <select
          value={sort}
          onChange={e => setSort(e.target.value as SortKey)}
          className="shrink-0 text-sm px-3 py-2 rounded-xl border"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-secondary)', minHeight: 44 }}
        >
          <option value="time">Latest first</option>
          <option value="amount_desc">High → Low</option>
          <option value="amount_asc">Low → High</option>
        </select>

        {/* Category chips */}
        {(['All', ...CATEGORIES] as const).map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat as Category | 'All')}
            className="chip shrink-0"
            style={{
              background: filterCat === cat ? 'var(--accent)' : 'var(--bg-card)',
              color: filterCat === cat ? '#fff' : 'var(--text-secondary)',
              border: `1px solid ${filterCat === cat ? 'var(--accent)' : 'var(--border)'}`,
              minHeight: 44,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Expense cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">🔍</div>
          <p className="font-medium" style={{ color: 'var(--text-secondary)' }}>No expenses found</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map(e => (
            <ExpenseCard key={e.id} expense={e} categoryColors={categoryColors} />
          ))}
        </div>
      )}
    </div>
  );
}
