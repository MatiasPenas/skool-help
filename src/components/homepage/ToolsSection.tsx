import { motion } from 'framer-motion';
import { SectionHeader } from './SectionHeader';
import { ToolItem } from './ToolItem';

interface ToolsSectionProps {
    id?: string;
    title: string;
    linkText?: string;
    href?: string;
    showLink?: boolean;
    tooltip?: string;
    tools: any[];
}

export function ToolsSection({
    id,
    title,
    linkText = "All Tools",
    href = "#",
    showLink = true,
    tooltip,
    tools
}: ToolsSectionProps) {
    return (
        <motion.section
            id={id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="py-8"
        >
            <SectionHeader title={title} linkText={showLink ? linkText : undefined} href={href} tooltip={tooltip} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tools.map((tool: any, index: number) => (
                    <motion.div
                        key={tool.name}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                        <ToolItem
                            name={tool.name}
                            description={tool.description}
                            href={tool.href}
                            buttonText={tool.buttonText ?? (tool.href ? "JOIN" : undefined)}
                            icon={
                                tool.image
                                    ? <img src={tool.image} alt={tool.name} className="w-8 h-8 rounded-full object-cover group-hover:scale-110 transition-transform duration-300 ease-out" />
                                    : <div className={`w-5 h-5 bg-accent-${tool.color} ${tool.shape || 'rounded-sm'}`} />
                            }
                        />
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}
