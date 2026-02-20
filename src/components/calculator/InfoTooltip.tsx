import { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';

export function InfoTooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!show) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setShow(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [show]);

  return (
    <div className="relative inline-flex" ref={ref}>
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <Info className="size-3.5" />
      </button>
      {show && (
        <div className="absolute left-0 top-6 z-50 w-56 rounded-lg border border-border bg-popover px-3 py-2 text-xs leading-relaxed text-popover-foreground shadow-xl">
          {text}
        </div>
      )}
    </div>
  );
}
