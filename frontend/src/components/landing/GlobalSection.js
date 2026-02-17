import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { ASSETS } from '@/config/assets';
import { Globe, ArrowRight, Zap, Shield, Clock, Banknote } from 'lucide-react';

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
      subtitle: 'نوفر خدمات تحويل الأموال إلى جميع دول العالم بأسرع وقت وأفضل الأسعار. بغض النظر عن وجهتك، نحن معك.',
      features: [
        { icon: Globe, title: 'جميع دول العالم', desc: 'تغطية شاملة بدون استثناء' },
        { icon: Zap, title: 'تحويل فوري', desc: 'استلام المبالغ خلال دقائق' },
        { icon: Shield, title: 'آمن ومضمون', desc: 'حماية كاملة لتحويلاتك' },
        { icon: Clock, title: '24/7', desc: 'خدمة متواصلة على مدار الساعة' }
      ],
      examplesTitle: 'أمثلة على بعض الوجهات',
      cta: 'ابدأ التحويل الآن'
    },
    en: {
      badge: 'Global Coverage',
      title: 'Transfers to All Countries Worldwide',
      subtitle: 'We provide money transfer services to all countries in the world with fastest delivery and best rates. No matter your destination, we are with you.',
      features: [
        { icon: Globe, title: 'All Countries', desc: 'Complete coverage without exception' },
        { icon: Zap, title: 'Instant Transfer', desc: 'Receive funds within minutes' },
        { icon: Shield, title: 'Safe & Secure', desc: 'Complete protection for transfers' },
        { icon: Clock, title: '24/7', desc: 'Round-the-clock service' }
      ],
      examplesTitle: 'Examples of some destinations',
      cta: 'Start Transfer Now'
    },
    ku: {
      badge: 'داپۆشینی جیهانی',
      title: 'گواستنەوە بۆ هەموو وڵاتەکانی جیهان',
      subtitle: 'خزمەتگوزاری گواستنەوەی پارە بۆ هەموو وڵاتەکانی جیهان پێشکەش دەکەین بە خێراترین کات و باشترین نرخ.',
      features: [
        { icon: Globe, title: 'هەموو وڵاتەکان', desc: 'داپۆشینی تەواو بێ جیاوازی' },
        { icon: Zap, title: 'گواستنەوەی یەکجار', desc: 'وەرگرتنی بڕەکان لە خولەکدا' },
        { icon: Shield, title: 'پارێزراو و دڵنیا', desc: 'پاراستنی تەواو بۆ گواستنەوەکانت' },
        { icon: Clock, title: '٢٤/٧', desc: 'خزمەتگوزاری بەردەوام' }
      ],
      examplesTitle: 'نموونەی هەندێک لە مەبەستەکان',
      cta: 'دەستپێکردنی گواستنەوە'
    }
  };

  const t = text[currentLanguage] || text.ar;

  // Example countries with flags (just examples, we support ALL countries)
  const exampleCountries = [
    { flag: '🇦🇪', nameAr: 'الإمارات', nameEn: 'UAE', nameKu: 'ئیمارات' },
    { flag: '🇸🇦', nameAr: 'السعودية', nameEn: 'Saudi Arabia', nameKu: 'سعودیە' },
    { flag: '🇹🇷', nameAr: 'تركيا', nameEn: 'Turkey', nameKu: 'تورکیا' },
    { flag: '🇯🇴', nameAr: 'الأردن', nameEn: 'Jordan', nameKu: 'ئوردن' },
    { flag: '🇪🇬', nameAr: 'مصر', nameEn: 'Egypt', nameKu: 'میسر' },
    { flag: '🇱🇧', nameAr: 'لبنان', nameEn: 'Lebanon', nameKu: 'لوبنان' },
    { flag: '🇰🇼', nameAr: 'الكويت', nameEn: 'Kuwait', nameKu: 'کوەیت' },
    { flag: '🇶🇦', nameAr: 'قطر', nameEn: 'Qatar', nameKu: 'قەتەر' },
    { flag: '🇧🇭', nameAr: 'البحرين', nameEn: 'Bahrain', nameKu: 'بەحرەین' },
    { flag: '🇮🇷', nameAr: 'إيران', nameEn: 'Iran', nameKu: 'ئێران' },
    { flag: '🇮🇳', nameAr: 'الهند', nameEn: 'India', nameKu: 'هیندستان' },
    { flag: '🇵🇰', nameAr: 'باكستان', nameEn: 'Pakistan', nameKu: 'پاکستان' },
    { flag: '🇩🇪', nameAr: 'ألمانيا', nameEn: 'Germany', nameKu: 'ئەڵمانیا' },
    { flag: '🇬🇧', nameAr: 'بريطانيا', nameEn: 'UK', nameKu: 'بەریتانیا' },
    { flag: '🇺🇸', nameAr: 'أمريكا', nameEn: 'USA', nameKu: 'ئەمریکا' },
    { flag: '🇨🇳', nameAr: 'الصين', nameEn: 'China', nameKu: 'چین' }
  ];

  const getCountryName = (country) => {
    if (isKurdish) return country.nameKu;
    if (isArabic) return country.nameAr;
    return country.nameEn;
  };

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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
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

          <p className={`text-lg max-w-3xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {t.subtitle}
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {t.features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`p-5 rounded-2xl text-center transition-colors ${
                isDark 
                  ? 'bg-white/5 border border-white/10 hover:bg-white/10'
                  : 'bg-white border border-slate-200 shadow-sm hover:shadow-md'
              }`}
            >
              <feature.icon className={`w-10 h-10 mx-auto mb-3 ${
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
        </motion.div>

        {/* Example Countries - Flowing Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={`p-8 rounded-3xl ${
            isDark 
              ? 'bg-white/5 backdrop-blur-xl border border-white/10'
              : 'bg-white/80 backdrop-blur-xl border border-slate-200 shadow-2xl'
          }`}
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <Banknote className={`w-6 h-6 ${isDark ? 'text-[#D4AF37]' : 'text-amber-600'}`} />
            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t.examplesTitle}
            </h3>
          </div>

          {/* Animated Flags Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-4 mb-8">
            {exampleCountries.map((country, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.5 + index * 0.03 }}
                whileHover={{ scale: 1.1, y: -5 }}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-colors cursor-pointer ${
                  isDark 
                    ? 'bg-white/5 hover:bg-white/10'
                    : 'bg-slate-50 hover:bg-amber-50 border border-slate-100'
                }`}
              >
                <span className="text-3xl">{country.flag}</span>
                <span className={`text-xs font-medium text-center ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {getCountryName(country)}
                </span>
              </motion.div>
            ))}
          </div>

          {/* "And more" indicator */}
          <div className="flex items-center justify-center gap-2">
            <div className="flex -space-x-2">
              {['🇫🇷', '🇮🇹', '🇪🇸', '🇯🇵', '🇧🇷'].map((flag, i) => (
                <span key={i} className="text-2xl opacity-60">{flag}</span>
              ))}
            </div>
            <span className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {isKurdish ? 'و هەموو وڵاتەکانی تر...' : isArabic ? 'وجميع دول العالم الأخرى...' : 'and all other countries...'}
            </span>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/transfers'}
            className={`px-8 py-4 rounded-full font-bold inline-flex items-center gap-2 shadow-xl transition-all ${
              isDark 
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-blue-500/30'
                : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:shadow-blue-600/30'
            }`}
          >
            {t.cta}
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default GlobalSection;
