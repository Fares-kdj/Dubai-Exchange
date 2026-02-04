import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import Header from './Header';
import Hero from './Hero';
import CurrencyConverter from './CurrencyConverter';
import Services from './Services';
import TrustSection from './TrustSection';
import Contact from './Contact';
import Footer from './Footer';

const HomePage = () => {
  const { isDark } = useTheme();
  
  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'
    }`}>
      <Header />
      <Hero />
      <CurrencyConverter />
      <Services />
      <TrustSection />
      <Contact />
      <Footer />
    </div>
  );
};

export default HomePage;
