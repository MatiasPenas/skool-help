import React from 'react';
import { InfoTooltip } from '../InfoTooltip';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import type { FreemiumMonthData } from '@/lib/freemium-engine';
import { formatNumber } from '@/lib/calculator-engine';

interface Props {
  data: FreemiumMonthData[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="rounded-lg border border-border/50 bg-background px-3 py-2 text-xs shadow-xl">
      <p className="font-medium mb-1">Month {label}</p>
      <p className="text-accent-blue">
        Free Members: <span className="font-mono font-medium">{d?.freeMembers?.toLocaleString()}</span>
      </p>
      <p className="text-accent-green">
        Premium Members: <span className="font-mono font-medium">{d?.premiumMembers?.toLocaleString()}</span>
      </p>
    </div>
  );
}

export function FreemiumGrowthChart({ data }: Props) {
  const chartData = data.map((d) => ({
    name: `M${d.month}`,
    freeMembers: d.totalFreeMembers,
    premiumMembers: d.totalPremiumMembers,
  }));

  return (
    <div className="bg-card rounded-xl border p-5">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider">
          Growth Trajectory (12 Months)
        </h3>
        <InfoTooltip text="Shows how your free and premium member counts grow over 12 months. Free members feed the funnel; premium members generate revenue." />
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="colorFree" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPremium" x1="0" y1="0" x2="0" y2="1">
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
              dataKey="freeMembers"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#colorFree)"
              dot={{ r: 3, fill: '#3b82f6', stroke: '#3b82f6' }}
              activeDot={{ r: 5, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="premiumMembers"
              stroke="#22c55e"
              strokeWidth={2}
              fill="url(#colorPremium)"
              dot={{ r: 3, fill: '#22c55e', stroke: '#22c55e' }}
              activeDot={{ r: 5, fill: '#22c55e', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center gap-4 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="size-2.5 rounded-full bg-accent-blue" />
          <span className="text-xs text-muted-foreground">Free Members</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="size-2.5 rounded-full bg-accent-green" />
          <span className="text-xs text-muted-foreground">Premium Members</span>
        </div>
      </div>
    </div>
  );
}
