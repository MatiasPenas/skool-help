import { useState } from 'react';
import { ChevronLeft, Copy, Check, Megaphone, Heart, Facebook, Instagram } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import adsData from '@/data/meta-ads-examples.json';

interface AdExample {
  advertiserName: string;
  advertiserAvatar: string;
  platform: 'facebook' | 'instagram';
  primaryText: string;
  creativeUrl: string;
  creativeAlt: string;
  destinationUrl: string;
  likes: number;
}

const ADS: AdExample[] = adsData as AdExample[];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
    >
      {copied ? (
        <>
          <Check className="w-3 h-3 text-accent-green" />
          Copied
        </>
      ) : (
        <>
          <Copy className="w-3 h-3" />
          Copy
        </>
      )}
    </Button>
  );
}

function AdCard({ ad }: { ad: AdExample }) {
  const [expanded, setExpanded] = useState(false);
  const shouldTruncate = ad.primaryText.length > 150;
  const displayText = !expanded && shouldTruncate
    ? ad.primaryText.slice(0, 150).trimEnd() + '...'
    : ad.primaryText;

  const PlatformIcon = ad.platform === 'instagram' ? Instagram : Facebook;

  return (
    <Card className="border-border/50 bg-card overflow-hidden py-0 gap-0">
      {/* Advertiser header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <img
          src={ad.advertiserAvatar}
          alt={ad.advertiserName}
          className="w-9 h-9 rounded-full object-cover flex-shrink-0"
        />
        <span className="text-sm font-semibold text-foreground">
          {ad.advertiserName}
        </span>
      </div>

      {/* Primary text */}
      <div className="px-4 pb-3">
        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
          {displayText}
        </p>
        {shouldTruncate && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-muted-foreground hover:text-foreground mt-1 transition-colors"
          >
            {expanded ? 'Show less' : 'Read More'}
          </button>
        )}
      </div>

      {/* Creative image */}
      <div className="w-full">
        <img
          src={ad.creativeUrl}
          alt={ad.creativeAlt}
          className="w-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Heart className="w-4 h-4" />
            <span className="text-xs">{ad.likes}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <PlatformIcon className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              {ad.destinationUrl}
            </span>
          </div>
        </div>
        <CopyButton text={ad.primaryText} />
      </div>
    </Card>
  );
}

export default function MetaAdsExamples() {
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
          <div className="w-10 h-10 rounded-lg bg-accent-blue/15 flex items-center justify-center">
            <Megaphone className="w-5 h-5 text-accent-blue" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Meta Ads
            </h1>
            <p className="text-sm text-muted-foreground">
              Real examples of Meta ads used to grow Skool communities
            </p>
          </div>
        </div>
      </div>

      {/* Masonry grid - split into 3 columns */}
      <div className="flex gap-6">
        {[0, 1, 2].map((colIndex) => (
          <div key={colIndex} className="flex-1 min-w-0 flex flex-col gap-6">
            {ADS.filter((_, i) => i % 3 === colIndex).map((ad) => (
              <AdCard key={ad.advertiserName} ad={ad} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
