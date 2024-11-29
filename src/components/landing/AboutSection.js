export default function AboutSection() {
    return (
        <section id="about" className="py-16 max-w-7xl mx-auto text-center px-6">
            <h2 className="text-3xl font-bold mb-6">What is OCIA Network?</h2>
            <p className="text-lg text-textSecondary mb-8">
                OCIA is an intelligent agent designed to simplify and optimize blockchain operations. With advanced AI, OCIA enables automated transactions and smart decision-making for developers, businesses, and individuals.
            </p>
            <div className="relative flex justify-center">
                <div className="w-80 h-80 bg-gradient-to-r from-primary to-accent rounded-full shadow-lg"></div>
            </div>
        </section>
    );
}