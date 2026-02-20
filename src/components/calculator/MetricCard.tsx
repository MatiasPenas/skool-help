import React from 'react';
import { cn } from '@/lib/utils';
import { InfoTooltip } from './InfoTooltip';

interface MetricCardProps {
  label: string;
  value: string;
  subtext?: string;
  tooltip?: string;
  icon?: React.ReactNode;
  status?: 'good' | 'warning' | 'danger' | 'neutral';
}

const statusColors = {
  good: 'border-l-accent-green',
  warning: 'border-l-accent-yellow',
  danger: 'border-l-accent-pink',
  neutral: 'border-l-accent-blue',
};

const statusDotColors = {
  good: 'bg-accent-green',
  warning: 'bg-accent-yellow',
  danger: 'bg-accent-pink',
  neutral: 'bg-accent-blue',
};

export function MetricCard({ label, value, subtext, tooltip, icon, status = 'neutral' }: MetricCardProps) {
  return (
    <div
      className={cn(
        'bg-card rounded-xl border border-l-4 p-4 transition-all hover:bg-card-hover',
        statusColors[status]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className={cn('size-2 rounded-full flex-shrink-0', statusDotColors[status])} />
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {label}
            </p>
            {tooltip && <InfoTooltip text={tooltip} />}
          </div>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {subtext && (
            <p className="text-xs text-muted-foreground">{subtext}</p>
          )}
        </div>
        {icon && (
          <div className="rounded-lg bg-secondary p-2 text-muted-foreground flex-shrink-0">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
