import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { ASSETS } from '@/config/assets';
import { Globe, MapPin, ArrowRight, Check, Zap, Shield, Clock } from 'lucide-react';

export const GlobalSection = () => {
  const { currentLanguage } = useLanguage();
  const { isDark } = useTheme();
  const isArabic = currentLanguage === 'ar';
  const isKurdish = currentLanguage === 'ku';
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const text = {
    ar: {
      badge: 'تغطية عالمية',
      title: 'تحويلات لجميع دول العالم',
      subtitle: 'نوفر خدمات تحويل الأموال إلى أكثر من 50 دولة حول العالم بأسرع وقت وأفضل الأسعار',
      features: [
        { icon: Globe, title: '+50 دولة', desc: 'تغطية شاملة لمعظم دول العالم' },
        { icon: Zap, title: 'تحويل فوري', desc: 'استلام المبالغ خلال دقائق' },
        { icon: Shield, title: 'آمن ومضمون', desc: 'حماية كاملة لتحويلاتك' },
        { icon: Clock, title: '24/7', desc: 'خدمة متواصلة على مدار الساعة' }
      ],
      countries: ['الإمارات', 'السعودية', 'تركيا', 'الأردن', 'مصر', 'لبنان', 'الكويت', 'قطر', 'البحرين', 'إيران', 'الهند', 'باكستان'],
      cta: 'ابدأ التحويل الآن'
    },
    en: {
      badge: 'Global Coverage',
      title: 'Transfers to All Countries',
      subtitle: 'We provide money transfer services to more than 50 countries worldwide with fastest delivery and best rates',
      features: [
        { icon: Globe, title: '50+ Countries', desc: 'Comprehensive coverage worldwide' },
        { icon: Zap, title: 'Instant Transfer', desc: 'Receive funds within minutes' },
        { icon: Shield, title: 'Safe & Secure', desc: 'Complete protection for transfers' },
        { icon: Clock, title: '24/7', desc: 'Round-the-clock service' }
      ],
      countries: ['UAE', 'Saudi Arabia', 'Turkey', 'Jordan', 'Egypt', 'Lebanon', 'Kuwait', 'Qatar', 'Bahrain', 'Iran', 'India', 'Pakistan'],
      cta: 'Start Transfer Now'
    },
    ku: {
      badge: 'داپۆشینی جیهانی',
      title: 'گواستنەوە بۆ هەموو وڵاتەکان',
      subtitle: 'خزمەتگوزاری گواستنەوەی پارە بۆ زیاتر لە ٥٠ وڵات لە جیهاندا پێشکەش دەکەین',
      features: [
        { icon: Globe, title: '+٥٠ وڵات', desc: 'داپۆشینی تەواو بۆ زۆربەی وڵاتەکانی جیهان' },
        { icon: Zap, title: 'گواستنەوەی یەکجار', desc: 'وەرگرتنی بڕەکان لە خولەکدا' },
        { icon: Shield, title: 'پارێزراو و دڵنیا', desc: 'پاراستنی تەواو بۆ گواستنەوەکانت' },
        { icon: Clock, title: '٢٤/٧', desc: 'خزمەتگوزاری بەردەوام' }
      ],
      countries: ['ئیمارات', 'سعودیە', 'تورکیا', 'ئوردن', 'میسر', 'لوبنان', 'کوەیت', 'قەتەر', 'بەحرەین', 'ئێران', 'هیندستان', 'پاکستان'],
      cta: 'دەستپێکردنی گواستنەوە'
    }
  };

  const t = text[currentLanguage] || text.ar;

  // Country flags
  const countryFlags = ['🇦🇪', '🇸🇦', '🇹🇷', '🇯🇴', '🇪🇬', '🇱🇧', '🇰🇼', '🇶🇦', '🇧🇭', '🇮🇷', '🇮🇳', '🇵🇰'];

  return (
    <section 
      ref={sectionRef}
      className={`relative py-24 md:py-32 overflow-hidden transition-colors duration-500 ${
        isDark 
          ? 'bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900'
          : 'bg-gradient-to-b from-blue-50 via-indigo-50 to-white'
      }`}
      id="global"
    >
      {/* Background */}
      <div className="absolute inset-0">
        {/* Globe Image in Background */}
        <div className={`absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] ${
          isDark ? 'opacity-30' : 'opacity-20'
        }`}>
          <img 
            src={ASSETS.globalNetwork}
            alt="Global Network"
            className="w-full h-full object-contain"
          />
        </div>
        
        {/* Decorative Elements */}
        <div className={`absolute top-20 left-20 w-64 h-64 rounded-full blur-3xl ${
          isDark ? 'bg-blue-500/20' : 'bg-blue-400/20'
        }`} />
        <div className={`absolute bottom-20 right-20 w-80 h-80 rounded-full blur-3xl ${
          isDark ? 'bg-[#D4AF37]/10' : 'bg-amber-300/20'
        }`} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2 }}
              className={`inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full text-sm font-medium ${
                isDark 
                  ? 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
                  : 'bg-blue-500/10 border border-blue-500/20 text-blue-600'
              }`}
            >
              <Globe className="w-4 h-4" />
              {t.badge}
            </motion.span>

            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              {t.title}
            </h2>

            <p className={`text-lg mb-8 max-w-xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {t.subtitle}
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {t.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className={`p-4 rounded-2xl transition-colors ${
                    isDark 
                      ? 'bg-white/5 border border-white/10 hover:bg-white/10'
                      : 'bg-white border border-slate-200 shadow-sm hover:shadow-md'
                  }`}
                >
                  <feature.icon className={`w-8 h-8 mb-2 ${
                    isDark ? 'text-[#D4AF37]' : 'text-blue-600'
                  }`} />
                  <h4 className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {feature.title}
                  </h4>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/transfers'}
              className={`px-8 py-4 rounded-full font-bold flex items-center gap-2 shadow-xl transition-all ${
                isDark 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-blue-500/30'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:shadow-blue-600/30'
              }`}
            >
              {t.cta}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>

          {/* Countries Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className={`p-8 rounded-3xl ${
              isDark 
                ? 'bg-white/5 backdrop-blur-xl border border-white/10'
                : 'bg-white/80 backdrop-blur-xl border border-slate-200 shadow-2xl'
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <MapPin className={`w-6 h-6 ${isDark ? 'text-[#D4AF37]' : 'text-amber-600'}`} />
                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {isKurdish ? 'وڵاتە پشتگیریکراوەکان' : isArabic ? 'الدول المدعومة' : 'Supported Countries'}
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {t.countries.map((country, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className={`flex items-center gap-2 p-3 rounded-xl transition-colors ${
                      isDark 
                        ? 'bg-white/5 hover:bg-white/10'
                        : 'bg-slate-50 hover:bg-amber-50 border border-slate-100'
                    }`}
                  >
                    <span className="text-xl">{countryFlags[index]}</span>
                    <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {country}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* More Countries Badge */}
              <div className={`mt-6 pt-6 border-t flex items-center justify-center gap-2 ${
                isDark ? 'border-white/10' : 'border-slate-200'
              }`}>
                <Check className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {isKurdish ? 'و زیاتر...' : isArabic ? 'والمزيد...' : 'and many more...'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GlobalSection;
