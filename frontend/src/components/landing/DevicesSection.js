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
      devices: [
        { icon: Smartphone, title: 'iPhone', desc: 'تطبيق سهل وسريع على هاتفك' },
        { icon: Tablet, title: 'iPad', desc: 'واجهة محسنة للأجهزة اللوحية' },
        { icon: Monitor, title: 'MacBook', desc: 'تجربة كاملة على الويب' }
      ],
      benefits: ['واجهة سهلة الاستخدام', 'تصميم متجاوب', 'أمان عالي', 'دعم 24/7']
    },
    en: {
      badge: 'Available on All Devices',
      title: 'Our Services Wherever You Are',
      subtitle: 'Enjoy a seamless experience on phone, iPad, or computer. Our services are available on all devices.',
      devices: [
        { icon: Smartphone, title: 'iPhone', desc: 'Easy and fast app on your phone' },
        { icon: Tablet, title: 'iPad', desc: 'Optimized tablet interface' },
        { icon: Monitor, title: 'MacBook', desc: 'Full web experience' }
      ],
      benefits: ['User-friendly interface', 'Responsive design', 'High security', '24/7 support']
    },
    ku: {
      badge: 'بەردەستە لە هەموو ئامێرەکان',
      title: 'خزمەتگوزاریەکانمان لەگەڵت هەر لە کوێ بیت',
      subtitle: 'چێژ لە ئەزموونێکی ئاسان وەربگرە لەسەر مۆبایل، ئایپاد، یان کۆمپیوتەر.',
      devices: [
        { icon: Smartphone, title: 'iPhone', desc: 'ئەپلیکەیشنێکی ئاسان و خێرا' },
        { icon: Tablet, title: 'iPad', desc: 'ڕووکارێکی باشتر بۆ تابلێت' },
        { icon: Monitor, title: 'MacBook', desc: 'ئەزموونی تەواو لەسەر وێب' }
      ],
      benefits: ['ڕووکاری ئاسان', 'دیزاینی گونجاو', 'ئاسایشی بەرز', 'پشتگیری ٢٤/٧']
    }
  };

  const t = text[currentLanguage] || text.ar;

  // Get device images based on theme
  const deviceImages = isDark 
    ? {
        phone: ASSETS.devicePhoneDark,
        tablet: ASSETS.deviceTabletDark,
        laptop: ASSETS.deviceLaptopDark
      }
    : {
        phone: ASSETS.devicePhoneLight,
        tablet: ASSETS.deviceTabletLight,
        laptop: ASSETS.deviceLaptopLight
      };

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

        {/* Real Device Screenshots */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* iPhone */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col items-center"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative mb-6"
            >
              <img 
                src={deviceImages.phone}
                alt="iPhone App"
                className="h-[350px] md:h-[400px] w-auto object-contain drop-shadow-2xl"
              />
              {/* Glow */}
              <div className={`absolute inset-0 rounded-3xl blur-2xl -z-10 ${
                isDark ? 'bg-purple-500/20' : 'bg-amber-300/30'
              }`} style={{ transform: 'scale(0.8)' }} />
            </motion.div>
            
            <div className={`flex items-center gap-3 p-4 rounded-2xl w-full max-w-xs ${
              isDark 
                ? 'bg-white/5 border border-white/10'
                : 'bg-white border border-amber-100 shadow-lg'
            }`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                isDark 
                  ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/30'
                  : 'bg-gradient-to-br from-amber-100 to-yellow-100'
              }`}>
                <Smartphone className={`w-6 h-6 ${isDark ? 'text-purple-400' : 'text-amber-700'}`} />
              </div>
              <div>
                <h4 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {t.devices[0].title}
                </h4>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {t.devices[0].desc}
                </p>
              </div>
            </div>
          </motion.div>

          {/* iPad */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="relative mb-6"
            >
              <img 
                src={deviceImages.tablet}
                alt="iPad App"
                className="h-[300px] md:h-[350px] w-auto object-contain drop-shadow-2xl"
              />
              {/* Glow */}
              <div className={`absolute inset-0 rounded-3xl blur-2xl -z-10 ${
                isDark ? 'bg-blue-500/20' : 'bg-yellow-300/30'
              }`} style={{ transform: 'scale(0.8)' }} />
            </motion.div>
            
            <div className={`flex items-center gap-3 p-4 rounded-2xl w-full max-w-xs ${
              isDark 
                ? 'bg-white/5 border border-white/10'
                : 'bg-white border border-amber-100 shadow-lg'
            }`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                isDark 
                  ? 'bg-gradient-to-br from-blue-500/30 to-cyan-500/30'
                  : 'bg-gradient-to-br from-yellow-100 to-amber-100'
              }`}>
                <Tablet className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-amber-700'}`} />
              </div>
              <div>
                <h4 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {t.devices[1].title}
                </h4>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {t.devices[1].desc}
                </p>
              </div>
            </div>
          </motion.div>

          {/* MacBook */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col items-center"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="relative mb-6"
            >
              <img 
                src={deviceImages.laptop}
                alt="MacBook App"
                className="h-[280px] md:h-[320px] w-auto object-contain drop-shadow-2xl"
              />
              {/* Glow */}
              <div className={`absolute inset-0 rounded-3xl blur-2xl -z-10 ${
                isDark ? 'bg-emerald-500/20' : 'bg-amber-200/40'
              }`} style={{ transform: 'scale(0.8)' }} />
            </motion.div>
            
            <div className={`flex items-center gap-3 p-4 rounded-2xl w-full max-w-xs ${
              isDark 
                ? 'bg-white/5 border border-white/10'
                : 'bg-white border border-amber-100 shadow-lg'
            }`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                isDark 
                  ? 'bg-gradient-to-br from-emerald-500/30 to-teal-500/30'
                  : 'bg-gradient-to-br from-amber-100 to-orange-100'
              }`}>
                <Monitor className={`w-6 h-6 ${isDark ? 'text-emerald-400' : 'text-amber-700'}`} />
              </div>
              <div>
                <h4 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {t.devices[2].title}
                </h4>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {t.devices[2].desc}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className={`max-w-2xl mx-auto p-6 rounded-2xl ${
            isDark 
              ? 'bg-gradient-to-r from-[#D4AF37]/10 to-amber-500/5 border border-[#D4AF37]/20'
              : 'bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200'
          }`}
        >
          <h4 className={`font-bold mb-4 text-center ${isDark ? 'text-[#D4AF37]' : 'text-amber-800'}`}>
            {isKurdish ? 'تایبەتمەندییەکان' : isArabic ? 'المميزات' : 'Features'}
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {t.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 justify-center">
                <Check className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DevicesSection;
