export default function Footer() {
    return (
        <footer className="relative bg-gradient-to-r from-[#1F1F1F] via-[#2C2C2C] to-[#1F1F1F] text-textSecondary py-12 overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-10 left-20 w-96 h-96 bg-gradient-to-r from-primary via-primaryHover to-secondary rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-20 w-96 h-96 bg-gradient-to-r from-secondary via-primary to-primaryHover rounded-full blur-3xl"></div>
                <div className="absolute top-1/3 left-0 w-full h-0.5 bg-gradient-to-r from-primary via-transparent to-primaryHover opacity-50"></div>
            </div>
    
            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-gray-600 pb-8">
                    <div>
                        <h3 className="text-secondary text-lg font-semibold mb-4">
                            About OCIA Network
                        </h3>
                        <p className="text-sm">
                            OCIA Network is your gateway to smarter blockchain automation. 
                            Simplify on-chain tasks and optimize operations with cutting-edge AI.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-secondary text-lg font-semibold mb-4">
                            Useful Links
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="#features"
                                    className="hover:text-primary transition-all"
                                >
                                    Features
                                </a>
                            </li>
                            <li>
                                <a href="#about" className="hover:text-primary transition-all">
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="#faq" className="hover:text-primary transition-all">
                                    FAQ
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://github.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary transition-all"
                                >
                                    GitHub
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-secondary text-lg font-semibold mb-4">
                            Connect with Us
                        </h3>
                        <div className="flex space-x-4">
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-secondary hover:text-primary transition-all"
                                >
                                <i className="fab fa-twitter text-xl"></i>
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-secondary hover:text-primary transition-all"
                                >
                                <i className="fab fa-linkedin text-xl"></i>
                            </a>
                            <a
                                href="https://discord.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                    className="text-secondary hover:text-primary transition-all"
                                >
                                <i className="fab fa-discord text-xl"></i>
                            </a>
                        </div>
                        <p className="text-sm mt-4">
                            Email us:{" "}
                                <a
                                href="mailto:support@ocia.network"
                                className="hover:text-primary"
                            >
                                support@ocia.network
                            </a>
                        </p>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-8 text-sm">
                    <p>&copy; {new Date().getFullYear()} OCIA Network. All rights reserved.</p>
                    <div className="flex space-x-4">
                        <a href="#" className="hover:text-primary transition-all">
                            Terms of Service
                        </a>
                        <a href="#" className="hover:text-primary transition-all">
                            Privacy Policy
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
  