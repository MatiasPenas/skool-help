import { motion } from 'framer-motion';

export function AboutSection() {
    return (
        <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="py-16 text-center"
        >
            <div className="max-w-xl mx-auto">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">About This Site</p>
                <h2 className="text-2xl font-bold tracking-tight mb-4">
                    Everything you need to run a Skool community. Free.
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                    Free tools, swipe files, and guides for Skool community owners. We cover what actually works: ads, pricing, retention, and growth. No paywalls. No lead capture. We earn affiliate commissions when you sign up for tools we recommend.
                </p>
                <a
                    href="https://www.skool.com/?ref=101889e86ce44c2f8edc5db9957fe449"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-[#F0CF80] text-black text-sm font-bold uppercase tracking-wide px-8 py-3 rounded-[4px] hover:bg-[#F0CF80]/90 transition-colors duration-200 shadow-none"
                >
                    Create Your Skool Community
                </a>
                <p className="text-xs text-muted-foreground mt-4">Free 14-day trial. No credit card required.</p>
            </div>
        </motion.section>
    );
}
