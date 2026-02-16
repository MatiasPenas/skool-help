import React from 'react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  label: string;
  value: string;
  subtext?: string;
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

export function MetricCard({ label, value, subtext, icon, status = 'neutral' }: MetricCardProps) {
  return (
    <div
      className={cn(
        'bg-card rounded-xl border border-l-4 p-4 transition-all hover:bg-card-hover',
        statusColors[status]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className={cn('size-2 rounded-full', statusDotColors[status])} />
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {label}
            </p>
          </div>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {subtext && (
            <p className="text-xs text-muted-foreground">{subtext}</p>
          )}
        </div>
        {icon && (
          <div className="rounded-lg bg-secondary p-2 text-muted-foreground">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
