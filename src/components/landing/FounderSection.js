import "@fortawesome/fontawesome-free/css/all.min.css";
export default function FounderSection() {
    return (
      <section
        id="founder"
        className="py-20 bg-gradient-to-b from-background via-[#1F1F1F] to-background text-secondary"
      >
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center">
  
          {/* Imagen del Fundador */}
          <div className="md:w-1/3 mb-8 md:mb-0">
            <div className="w-64 h-64 rounded-full overflow-hidden shadow-lg mx-auto">
              <img
                src="/yo.png"
                alt="Founder"
                className="w-full h-full object-cover bg-gradient-to-b from-primary to-primaryHover"
              />
            </div>
          </div>
  
          {/* Texto del Fundador */}
          <div className="md:w-2/3 text-center md:text-left">
            <h2 className="text-3xl font-bold mb-4">
              Meet the Founder
            </h2>
            <h3 className="text-xl font-semibold text-primary mb-2">
              David Zapata
            </h3>
            <p className="text-textSecondary text-sm italic mb-6">
              Founder & CEO, OCIA Network
            </p>
            <p className="text-lg text-textSecondary leading-relaxed mb-6">
              "At OCIA Network, we believe in harnessing the power of blockchain 
              to simplify and revolutionize on-chain interactions. With a focus 
              on innovation and security, we aim to empower developers and 
              businesses to achieve more with less complexity."
            </p>
  
            {/* Iconos de Redes Sociales */}
            <div className="flex space-x-4 justify-center md:justify-start">
              <a
                href="https://www.linkedin.com/in/davidzapatao/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:text-primary transition-all text-2xl"
              >
                <i className="fab fa-linkedin"></i>
              </a>
              <a
                href="https://x.com/DavidZapataOh"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:text-primary transition-all text-2xl"
              >
                <i className="fab fa-x-twitter"></i>
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }
  