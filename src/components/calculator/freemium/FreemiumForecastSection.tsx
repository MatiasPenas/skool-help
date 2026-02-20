import React from 'react';
import type { FreemiumForecastSummary } from '@/lib/freemium-engine';
import { formatCurrency, formatNumber } from '@/lib/calculator-engine';
import { MetricCard } from '../MetricCard';
import { TrendingUp, Users, UserPlus, BarChart3, DollarSign } from 'lucide-react';

interface Props {
  summary: FreemiumForecastSummary;
}

export function FreemiumForecastSection({ summary }: Props) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="size-5 text-accent-blue" />
        <h2 className="text-sm font-semibold uppercase tracking-wider">12 Month Forecast</h2>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard
          label="Forecast MRR"
          value={formatCurrency(summary.forecastMrr)}
          subtext="Month 12 revenue"
          tooltip="Projected monthly recurring revenue at the end of month 12 based on your current inputs."
          status="neutral"
          icon={<TrendingUp className="size-4" />}
        />
        <MetricCard
          label="Premium Members"
          value={formatNumber(summary.totalMembers)}
          subtext="Paying members at M12"
          tooltip="Total paying members projected by month 12, converted from your free community."
          status="neutral"
          icon={<Users className="size-4" />}
        />
        <MetricCard
          label="Free Members"
          value={formatNumber(summary.totalFreeMembers)}
          subtext="In funnel at M12"
          tooltip="Free community members remaining in your funnel at month 12, not yet converted to paid."
          status="neutral"
          icon={<UserPlus className="size-4" />}
        />
        <MetricCard
          label="12-Mo Total Profit"
          value={formatCurrency(summary.totalProfit12Mo)}
          subtext="Cumulative profit"
          tooltip="Sum of all monthly profits (revenue minus ad spend) across all 12 months. Red means you spent more on ads than you earned."
          status={summary.totalProfit12Mo >= 0 ? 'good' : 'danger'}
          icon={<DollarSign className="size-4" />}
        />
      </div>
    </div>
  );
}
