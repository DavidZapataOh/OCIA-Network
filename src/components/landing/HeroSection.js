import { motion } from 'framer-motion';

export default function HeroSection() {
    return (
        <section className="min-h-screen flex items-center justify-center text-center px-6">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="space-y-6"
                >
                <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                    Take Blockchain Intelligence <br />
                    <span className="text-primary">to the Next Level</span>
                </h1>
                <p className="text-lg md:text-xl text-textSecondary">
                    Automate tasks, optimize transactions, and maximize your results with OCIA Network.
                </p>
                <button className="mt-6 bg-primary text-secondary px-8 py-3 rounded-lg text-lg font-medium hover:bg-primaryHover transition-all">
                    Explore Now
                </button>
            </motion.div>
        </section>
    );
  }