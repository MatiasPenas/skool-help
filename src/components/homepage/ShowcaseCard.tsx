import { Card } from '@/components/ui/card';

interface ShowcaseCardProps {
    category: string;
    title: string;
    thumbnail: string;
    href?: string;
}

export function ShowcaseCard({ category, title, thumbnail, href }: ShowcaseCardProps) {
    const inner = (
        <Card className="flex flex-row items-center justify-between gap-6 p-6 rounded-card bg-card border-border border cursor-pointer group hover:bg-white/5 transition-colors duration-200">
            <div className="flex-1 flex flex-col justify-center min-h-[96px] md:min-h-[128px] text-center md:text-left">
                <span className="text-xs text-muted-foreground uppercase tracking-wider leading-none">{category}</span>
                <h3 className="text-lg md:text-xl font-bold text-foreground mt-2 group-hover:text-white transition-colors leading-tight max-w-[280px] mx-auto md:mx-0">{title}</h3>
            </div>
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden flex-shrink-0">
                <img src={thumbnail} alt={title} className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500" />
            </div>
        </Card>
    );

    if (href) {
        const isExternal = href.startsWith('http');
        return <a href={href} className="block" {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{inner}</a>;
    }
    return inner;
}
