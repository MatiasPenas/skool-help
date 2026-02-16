import React from 'react';
import type { CohortData } from '@/lib/calculator-engine';
import { formatNumber } from '@/lib/calculator-engine';
import { cn } from '@/lib/utils';

interface Props {
  cohorts: CohortData[];
  churnRate: number;
}

function getRetentionColor(pct: number): string {
  if (pct >= 80) return 'bg-accent-green/80 text-white';
  if (pct >= 60) return 'bg-accent-green/60 text-white';
  if (pct >= 40) return 'bg-accent-green/40 text-white';
  if (pct >= 20) return 'bg-accent-yellow/40 text-white';
  if (pct > 0) return 'bg-accent-pink/30 text-white';
  return 'bg-transparent text-muted-foreground';
}

export function RetentionHeatmap({ cohorts, churnRate }: Props) {
  const months = cohorts.length;

  return (
    <div className="bg-card rounded-xl border p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
        Retention Cohorts
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="text-left font-medium text-muted-foreground p-1.5 min-w-[60px]">Cohort</th>
              <th className="text-center font-medium text-muted-foreground p-1.5 min-w-[44px]">Init</th>
              {Array.from({ length: months }, (_, i) => (
                <th key={i} className="text-center font-medium text-muted-foreground p-1.5 min-w-[44px]">
                  M{i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cohorts.map((cohort) => (
              <tr key={cohort.cohortMonth}>
                <td className="font-medium p-1.5">M{cohort.cohortMonth}</td>
                <td className="text-center p-1.5 font-mono">
                  {formatNumber(cohort.initialSize)}
                </td>
                {Array.from({ length: months }, (_, monthIdx) => {
                  const retained = cohort.retainedByMonth[monthIdx];
                  if (retained === undefined) {
                    return <td key={monthIdx} className="p-1.5" />;
                  }
                  const pct = cohort.initialSize > 0
                    ? (retained / cohort.initialSize) * 100
                    : 0;
                  return (
                    <td key={monthIdx} className="p-1">
                      <div
                        className={cn(
                          'rounded px-1 py-0.5 text-center font-mono text-[10px] tabular-nums',
                          getRetentionColor(pct)
                        )}
                        title={`${retained.toLocaleString()} members (${pct.toFixed(0)}%)`}
                      >
                        {formatNumber(retained)}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
