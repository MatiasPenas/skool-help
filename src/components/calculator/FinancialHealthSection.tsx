import React from 'react';
import type { UnitEconomics } from '@/lib/calculator-engine';
import { MetricCard } from './MetricCard';
import { TrendingUp, Clock, Users, DollarSign } from 'lucide-react';

interface Props {
  economics: UnitEconomics;
  breakEvenMonth?: number | null;
}

function getRatioStatus(ratio: number): 'good' | 'warning' | 'danger' {
  if (ratio >= 3) return 'good';
  if (ratio >= 1) return 'warning';
  return 'danger';
}

function getPaybackStatus(months: number): 'good' | 'warning' | 'danger' {
  if (months <= 3) return 'good';
  if (months <= 12) return 'warning';
  return 'danger';
}

export function FinancialHealthSection({ economics }: Props) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="size-5 text-accent-green" />
        <h2 className="text-sm font-semibold uppercase tracking-wider">Financial Health</h2>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard
          label="LTV : CAC Ratio"
          value={`${economics.ltvCacRatio.toFixed(1)}x`}
          subtext="Target > 3.0x"
          tooltip="Ratio of customer lifetime value to acquisition cost. Above 3x is healthy, below 1x means you lose money per customer."
          status={getRatioStatus(economics.ltvCacRatio)}
          icon={<TrendingUp className="size-4" />}
        />
        <MetricCard
          label="Payback Period"
          value={`${economics.paybackMonths.toFixed(1)} mo`}
          subtext="Time to recover CAC"
          tooltip="Months of subscription revenue needed to recover the cost of acquiring one member. Under 3 months is great."
          status={getPaybackStatus(economics.paybackMonths)}
          icon={<Clock className="size-4" />}
        />
        <MetricCard
          label="Avg. Retention"
          value={`${economics.avgRetentionMonths.toFixed(1)} mo`}
          subtext="Average member lifespan"
          tooltip="How long an average member stays before canceling, based on your churn rate. Calculated as 1 / churn rate."
          status="neutral"
          icon={<Users className="size-4" />}
        />
        <MetricCard
          label="Customer LTV"
          value={`$${Math.round(economics.ltv).toLocaleString()}`}
          subtext="Lifetime Value"
          tooltip="Total revenue you can expect from one member over their entire lifetime. Calculated as monthly price / churn rate."
          status="neutral"
          icon={<DollarSign className="size-4" />}
        />
      </div>
    </div>
  );
}
