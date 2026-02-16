import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { MonthData } from '@/lib/calculator-engine';
import { formatNumber } from '@/lib/calculator-engine';

interface Props {
  data: MonthData[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="rounded-lg border border-border/50 bg-background px-3 py-2 text-xs shadow-xl">
      <p className="font-medium mb-1">Month {label}</p>
      <p className="text-accent-green">
        Acquired: <span className="font-mono font-medium">{d?.acquired?.toLocaleString()}</span>
      </p>
      <p className="text-accent-pink">
        Churned: <span className="font-mono font-medium">{d?.churned?.toLocaleString()}</span>
      </p>
      <p className="text-accent-blue">
        Net Growth: <span className="font-mono font-medium">{d?.netGrowth?.toLocaleString()}</span>
      </p>
    </div>
  );
}

export function AcquisitionChurnChart({ data }: Props) {
  const chartData = data.map((d) => ({
    name: `M${d.month}`,
    acquired: d.newMembers,
    churned: -d.churnedMembers,
    netGrowth: d.newMembers - d.churnedMembers,
  }));

  return (
    <div className="bg-card rounded-xl border p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
        Acquisition vs Churn
      </h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }} stackOffset="sign">
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
              tickFormatter={(v) => formatNumber(Math.abs(v))}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="hsl(0 0% 25%)" />
            <Bar dataKey="acquired" fill="#22c55e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="churned" fill="#ec4899" radius={[0, 0, 4, 4]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center gap-4 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="size-2.5 rounded-full bg-accent-green" />
          <span className="text-xs text-muted-foreground">Acquired</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="size-2.5 rounded-full bg-accent-pink" />
          <span className="text-xs text-muted-foreground">Churned</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="size-2.5 rounded-full bg-accent-blue" />
          <span className="text-xs text-muted-foreground">Net Growth</span>
        </div>
      </div>
    </div>
  );
}
