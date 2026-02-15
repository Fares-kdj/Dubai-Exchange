import React, { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { ASSETS } from '@/config/assets';
import { Shield, Award, CheckCircle } from 'lucide-react';

export const TrustSection3D = () => {
  const { currentLanguage } = useLanguage();
  const isArabic = currentLanguage === 'ar';
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  const trustPoints = [
    {
      icon: Shield,
      titleAr: 'مرخصة من البنك المركزي',
      titleEn: 'Licensed by Central Bank',
      descAr: 'نعمل تحت إشراف البنك المركزي العراقي',
      descEn: 'Operating under the supervision of the Central Bank of Iraq'
    },
    {
      icon: Award,
      titleAr: '+15 سنة خبرة',
      titleEn: '15+ Years Experience',
      descAr: 'خبرة واسعة في مجال الصرافة والتحويلات',
      descEn: 'Extensive experience in exchange and transfers'
    },
    {
      icon: CheckCircle,
      titleAr: '+10,000 عميل',
      titleEn: '10,000+ Clients',
      descAr: 'ثقة آلاف العملاء تدعم نجاحنا',
      descEn: 'Thousands of satisfied customers trust us'
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-slate-900 overflow-hidden"
      id="trust"
    >
      {/* Parallax Background Images */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          style={{ y: y1 }}
          className="absolute top-0 left-0 w-1/2 h-full opacity-20"
        >
          <img 
            src={ASSETS.cbiBuilding1}
            alt="Central Bank Building"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-transparent" />
        </motion.div>
        
        <motion.div 
          style={{ y: y2 }}
          className="absolute top-20 right-0 w-1/2 h-full opacity-15"
        >
          <img 
            src={ASSETS.cbiBuilding2}
            alt="Central Bank Building"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-slate-900 to-transparent" />
        </motion.div>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-900/70" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: CBI Logo Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className={`${isArabic ? 'lg:order-2' : 'lg:order-1'}`}
          >
            <div className="relative">
              {/* Glass Card with CBI Logo */}
              <motion.div
                whileHover={{ scale: 1.02, rotateY: 5 }}
                className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden"
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

                  <h3 className="text-2xl font-bold text-white text-center mb-2">
                    {isArabic ? 'البنك المركزي العراقي' : 'Central Bank of Iraq'}
                  </h3>
                  
                  <p className="text-slate-400 text-center">
                    {isArabic ? 'موثوق ومرخص رسمياً' : 'Trusted and Officially Licensed'}
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
                ✓ {isArabic ? 'مرخص' : 'Licensed'}
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Trust Points */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className={`${isArabic ? 'lg:order-1' : 'lg:order-2'}`}
          >
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-2 mb-6 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-sm font-medium"
            >
              {isArabic ? 'لماذا نحن؟' : 'Why Us?'}
            </motion.span>

            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">
              {isArabic ? 'ثقة وأمان' : 'Trust & Security'}
            </h2>

            <p className="text-lg text-slate-400 mb-10">
              {isArabic 
                ? 'نفخر بكوننا شركة مرخصة من قبل البنك المركزي العراقي، مما يضمن لك أعلى معايير الأمان والموثوقية.'
                : 'We pride ourselves on being licensed by the Central Bank of Iraq, ensuring the highest standards of security and reliability.'
              }
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
                  <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#D4AF37]/30 transition-colors">
                    <point.icon className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">
                      {isArabic ? point.titleAr : point.titleEn}
                    </h4>
                    <p className="text-slate-400 text-sm">
                      {isArabic ? point.descAr : point.descEn}
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
