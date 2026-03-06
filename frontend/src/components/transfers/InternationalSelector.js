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
        <stop offset="0%" stopColor="#FFD700" />
        <stop offset="100%" stopColor="#FFA500" />
      </linearGradient>
    </defs>
    <rect fill="url(#wu-gradient)" width="60" height="60" rx="12" />
    <text x="30" y="38" textAnchor="middle" fill="#000" fontSize="18" fontWeight="900">WU</text>
  </svg>
);

// MoneyGram Icon - Premium Style
const MoneyGramIcon = () => (
  <svg viewBox="0 0 60 60" className="w-14 h-14">
    <defs>
      <linearGradient id="mg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF7F00" />
        <stop offset="100%" stopColor="#FF4500" />
      </linearGradient>
    </defs>
    <rect fill="url(#mg-gradient)" width="60" height="60" rx="12" />
    <text x="30" y="38" textAnchor="middle" fill="#FFF" fontSize="16" fontWeight="900">MG</text>
  </svg>
);

const InternationalSelector = () => {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const { isDark } = useTheme();
  const isArabic = currentLanguage === 'ar';
  const isKurdish = currentLanguage === 'ku';

  const t = (ar, en, ku) => {
    if (isKurdish) return ku || en;
    if (isArabic) return ar;
    return en;
  };

  const options = [
    {
      id: 'western-union',
      icon: WesternUnionIcon,
      titleAr: 'ويسترن يونيون',
      titleEn: 'Western Union',
      titleKu: 'وێستەرن یونیۆن',
      descAr: 'تحويل سريع وموثوق لأكثر من 200 دولة حول العالم',
      descEn: 'Fast and reliable transfer to 200+ countries worldwide',
      descKu: 'گواستنەوەی خێرا و جێی متمانە بۆ زیاتر لە ٢٠٠ وڵات لە جیهاندا',
      gradient: 'from-yellow-400 to-amber-500',
      iconBg: isDark ? 'bg-yellow-500/20' : 'bg-yellow-100',
      hoverGlow: 'hover:shadow-yellow-500/25',
      link: '/transfers/western-union',
      badge: { ar: 'الأكثر شعبية', en: 'Most Popular', ku: 'بەناوبانگترین' },
      features: [
        { ar: 'تحويل خلال دقائق', en: 'Transfer in minutes', ku: 'گواستنەوە لە چەند خولەکێکدا' },
        { ar: 'شبكة عالمية', en: 'Global network', ku: 'تۆڕی جیهانی' }
      ]
    },
    {
      id: 'moneygram',
      icon: MoneyGramIcon,
      titleAr: 'موني جرام',
      titleEn: 'MoneyGram',
      titleKu: 'مۆنی گرام',
      descAr: 'خدمة تحويل دولية سريعة وآمنة بأسعار تنافسية',
      descEn: 'Fast and secure international transfer with competitive rates',
      descKu: 'خزمەتگوزاری گواستنەوەی نێودەوڵەتی خێرا و پارێزراو بە نرخێکی کێبڕکێکار',
      gradient: 'from-orange-500 to-red-500',
      iconBg: isDark ? 'bg-orange-500/20' : 'bg-orange-100',
      hoverGlow: 'hover:shadow-orange-500/25',
      link: '/transfers/moneygram',
      features: [
        { ar: 'أسعار تنافسية', en: 'Competitive rates', ku: 'نرخی کێبڕکێکار' },
        { ar: 'دعم 24/7', en: '24/7 support', ku: 'پشتیوانی ٢٤/٧' }
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
      titleKu: 'گواستنەوە بەپێی وڵات',
      descAr: 'اختر الدولة واكتشف أفضل طرق التحويل المتاحة',
      descEn: 'Choose a country and discover available transfer methods',
      descKu: 'وڵاتێک هەڵبژێره و باشترین ڕێگاکانی گواستنەوە بدۆزەرەوە',
      gradient: 'from-indigo-500 to-purple-600',
      iconBg: isDark ? 'bg-indigo-500/20' : 'bg-indigo-100',
      hoverGlow: 'hover:shadow-indigo-500/25',
      link: '/transfers/country-wizard',
      badge: { ar: 'تجربة جديدة', en: 'New Experience', ku: 'ئەزموونێکی نوێ' },
      features: [
        { ar: 'خيارات متعددة', en: 'Multiple options', ku: 'بژاردەی زۆر' },
        { ar: 'أفضل الأسعار', en: 'Best rates', ku: 'باشترین نرخەکان' }
      ]
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark
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
            className={`flex items-center gap-2 mb-8 group ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            {t('العودة للتحويلات', 'Back to Transfers', 'گەڕانەوە بۆ گواستنەوەکان')}
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
              className={`w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-8 shadow-2xl ${isDark ? 'shadow-blue-500/30' : 'shadow-blue-500/20'
                }`}
            >
              <Globe className="w-12 h-12 text-white" />
            </motion.div>

            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t('التحويل الدولي', 'International Transfer', 'گواستنەوەی نێودەوڵەتی')}
            </h1>
            <p className={`text-lg max-w-xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {t(
                'اختر طريقة التحويل المناسبة لإرسال الأموال إلى الخارج',
                'Choose the appropriate transfer method to send money abroad',
                'ڕێگەی گواستنەوەی گونجاو هەڵبژێرە بۆ ناردنی پارە بۆ دەرەوەی وڵات'
              )}
            </p>
          </motion.div>

          {/* Premium 3-Card Grid with Floating Animation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {options.map((option, index) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  y: [0, -18, 0, -10, 0],
                  scale: [1, 1.02, 1, 1.01, 1],
                  rotate: [0, 1.5, 0, -1, 0]
                }}
                transition={{
                  opacity: { delay: 0.2 + index * 0.15, duration: 0.6 },
                  y: {
                    delay: index * 0.4,
                    duration: 2.5 + index * 0.3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  },
                  scale: {
                    delay: index * 0.4,
                    duration: 2.5 + index * 0.3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  },
                  rotate: {
                    delay: index * 0.4,
                    duration: 3 + index * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
                whileHover={{
                  y: -25,
                  scale: 1.06,
                  rotate: 0,
                  transition: { type: "spring", stiffness: 400, damping: 15 }
                }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate(option.link)}
                className="cursor-pointer group"
                style={{
                  transformStyle: 'preserve-3d',
                  perspective: '1000px'
                }}
                data-testid={`international-option-${option.id}`}
              >
                <div className={`relative rounded-3xl p-8 border-2 h-full transition-all duration-500 overflow-hidden ${isDark
                    ? 'bg-slate-800/70 border-slate-700 hover:border-slate-500'
                    : 'bg-white/90 border-slate-200 hover:border-slate-300'
                  } shadow-xl hover:shadow-2xl ${option.hoverGlow} backdrop-blur-sm`}>

                  {/* Floating Particles */}
                  <motion.div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className={`absolute w-1.5 h-1.5 rounded-full bg-gradient-to-r ${option.gradient} opacity-40`}
                        style={{
                          left: `${15 + i * 18}%`,
                          top: `${25 + (i % 3) * 20}%`
                        }}
                        animate={{
                          y: [-15, -40, -15],
                          opacity: [0.3, 0.7, 0.3],
                          scale: [0.8, 1.3, 0.8]
                        }}
                        transition={{
                          duration: 2.5 + i * 0.4,
                          delay: i * 0.3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </motion.div>

                  {/* Badge */}
                  {option.badge && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{
                        opacity: 1,
                        y: [0, -3, 0]
                      }}
                      transition={{
                        opacity: { delay: 0.5 + index * 0.1 },
                        y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                      }}
                      className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-[#D4AF37] to-[#FCD34D] rounded-full text-xs font-bold text-slate-900 shadow-lg"
                    >
                      {t(option.badge.ar, option.badge.en, option.badge.ku)}
                    </motion.div>
                  )}

                  {/* Shimmer Effect */}
                  <motion.div
                    className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12"
                  />

                  {/* Gold accent on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-[#D4AF37]/0 to-[#D4AF37]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`} />

                  <div className="relative z-10">
                    {/* Icon with Enhanced Floating Animation */}
                    <motion.div
                      animate={{
                        boxShadow: [
                          '0 0 0 0 rgba(212, 175, 55, 0)',
                          '0 0 20px 8px rgba(212, 175, 55, 0.15)',
                          '0 0 0 0 rgba(212, 175, 55, 0)'
                        ],
                        rotate: [0, 3, -3, 0]
                      }}
                      transition={{
                        boxShadow: { duration: 2.5, repeat: Infinity, delay: index * 0.3 },
                        rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                      }}
                      whileHover={{
                        rotate: [0, -10, 10, -5, 5, 0],
                        scale: 1.15,
                        transition: { duration: 0.5 }
                      }}
                      className={`w-20 h-20 ${option.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-6 relative`}
                    >
                      {/* Inner Glow */}
                      <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <option.icon />
                    </motion.div>

                    {/* Title */}
                    <motion.h3
                      className={`text-2xl font-bold text-center mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}
                      whileHover={{ scale: 1.05 }}
                    >
                      {t(option.titleAr, option.titleEn, option.titleKu)}
                    </motion.h3>

                    {/* Description */}
                    <p className={`text-center text-sm mb-6 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {t(option.descAr, option.descEn, option.descKu)}
                    </p>

                    {/* Features */}
                    <div className="space-y-2 mb-6">
                      {option.features.map((feature, fIndex) => (
                        <motion.div
                          key={fIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + fIndex * 0.1 }}
                          className={`flex items-center gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
                        >
                          <motion.div
                            className={`w-2 h-2 rounded-full bg-gradient-to-r ${option.gradient}`}
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: fIndex * 0.3 }}
                          />
                          {t(feature.ar, feature.en, feature.ku)}
                        </motion.div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <motion.div
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all ${isDark
                          ? 'bg-slate-700/50 text-white group-hover:bg-[#D4AF37] group-hover:text-slate-900'
                          : 'bg-slate-100 text-slate-700 group-hover:bg-[#D4AF37] group-hover:text-slate-900'
                        }`}
                      whileHover={{ scale: 1.05 }}
                    >
                      {t('اختيار', 'Select', 'هەڵبژاردن')}
                      <motion.div
                        animate={{ x: [0, 8, 0] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Bottom Border Glow */}
                  <motion.div
                    className={`absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r ${option.gradient}`}
                    initial={{ scaleX: 0, opacity: 0 }}
                    whileHover={{ scaleX: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Corner Decorations */}
                  <div className={`absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 rounded-tr-lg opacity-0 group-hover:opacity-50 transition-opacity ${option.id === 'western-union' ? 'border-yellow-400' : option.id === 'moneygram' ? 'border-orange-400' : 'border-indigo-400'
                    }`} />
                  <div className={`absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 rounded-bl-lg opacity-0 group-hover:opacity-50 transition-opacity ${option.id === 'western-union' ? 'border-yellow-400' : option.id === 'moneygram' ? 'border-orange-400' : 'border-indigo-400'
                    }`} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Info Section - Premium Style */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className={`max-w-4xl mx-auto mt-16 p-8 rounded-3xl border-2 ${isDark
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
                className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'
                  }`}
              >
                <Sparkles className={`w-7 h-7 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              </motion.div>
              <div>
                <h4 className={`font-bold text-xl mb-2 ${isDark ? 'text-blue-300' : 'text-blue-900'}`}>
                  {t('نصيحة للحصول على أفضل تجربة', 'Tip for the Best Experience', 'ئامۆژگاری بۆ باشترین ئەزموون')}
                </h4>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
                  {t(
                    'لأفضل أسعار الصرف والرسوم المنخفضة، جرب "تحويل حسب الدولة" لاكتشاف الخيارات المحلية المتاحة في البلد المستهدف. ستجد طرق دفع متنوعة تناسب احتياجاتك.',
                    'For the best exchange rates and low fees, try "Country-based Transfer" to discover local options available in the destination country. You will find various payment methods to suit your needs.',
                    'بۆ باشترین نرخی ئاڵوگۆڕ و تێچووی کەم، "گواستنەوە بەپێی وڵات" تاقی بکەرەوە بۆ دۆزینەوەی بژاردە ناوخۆییەکانی بەردەست لە وڵاتی مەبەستدا. ڕێگەی جیاوازی پارەدانی تێدایە کە لەگەڵ پێداویستییەکانت دەگونجێت.'
                  )}
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
              <span className="text-sm">{t('تحويل آمن ومضمون', 'Safe & Secure Transfer', 'گواستنەوەی پارێزراو و مسۆگەر')}</span>
            </div>
            <div className={`flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <Clock className="w-5 h-5 text-blue-500" />
              <span className="text-sm">{t('خدمة على مدار الساعة', '24/7 Service', 'خزمەتگوزاری بە درێژایی شەو و ڕۆژ')}</span>
            </div>
            <div className={`flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <Globe className="w-5 h-5 text-purple-500" />
              <span className="text-sm">{t('+200 دولة حول العالم', '200+ Countries Worldwide', '+٢٠٠ وڵات لە جیهاندا')}</span>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer3D />
    </div>
  );
};

export default InternationalSelector;
