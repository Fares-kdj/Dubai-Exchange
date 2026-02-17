import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { ASSETS, COMPANY } from '@/config/assets';
import { Shield, Zap, Globe, MapPin } from 'lucide-react';

export const HeroSection3D = () => {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const { isDark } = useTheme();
  const isArabic = currentLanguage === 'ar';
  const isKurdish = currentLanguage === 'ku';
  const isRTL = isArabic || isKurdish;

  const content = {
    ar: {
      name: COMPANY.nameAr,
      slogan: COMPANY.sloganAr,
      feature1: 'تحويلات لجميع دول العالم',
      feature2: 'حجز الدولار للمسافرين',
      cta1: 'حجز الدولار للمسافرين',
      cta2: 'التحويلات المالية',
      licensed: 'مرخصة رسمياً',
      instant: 'خدمة فورية',
      countries: '+50 دولة',
      cbiTitle: 'مرخصة من البنك المركزي العراقي'
    },
    en: {
      name: COMPANY.nameEn,
      slogan: COMPANY.sloganEn,
      feature1: 'Transfers to All Countries',
      feature2: 'USD Booking for Travelers',
      cta1: 'Book USD for Travelers',
      cta2: 'Money Transfers',
      licensed: 'Licensed',
      instant: 'Instant Service',
      countries: '50+ Countries',
      cbiTitle: 'Licensed by Central Bank of Iraq'
    },
    ku: {
      name: COMPANY.nameKu,
      slogan: COMPANY.sloganKu,
      feature1: 'گواستنەوە بۆ هەموو وڵاتەکان',
      feature2: 'نۆرەکردنی دۆلار بۆ گەشتیاران',
      cta1: 'نۆرەکردنی دۆلار بۆ گەشتیاران',
      cta2: 'گواستنەوەی پارە',
      licensed: 'مۆڵەتپێدراو',
      instant: 'خزمەتگوزاری یەکجار',
      countries: '+٥٠ وڵات',
      cbiTitle: 'مۆڵەتدار لە بانکی ناوەندیی عێراق'
    }
  };

  const t = content[currentLanguage] || content.ar;

  return (
    <section className={`relative min-h-screen overflow-hidden transition-colors duration-500 ${
      isDark 
        ? 'bg-slate-900'
        : 'bg-gradient-to-br from-amber-50 via-white to-yellow-50'
    }`}>
      {/* Background with CBI Building - More Visible */}
      <div className="absolute inset-0 z-0">
        {/* CBI Building Image - More Prominent */}
        <div className="absolute inset-0">
          <img 
            src={ASSETS.cbiBuilding1}
            alt="Central Bank of Iraq"
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              isDark ? 'opacity-40' : 'opacity-30'
            }`}
          />
          {/* Gradient Overlay - Adjusted for better visibility */}
          <div className={`absolute inset-0 ${
            isDark 
              ? 'bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-900/90'
              : 'bg-gradient-to-b from-amber-50/80 via-white/60 to-yellow-50/90'
          }`} />
        </div>

        {/* Golden Decorative Elements for Light Mode */}
        {!isDark && (
          <>
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-amber-200/40 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-yellow-200/30 to-transparent rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-gradient-to-br from-[#D4AF37]/20 to-transparent rounded-full blur-2xl" />
          </>
        )}
      </div>

      {/* Animated Golden Particles */}
      <div className="absolute inset-0 z-5 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 rounded-full ${isDark ? 'bg-[#D4AF37]/60' : 'bg-[#D4AF37]/80'}`}
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full py-24 lg:py-32">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className={isRTL ? 'lg:order-2' : 'lg:order-1'}
          >
            {/* CBI Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`inline-flex items-center gap-3 px-4 py-2 rounded-full mb-6 backdrop-blur-sm ${
                isDark 
                  ? 'bg-green-500/20 border border-green-500/30'
                  : 'bg-green-600/10 border border-green-600/30 shadow-lg shadow-green-500/10'
              }`}
            >
              <img 
                src={ASSETS.cbiLogo}
                alt="CBI"
                className="w-8 h-8 object-contain"
              />
              <span className={`text-sm font-bold ${isDark ? 'text-green-400' : 'text-green-700'}`}>
                {t.cbiTitle}
              </span>
            </motion.div>

            {/* Logo - Using logoBlack for light mode with golden tint */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <img
                src={isDark ? ASSETS.logoWhite : ASSETS.logoBlack}
                alt="Dubai International Exchange"
                className={`h-14 md:h-16 ${!isDark ? 'drop-shadow-lg' : ''}`}
                style={!isDark ? { filter: 'sepia(30%) saturate(150%)' } : {}}
                data-testid="hero-logo"
              />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight ${
                isDark ? 'text-white' : 'text-slate-800'
              }`}
              data-testid="hero-title"
            >
              {t.name}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`text-base md:text-lg mb-6 max-w-xl ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
              data-testid="hero-subtitle"
            >
              {t.slogan}
            </motion.p>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="flex flex-wrap gap-3 mb-8"
            >
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium shadow-lg ${
                isDark 
                  ? 'bg-[#D4AF37]/20 text-[#FCD34D] border border-[#D4AF37]/30'
                  : 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border border-amber-200'
              }`}>
                <Globe className="w-4 h-4" />
                <span>{t.feature1}</span>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium shadow-lg ${
                isDark 
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200'
              }`}>
                <Zap className="w-4 h-4" />
                <span>{t.feature2}</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                onClick={() => navigate('/traveler-booking')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#FCD34D] text-slate-900 font-bold rounded-full shadow-xl shadow-[#D4AF37]/30 hover:shadow-[#D4AF37]/50 transition-all"
                data-testid="cta-booking"
              >
                {t.cta1}
              </motion.button>

              <motion.button
                onClick={() => navigate('/transfers')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 backdrop-blur-sm border-2 font-bold rounded-full transition-all ${
                  isDark 
                    ? 'bg-white/10 border-white/30 text-white hover:bg-white/20'
                    : 'bg-slate-800/90 border-slate-800 text-white hover:bg-slate-900'
                }`}
                data-testid="cta-transfers"
              >
                {t.cta2}
              </motion.button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap items-center gap-6 mt-8"
            >
              {[
                { icon: Shield, text: t.licensed, color: 'green' },
                { icon: Zap, text: t.instant, color: 'blue' },
                { icon: Globe, text: t.countries, color: 'purple' }
              ].map((badge, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                    isDark 
                      ? `bg-${badge.color}-500/20`
                      : `bg-${badge.color}-100 border border-${badge.color}-200`
                  }`} style={{
                    backgroundColor: isDark 
                      ? badge.color === 'green' ? 'rgba(34,197,94,0.2)' 
                        : badge.color === 'blue' ? 'rgba(59,130,246,0.2)' 
                        : 'rgba(168,85,247,0.2)'
                      : badge.color === 'green' ? 'rgba(34,197,94,0.1)' 
                        : badge.color === 'blue' ? 'rgba(59,130,246,0.1)' 
                        : 'rgba(168,85,247,0.1)'
                  }}>
                    <badge.icon className={`w-4 h-4 ${
                      badge.color === 'green' ? 'text-green-500' 
                        : badge.color === 'blue' ? 'text-blue-500' 
                        : 'text-purple-500'
                    }`} />
                  </div>
                  <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {badge.text}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Images Side */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className={`relative ${isRTL ? 'lg:order-1' : 'lg:order-2'}`}
          >
            <div className="relative w-full h-[450px] lg:h-[550px]">
              {/* Golden Glow Behind Images */}
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-3xl ${
                isDark ? 'bg-[#D4AF37]/20' : 'bg-[#D4AF37]/30'
              }`} />

              {/* Airplane Image */}
              <motion.div
                className="absolute top-0 right-0 w-[70%] z-10"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="relative">
                  <img 
                    src={ASSETS.heroAirplane}
                    alt="Travel"
                    className={`w-full h-auto rounded-3xl shadow-2xl ${!isDark ? 'ring-4 ring-amber-100' : ''}`}
                  />
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              </motion.div>

              {/* Card Hand Image */}
              <motion.div
                className="absolute bottom-0 left-0 w-[65%] z-20"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <div className="relative">
                  <img 
                    src={ASSETS.heroCardHand}
                    alt="Payment Card"
                    className={`w-full h-auto rounded-3xl shadow-2xl ${!isDark ? 'ring-4 ring-yellow-100' : ''}`}
                  />
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              </motion.div>

              {/* Floating CBI Logo */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full flex items-center justify-center shadow-2xl z-30 bg-white"
                animate={{ 
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    '0 0 30px rgba(212,175,55,0.4)',
                    '0 0 60px rgba(212,175,55,0.6)',
                    '0 0 30px rgba(212,175,55,0.4)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <img 
                  src={ASSETS.cbiLogo}
                  alt="CBI"
                  className="w-16 h-16 object-contain"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className={`w-6 h-10 rounded-full border-2 flex items-start justify-center p-2 ${
            isDark ? 'border-white/30' : 'border-amber-600/50'
          }`}
        >
          <motion.div className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-white' : 'bg-amber-600'}`} />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection3D;
