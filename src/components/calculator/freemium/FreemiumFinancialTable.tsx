import React from 'react';
import type { FreemiumMonthData } from '@/lib/freemium-engine';
import { formatCurrency, formatNumber } from '@/lib/calculator-engine';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { InfoTooltip } from '../InfoTooltip';

interface Props {
  data: FreemiumMonthData[];
  showEffectiveCac?: boolean;
}

function exportCsv(data: FreemiumMonthData[], showEffectiveCac: boolean) {
  const header = showEffectiveCac
    ? 'Month,Revenue,Ad Spend,Profit,Margin %,Free Members,Converted,Premium Members,Eff. CPA\n'
    : 'Month,Revenue,Ad Spend,Profit,Margin %,Free Members,Converted,Premium Members\n';
  const rows = data
    .map((d) => {
      const base = `M${d.month},$${d.revenue.toFixed(0)},$${d.adSpend.toFixed(0)},$${d.profit.toFixed(0)},${d.marginPct.toFixed(1)}%,${d.totalFreeMembers},${d.converted},${d.totalPremiumMembers}`;
      return showEffectiveCac ? `${base},$${d.effectiveCac.toFixed(2)}` : base;
    })
    .join('\n');
  const blob = new Blob([header + rows], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'skool-freemium-forecast.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export function FreemiumFinancialTable({ data, showEffectiveCac = false }: Props) {
  return (
    <div className="bg-card rounded-xl border p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5">
          <h3 className="text-sm font-semibold uppercase tracking-wider">Financial Breakdown</h3>
          <InfoTooltip text="Month-by-month projection of revenue, ad spend, profit, and membership counts over 12 months." />
        </div>
        <Button variant="ghost" size="sm" onClick={() => exportCsv(data, showEffectiveCac)} className="gap-1.5 text-xs">
          <Download className="size-3.5" />
          CSV
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Month</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
              <TableHead className="text-right">Ad Spend</TableHead>
              <TableHead className="text-right">Profit</TableHead>
              <TableHead className="text-right">Margin</TableHead>
              <TableHead className="text-right">
                <span className="inline-flex items-center justify-end gap-1">Free <InfoTooltip text="Total free community members in your funnel this month." /></span>
              </TableHead>
              <TableHead className="text-right">
                <span className="inline-flex items-center justify-end gap-1">Conv. <InfoTooltip text="Free members who converted to paid this month." /></span>
              </TableHead>
              <TableHead className="text-right">
                <span className="inline-flex items-center justify-end gap-1">Premium <InfoTooltip text="Total paying members at the end of this month." /></span>
              </TableHead>
              {showEffectiveCac && (
                <TableHead className="text-right">
                  <span className="inline-flex items-center justify-end gap-1">
                    Eff. CPA
                    <InfoTooltip text="Effective free member acquisition cost this month, after compounding audience saturation." />
                  </span>
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((d) => (
              <TableRow key={d.month}>
                <TableCell className="font-medium">M{d.month}</TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {formatCurrency(d.revenue)}
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {formatCurrency(d.adSpend)}
                </TableCell>
                <TableCell
                  className={cn(
                    'text-right font-mono text-sm font-medium',
                    d.profit >= 0 ? 'text-accent-green' : 'text-accent-pink'
                  )}
                >
                  {formatCurrency(d.profit)}
                </TableCell>
                <TableCell className="text-right font-mono text-sm text-muted-foreground">
                  {d.marginPct.toFixed(1)}%
                </TableCell>
                <TableCell className="text-right font-mono text-sm text-accent-blue">
                  {formatNumber(d.totalFreeMembers)}
                </TableCell>
                <TableCell className="text-right font-mono text-sm text-accent-yellow">
                  {formatNumber(d.converted)}
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {formatNumber(d.totalPremiumMembers)}
                </TableCell>
                {showEffectiveCac && (
                  <TableCell className="text-right font-mono text-sm text-accent-yellow">
                    {formatCurrency(d.effectiveCac)}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
