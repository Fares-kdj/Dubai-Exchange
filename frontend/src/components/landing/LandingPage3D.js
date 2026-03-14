import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import Header3D from './Header3D';
import { HeroSection3D } from './HeroSection3D';
import { GlobalSection } from './GlobalSection';
import { ServicesSection3D } from './ServicesSection3D';

// Lazy load sections below the fold
const CurrencyConverterSection = React.lazy(() => import('./CurrencyConverterSection').then(m => ({ default: m.CurrencyConverterSection })));
const DevicesSection = React.lazy(() => import('./DevicesSection').then(m => ({ default: m.DevicesSection })));
const PartnersSection3D = React.lazy(() => import('./PartnersSection3D').then(m => ({ default: m.PartnersSection3D })));
const TrustSection3D = React.lazy(() => import('./TrustSection3D').then(m => ({ default: m.TrustSection3D })));
const PaymentsSection3D = React.lazy(() => import('./PaymentsSection3D').then(m => ({ default: m.PaymentsSection3D })));
const ContactSection = React.lazy(() => import('./ContactSection').then(m => ({ default: m.ContactSection })));
const Footer3D = React.lazy(() => import('./Footer3D'));
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LandingPage3D = () => {
  const { isDark } = useTheme();
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    }
  }, [location.hash]);

  useEffect(() => {
    // Note: Individual sections (HeroSection3D, ServicesSection3D, etc.) 
    // already handle their own 'in-view' animations using framer-motion's useInView
    // which is more performant than global ScrollTrigger class injections.
    
    // Refresh ScrollTrigger as a courtesy for lazy-loaded content
    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className={`min-h-screen overflow-x-hidden transition-colors duration-300 ${isDark
      ? 'bg-slate-900 text-white'
      : 'bg-slate-50 text-slate-900'
      }`}>
      <Header3D />
      <main>
        {/* Hero - With CBI Building Background */}
        <HeroSection3D />

        {/* Global - International Transfers */}
        <GlobalSection />

        {/* Services - Service Cards */}
        <ServicesSection3D />

        <React.Suspense fallback={<div className="h-20" />}>
          {/* Currency Converter */}
          <CurrencyConverterSection />

          {/* Devices - Phone, iPad, Computer */}
          <DevicesSection />

          {/* Partners - Partner Logos */}
          <PartnersSection3D />

          {/* Trust (CBI) */}
          <TrustSection3D />

          {/* Payments - Card & USDT */}
          <PaymentsSection3D />

          {/* Contact */}
          <ContactSection />
        </React.Suspense>
      </main>
      <React.Suspense fallback={<div className="h-20" />}>
        <Footer3D />
      </React.Suspense>
    </div>
  );
};

export default LandingPage3D;
