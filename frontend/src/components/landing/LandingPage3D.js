import React, { useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import Header3D from './Header3D';
import { HeroSection3D } from './HeroSection3D';
import { ServicesSection3D } from './ServicesSection3D';
import { PartnersSection3D } from './PartnersSection3D';
import { TrustSection3D } from './TrustSection3D';
import { PaymentsSection3D } from './PaymentsSection3D';
import Footer3D from './Footer3D';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LandingPage3D = () => {
  const { isDark } = useTheme();

  useEffect(() => {
    // Setup scroll triggers for sections
    const sections = document.querySelectorAll('section');
    
    sections.forEach((section, index) => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleClass: 'visible',
        once: true
      });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className={`min-h-screen overflow-x-hidden transition-colors duration-300 ${
      isDark 
        ? 'bg-slate-900 text-white' 
        : 'bg-slate-50 text-slate-900'
    }`}>
      <Header3D />
      <main>
        <HeroSection3D />
        <ServicesSection3D />
        <PartnersSection3D />
        <TrustSection3D />
        <PaymentsSection3D />
      </main>
      <Footer3D />
    </div>
  );
};

export default LandingPage3D;
