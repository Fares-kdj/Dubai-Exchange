import React, { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { ASSETS } from '@/config/assets';
import { Shield, Award, CheckCircle } from 'lucide-react';

export const TrustSection3D = () => {
  const { currentLanguage } = useLanguage();
  const { isDark } = useTheme();
  const isArabic = currentLanguage === 'ar';
  const isKurdish = currentLanguage === 'ku';
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [50, -50]);

  const text = {
    ar: {
      badge: 'لماذا نحن؟',
      title: 'ثقة وأمان',
      subtitle: 'نفخر بكوننا شركة مرخصة من قبل البنك المركزي العراقي، مما يضمن لك أعلى معايير الأمان والموثوقية.',
      cbiTitle: 'البنك المركزي العراقي',
      cbiSubtitle: 'موثوق ومرخص رسمياً',
      licensed: 'مرخص'
    },
    en: {
      badge: 'Why Us?',
      title: 'Trust & Security',
      subtitle: 'We pride ourselves on being licensed by the Central Bank of Iraq, ensuring the highest standards of security and reliability.',
      cbiTitle: 'Central Bank of Iraq',
      cbiSubtitle: 'Trusted and Officially Licensed',
      licensed: 'Licensed'
    },
    ku: {
      badge: 'بۆچی ئێمە؟',
      title: 'متمانە و پاراستن',
      subtitle: 'شانازی دەکەین بە بوونمان بە کۆمپانیای مۆڵەتدار لەلایەن بانکی ناوەندیی عێراقەوە، کە ستانداردە بەرزترینەکانی ئاسایش و جێبەجێبوون بۆت دابین دەکات.',
      cbiTitle: 'بانکی ناوەندیی عێراق',
      cbiSubtitle: 'متمانەپێکراو و مۆڵەتدار بە فەرمی',
      licensed: 'مۆڵەتدار'
    }
  };

  const t = text[currentLanguage] || text.ar;

  const trustPoints = [
    {
      icon: Shield,
      titleAr: 'مرخصة من البنك المركزي',
      titleEn: 'Licensed by Central Bank',
      titleKu: 'مۆڵەتدار لە بانکی ناوەندی',
      descAr: 'نعمل تحت إشراف البنك المركزي العراقي',
      descEn: 'Operating under the supervision of the Central Bank of Iraq',
      descKu: 'کاردەکەین لەژێر چاودێری بانکی ناوەندیی عێراق'
    },
    {
      icon: Award,
      titleAr: '+15 سنة خبرة',
      titleEn: '15+ Years Experience',
      titleKu: '+١٥ ساڵ ئەزموون',
      descAr: 'خبرة واسعة في مجال الصرافة والتحويلات',
      descEn: 'Extensive experience in exchange and transfers',
      descKu: 'ئەزموونی فراوان لە بواری ئاڵوگۆڕ و گواستنەوە'
    },
    {
      icon: CheckCircle,
      titleAr: '+10,000 عميل',
      titleEn: '10,000+ Clients',
      titleKu: '+١٠،٠٠٠ کڕیار',
      descAr: 'ثقة آلاف العملاء تدعم نجاحنا',
      descEn: 'Thousands of satisfied customers trust us',
      descKu: 'متمانەی هەزاران کڕیار پشتگیری سەرکەوتنمان دەکەن'
    }
  ];

  const getTitle = (point) => isKurdish ? point.titleKu : isArabic ? point.titleAr : point.titleEn;
  const getDesc = (point) => isKurdish ? point.descKu : isArabic ? point.descAr : point.descEn;

  return (
    <section 
      ref={sectionRef}
      className={`relative py-24 md:py-32 overflow-hidden transition-colors duration-500 ${
        isDark ? 'bg-slate-900' : 'bg-slate-100'
      }`}
      id="trust"
    >
      {/* Parallax Background Images */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          style={{ y: y1 }}
          className={`absolute top-0 left-0 w-1/2 h-full ${isDark ? 'opacity-20' : 'opacity-10'}`}
        >
          <img 
            src={ASSETS.cbiBuilding1}
            alt="Central Bank Building"
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${isDark ? 'from-slate-900' : 'from-slate-100'} to-transparent`} />
        </motion.div>
        
        <motion.div 
          style={{ y: y2 }}
          className={`absolute top-20 right-0 w-1/2 h-full ${isDark ? 'opacity-15' : 'opacity-10'}`}
        >
          <img 
            src={ASSETS.cbiBuilding2}
            alt="Central Bank Building"
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-l ${isDark ? 'from-slate-900' : 'from-slate-100'} to-transparent`} />
        </motion.div>
      </div>

      {/* Overlay */}
      <div className={`absolute inset-0 ${isDark ? 'bg-slate-900/70' : 'bg-slate-100/80'}`} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: CBI Logo Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className={`${isArabic || isKurdish ? 'lg:order-2' : 'lg:order-1'}`}
          >
            <div className="relative">
              {/* Glass Card with CBI Logo */}
              <motion.div
                whileHover={{ scale: 1.02, rotateY: 5 }}
                className={`backdrop-blur-2xl border rounded-3xl p-8 md:p-12 relative overflow-hidden ${
                  isDark 
                    ? 'bg-white/5 border-white/10'
                    : 'bg-white border-slate-200 shadow-xl'
                }`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Glow Effect */}
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#D4AF37]/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl" />

                {/* CBI Logo */}
                <div className="relative z-10 flex flex-col items-center">
                  <motion.div
                    animate={{ 
                      boxShadow: [
                        '0 0 20px rgba(212,175,55,0.3)',
                        '0 0 40px rgba(212,175,55,0.5)',
                        '0 0 20px rgba(212,175,55,0.3)'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-full p-4 mb-6 shadow-2xl"
                  >
                    <img 
                      src={ASSETS.cbiLogo}
                      alt="Central Bank of Iraq"
                      className="w-full h-full object-contain"
                      data-testid="cbi-logo"
                    />
                  </motion.div>

                  <h3 className={`text-2xl font-bold text-center mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {t.cbiTitle}
                  </h3>
                  
                  <p className={`text-center ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {t.cbiSubtitle}
                  </p>
                </div>
              </motion.div>

              {/* Floating Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.5, type: "spring" }}
                className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
              >
                ✓ {t.licensed}
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Trust Points */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className={`${isArabic || isKurdish ? 'lg:order-1' : 'lg:order-2'}`}
          >
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2 }}
              className={`inline-block px-4 py-2 mb-6 rounded-full text-sm font-medium ${
                isDark 
                  ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                  : 'bg-green-500/10 border border-green-500/20 text-green-600'
              }`}
            >
              {t.badge}
            </motion.span>

            <h2 className={`text-3xl sm:text-5xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t.title}
            </h2>

            <p className={`text-lg mb-10 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {t.subtitle}
            </p>

            {/* Trust Points */}
            <div className="space-y-6">
              {trustPoints.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-4 group"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                    isDark 
                      ? 'bg-[#D4AF37]/20 group-hover:bg-[#D4AF37]/30'
                      : 'bg-[#D4AF37]/10 group-hover:bg-[#D4AF37]/20'
                  }`}>
                    <point.icon className={`w-6 h-6 ${isDark ? 'text-[#D4AF37]' : 'text-[#B8860B]'}`} />
                  </div>
                  <div>
                    <h4 className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {getTitle(point)}
                    </h4>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {getDesc(point)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection3D;
