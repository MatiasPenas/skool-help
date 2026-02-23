import { useState } from 'react';
import { Copy, Check, MessageSquare, ChevronLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import messagesData from '@/data/welcome-messages.json';

interface WelcomeMessage {
  id: string;
  category: string;
  length: string;
  message: string;
}

const MESSAGES: WelcomeMessage[] = messagesData;

const CATEGORIES = ['All', 'Start a Conversation', 'Drive to a Link', 'Drive Referrals', 'Offer Upgrade'];
const LENGTHS = ['All', 'Short', 'Medium', 'Long'];

const CATEGORY_COLORS: Record<string, string> = {
  'Start a Conversation': 'bg-accent-blue/15 text-accent-blue',
  'Drive to a Link': 'bg-accent-green/15 text-accent-green',
  'Drive Referrals': 'bg-accent-orange/15 text-accent-orange',
  'Offer Upgrade': 'bg-accent-purple/15 text-accent-purple',
};

const LENGTH_COLORS: Record<string, string> = {
  Short: 'bg-secondary/80 text-muted-foreground',
  Medium: 'bg-secondary/80 text-muted-foreground',
  Long: 'bg-secondary/80 text-muted-foreground',
};

// Highlights #PLACEHOLDERS# and [PLACEHOLDERS]
function highlightPlaceholders(text: string) {
  const parts = text.split(/(#[^#\n]+#|\[[^\]\n]+\])/g);
  return parts.map((part, i) => {
    if (/^#[^#]+#$/.test(part) || /^\[[^\]]+\]$/.test(part)) {
      return (
        <mark
          key={i}
          className="bg-amber-100 text-amber-700 rounded px-0.5 not-italic font-normal"
        >
          {part}
        </mark>
      );
    }
    return part;
  });
}

function CopyButton({ text, category, length }: { text: string; category: string; length: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    window.posthog?.capture('swipe_file_copied', {
      swipe_file_type: 'dm_template',
      template_category: category,
      template_length: length,
      text_length: text.length,
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-accent-green" />
          Copied
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          Copy
        </>
      )}
    </Button>
  );
}

function MessageCard({ msg }: { msg: WelcomeMessage }) {
  return (
    <Card className="border-border/50 bg-card overflow-hidden py-0 gap-0 flex flex-col">
      {/* Badges */}
      <div className="flex items-center gap-2 px-5 pt-4 pb-3 border-b border-border/50">
        <span
          className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[msg.category] ?? 'bg-secondary text-secondary-foreground'}`}
        >
          {msg.category}
        </span>
        <span
          className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full ${LENGTH_COLORS[msg.length]}`}
        >
          {msg.length}
        </span>
      </div>

      {/* Message body, Skool DM style */}
      <div className="px-5 py-4 flex-1 bg-white">
        <div className="bg-white rounded-xl border border-gray-200 px-4 pt-3 pb-4 shadow-sm">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-sm font-semibold text-gray-900">Community Owner</span>
            <span className="text-xs text-gray-400 ml-4 shrink-0">Just now</span>
          </div>
          <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
            {highlightPlaceholders(msg.message)}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-border/50 flex justify-end">
        <CopyButton text={msg.message} category={msg.category} length={msg.length} />
      </div>
    </Card>
  );
}

function FilterPills({
  options,
  active,
  onChange,
  counts,
}: {
  options: string[];
  active: string;
  onChange: (v: string) => void;
  counts?: Record<string, number>;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${active === opt
              ? 'bg-foreground text-background border-foreground'
              : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/40'
            }`}
        >
          {opt}
          {counts && opt !== 'All' && (
            <span className="ml-1 opacity-60">({counts[opt] ?? 0})</span>
          )}
        </button>
      ))}
    </div>
  );
}

export default function WelcomeMessageExamples() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeLength, setActiveLength] = useState('All');

  const filtered = MESSAGES.filter((m) => {
    const catMatch = activeCategory === 'All' || m.category === activeCategory;
    const lenMatch = activeLength === 'All' || m.length === activeLength;
    return catMatch && lenMatch;
  });

  const categoryCounts = Object.fromEntries(
    CATEGORIES.slice(1).map((c) => [c, MESSAGES.filter((m) => m.category === c).length])
  );

  const lengthCounts = Object.fromEntries(
    LENGTHS.slice(1).map((l) => [
      l,
      MESSAGES.filter(
        (m) =>
          (activeCategory === 'All' || m.category === activeCategory) && m.length === l
      ).length,
    ])
  );

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <a
          href="/tools"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Tools
        </a>
      </div>

      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-accent-purple/15 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-accent-purple" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Auto DM</h1>
            <p className="text-sm text-muted-foreground">
              Copy-paste DM templates for when new members join your community
            </p>
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div className="mb-3">
        <FilterPills
          options={CATEGORIES}
          active={activeCategory}
          onChange={(v) => {
            setActiveCategory(v);
            setActiveLength('All');
            if (v !== 'All') {
              window.posthog?.capture('dm_template_filter_changed', { filter_type: 'category', filter_value: v });
            }
          }}
          counts={categoryCounts}
        />
      </div>

      {/* Length filter */}
      <div className="mb-6">
        <FilterPills
          options={LENGTHS}
          active={activeLength}
          onChange={(v) => {
            setActiveLength(v);
            if (v !== 'All') {
              window.posthog?.capture('dm_template_filter_changed', { filter_type: 'length', filter_value: v, active_category: activeCategory });
            }
          }}
          counts={lengthCounts}
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((msg) => (
          <MessageCard key={msg.id} msg={msg} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground text-sm py-12">
          No templates match the selected filters.
        </p>
      )}
    </div>
  );
}
