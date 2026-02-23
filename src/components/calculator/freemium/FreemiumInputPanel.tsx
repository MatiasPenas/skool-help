import { useState } from 'react';
import type { FreemiumInputs } from '@/lib/freemium-engine';
import { formatCurrency } from '@/lib/calculator-engine';
import { NumberInput } from '../NumberInput';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Share2, ArrowRight } from 'lucide-react';

const SCENARIO_PROFILES: Record<string, { cac: number; conversionRate: number; churnRate: number; reinvestmentPct: number }> = {
  conservative: { cac: 8,  conversionRate: 0.03, churnRate: 0.20, reinvestmentPct: 0.30 },
  realistic:    { cac: 5,  conversionRate: 0.05, churnRate: 0.12, reinvestmentPct: 1.0  },
  'the dream':  { cac: 2,  conversionRate: 0.08, churnRate: 0.05, reinvestmentPct: 1.0  },
};

function applyScenario(key: string, current: FreemiumInputs): FreemiumInputs {
  const p = SCENARIO_PROFILES[key];
  return { ...current, cac: p.cac, conversionRate: p.conversionRate, churnRate: p.churnRate, reinvestmentPct: p.reinvestmentPct };
}

function detectActiveScenario(inputs: FreemiumInputs): string | null {
  for (const [key, p] of Object.entries(SCENARIO_PROFILES)) {
    if (
      inputs.cac === p.cac &&
      inputs.conversionRate === p.conversionRate &&
      inputs.churnRate === p.churnRate &&
      inputs.reinvestmentPct === p.reinvestmentPct
    ) return key;
  }
  return null;
}

interface Props {
  inputs: FreemiumInputs;
  onChange: <K extends keyof FreemiumInputs>(key: K, value: FreemiumInputs[K]) => void;
  onPreset: (inputs: FreemiumInputs) => void;
}

export function FreemiumInputPanel({ inputs, onChange, onPreset }: Props) {
  const [copied, setCopied] = useState(false);
  const activeScenario = detectActiveScenario(inputs);

  const effectiveCAC = inputs.conversionRate > 0
    ? inputs.cac / inputs.conversionRate
    : 0;

  const handleChange = <K extends keyof FreemiumInputs>(key: K, value: FreemiumInputs[K]) => {
    window.posthog?.capture('freemium_calculator_used', {
      calculator_type: 'freemium',
      changed_field: key,
      [key]: value,
      monthly_price: inputs.monthlyPrice,
      cac: inputs.cac,
      conversion_rate: inputs.conversionRate,
      churn_rate: inputs.churnRate,
      initial_budget: inputs.initialBudget,
      reinvestment_pct: inputs.reinvestmentPct,
    });
    onChange(key, value);
  };

  const handlePreset = (key: string, newInputs: FreemiumInputs) => {
    window.posthog?.capture('freemium_calculator_used', {
      calculator_type: 'freemium',
      changed_field: 'scenario_preset',
      scenario: key,
      monthly_price: newInputs.monthlyPrice,
      cac: newInputs.cac,
      conversion_rate: newInputs.conversionRate,
      churn_rate: newInputs.churnRate,
      initial_budget: newInputs.initialBudget,
      reinvestment_pct: newInputs.reinvestmentPct,
    });
    onPreset(newInputs);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      window.posthog?.capture('freemium_calculator_shared', {
        calculator_type: 'freemium',
        monthly_price: inputs.monthlyPrice,
        cac: inputs.cac,
        conversion_rate: inputs.conversionRate,
        churn_rate: inputs.churnRate,
      });
    } catch {
      // fallback
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-xl border p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold">Ads Calculator</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Freemium Skool Community</p>
          </div>
          <Badge className="bg-accent-green text-white border-accent-green">Freemium</Badge>
        </div>

        {/* Scenario Presets */}
        <div className="flex gap-1.5 mb-4">
          {(Object.keys(SCENARIO_PROFILES) as Array<keyof typeof SCENARIO_PROFILES>).map((key) => (
            <button
              key={key}
              onClick={() => handlePreset(key, applyScenario(key, inputs))}
              className={[
                'flex-1 rounded-md px-2 py-1 text-[10px] font-medium uppercase tracking-wider transition-colors',
                activeScenario === key
                  ? 'bg-accent-green/20 text-accent-green border border-accent-green/40'
                  : 'bg-muted text-muted-foreground border border-transparent hover:bg-muted/80',
              ].join(' ')}
            >
              {key}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <NumberInput
            label="Monthly Price"
            prefix="$"
            value={inputs.monthlyPrice}
            onChange={(v) => handleChange('monthlyPrice', v)}
            min={1}
            max={10000}
            tooltip="The monthly subscription price for your premium paid tier."
          />

          <NumberInput
            label="Free Member CPA"
            prefix="$"
            value={inputs.cac}
            onChange={(v) => handleChange('cac', v)}
            min={0.5}
            max={100}
            step={0.5}
            tooltip="Cost per acquisition to get one person to join your free community. Typically $2-5 for Skool free groups."
          />

          <NumberInput
            label="Free → Paid Conversion"
            suffix="%"
            value={Math.round(inputs.conversionRate * 100)}
            onChange={(v) => handleChange('conversionRate', v / 100)}
            min={1}
            max={50}
            tooltip="Percentage of free members who upgrade to your paid tier each month. 3-5% is good, 5-8% is great."
          />

          {/* Effective Premium CAC derived metric */}
          <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
            <span className="text-xs text-muted-foreground">Effective Premium CAC</span>
            <span className="text-sm font-mono font-medium text-accent-yellow">
              {formatCurrency(effectiveCAC)}
            </span>
          </div>

          <NumberInput
            label="Churn Rate"
            suffix="%"
            value={Math.round(inputs.churnRate * 100)}
            onChange={(v) => handleChange('churnRate', v / 100)}
            min={1}
            max={100}
            tooltip="The percentage of premium paying members who cancel each month. 10% means 1 in 10 members leave monthly."
          />

          <NumberInput
            label="Initial Budget"
            prefix="$"
            value={inputs.initialBudget}
            onChange={(v) => handleChange('initialBudget', v)}
            min={0}
            max={1000000}
            step={100}
            tooltip="Your ad spend budget for month 1. After that, ad spend is calculated from revenue and your reinvestment %."
          />

          <Separator className="my-2" />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Reinvestment
              </Label>
              <Badge variant="outline" className="text-xs font-mono">
                {Math.round(inputs.reinvestmentPct * 100)}%
              </Badge>
            </div>
            <Slider
              value={[inputs.reinvestmentPct * 100]}
              onValueChange={([v]) => handleChange('reinvestmentPct', v / 100)}
              min={0}
              max={100}
              step={1}
            />
            <div className="flex justify-between text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              <span>Profit</span>
              <span>Growth</span>
            </div>
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full gap-2"
        onClick={handleShare}
      >
        <Share2 className="size-4" />
        {copied ? 'Link Copied!' : 'Share Calculator'}
      </Button>

      <div className="bg-card rounded-xl border p-4">
        <p className="text-xs leading-relaxed text-muted-foreground">
          This calculator models a <strong className="text-foreground">freemium funnel</strong> where you drive
          paid traffic to a free Skool community, then convert a percentage of free members to your premium
          paid tier each month.
        </p>
        <a
          href="/tools/skool-ads-calculator"
          className="mt-3 flex items-center gap-1.5 text-xs font-medium text-accent-purple hover:underline"
        >
          Charging from day one? Try the Premium Calculator
          <ArrowRight className="size-3" />
        </a>
      </div>
    </div>
  );
}
