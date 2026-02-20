import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine,
} from 'recharts';
import type { MonthData } from '@/lib/calculator-engine';
import { formatCurrency } from '@/lib/calculator-engine';
import { TrendingUp } from 'lucide-react';
import { InfoTooltip } from './InfoTooltip';

interface Props {
  data: MonthData[];
  breakEvenMonth: number | null;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const value = payload[0]?.value ?? 0;
  return (
    <div className="rounded-lg border border-border/50 bg-background px-3 py-2 text-xs shadow-xl">
      <p className="font-medium mb-1">Month {label?.replace('M', '')}</p>
      <p className={value >= 0 ? 'text-[#3b82f6]' : 'text-[#ec4899]'}>
        Cumulative Profit:{' '}
        <span className="font-mono font-medium">{formatCurrency(value)}</span>
      </p>
    </div>
  );
}

export function CumulativeProfitChart({ data, breakEvenMonth }: Props) {
  const chartData = data.map((d) => ({
    name: `M${d.month}`,
    cumulativeProfit: d.cumulativeProfit,
  }));

  const isAllNegative = data.every((d) => d.cumulativeProfit < 0);
  const strokeColor = isAllNegative ? '#ec4899' : '#3b82f6';
  const gradientId = isAllNegative ? 'colorProfitNeg' : 'colorProfitPos';

  return (
    <div className="bg-card rounded-xl border p-5">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="size-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold uppercase tracking-wider">
          Cash Flow (Cumulative)
        </h3>
        <InfoTooltip text="Your running total of profit or loss over 12 months, after ad spend and revenue. Break-even is the month this line crosses zero." />
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="colorProfitPos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorProfitNeg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
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
              tickFormatter={(v) => formatCurrency(v)}
              width={70}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={0}
              stroke="hsl(0 0% 40%)"
              strokeDasharray="4 4"
            />
            {breakEvenMonth && (
              <ReferenceLine
                x={`M${breakEvenMonth}`}
                stroke="#22c55e"
                strokeDasharray="4 4"
                label={{
                  value: `Break-even`,
                  fill: '#22c55e',
                  fontSize: 10,
                  position: 'insideTopRight',
                }}
              />
            )}
            <Area
              type="monotone"
              dataKey="cumulativeProfit"
              stroke={strokeColor}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              dot={{ r: 3, fill: strokeColor, stroke: strokeColor }}
              activeDot={{ r: 5, fill: strokeColor, stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center gap-4 mt-3">
        <div className="flex items-center gap-2">
          <div className="size-2.5 rounded-full bg-[#3b82f6]" />
          <span className="text-xs text-muted-foreground">Profit</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-2.5 rounded-full bg-[#ec4899]" />
          <span className="text-xs text-muted-foreground">Loss</span>
        </div>
        {breakEvenMonth && (
          <div className="flex items-center gap-2">
            <div className="size-2.5 rounded-full bg-accent-green" />
            <span className="text-xs text-muted-foreground">Break-even M{breakEvenMonth}</span>
          </div>
        )}
      </div>
    </div>
  );
}
