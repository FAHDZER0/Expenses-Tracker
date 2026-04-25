'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { Salary } from '@/lib/types';

const sb = () => createClient();

export function useSalaries() {
  return useQuery({
    queryKey: ['salaries'],
    queryFn: async () => {
      const { data, error } = await sb()
        .from('salaries')
        .select('*')
        .order('month', { ascending: false });
      if (error) throw error;
      return data as Salary[];
    },
  });
}

export function useSalaryForMonth(month: string) {
  return useQuery({
    queryKey: ['salary', month],
    queryFn: async () => {
      const { data, error } = await sb()
        .from('salaries')
        .select('*')
        .eq('month', month)
        .maybeSingle();
      if (error) throw error;
      return data as Salary | null;
    },
    enabled: !!month,
  });
}

export function useUpsertSalary() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ month, amount }: { month: string; amount: number }) => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('salaries')
        .upsert({ user_id: user!.id, month, amount }, { onConflict: 'user_id,month' });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['salaries'] }),
  });
}

export function useDeleteSalary() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await sb().from('salaries').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['salaries'] }),
  });
}
