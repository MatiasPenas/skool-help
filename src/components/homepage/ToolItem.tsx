import { Button } from '@/components/ui/button';

interface ToolItemProps {
    icon: React.ReactNode;
    name: string;
    description: string;
    href?: string;
    buttonText?: string;
}

const Wrapper = ({ href, children }: { href?: string; children: React.ReactNode }) =>
    href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="block">
            {children}
        </a>
    ) : (
        <>{children}</>
    );

export function ToolItem({ icon, name, description, href, buttonText = "GET" }: ToolItemProps) {
    return (
        <Wrapper href={href}>
            <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-border cursor-pointer group hover:bg-white/10 transition-colors duration-200">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center overflow-hidden">
                        {icon}
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-foreground">{name}</h3>
                        <p className="text-xs text-muted-foreground">{description}</p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-white/10 active:scale-95 transition-all duration-200"
                    asChild={false}
                >
                    {buttonText}
                </Button>
            </div>
        </Wrapper>
    );
}
