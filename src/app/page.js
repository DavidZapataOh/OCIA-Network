'use client';

import Image from 'next/image'
import { motion } from "framer-motion";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import FeaturesSection from '../components/FeaturesSection';
import FounderSection from '../components/FounderSection';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

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