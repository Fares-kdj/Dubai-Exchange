import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { ASSETS } from '@/config/assets';
import { Smartphone, Tablet, Monitor, Wifi, Check } from 'lucide-react';

export const DevicesSection = () => {
  const { currentLanguage } = useLanguage();
  const { isDark } = useTheme();
  const isArabic = currentLanguage === 'ar';
  const isKurdish = currentLanguage === 'ku';
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const text = {
    ar: {
      badge: 'متاح على جميع الأجهزة',
      title: 'خدماتنا معك أينما كنت',
      subtitle: 'استمتع بتجربة سلسة على الهاتف، الآيباد، أو الكمبيوتر. خدماتنا متوفرة على جميع الأجهزة.',
      features: [
        { icon: Smartphone, title: 'الهاتف الذكي', desc: 'تطبيق سهل وسريع' },
        { icon: Tablet, title: 'الآيباد', desc: 'واجهة محسنة للأجهزة اللوحية' },
        { icon: Monitor, title: 'الكمبيوتر', desc: 'تجربة كاملة على الويب' }
      ],
      benefits: ['واجهة سهلة الاستخدام', 'تصميم متجاوب', 'أمان عالي', 'دعم 24/7']
    },
    en: {
      badge: 'Available on All Devices',
      title: 'Our Services Wherever You Are',
      subtitle: 'Enjoy a seamless experience on phone, iPad, or computer. Our services are available on all devices.',
      features: [
        { icon: Smartphone, title: 'Smartphone', desc: 'Easy and fast app' },
        { icon: Tablet, title: 'iPad', desc: 'Optimized tablet interface' },
        { icon: Monitor, title: 'Computer', desc: 'Full web experience' }
      ],
      benefits: ['User-friendly interface', 'Responsive design', 'High security', '24/7 support']
    },
    ku: {
      badge: 'بەردەستە لە هەموو ئامێرەکان',
      title: 'خزمەتگوزاریەکانمان لەگەڵت هەر لە کوێ بیت',
      subtitle: 'چێژ لە ئەزموونێکی ئاسان وەربگرە لەسەر مۆبایل، ئایپاد، یان کۆمپیوتەر.',
      features: [
        { icon: Smartphone, title: 'مۆبایلی زیرەک', desc: 'ئەپلیکەیشنێکی ئاسان و خێرا' },
        { icon: Tablet, title: 'ئایپاد', desc: 'ڕووکارێکی باشتر بۆ تابلێت' },
        { icon: Monitor, title: 'کۆمپیوتەر', desc: 'ئەزموونی تەواو لەسەر وێب' }
      ],
      benefits: ['ڕووکاری ئاسان', 'دیزاینی گونجاو', 'ئاسایشی بەرز', 'پشتگیری ٢٤/٧']
    }
  };

  const t = text[currentLanguage] || text.ar;

  return (
    <section 
      ref={sectionRef}
      className={`relative py-24 md:py-32 overflow-hidden transition-colors duration-500 ${
        isDark 
          ? 'bg-gradient-to-b from-slate-800 to-slate-900'
          : 'bg-gradient-to-b from-amber-50/50 via-white to-yellow-50/50'
      }`}
      id="devices"
    >
      {/* Background Decorations */}
      <div className="absolute inset-0">
        {!isDark && (
          <>
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-amber-100/60 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-yellow-100/50 to-transparent rounded-full blur-3xl" />
          </>
        )}
        {isDark && (
          <>
            <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
          </>
        )}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
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
                ? 'bg-purple-500/20 border border-purple-500/30 text-purple-400'
                : 'bg-amber-500/10 border border-amber-500/30 text-amber-700'
            }`}
          >
            <Wifi className="w-4 h-4" />
            {t.badge}
          </motion.span>
          
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            {t.title}
          </h2>
          
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {t.subtitle}
          </p>
        </motion.div>

        {/* Devices Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Device Images */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative h-[400px] md:h-[500px]"
          >
            {/* Phone */}
            <motion.div
              className="absolute left-0 bottom-0 w-[40%] z-30"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <img 
                src={ASSETS.devicePhone}
                alt="Phone App"
                className={`w-full h-auto drop-shadow-2xl ${!isDark ? 'ring-4 ring-amber-100/50 rounded-3xl' : ''}`}
              />
            </motion.div>

            {/* Laptop & Tablet */}
            <motion.div
              className="absolute right-0 top-0 w-[75%] z-20"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <img 
                src={ASSETS.deviceLaptopTablet}
                alt="Laptop and Tablet"
                className={`w-full h-auto drop-shadow-2xl ${!isDark ? 'ring-4 ring-yellow-100/50 rounded-3xl' : ''}`}
              />
            </motion.div>

            {/* Glow Effect */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-3xl -z-10 ${
              isDark ? 'bg-purple-500/20' : 'bg-amber-300/30'
            }`} />
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            {/* Device Types */}
            <div className="space-y-4 mb-8">
              {t.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className={`flex items-center gap-4 p-5 rounded-2xl transition-all ${
                    isDark 
                      ? 'bg-white/5 border border-white/10 hover:bg-white/10'
                      : 'bg-white border border-amber-100 shadow-lg hover:shadow-xl hover:border-amber-200'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                    isDark 
                      ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/30'
                      : 'bg-gradient-to-br from-amber-100 to-yellow-100'
                  }`}>
                    <feature.icon className={`w-7 h-7 ${
                      isDark ? 'text-purple-400' : 'text-amber-700'
                    }`} />
                  </div>
                  <div>
                    <h4 className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {feature.title}
                    </h4>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Benefits */}
            <div className={`p-6 rounded-2xl ${
              isDark 
                ? 'bg-gradient-to-r from-[#D4AF37]/10 to-amber-500/5 border border-[#D4AF37]/20'
                : 'bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200'
            }`}>
              <h4 className={`font-bold mb-4 ${isDark ? 'text-[#D4AF37]' : 'text-amber-800'}`}>
                {isKurdish ? 'تایبەتمەندییەکان' : isArabic ? 'المميزات' : 'Features'}
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {t.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DevicesSection;
