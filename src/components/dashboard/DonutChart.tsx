'use client';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DEFAULT_CATEGORY_COLORS, formatAED } from '@/lib/constants';
import type { Category } from '@/lib/types';

interface DonutChartProps {
  data: Record<Category, number>;
  categoryColors?: Record<string, string>;
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) => {
  if (active && payload?.length) {
    return (
      <div
        className="px-3 py-2 rounded-xl text-sm shadow-xl"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
      >
        <p className="font-semibold">{payload[0].name}</p>
        <p style={{ color: 'var(--accent)' }}>{formatAED(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export function DonutChart({ data, categoryColors }: DonutChartProps) {
  const chartData = Object.entries(data)
    .filter(([, v]) => v > 0)
    .map(([cat, value]) => ({
      name: cat,
      value,
      color: categoryColors?.[cat] ?? DEFAULT_CATEGORY_COLORS[cat as Category] ?? '#8B5CF6',
    }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-48">
        <p style={{ color: 'var(--text-muted)' }}>No data</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={3}
          dataKey="value"
          stroke="none"
        >
          {chartData.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => (
            <span style={{ color: 'var(--text-secondary)', fontSize: 11 }}>{value}</span>
          )}
          iconSize={8}
          iconType="circle"
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
