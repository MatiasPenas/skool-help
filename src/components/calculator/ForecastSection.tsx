import React from 'react';
import type { ForecastSummary } from '@/lib/calculator-engine';
import { formatCurrency, formatNumber } from '@/lib/calculator-engine';
import { MetricCard } from './MetricCard';
import { TrendingUp, Users, BarChart3, DollarSign } from 'lucide-react';

interface Props {
  summary: ForecastSummary;
}

export function ForecastSection({ summary }: Props) {
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
          status="neutral"
          icon={<TrendingUp className="size-4" />}
        />
        <MetricCard
          label="Total Members (M12)"
          value={formatNumber(summary.totalMembers)}
          status="neutral"
          icon={<Users className="size-4" />}
        />
        <MetricCard
          label="Annual Run Rate"
          value={formatCurrency(summary.annualRunRate)}
          status="neutral"
          icon={<BarChart3 className="size-4" />}
        />
        <MetricCard
          label="12-Mo Total Profit"
          value={formatCurrency(summary.totalProfit12Mo)}
          status={summary.totalProfit12Mo >= 0 ? 'good' : 'danger'}
          icon={<DollarSign className="size-4" />}
        />
      </div>
    </div>
  );
}
