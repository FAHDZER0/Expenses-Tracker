'use client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { formatAED } from '@/lib/constants';
import { format, parseISO } from 'date-fns';

interface SpendingTrendChartProps {
  data: { date: string; total: number }[];
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (active && payload?.length) {
    return (
      <div
        className="px-3 py-2 rounded-xl text-sm shadow-xl"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
      >
        <p className="font-semibold">{label}</p>
        <p style={{ color: 'var(--accent)' }}>{formatAED(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export function SpendingTrendChart({ data }: SpendingTrendChartProps) {
  const chartData = data.map(d => ({
    day: format(parseISO(d.date), 'd'),
    total: d.total,
    fullDate: format(parseISO(d.date), 'MMM d'),
  }));

  if (chartData.every(d => d.total === 0)) {
    return (
      <div className="flex items-center justify-center h-40">
        <p style={{ color: 'var(--text-muted)' }}>No spending data</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border-subtle)" />
        <XAxis
          dataKey="day"
          tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : String(v)}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--accent-dim)' }} />
        <Bar dataKey="total" fill="var(--accent)" radius={[4, 4, 0, 0]} maxBarSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
}
