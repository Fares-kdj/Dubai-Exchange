import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { PARTNERS, ASSETS } from '@/config/assets';

const PartnerCard = ({ partner, index, isArabic }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="group"
      data-testid={`partner-${partner.id}`}
    >
      <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-32 flex items-center justify-center overflow-hidden transition-all duration-500 hover:bg-white/10 hover:border-[#D4AF37]/30 hover:shadow-xl hover:shadow-[#D4AF37]/10">
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Partner Logo */}
        <img
          src={partner.logo}
          alt={isArabic ? partner.nameAr : partner.nameEn}
          className="max-h-16 max-w-full object-contain filter brightness-90 group-hover:brightness-110 transition-all duration-300"
        />
      </div>
      
      {/* Partner Name (appears on hover) */}
      <motion.p 
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="text-center text-sm text-slate-400 mt-2 group-hover:text-[#FCD34D] transition-colors"
      >
        {isArabic ? partner.nameAr : partner.nameEn}
      </motion.p>
    </motion.div>
  );
};

export const PartnersSection3D = () => {
  const { currentLanguage } = useLanguage();
  const isArabic = currentLanguage === 'ar';
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-gradient-to-b from-slate-900 to-slate-800 overflow-hidden"
      id="partners"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(212,175,55,0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-2 mb-6 bg-white/10 border border-white/20 rounded-full text-white text-sm font-medium"
          >
            {isArabic ? 'شركاؤنا' : 'Our Partners'}
          </motion.span>
          
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">
            {isArabic ? 'شبكة شركاء موثوقة' : 'Trusted Partner Network'}
          </h2>
          
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            {isArabic 
              ? 'نتعاون مع أفضل المؤسسات المالية لتقديم خدمات متميزة'
              : 'We collaborate with the best financial institutions to deliver excellent services'
            }
          </p>
        </motion.div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {PARTNERS.map((partner, index) => (
            <PartnerCard 
              key={partner.id} 
              partner={partner} 
              index={index}
              isArabic={isArabic}
            />
          ))}
        </div>

        {/* Marquee Effect for Partners */}
        <div className="mt-16 overflow-hidden">
          <motion.div
            animate={{ x: isArabic ? [0, 200] : [-200, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="flex gap-12 items-center justify-center opacity-30"
          >
            {[...PARTNERS, ...PARTNERS].map((partner, index) => (
              <img
                key={`marquee-${index}`}
                src={partner.logo}
                alt=""
                className="h-8 grayscale"
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection3D;
