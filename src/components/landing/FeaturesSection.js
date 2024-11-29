import { motion } from 'framer-motion';

export default function FeaturesSection() {
    const features = [
        {
            title: "On-Chain Automation",
            description:
            "Execute fast and secure transactions without lifting a finger. Our AI handles the heavy lifting, so you can focus on what matters.",
            icon: "⚡",
        },
        {
            title: "Smart Decision Making",
            description:
            "Leverage cutting-edge AI that learns from your objectives and optimizes your blockchain operations intelligently.",
            icon: "🧠",
        },
        {
            title: "Secure Management",
            description:
            "Your wallet, your rules. We prioritize security to ensure your assets remain protected at all times.",
            icon: "🔒",
        },
        {
            title: "Cross-Chain Compatibility",
            description:
            "Seamlessly interact with multiple chains, ensuring maximum flexibility for your projects and goals.",
            icon: "🔗",
        },
    ];
  
    return (
        <section
            id="features"
            className="py-20 bg-gradient-to-r from-background via-[#1F1F1F] to-background relative overflow-hidden"
        >
            <div className="absolute inset-0 opacity-10">
                <div className="w-96 h-96 bg-gradient-to-tr from-primary via-primaryHover to-secondary rounded-full blur-3xl absolute top-10 left-20"></div>
                <div className="w-96 h-96 bg-gradient-to-br from-primaryHover via-primary to-secondary rounded-full blur-3xl absolute bottom-10 right-20"></div>
            </div>
    
            <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                <h2 className="text-4xl font-bold text-secondary mb-4">
                    Why Choose <span className="text-primary">OCIA Network?</span>
                </h2>
                <p className="text-lg text-textSecondary mb-12">
                    Discover the powerful features that make OCIA your go-to solution for
                    blockchain automation and optimization.
                </p>
        
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, idx) => (
                    <motion.div
                        key={idx}
                        className="bg-elementBackground p-8 rounded-xl shadow-lg transform transition-transform hover:scale-105"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.2 }}
                    >
                        <div className="text-5xl mb-4 text-primary">{feature.icon}</div>
                        <h3 className="text-xl font-semibold text-secondary mb-2">
                        {feature.title}
                        </h3>
                        <p className="text-textSecondary">{feature.description}</p>
                    </motion.div>
                    ))}
                </div>
    
                <div className="mt-16">
                    <button className="bg-primary text-secondary px-6 py-3 rounded-lg text-lg font-medium hover:bg-primaryHover transition-all">
                        Learn More
                    </button>
                </div>
            </div>
        </section>
    );
}