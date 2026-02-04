import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, TrendingUp, Shield, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Pattern */}
      <div className={`absolute inset-0 transition-colors duration-300 ${
        isDark 
          ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
          : 'bg-gradient-to-br from-slate-50 via-white to-amber-50/30'
      }`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(252,211,77,0.1),transparent_50%)]" />
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-[#D4AF37]/20 to-[#FCD34D]/20 rounded-full blur-3xl"
        animate={{
          y: [0, 30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 left-10 w-40 h-40 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"
        animate={{
          y: [0, -40, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[85vh]">
          {/* Content Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 order-2 lg:order-1"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8 ${
                isDark 
                  ? 'bg-[#D4AF37]/20 border-[#D4AF37]/30'
                  : 'bg-gradient-to-r from-[#D4AF37]/10 to-[#FCD34D]/10 border-[#D4AF37]/20'
              }`}
              data-testid="hero-badge"
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                {t('hero.subtitle')}
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
              data-testid="hero-title"
            >
              <span className={`bg-clip-text text-transparent ${
                isDark 
                  ? 'bg-gradient-to-r from-white via-slate-200 to-white'
                  : 'bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900'
              }`}>
                {t('hero.title')}
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className={`text-lg md:text-xl mb-10 max-w-2xl leading-relaxed ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
              data-testid="hero-description"
            >
              {t('hero.description')}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/traveler-booking')}
                data-testid="cta-booking"
                className={`group px-8 py-4 font-bold rounded-full shadow-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                  isDark 
                    ? 'bg-[#D4AF37] text-slate-900 hover:bg-[#FCD34D] shadow-[#D4AF37]/30'
                    : 'bg-slate-900 text-white shadow-slate-900/30 hover:shadow-slate-900/50'
                }`}
              >
                {t('hero.ctaBooking')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/transfers')}
                data-testid="cta-transfer"
                className={`group px-8 py-4 border-2 font-bold rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                  isDark 
                    ? 'bg-slate-800 border-slate-600 text-white hover:border-[#D4AF37]'
                    : 'bg-white border-slate-200 text-slate-900 hover:border-[#D4AF37] hover:bg-slate-50'
                }`}
              >
                {t('hero.ctaTransfer')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap items-center gap-6"
            >
              <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <span className="font-medium">{currentLanguage === 'ar' ? 'مرخصة رسمياً' : 'Licensed'}</span>
              </div>
              <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
                <span className="font-medium">{currentLanguage === 'ar' ? 'خدمة فورية' : 'Instant Service'}</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Visual Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-5 order-1 lg:order-2 relative h-[50vh] lg:h-[600px]"
          >
            {/* 3D Image */}
            <div className="relative w-full h-full">
              <motion.div
                className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src="https://customer-assets.emergentagent.com/job_exchange-kbag/artifacts/2t5hm46y_image.png"
                  alt="Exchange Services"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/20 to-transparent mix-blend-overlay" />
              </motion.div>

              {/* Floating Cards */}
              <motion.div
                className={`absolute -bottom-8 -left-8 rounded-2xl shadow-xl p-6 border ${
                  isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
                }`}
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>+10K</div>
                    <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {currentLanguage === 'ar' ? 'عميل راضٍ' : 'Happy Clients'}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Stats Card */}
              <motion.div
                className="absolute -top-8 -right-8 bg-gradient-to-br from-[#D4AF37] to-[#FCD34D] rounded-2xl shadow-xl p-6 text-white"
                animate={{
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="text-3xl font-bold mb-1">50+</div>
                <div className="text-sm opacity-90">
                  {currentLanguage === 'ar' ? 'دولة' : 'Countries'}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
