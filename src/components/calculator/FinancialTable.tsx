import React from 'react';
import type { MonthData } from '@/lib/calculator-engine';
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
import { InfoTooltip } from './InfoTooltip';

interface Props {
  data: MonthData[];
}

function exportCsv(data: MonthData[]) {
  const header = 'Month,Revenue,Ad Spend,Profit,Margin %,Members\n';
  const rows = data
    .map(
      (d) =>
        `M${d.month},$${d.revenue.toFixed(0)},$${d.adSpend.toFixed(0)},$${d.profit.toFixed(0)},${d.marginPct.toFixed(1)}%,${d.totalMembers}`
    )
    .join('\n');
  const blob = new Blob([header + rows], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'skool-ads-forecast.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export function FinancialTable({ data }: Props) {
  return (
    <div className="bg-card rounded-xl border p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5">
          <h3 className="text-sm font-semibold uppercase tracking-wider">Financial Breakdown</h3>
          <InfoTooltip text="Month-by-month projection of revenue, ad spend, profit, and member count over 12 months." />
        </div>
        <Button variant="ghost" size="sm" onClick={() => exportCsv(data)} className="gap-1.5 text-xs">
          <Download className="size-3.5" />
          CSV
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Month</TableHead>
            <TableHead className="text-right">Revenue</TableHead>
            <TableHead className="text-right">Ad Spend</TableHead>
            <TableHead className="text-right">Profit</TableHead>
            <TableHead className="text-right">Margin</TableHead>
            <TableHead className="text-right">Members</TableHead>
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
              <TableCell className="text-right font-mono text-sm">
                {formatNumber(d.totalMembers)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
