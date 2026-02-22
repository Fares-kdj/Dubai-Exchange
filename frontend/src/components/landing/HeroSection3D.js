import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { COMPANY } from '@/config/assets';
import { Shield, Zap, Globe, Plane, ArrowLeftRight, Wallet, CreditCard } from 'lucide-react';

// Hero background images - easy to swap with videos later
const HERO_ASSETS = {
  dark: 'https://customer-assets.emergentagent.com/job_dubai-exchange/artifacts/taky4fxl_hero-dark.png',
  light: 'https://customer-assets.emergentagent.com/job_dubai-exchange/artifacts/l2ellrq4_hero-light.png'
};

export const HeroSection3D = () => {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const { isDark } = useTheme();
  const isArabic = currentLanguage === 'ar';
  const isKurdish = currentLanguage === 'ku';

  const content = {
    ar: {
      name: COMPANY.nameAr,
      slogan: COMPANY.sloganAr,
      licensed: 'مرخصة رسمياً',
      instant: 'خدمة فورية',
      countries: '+50 دولة',
      cbiTitle: 'مرخصة من البنك المركزي العراقي'
    },
    en: {
      name: COMPANY.nameEn,
      slogan: COMPANY.sloganEn,
      licensed: 'Licensed',
      instant: 'Instant Service',
      countries: '50+ Countries',
      cbiTitle: 'Licensed by Central Bank of Iraq'
    },
    ku: {
      name: COMPANY.nameKu,
      slogan: COMPANY.sloganKu,
      licensed: 'مۆڵەتپێدراو',
      instant: 'خزمەتگوزاری یەکجار',
      countries: '+٥٠ وڵات',
      cbiTitle: 'مۆڵەتدار لە بانکی ناوەندیی عێراق'
    }
  };

  // 4 Main Services with icons and animations
  const mainServices = [
    {
      id: 'traveler',
      icon: Plane,
      labelAr: 'حجز الدولار للمسافرين',
      labelEn: 'Traveler USD Booking',
      labelKu: 'نۆرەکردنی دۆلار بۆ گەشتیاران',
      link: '/traveler-booking',
      gradient: 'from-amber-500 to-yellow-600',
      hoverGlow: 'hover:shadow-amber-500/50',
      animation: { rotate: [0, -5, 5, 0], y: [0, -3, 0] }
    },
    {
      id: 'transfers',
      icon: ArrowLeftRight,
      labelAr: 'التحويلات المالية',
      labelEn: 'Money Transfers',
      labelKu: 'گواستنەوەی پارە',
      link: '/transfers',
      gradient: 'from-blue-500 to-indigo-600',
      hoverGlow: 'hover:shadow-blue-500/50',
      animation: { x: [-3, 3, -3, 3, 0] }
    },
    {
      id: 'usdt',
      icon: Wallet,
      labelAr: 'شحن USDT',
      labelEn: 'USDT Top-Up',
      labelKu: 'شحنی USDT',
      link: '/services/usdt',
      gradient: 'from-teal-500 to-emerald-600',
      hoverGlow: 'hover:shadow-teal-500/50',
      animation: { scale: [1, 1.05, 1], rotate: [0, 3, -3, 0] }
    },
    {
      id: 'cards',
      icon: CreditCard,
      labelAr: 'تعبئة البطاقات',
      labelEn: 'Card Recharge',
      labelKu: 'پڕکردنەوەی کارت',
      link: '/services/card-recharge',
      gradient: 'from-purple-500 to-violet-600',
      hoverGlow: 'hover:shadow-purple-500/50',
      animation: { rotateY: [0, 10, -10, 0] }
    }
  ];

  const t = content[currentLanguage] || content.ar;
  const getLabel = (service) => {
    if (currentLanguage === 'ar') return service.labelAr;
    if (currentLanguage === 'ku') return service.labelKu;
    return service.labelEn;
  };

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Image/Video Container */}
      <div className="absolute inset-0 z-0">
        {/* Hero Background - Using images (easy to swap with video later) */}
        <div className="absolute inset-0">
          {/* Dark Mode Background */}
          <img 
            src={HERO_ASSETS.dark}
            alt="Hero Background Dark"
            className={`absolute inset-0 w-full h-full object-cover object-right transition-opacity duration-700 ${
              isDark ? 'opacity-100' : 'opacity-0'
            }`}
          />
          {/* Light Mode Background */}
          <img 
            src={HERO_ASSETS.light}
            alt="Hero Background Light"
            className={`absolute inset-0 w-full h-full object-cover object-right transition-opacity duration-700 ${
              isDark ? 'opacity-0' : 'opacity-100'
            }`}
          />
        </div>

        {/* Gradient Overlay for text readability */}
        <div className={`absolute inset-0 ${
          isDark 
            ? 'bg-gradient-to-l from-transparent via-slate-900/40 to-slate-900/80'
            : 'bg-gradient-to-l from-transparent via-white/30 to-white/70'
        }`} />
      </div>

      {/* Content Container - Desktop: Two-column grid with content LEFT-aligned for ALL languages */}
      <div className="relative z-10 min-h-screen" dir="ltr">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 min-h-screen">
          {/* Desktop: Grid layout | Mobile: Flex centered */}
          <div className="min-h-[calc(100vh-7rem)] flex items-center lg:grid lg:grid-cols-[minmax(420px,560px)_1fr]">
            {/* Content Column - Always on LEFT for desktop, regardless of RTL/LTR */}
            <div className="w-full lg:max-w-[560px]">
              {/* Inner content wrapper - respects text direction for Arabic/Kurdish */}
              <div className={isArabic || isKurdish ? 'text-right' : 'text-left'} dir={isArabic || isKurdish ? 'rtl' : 'ltr'}>
              {/* CBI Badge */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-full border mb-8 ${
                  isDark 
                    ? 'bg-[#D4AF37]/10 border-[#D4AF37]/30 text-[#D4AF37]' 
                    : 'bg-amber-100/80 border-amber-300 text-amber-800'
                }`}
              >
                <img 
                  src="https://upload.wikimedia.org/wikipedia/en/thumb/9/95/Central_Bank_of_Iraq_logo.png/150px-Central_Bank_of_Iraq_logo.png"
                  alt="CBI"
                  className="w-8 h-8 object-contain"
                />
                <span className="font-semibold text-sm">{t.cbiTitle}</span>
              </motion.div>

              {/* Company Logo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-6"
              >
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center shadow-2xl ${
                  isDark ? 'shadow-[#D4AF37]/30' : 'shadow-amber-500/40'
                }`}>
                  <span className="text-2xl font-black text-white">DIE</span>
                </div>
              </motion.div>

              {/* Company Name */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {t.name}
              </motion.h1>

              {/* Slogan */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className={`text-lg md:text-xl mb-10 ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                {t.slogan}
              </motion.p>

              {/* 4 Main Service Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-2 gap-4 mb-10"
              >
                {mainServices.map((service, index) => (
                  <motion.button
                    key={service.id}
                    onClick={() => navigate(service.link)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    whileHover={{ 
                      scale: 1.03, 
                      y: -5,
                      ...service.animation
                    }}
                    whileTap={{ scale: 0.97 }}
                    className={`group relative flex items-center gap-3 px-5 py-4 rounded-2xl font-bold transition-all duration-300 overflow-hidden ${
                      isDark 
                        ? 'bg-slate-800/80 hover:bg-slate-700/90 text-white border border-slate-700/50' 
                        : 'bg-white/80 hover:bg-white text-slate-900 border border-slate-200/50'
                    } backdrop-blur-sm shadow-lg hover:shadow-2xl ${service.hoverGlow}`}
                    data-testid={`hero-service-${service.id}`}
                  >
                    {/* Icon Container */}
                    <motion.div
                      whileHover={service.animation}
                      transition={{ duration: 0.5 }}
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-lg flex-shrink-0`}
                    >
                      <service.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    
                    {/* Label */}
                    <span className="text-sm md:text-base">{getLabel(service)}</span>

                    {/* Hover Glow Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`} />
                  </motion.button>
                ))}
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="flex flex-wrap items-center gap-4 lg:gap-6"
              >
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                  isDark ? 'bg-slate-800/60 text-slate-300' : 'bg-white/60 text-slate-700'
                } backdrop-blur-sm`}>
                  <Shield className={`w-4 h-4 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                  <span className="text-sm font-medium">{t.licensed}</span>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                  isDark ? 'bg-slate-800/60 text-slate-300' : 'bg-white/60 text-slate-700'
                } backdrop-blur-sm`}>
                  <Zap className={`w-4 h-4 ${isDark ? 'text-yellow-400' : 'text-amber-600'}`} />
                  <span className="text-sm font-medium">{t.instant}</span>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                  isDark ? 'bg-slate-800/60 text-slate-300' : 'bg-white/60 text-slate-700'
                } backdrop-blur-sm`}>
                  <Globe className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  <span className="text-sm font-medium">{t.countries}</span>
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Right column - Empty space for hero visual (the background image) */}
          <div className="hidden lg:block" aria-hidden="true" />
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <div className={`w-6 h-10 rounded-full border-2 flex justify-center pt-2 ${
          isDark ? 'border-slate-600' : 'border-slate-400'
        }`}>
          <div className={`w-1.5 h-3 rounded-full ${
            isDark ? 'bg-[#D4AF37]' : 'bg-amber-500'
          }`} />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection3D;
