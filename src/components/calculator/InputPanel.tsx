import React, { useState } from 'react';
import type { CalculatorInputs } from '@/lib/calculator-engine';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Share2, Info, ChevronDown, ChevronUp } from 'lucide-react';

interface InputPanelProps {
  inputs: CalculatorInputs;
  onChange: <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => void;
}

function NumberInput({
  label,
  prefix,
  suffix,
  value,
  onChange,
  min,
  max,
  step = 1,
  tooltip,
}: {
  label: string;
  prefix?: string;
  suffix?: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  tooltip?: string;
}) {
  const [localValue, setLocalValue] = useState(String(value));

  const handleBlur = () => {
    let num = parseFloat(localValue);
    if (isNaN(num)) num = min;
    num = Math.max(min, Math.min(max, num));
    setLocalValue(String(num));
    onChange(num);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setLocalValue(raw);
    const num = parseFloat(raw);
    if (!isNaN(num)) {
      onChange(Math.max(min, Math.min(max, num)));
    }
  };

  // Sync when parent value changes (e.g. from URL)
  React.useEffect(() => {
    setLocalValue(String(value));
  }, [value]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </Label>
        {tooltip && (
          <span className="text-muted-foreground" title={tooltip}>
            <Info className="size-3.5" />
          </span>
        )}
      </div>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {prefix}
          </span>
        )}
        <Input
          type="number"
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          min={min}
          max={max}
          step={step}
          className={prefix ? 'pl-7' : suffix ? 'pr-7' : ''}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

export function InputPanel({ inputs, onChange }: InputPanelProps) {
  const [showAbout, setShowAbout] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl border p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold">Ads Calculator</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Premium Skool Community</p>
          </div>
          <Badge className="bg-accent-purple text-white border-accent-purple">Premium</Badge>
        </div>

        <div className="space-y-4">
          <NumberInput
            label="Monthly Price"
            prefix="$"
            value={inputs.monthlyPrice}
            onChange={(v) => onChange('monthlyPrice', v)}
            min={1}
            max={10000}
            tooltip="Monthly subscription price per member"
          />

          <NumberInput
            label="CAC (Acquisition Cost)"
            prefix="$"
            value={inputs.cac}
            onChange={(v) => onChange('cac', v)}
            min={1}
            max={50000}
            tooltip="Cost to acquire one new member through ads"
          />

          <NumberInput
            label="Churn Rate"
            suffix="%"
            value={Math.round(inputs.churnRate * 100)}
            onChange={(v) => onChange('churnRate', v / 100)}
            min={1}
            max={100}
            tooltip="Percentage of members who cancel each month"
          />

          <NumberInput
            label="Initial Budget"
            prefix="$"
            value={inputs.initialBudget}
            onChange={(v) => onChange('initialBudget', v)}
            min={0}
            max={1000000}
            step={100}
            tooltip="First month's ad spend budget"
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
              onValueChange={([v]) => onChange('reinvestmentPct', v / 100)}
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
        <button
          onClick={() => setShowAbout(!showAbout)}
          className="flex w-full items-center justify-between text-sm font-medium"
        >
          About
          {showAbout ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </button>
        {showAbout && (
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            This interactive calculator simulates the financial trajectory of a premium Skool
            community using paid ads for member acquisition. Adjust inputs to visualize unit
            economics, growth compounding, and retention cohorts over 12 months.
          </p>
        )}
      </div>
    </div>
  );
}
