import React from 'react';
import Header from './Header';
import Hero from './Hero';
import CurrencyConverter from './CurrencyConverter';
import Services from './Services';
import TrustSection from './TrustSection';
import Contact from './Contact';
import Footer from './Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
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
