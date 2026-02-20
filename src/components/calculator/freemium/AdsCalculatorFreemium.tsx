import React from 'react';
import { useFreemiumCalculator } from '@/hooks/useFreemiumCalculator';
import { parseFreemiumUrlInputs, useSyncFreemiumUrlState } from '@/hooks/useFreemiumUrlState';
import { FreemiumInputPanel } from './FreemiumInputPanel';
import { FinancialHealthSection } from '../FinancialHealthSection';
import { FreemiumForecastSection } from './FreemiumForecastSection';
import { FreemiumGrowthChart } from './FreemiumGrowthChart';
import { FreemiumAcquisitionChart } from './FreemiumAcquisitionChart';
import { FreemiumFinancialTable } from './FreemiumFinancialTable';
import { CumulativeProfitChart } from '../CumulativeProfitChart';
import { RetentionHeatmap } from '../RetentionHeatmap';
import { CtaSection } from '../CtaSection';
import { ChevronLeft } from 'lucide-react';

export default function AdsCalculatorFreemium() {
  const [urlInputs] = React.useState(() => parseFreemiumUrlInputs());
  const calculator = useFreemiumCalculator(urlInputs);
  useSyncFreemiumUrlState(calculator.inputs);

  return (
    <div className="max-w-[1400px] mx-auto px-4 pt-6">
      <a href="/tools" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
        <ChevronLeft className="w-4 h-4" />
        Tools
      </a>
    <div className="flex flex-col lg:flex-row gap-6 pb-8">
      {/* Left sidebar - sticky on desktop */}
      <aside className="lg:w-[320px] lg:flex-shrink-0 lg:sticky lg:top-20 lg:self-start">
        <FreemiumInputPanel inputs={calculator.inputs} onChange={calculator.updateInput} onPreset={calculator.setInputs} />
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 space-y-6">
        <FinancialHealthSection economics={calculator.unitEconomics} />
        <FreemiumForecastSection summary={calculator.forecastSummary} />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <FreemiumGrowthChart data={calculator.monthlyData} />
          <FreemiumAcquisitionChart data={calculator.monthlyData} />
        </div>
        <CumulativeProfitChart data={calculator.monthlyData} breakEvenMonth={calculator.breakEvenMonth} />
        <FreemiumFinancialTable data={calculator.monthlyData} />
        <RetentionHeatmap
          cohorts={calculator.cohorts}
          churnRate={calculator.inputs.churnRate}
        />
        <CtaSection />
      </main>
    </div>
    </div>
  );
}
