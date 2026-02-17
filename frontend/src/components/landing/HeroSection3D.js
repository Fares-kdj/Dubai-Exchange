import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { ASSETS, COMPANY } from '@/config/assets';
import { Shield, Zap, Globe } from 'lucide-react';

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
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
        : 'bg-gradient-to-br from-slate-50 via-white to-blue-50'
    }`}>
      {/* Background with CBI Building */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0">
          <img 
            src={ASSETS.cbiBuilding1}
            alt="Central Bank of Iraq"
            className={`w-full h-full object-cover ${isDark ? 'opacity-20' : 'opacity-10'}`}
          />
          <div className={`absolute inset-0 ${
            isDark 
              ? 'bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900'
              : 'bg-gradient-to-b from-white/90 via-white/70 to-white'
          }`} />
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-5 overflow-hidden">
        <motion.div
          className={`absolute top-20 right-20 w-96 h-96 rounded-full blur-3xl ${isDark ? 'bg-[#D4AF37]/10' : 'bg-[#D4AF37]/20'}`}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className={`absolute bottom-20 left-20 w-80 h-80 rounded-full blur-3xl ${isDark ? 'bg-blue-500/10' : 'bg-blue-500/15'}`}
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
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
              className={`inline-flex items-center gap-3 px-4 py-2 rounded-full mb-6 ${
                isDark 
                  ? 'bg-green-500/20 border border-green-500/30'
                  : 'bg-green-500/10 border border-green-500/20'
              }`}
            >
              <img 
                src={ASSETS.cbiLogo}
                alt="CBI"
                className="w-8 h-8 object-contain"
              />
              <span className={`text-sm font-medium ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                {t.cbiTitle}
              </span>
            </motion.div>

            {/* Logo */}
            <motion.img
              src={isDark ? ASSETS.logoWhite : ASSETS.logoColor}
              alt="Dubai International Exchange"
              className="h-14 md:h-16 mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              data-testid="hero-logo"
            />

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight ${
                isDark ? 'text-white' : 'text-slate-900'
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
              className={`text-base md:text-lg mb-6 max-w-xl ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
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
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                isDark ? 'bg-[#D4AF37]/20 text-[#FCD34D]' : 'bg-[#D4AF37]/10 text-[#B8860B]'
              }`}>
                <Globe className="w-4 h-4" />
                <span className="font-medium">{t.feature1}</span>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-500/10 text-blue-600'
              }`}>
                <Zap className="w-4 h-4" />
                <span className="font-medium">{t.feature2}</span>
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
                    : 'bg-slate-900/10 border-slate-900/30 text-slate-900 hover:bg-slate-900/20'
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
              <div className="flex items-center gap-2">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${isDark ? 'bg-green-500/20' : 'bg-green-500/10'}`}>
                  <Shield className="w-4 h-4 text-green-500" />
                </div>
                <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t.licensed}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${isDark ? 'bg-blue-500/20' : 'bg-blue-500/10'}`}>
                  <Zap className="w-4 h-4 text-blue-500" />
                </div>
                <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t.instant}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${isDark ? 'bg-purple-500/20' : 'bg-purple-500/10'}`}>
                  <Globe className="w-4 h-4 text-purple-500" />
                </div>
                <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t.countries}</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Images Side */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className={`relative ${isRTL ? 'lg:order-1' : 'lg:order-2'}`}
          >
            <div className="relative w-full h-[400px] lg:h-[500px]">
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
                    className="w-full h-auto rounded-3xl shadow-2xl"
                  />
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/30 to-transparent" />
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
                    className="w-full h-auto rounded-3xl shadow-2xl"
                  />
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              </motion.div>

              {/* Floating CBI Logo */}
              <motion.div
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full flex items-center justify-center shadow-2xl z-30 ${
                  isDark ? 'bg-white' : 'bg-white'
                }`}
                animate={{ 
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    '0 0 30px rgba(212,175,55,0.3)',
                    '0 0 50px rgba(212,175,55,0.5)',
                    '0 0 30px rgba(212,175,55,0.3)'
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
            isDark ? 'border-white/30' : 'border-slate-900/30'
          }`}
        >
          <motion.div className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-white' : 'bg-slate-900'}`} />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection3D;
