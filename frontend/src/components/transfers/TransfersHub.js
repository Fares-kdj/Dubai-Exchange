import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { motion, useInView } from 'framer-motion';
import { MapPin, Globe, ArrowRight, Building2, Sparkles } from 'lucide-react';
import Header3D from '../landing/Header3D';
import Footer3D from '../landing/Footer3D';

const TransfersHub = () => {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const { isDark } = useTheme();
  const isArabic = currentLanguage === 'ar';
  const isKurdish = currentLanguage === 'ku';
  const sectionRef = React.useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const t = (ar, en, ku) => {
    if (isKurdish) return ku || en;
    if (isArabic) return ar;
    return en;
  };

  const transferTypes = [
    {
      id: 'local',
      icon: MapPin,
      titleAr: 'تحويل محلي',
      titleEn: 'Local Transfer',
      titleKu: 'گواستنەوەی ناوخۆیی',
      descAr: 'تحويل أموال داخل العراق بين المحافظات',
      descEn: 'Transfer money within Iraq between provinces',
      descKu: 'گواستنەوەی پارە لەناو عێراقدا لە نێوان پارێزگاکاندا',
      gradient: 'from-emerald-500 to-teal-600',
      bgGlow: 'bg-emerald-500/20',
      link: '/transfers/local'
    },
    {
      id: 'international',
      icon: Globe,
      titleAr: 'تحويل دولي',
      titleEn: 'International Transfer',
      titleKu: 'گواستنەوەی نێودەوڵەتی',
      descAr: 'تحويل أموال إلى جميع دول العالم',
      descEn: 'Transfer money to countries worldwide',
      descKu: 'گواستنەوەی پارە بۆ هەموو وڵاتانی جیهان',
      gradient: 'from-blue-500 to-indigo-600',
      bgGlow: 'bg-blue-500/20',
      link: '/transfers/international'
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
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ delay: 0.2 }}
              className={`inline-flex items-center gap-2 px-4 py-2 border rounded-full mb-6 ${isDark
                  ? 'bg-[#D4AF37]/10 border-[#D4AF37]/30'
                  : 'bg-gradient-to-r from-[#D4AF37]/10 to-[#FCD34D]/10 border-[#D4AF37]/20'
                }`}
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {t('خدمات التحويل', 'Transfer Services', 'خزمەتگوزارییەکانی گواستنەوە')}
              </span>
            </motion.div>

            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t('التحويلات المالية', 'Money Transfers', 'گواستنەوە داراییەکان')}
            </h1>
            <p className={`text-lg md:text-xl max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {t(
                'اختر نوع التحويل المناسب لك - محلي داخل العراق أو دولي لجميع أنحاء العالم',
                'Choose the transfer type that suits you - local within Iraq or international worldwide',
                'جۆری گواستنەوەی گونجاو هەڵبژێرە - ناوخۆیی لەناو عێراق یان نێودەوڵەتی بۆ هەموو جیهان'
              )}
            </p>
          </motion.div>

          {/* Transfer Type Cards with Floating Animation */}
          <div ref={sectionRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {transferTypes.map((type, index) => (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{
                  duration: 0.6,
                  delay: 0.3 + index * 0.15
                }}
                whileHover={{
                  y: -25,
                  scale: 1.06,
                  rotate: 0,
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
                <div className={`relative rounded-3xl p-8 md:p-10 border-2 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden ${isDark
                    ? 'bg-slate-800/70 border-slate-700 hover:border-slate-500'
                    : 'bg-white/90 border-slate-200 hover:border-slate-300'
                  } backdrop-blur-sm`}>


                  {/* Background Glow */}
                  <div className={`absolute -top-20 -right-20 w-48 h-48 ${type.bgGlow} rounded-full blur-3xl opacity-40`} />

                  {/* Shimmer Effect on Hover */}
                  <motion.div
                    className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                  />

                  {/* Gold accent on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/0 to-[#D4AF37]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

                  <div className="relative z-10">
                    <motion.div
                      className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${type.gradient} flex items-center justify-center mb-8 shadow-2xl group-hover:shadow-3xl transition-all relative`}
                      whileHover={{
                        rotate: [0, -15, 15, -10, 10, 0],
                        scale: 1.15,
                        transition: { duration: 0.6 }
                      }}
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
                      {t(type.titleAr, type.titleEn, type.titleKu)}
                    </motion.h2>

                    {/* Description */}
                    <p className={`mb-8 leading-relaxed text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {t(type.descAr, type.descEn, type.descKu)}
                    </p>

                    {/* CTA with Arrow Animation */}
                    <motion.div
                      className={`inline-flex items-center gap-3 px-6 py-3 rounded-xl text-base font-bold ${isDark
                          ? 'bg-slate-700/50 text-white group-hover:bg-[#D4AF37] group-hover:text-slate-900'
                          : 'bg-slate-100 text-slate-700 group-hover:bg-[#D4AF37] group-hover:text-slate-900'
                        } transition-all duration-300`}
                      whileHover={{ scale: 1.05, x: 5 }}
                    >
                      {t('ابدأ التحويل', 'Start Transfer', 'دەست بکە بە گواستنەوە')}
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
                  <div className={`absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 rounded-tr-lg opacity-0 group-hover:opacity-60 transition-opacity ${type.id === 'local' ? 'border-emerald-400' : 'border-blue-400'
                    }`} />
                  <div className={`absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 rounded-bl-lg opacity-0 group-hover:opacity-60 transition-opacity ${type.id === 'local' ? 'border-emerald-400' : 'border-blue-400'
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
                  {t('شركة مرخصة', 'Licensed Company', 'کۆمپانیای ڕێگەپێدراو')}
                </p>
                <p className="text-sm">
                  {t('معتمدة رسمياً', 'Officially certified', 'بە فەرمی پەسەندکراو')}
                </p>
              </div>
            </div>
            <div className={`flex items-center gap-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                <Globe className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {t('+50 دولة', '50+ Countries', '+٥٠ وڵات')}
                </p>
                <p className="text-sm">
                  {t('تغطية عالمية', 'Global coverage', 'داپۆشینی جیهانی')}
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
