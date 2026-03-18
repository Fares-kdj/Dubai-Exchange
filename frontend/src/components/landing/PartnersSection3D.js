import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { PARTNERS } from '@/config/assets';

export const PartnersSection3D = () => {
  const { currentLanguage } = useLanguage();
  const { isDark } = useTheme();
  const isArabic = currentLanguage === 'ar';
  const isKurdish = currentLanguage === 'ku';
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const text = {
    ar: {
      badge: 'شركاؤنا',
      title: 'شبكة شركاء موثوقة',
      subtitle: 'نتعاون مع أفضل المؤسسات المالية لتقديم خدمات متميزة'
    },
    en: {
      badge: 'Our Partners',
      title: 'Trusted Partner Network',
      subtitle: 'We collaborate with the best financial institutions to deliver excellent services'
    },
    ku: {
      badge: 'هاوبەشەکانمان',
      title: 'تۆڕی هاوبەشی متمانەپێکراو',
      subtitle: 'هاوکاری لەگەڵ باشترین دامەزراوە دارایییەکان دەکەین بۆ پێشکەشکردنی خزمەتگوزارییە باشەکان'
    }
  };

  const t = text[currentLanguage] || text.ar;

  return (
    <section 
      ref={sectionRef}
      className={`relative py-24 md:py-32 overflow-hidden transition-colors duration-500 ${
        isDark 
          ? 'bg-gradient-to-b from-slate-900 to-slate-800'
          : 'bg-gradient-to-b from-slate-50 via-slate-100 to-slate-50'
      }`}
      id="partners"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, ${isDark ? 'rgba(212,175,55,0.15)' : 'rgba(212,175,55,0.1)'} 1px, transparent 0)`,
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
            className={`inline-block px-4 py-2 mb-6 rounded-full text-sm font-medium ${
              isDark 
                ? 'bg-white/10 border border-white/20 text-white'
                : 'bg-slate-900/10 border border-slate-900/20 text-slate-900'
            }`}
          >
            {t.badge}
          </motion.span>
          
          <h2 className={`text-3xl sm:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {t.title}
          </h2>
          
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {t.subtitle}
          </p>
        </motion.div>

        {/* Partners Grid - Professional Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          {PARTNERS.map((partner, index) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -8 }}
              className="group"
              data-testid={`partner-${partner.id}`}
            >
              <div className={`relative h-36 rounded-2xl p-6 flex flex-col items-center justify-center overflow-hidden transition-all duration-500 ${
                isDark 
                  ? 'bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-[#D4AF37]/50 shadow-lg hover:shadow-2xl hover:shadow-[#D4AF37]/10'
                  : 'bg-white border border-slate-200 hover:border-[#D4AF37]/50 shadow-md hover:shadow-xl'
              }`}>
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/0 to-[#D4AF37]/0 group-hover:from-[#D4AF37]/10 group-hover:to-transparent transition-all duration-500" />
                
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Partner Logo */}
                <div className="relative z-10 flex items-center justify-center h-full">
                  <img
                    src={partner.logo}
                    alt={isArabic ? partner.nameAr : partner.nameEn}
                    className={`max-h-16 max-w-full object-contain transition-all duration-300 ${
                      isDark 
                        ? 'brightness-90 group-hover:brightness-110' 
                        : 'brightness-100 group-hover:brightness-90'
                    }`}
                  />
                </div>
              </div>
              
              {/* Partner Name */}
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-center text-xs font-medium mt-3 transition-colors ${
                  isDark 
                    ? 'text-slate-400 group-hover:text-[#FCD34D]'
                    : 'text-slate-500 group-hover:text-[#B8860B]'
                }`}
              >
                {isKurdish ? partner.nameKu : isArabic ? partner.nameAr : partner.nameEn}
              </motion.p>
            </motion.div>
          ))}
        </div>

        {/* Infinite Marquee */}
        <div className="overflow-hidden py-8">
          <motion.div
            animate={isInView ? { x: isArabic || isKurdish ? [0, 300] : [-300, 0] } : { x: 0 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex gap-16 items-center"
          >
            {[...PARTNERS, ...PARTNERS, ...PARTNERS].map((partner, index) => (
              <img
                key={`marquee-${index}`}
                src={partner.logo}
                alt=""
                className={`h-10 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-300 ${
                  isDark ? 'brightness-90' : 'brightness-100'
                }`}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection3D;
