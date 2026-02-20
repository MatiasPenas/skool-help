interface EmailTemplateCardProps {
    image: string;
    title: string;
    subtitle: string;
    price?: string;
    bgColor?: string;
    iconText?: string;
    icon?: string;
    avatar?: string;
    href?: string;
}

export function EmailTemplateCard({
    image,
    title,
    subtitle,
    price,
    bgColor = "bg-card",
    iconText,
    icon,
    avatar,
    href,
}: EmailTemplateCardProps) {
    const isExternal = href?.startsWith('http');
    const Wrapper = ({ children }: { children: React.ReactNode }) =>
        href ? <a href={href} className="block" {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{children}</a> : <>{children}</>;

    return (
    <Wrapper>
        <div className="rounded-card overflow-hidden cursor-pointer group border border-border hover:bg-white/5 transition-colors duration-200">
            <div className="aspect-[4/3] overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                />
            </div>
            <div className="px-4 py-3 flex items-center gap-3 bg-card group-hover:bg-white/5 transition-colors duration-200">
                {avatar
                    ? <img src={avatar} alt={title} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                    : <div className={`w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center flex-shrink-0`}>
                        {icon
                            ? <img src={icon} alt="" className="w-5 h-5 invert opacity-90" />
                            : <span className="text-white text-sm font-bold leading-none">{iconText}</span>
                        }
                    </div>
                }
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                    <p className="text-xs text-muted-foreground">{subtitle}</p>
                </div>
            </div>
        </div>
    </Wrapper>
    );
}
