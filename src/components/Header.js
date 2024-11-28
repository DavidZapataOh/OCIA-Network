export default function Header() {
    return (
        <header className="fixed w-full bg-background z-50 shadow-subtle p-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <img src="/Logo_texto.png" alt="OCIA Logo" className="h-16" />
                <nav className="hidden md:flex space-x-6">
                    <a href="#features" className="hover:text-primary">Features</a>
                    <a href="#about" className="hover:text-primary">About Us</a>
                    <a href="#testimonials" className="hover:text-primary">Testimonials</a>
                    <a href="#faq" className="hover:text-primary">FAQ</a>
                </nav>
                <button className="bg-primary px-6 py-2 rounded hover:bg-primaryHover">
                    Access Now
                </button>
            </div>
        </header>
    );
}