'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { BudgetLimit, CategoryColor, Category } from '@/lib/types';

const sb = () => createClient();

// ── Budget Limits ──────────────────────────────────────────────────────────

export function useBudgetLimits(month: string) {
  return useQuery({
    queryKey: ['budgets', month],
    queryFn: async () => {
      const { data, error } = await sb()
        .from('budget_limits')
        .select('*')
        .eq('month', month);
      if (error) throw error;
      return data as BudgetLimit[];
    },
    enabled: !!month,
  });
}

export function useUpsertBudgetLimit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ month, category, limit_amount }: { month: string; category: Category; limit_amount: number }) => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('budget_limits')
        .upsert({ user_id: user!.id, month, category, limit_amount }, { onConflict: 'user_id,month,category' });
      if (error) throw error;
    },
    onSuccess: (_, { month }) => qc.invalidateQueries({ queryKey: ['budgets', month] }),
  });
}

// ── Category Colors ────────────────────────────────────────────────────────

export function useCategoryColors() {
  return useQuery({
    queryKey: ['category_colors'],
    queryFn: async () => {
      const { data, error } = await sb().from('category_colors').select('*');
      if (error) throw error;
      return data as CategoryColor[];
    },
  });
}

export function useUpsertCategoryColor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ category, color }: { category: Category; color: string }) => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('category_colors')
        .upsert({ user_id: user!.id, category, color }, { onConflict: 'user_id,category' });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['category_colors'] }),
  });
}
