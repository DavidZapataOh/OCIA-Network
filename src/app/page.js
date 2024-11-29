'use client';

import "swiper/css";
import Header from '../components/landing/Header';
import HeroSection from '../components/landing/HeroSection';
import AboutSection from '../components/landing/AboutSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import FounderSection from '../components/landing/FounderSection';
import FAQ from '../components/landing/FAQ';
import Footer from '../components/landing/Footer';

export default function Home() {
  return (
    <div className="bg-background bg-grid-circles text-secondary font-sans">
      <Header />
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <FounderSection />
      <FAQ />
      <Footer />
    </div>
  );
}