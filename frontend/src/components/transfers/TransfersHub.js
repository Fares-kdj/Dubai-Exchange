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

          {/* Transfer Type Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {transferTypes.map((type, index) => (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ 
                  y: -10, 
                  rotateY: 5,
                  rotateX: -5,
                  transition: { duration: 0.3 }
                }}
                onClick={() => navigate(type.link)}
                className="cursor-pointer group perspective-1000"
                data-testid={`transfer-card-${type.id}`}
              >
                <div className={`relative rounded-3xl p-8 md:p-10 border-2 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden ${
                  isDark 
                    ? 'bg-slate-800/50 border-slate-700 hover:border-slate-600' 
                    : 'bg-white border-slate-100 hover:border-slate-200'
                }`}>
                  {/* Background Glow */}
                  <div className={`absolute -top-20 -right-20 w-40 h-40 ${type.bgGlow} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  {/* Gold accent on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/0 to-[#D4AF37]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

                  <div className="relative z-10">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${type.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow`}
                    >
                      <type.icon className="w-10 h-10 text-white" />
                    </motion.div>

                    {/* Title */}
                    <h2 className={`text-2xl md:text-3xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900 group-hover:text-slate-800'}`}>
                      {currentLanguage === 'ar' ? type.titleAr : type.titleEn}
                    </h2>

                    {/* Description */}
                    <p className={`mb-6 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {currentLanguage === 'ar' ? type.descAr : type.descEn}
                    </p>

                    {/* CTA */}
                    <div className={`flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all ${
                      isDark ? 'text-slate-300 group-hover:text-white' : 'text-slate-700 group-hover:text-slate-900'
                    }`}>
                      {currentLanguage === 'ar' ? 'ابدأ التحويل' : 'Start Transfer'}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
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
