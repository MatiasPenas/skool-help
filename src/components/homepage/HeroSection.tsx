import { motion } from 'framer-motion';

export function HeroSection() {
    return (
        <motion.section
            id="hero"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="pt-24 pb-20 text-center"
        >
            <div className="flex items-center justify-center gap-3 mb-4">
                <h1 className="text-5xl font-bold">
                    <span style={{ color: '#263397' }}>S</span>
                    <span style={{ color: '#D3513E' }}>k</span>
                    <span style={{ color: '#E0B467' }}>o</span>
                    <span style={{ color: '#6BB7EE' }}>o</span>
                    <span style={{ color: '#C45946' }}>l</span>
                    <span className="text-foreground">.Help</span>
                </h1>
            </div>
            <p className="text-muted-foreground text-base">Free Tools & Resources for Skool Community Owners</p>
        </motion.section>
    );
}
