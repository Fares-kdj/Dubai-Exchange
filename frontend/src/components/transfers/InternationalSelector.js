import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { Globe, ArrowLeft, ArrowRight, Zap, Sparkles, Shield, Clock } from 'lucide-react';
import Header3D from '../landing/Header3D';
import Footer3D from '../landing/Footer3D';

// Western Union Icon - Premium Style
const WesternUnionIcon = () => (
  <svg viewBox="0 0 60 60" className="w-14 h-14">
    <defs>
      <linearGradient id="wu-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFD700"/>
        <stop offset="100%" stopColor="#FFA500"/>
      </linearGradient>
    </defs>
    <rect fill="url(#wu-gradient)" width="60" height="60" rx="12"/>
    <text x="30" y="38" textAnchor="middle" fill="#000" fontSize="18" fontWeight="900">WU</text>
  </svg>
);

// MoneyGram Icon - Premium Style
const MoneyGramIcon = () => (
  <svg viewBox="0 0 60 60" className="w-14 h-14">
    <defs>
      <linearGradient id="mg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF7F00"/>
        <stop offset="100%" stopColor="#FF4500"/>
      </linearGradient>
    </defs>
    <rect fill="url(#mg-gradient)" width="60" height="60" rx="12"/>
    <text x="30" y="38" textAnchor="middle" fill="#FFF" fontSize="16" fontWeight="900">MG</text>
  </svg>
);

const InternationalSelector = () => {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const { isDark } = useTheme();

  const options = [
    {
      id: 'western-union',
      icon: WesternUnionIcon,
      titleAr: 'ويسترن يونيون',
      titleEn: 'Western Union',
      descAr: 'تحويل سريع وموثوق لأكثر من 200 دولة حول العالم',
      descEn: 'Fast and reliable transfer to 200+ countries worldwide',
      gradient: 'from-yellow-400 to-amber-500',
      iconBg: isDark ? 'bg-yellow-500/20' : 'bg-yellow-100',
      hoverGlow: 'hover:shadow-yellow-500/25',
      link: '/transfers/western-union',
      badge: { ar: 'الأكثر شعبية', en: 'Most Popular' },
      features: [
        { ar: 'تحويل خلال دقائق', en: 'Transfer in minutes' },
        { ar: 'شبكة عالمية', en: 'Global network' }
      ]
    },
    {
      id: 'moneygram',
      icon: MoneyGramIcon,
      titleAr: 'موني جرام',
      titleEn: 'MoneyGram',
      descAr: 'خدمة تحويل دولية سريعة وآمنة بأسعار تنافسية',
      descEn: 'Fast and secure international transfer with competitive rates',
      gradient: 'from-orange-500 to-red-500',
      iconBg: isDark ? 'bg-orange-500/20' : 'bg-orange-100',
      hoverGlow: 'hover:shadow-orange-500/25',
      link: '/transfers/moneygram',
      features: [
        { ar: 'أسعار تنافسية', en: 'Competitive rates' },
        { ar: 'دعم 24/7', en: '24/7 support' }
      ]
    },
    {
      id: 'country-based',
      icon: () => (
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center`}>
          <Globe className="w-8 h-8 text-white" />
        </div>
      ),
      titleAr: 'تحويل حسب الدولة',
      titleEn: 'Country-based Transfer',
      descAr: 'اختر الدولة واكتشف أفضل طرق التحويل المتاحة',
      descEn: 'Choose a country and discover available transfer methods',
      gradient: 'from-indigo-500 to-purple-600',
      iconBg: isDark ? 'bg-indigo-500/20' : 'bg-indigo-100',
      hoverGlow: 'hover:shadow-indigo-500/25',
      link: '/transfers/country-wizard',
      badge: { ar: 'تجربة جديدة', en: 'New Experience' },
      features: [
        { ar: 'خيارات متعددة', en: 'Multiple options' },
        { ar: 'أفضل الأسعار', en: 'Best rates' }
      ]
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
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/transfers')}
            className={`flex items-center gap-2 mb-8 group ${
              isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            {currentLanguage === 'ar' ? 'العودة للتحويلات' : 'Back to Transfers'}
          </motion.button>

          {/* Header - Premium Style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <motion.div
              animate={{ 
                boxShadow: [
                  '0 0 0 0 rgba(212, 175, 55, 0)',
                  '0 0 0 15px rgba(212, 175, 55, 0.1)',
                  '0 0 0 0 rgba(212, 175, 55, 0)'
                ]
              }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className={`w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-8 shadow-2xl ${
                isDark ? 'shadow-blue-500/30' : 'shadow-blue-500/20'
              }`}
            >
              <Globe className="w-12 h-12 text-white" />
            </motion.div>
            
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {currentLanguage === 'ar' ? 'التحويل الدولي' : 'International Transfer'}
            </h1>
            <p className={`text-lg max-w-xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {currentLanguage === 'ar' 
                ? 'اختر طريقة التحويل المناسبة لإرسال الأموال إلى الخارج'
                : 'Choose the appropriate transfer method to send money abroad'}
            </p>
          </motion.div>

          {/* Premium 3-Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {options.map((option, index) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: 0.2 + index * 0.15,
                  type: "spring",
                  stiffness: 200,
                  damping: 20
                }}
                whileHover={{ 
                  y: -12, 
                  scale: 1.03,
                  transition: { type: "spring", stiffness: 400, damping: 10 }
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(option.link)}
                className="cursor-pointer group"
                data-testid={`international-option-${option.id}`}
              >
                <div className={`relative rounded-3xl p-8 border-2 h-full transition-all duration-500 overflow-hidden ${
                  isDark 
                    ? 'bg-slate-800/50 border-slate-700 hover:border-slate-600' 
                    : 'bg-white border-slate-200 hover:border-slate-300'
                } shadow-xl hover:shadow-2xl ${option.hoverGlow}`}>
                  
                  {/* Badge */}
                  {option.badge && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-[#D4AF37] to-[#FCD34D] rounded-full text-xs font-bold text-slate-900 shadow-lg"
                    >
                      {currentLanguage === 'ar' ? option.badge.ar : option.badge.en}
                    </motion.div>
                  )}

                  {/* Shimmer Effect */}
                  <motion.div 
                    className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                  />

                  {/* Gold accent on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-[#D4AF37]/0 to-[#D4AF37]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`} />

                  <div className="relative z-10">
                    {/* Icon with Pulse Animation */}
                    <motion.div
                      animate={{ 
                        boxShadow: [
                          '0 0 0 0 rgba(212, 175, 55, 0)',
                          '0 0 0 10px rgba(212, 175, 55, 0.1)',
                          '0 0 0 0 rgba(212, 175, 55, 0)'
                        ]
                      }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.3 }}
                      whileHover={{ 
                        rotate: [0, -5, 5, -3, 3, 0],
                        scale: 1.1,
                        transition: { duration: 0.5 }
                      }}
                      className={`w-20 h-20 ${option.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-6`}
                    >
                      <option.icon />
                    </motion.div>

                    {/* Title */}
                    <motion.h3 
                      className={`text-2xl font-bold text-center mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}
                      whileHover={{ scale: 1.02 }}
                    >
                      {currentLanguage === 'ar' ? option.titleAr : option.titleEn}
                    </motion.h3>

                    {/* Description */}
                    <p className={`text-center text-sm mb-6 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {currentLanguage === 'ar' ? option.descAr : option.descEn}
                    </p>

                    {/* Features */}
                    <div className="space-y-2 mb-6">
                      {option.features.map((feature, fIndex) => (
                        <div 
                          key={fIndex}
                          className={`flex items-center gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${option.gradient}`} />
                          {currentLanguage === 'ar' ? feature.ar : feature.en}
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <motion.div 
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all ${
                        isDark 
                          ? 'bg-slate-700/50 text-white group-hover:bg-[#D4AF37] group-hover:text-slate-900' 
                          : 'bg-slate-100 text-slate-700 group-hover:bg-[#D4AF37] group-hover:text-slate-900'
                      }`}
                      whileHover={{ scale: 1.02 }}
                    >
                      {currentLanguage === 'ar' ? 'اختيار' : 'Select'}
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.div>
                    </motion.div>
                  </div>
                  
                  {/* Bottom Border Glow */}
                  <motion.div 
                    className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${option.gradient}`}
                    initial={{ scaleX: 0, opacity: 0 }}
                    whileHover={{ scaleX: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Info Section - Premium Style */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className={`max-w-4xl mx-auto mt-16 p-8 rounded-3xl border-2 ${
              isDark 
                ? 'bg-blue-900/20 border-blue-700/50' 
                : 'bg-blue-50 border-blue-200'
            }`}
          >
            <div className="flex flex-col md:flex-row items-start gap-6">
              <motion.div 
                animate={{ 
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  isDark ? 'bg-blue-500/20' : 'bg-blue-100'
                }`}
              >
                <Sparkles className={`w-7 h-7 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              </motion.div>
              <div>
                <h4 className={`font-bold text-xl mb-2 ${isDark ? 'text-blue-300' : 'text-blue-900'}`}>
                  {currentLanguage === 'ar' ? 'نصيحة للحصول على أفضل تجربة' : 'Tip for the Best Experience'}
                </h4>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
                  {currentLanguage === 'ar' 
                    ? 'لأفضل أسعار الصرف والرسوم المنخفضة، جرب "تحويل حسب الدولة" لاكتشاف الخيارات المحلية المتاحة في البلد المستهدف. ستجد طرق دفع متنوعة تناسب احتياجاتك.'
                    : 'For the best exchange rates and low fees, try "Country-based Transfer" to discover local options available in the destination country. You will find various payment methods to suit your needs.'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-wrap justify-center gap-8 mt-12"
          >
            <div className={`flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <Shield className="w-5 h-5 text-green-500" />
              <span className="text-sm">{currentLanguage === 'ar' ? 'تحويل آمن ومضمون' : 'Safe & Secure Transfer'}</span>
            </div>
            <div className={`flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <Clock className="w-5 h-5 text-blue-500" />
              <span className="text-sm">{currentLanguage === 'ar' ? 'خدمة على مدار الساعة' : '24/7 Service'}</span>
            </div>
            <div className={`flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <Globe className="w-5 h-5 text-purple-500" />
              <span className="text-sm">{currentLanguage === 'ar' ? '+200 دولة حول العالم' : '200+ Countries Worldwide'}</span>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer3D />
    </div>
  );
};

export default InternationalSelector;
