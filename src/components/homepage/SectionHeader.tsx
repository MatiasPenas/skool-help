import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Info } from 'lucide-react';

interface SectionHeaderProps {
    title: string;
    linkText?: string;
    href?: string;
    tooltip?: string;
}

export function SectionHeader({ title, linkText, href = "#", tooltip }: SectionHeaderProps) {
    const [showTooltip, setShowTooltip] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!showTooltip) return;
        const handler = (e: MouseEvent) => {
            if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
                setShowTooltip(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [showTooltip]);

    return (
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-foreground">{title}</h2>
                {tooltip && (
                    <div className="relative" ref={tooltipRef}>
                        <button
                            type="button"
                            onClick={() => setShowTooltip(!showTooltip)}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <Info className="size-3.5" />
                        </button>
                        {showTooltip && (
                            <div className="absolute left-0 top-6 z-50 w-64 rounded-lg border border-border bg-popover px-3 py-2 text-xs leading-relaxed text-popover-foreground shadow-xl">
                                {tooltip}
                            </div>
                        )}
                    </div>
                )}
            </div>
            {linkText && (
                <motion.a
                    href={href}
                    className="group flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                    whileHover={{ x: 2 }}
                >
                    {linkText}
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.a>
            )}
        </div>
    );
}
