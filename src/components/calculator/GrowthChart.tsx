import React from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import type { MonthData } from '@/lib/calculator-engine';
import { formatNumber } from '@/lib/calculator-engine';

interface Props {
  data: MonthData[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border/50 bg-background px-3 py-2 text-xs shadow-xl">
      <p className="font-medium mb-1">Month {label}</p>
      <p className="text-accent-green">
        Total Members: <span className="font-mono font-medium">{payload[0]?.value?.toLocaleString()}</span>
      </p>
    </div>
  );
}

export function GrowthChart({ data }: Props) {
  const chartData = data.map((d) => ({
    name: `M${d.month}`,
    totalMembers: d.totalMembers,
  }));

  return (
    <div className="bg-card rounded-xl border p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
        Growth Trajectory (12 Months)
      </h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 16%)" />
            <XAxis
              dataKey="name"
              tick={{ fill: 'hsl(0 0% 63%)', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(0 0% 16%)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'hsl(0 0% 63%)', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(0 0% 16%)' }}
              tickLine={false}
              tickFormatter={(v) => formatNumber(v)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="totalMembers"
              stroke="#22c55e"
              strokeWidth={2}
              fill="url(#colorMembers)"
              dot={{ r: 3, fill: '#22c55e', stroke: '#22c55e' }}
              activeDot={{ r: 5, fill: '#22c55e', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center gap-2 mt-3">
        <div className="size-2.5 rounded-full bg-accent-green" />
        <span className="text-xs text-muted-foreground">Total Members</span>
      </div>
    </div>
  );
}
