import { Card } from '@/components/ui/card';

interface ResourceCardProps {
    image: string;
    iconLetter: string;
    iconColor: string;
    title: string;
    description: string;
    price: string;
}

export function ResourceCard({
    image,
    iconLetter,
    iconColor,
    title,
    description,
    price
}: ResourceCardProps) {
    return (
        <Card
            className="rounded-card bg-card border-none overflow-hidden cursor-pointer group hover:-translate-y-1 hover:bg-white/[0.03] transition-all duration-200"
        >
            <div className="aspect-[16/10] overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
            </div>
            <div className="p-3">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-5 h-5 rounded bg-elevated flex items-center justify-center">
                        <span className={`${iconColor} text-[10px] font-bold`}>{iconLetter}</span>
                    </div>
                    <h3 className="text-sm font-medium text-foreground">{title}</h3>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">{description}</p>
                    <span className="text-xs text-muted-foreground">{price}</span>
                </div>
            </div>
        </Card>
    );
}
