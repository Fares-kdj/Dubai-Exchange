import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { MapPin, Globe, ArrowRight, Building2, Sparkles } from 'lucide-react';
import Header3D from '../landing/Header3D';
import Footer3D from '../landing/Footer3D';

const TransfersHub = () => {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const { isDark } = useTheme();

  const transferTypes = [
    {
      id: 'local',
      icon: MapPin,
      titleAr: 'تحويل محلي',
      titleEn: 'Local Transfer',
      descAr: 'تحويل أموال داخل العراق بين المحافظات',
      descEn: 'Transfer money within Iraq between provinces',
      gradient: 'from-emerald-500 to-teal-600',
      bgGlow: 'bg-emerald-500/20',
      link: '/transfers/local'
    },
    {
      id: 'international',
      icon: Globe,
      titleAr: 'تحويل دولي',
      titleEn: 'International Transfer',
      descAr: 'تحويل أموال إلى جميع دول العالم',
      descEn: 'Transfer money to countries worldwide',
      gradient: 'from-blue-500 to-indigo-600',
      bgGlow: 'bg-blue-500/20',
      link: '/transfers/international'
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-b from-slate-50 via-white to-slate-50'
    }`}>
      <Header3D />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className={`inline-flex items-center gap-2 px-4 py-2 border rounded-full mb-6 ${
                isDark 
                  ? 'bg-[#D4AF37]/10 border-[#D4AF37]/30' 
                  : 'bg-gradient-to-r from-[#D4AF37]/10 to-[#FCD34D]/10 border-[#D4AF37]/20'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {currentLanguage === 'ar' ? 'خدمات التحويل' : 'Transfer Services'}
              </span>
            </motion.div>

            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {currentLanguage === 'ar' ? 'التحويلات المالية' : 'Money Transfers'}
            </h1>
            <p className={`text-lg md:text-xl max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {currentLanguage === 'ar' 
                ? 'اختر نوع التحويل المناسب لك - محلي داخل العراق أو دولي لجميع أنحاء العالم'
                : 'Choose the transfer type that suits you - local within Iraq or international worldwide'}
            </p>
          </motion.div>

          {/* Transfer Type Cards with Floating Animation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {transferTypes.map((type, index) => (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={{ 
                  opacity: 1, 
                  y: [0, -10, 0],
                  scale: 1
                }}
                transition={{ 
                  opacity: { delay: 0.3 + index * 0.15, duration: 0.6 },
                  scale: { delay: 0.3 + index * 0.15, duration: 0.6 },
                  y: {
                    delay: index * 0.8,
                    duration: 3 + index * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
                whileHover={{ 
                  y: -20, 
                  scale: 1.05,
                  rotateX: 5,
                  rotateY: index === 0 ? 3 : -3,
                  transition: { type: "spring", stiffness: 400, damping: 15 }
                }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate(type.link)}
                className="cursor-pointer group"
                style={{ 
                  transformStyle: 'preserve-3d',
                  perspective: '1000px'
                }}
                data-testid={`transfer-card-${type.id}`}
              >
                <div className={`relative rounded-3xl p-8 md:p-10 border-2 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden ${
                  isDark 
                    ? 'bg-slate-800/70 border-slate-700 hover:border-slate-500' 
                    : 'bg-white/90 border-slate-200 hover:border-slate-300'
                } backdrop-blur-sm`}>
                  
                  {/* Floating Particles */}
                  <motion.div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className={`absolute w-2 h-2 rounded-full bg-gradient-to-r ${type.gradient} opacity-30`}
                        style={{
                          left: `${10 + i * 15}%`,
                          top: `${20 + (i % 3) * 25}%`
                        }}
                        animate={{
                          y: [-20, -50, -20],
                          x: [0, (i % 2 === 0 ? 10 : -10), 0],
                          opacity: [0.2, 0.6, 0.2],
                          scale: [0.8, 1.2, 0.8]
                        }}
                        transition={{
                          duration: 3 + i * 0.5,
                          delay: i * 0.3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </motion.div>

                  {/* Animated Background Glow */}
                  <motion.div 
                    className={`absolute -top-20 -right-20 w-48 h-48 ${type.bgGlow} rounded-full blur-3xl`}
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Shimmer Effect on Hover */}
                  <motion.div 
                    className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                  />
                  
                  {/* Gold accent on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/0 to-[#D4AF37]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

                  <div className="relative z-10">
                    {/* Icon with Floating and Rotate Animation */}
                    <motion.div
                      animate={{ 
                        boxShadow: [
                          '0 0 0 0 rgba(212, 175, 55, 0)',
                          '0 0 25px 8px rgba(212, 175, 55, 0.15)',
                          '0 0 0 0 rgba(212, 175, 55, 0)'
                        ],
                        rotate: [0, 3, -3, 0]
                      }}
                      transition={{ 
                        boxShadow: { duration: 2.5, repeat: Infinity, delay: index * 0.5 },
                        rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                      }}
                      whileHover={{ 
                        rotate: [0, -15, 15, -10, 10, 0],
                        scale: 1.15,
                        transition: { duration: 0.6 }
                      }}
                      className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${type.gradient} flex items-center justify-center mb-8 shadow-2xl group-hover:shadow-3xl transition-shadow relative`}
                    >
                      {/* Inner Glow */}
                      <div className="absolute inset-0 rounded-3xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      >
                        <type.icon className="w-12 h-12 text-white relative z-10" />
                      </motion.div>
                    </motion.div>

                    {/* Title with Slide Animation */}
                    <motion.h2 
                      className={`text-2xl md:text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}
                      whileHover={{ x: 5, scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {currentLanguage === 'ar' ? type.titleAr : type.titleEn}
                    </motion.h2>

                    {/* Description */}
                    <p className={`mb-8 leading-relaxed text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {currentLanguage === 'ar' ? type.descAr : type.descEn}
                    </p>

                    {/* CTA with Arrow Animation */}
                    <motion.div 
                      className={`inline-flex items-center gap-3 px-6 py-3 rounded-xl text-base font-bold ${
                        isDark 
                          ? 'bg-slate-700/50 text-white group-hover:bg-[#D4AF37] group-hover:text-slate-900' 
                          : 'bg-slate-100 text-slate-700 group-hover:bg-[#D4AF37] group-hover:text-slate-900'
                      } transition-all duration-300`}
                      whileHover={{ scale: 1.05, x: 5 }}
                    >
                      {currentLanguage === 'ar' ? 'ابدأ التحويل' : 'Start Transfer'}
                      <motion.div
                        animate={{ x: [0, 8, 0] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.div>
                    </motion.div>
                  </div>
                  
                  {/* Bottom Border Glow on Hover */}
                  <motion.div 
                    className={`absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r ${type.gradient}`}
                    initial={{ scaleX: 0, opacity: 0 }}
                    whileHover={{ scaleX: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Corner Decorations */}
                  <div className={`absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 rounded-tr-lg opacity-0 group-hover:opacity-60 transition-opacity ${
                    type.id === 'local' ? 'border-emerald-400' : 'border-blue-400'
                  }`} />
                  <div className={`absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 rounded-bl-lg opacity-0 group-hover:opacity-60 transition-opacity ${
                    type.id === 'local' ? 'border-emerald-400' : 'border-blue-400'
                  }`} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-8 mt-16"
          >
            <div className={`flex items-center gap-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDark ? 'bg-green-500/20' : 'bg-green-100'}`}>
                <Building2 className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {currentLanguage === 'ar' ? 'شركة مرخصة' : 'Licensed Company'}
                </p>
                <p className="text-sm">
                  {currentLanguage === 'ar' ? 'معتمدة رسمياً' : 'Officially certified'}
                </p>
              </div>
            </div>
            <div className={`flex items-center gap-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                <Globe className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {currentLanguage === 'ar' ? '+50 دولة' : '50+ Countries'}
                </p>
                <p className="text-sm">
                  {currentLanguage === 'ar' ? 'تغطية عالمية' : 'Global coverage'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer3D />
    </div>
  );
};

export default TransfersHub;
