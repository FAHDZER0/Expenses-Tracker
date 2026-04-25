'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { Expense, Category } from '@/lib/types';

const sb = () => createClient();

// ── Fetch ──────────────────────────────────────────────────────────────────

export function useExpensesByDate(date: string) {
  return useQuery({
    queryKey: ['expenses', 'date', date],
    queryFn: async () => {
      const { data, error } = await sb()
        .from('expenses')
        .select('*')
        .eq('date', date)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Expense[];
    },
    enabled: !!date,
  });
}

export function useExpensesByMonth(month: string) {
  return useQuery({
    queryKey: ['expenses', 'month', month],
    queryFn: async () => {
      const start = `${month}-01`;
      const [year, m] = month.split('-').map(Number);
      const lastDay = new Date(year, m, 0).getDate();
      const end = `${month}-${String(lastDay).padStart(2, '0')}`;
      const { data, error } = await sb()
        .from('expenses')
        .select('*')
        .gte('date', start)
        .lte('date', end)
        .order('date', { ascending: true });
      if (error) throw error;
      return data as Expense[];
    },
    enabled: !!month,
  });
}

export function useExpense(id: string | null) {
  return useQuery({
    queryKey: ['expense', id],
    queryFn: async () => {
      const { data, error } = await sb()
        .from('expenses')
        .select('*')
        .eq('id', id!)
        .single();
      if (error) throw error;
      return data as Expense;
    },
    enabled: !!id,
  });
}

// ── Mutations ──────────────────────────────────────────────────────────────

export interface ExpensePayload {
  date: string;
  amount: number;
  category: Category;
  notes: string;
  is_recurring: boolean;
}

export function useAddExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ExpensePayload) => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from('expenses').insert({
        ...payload,
        user_id: user!.id,
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['expenses'] }),
  });
}

export function useUpdateExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<ExpensePayload> }) => {
      const { error } = await sb().from('expenses').update(payload).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['expenses'] }),
  });
}

export function useDeleteExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await sb().from('expenses').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['expenses'] }),
  });
}
