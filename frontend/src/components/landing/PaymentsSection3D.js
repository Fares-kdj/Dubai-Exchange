import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { ASSETS } from '@/config/assets';
import { CreditCard, Coins, ArrowRight, Shield, Zap, Globe } from 'lucide-react';

// Payment Card Section
const PaymentCardSection = ({ isArabic, isKurdish, isDark }) => {
  const navigate = useNavigate();

  const text = {
    ar: { 
      badge: 'تعبئة البطاقات', 
      title: 'اشحن بطاقاتك بسهولة', 
      desc: 'خدمة تعبئة البطاقات المصرفية بأفضل الأسعار وأسرع وقت. ندعم جميع أنواع البطاقات المحلية والدولية.',
      cta: 'ابدأ التعبئة',
      features: ['دعم جميع البطاقات', 'عمولة منخفضة', 'تنفيذ فوري']
    },
    en: { 
      badge: 'Card Top-up', 
      title: 'Top Up Your Cards Easily', 
      desc: 'Bank card top-up service at the best rates and fastest time. We support all types of local and international cards.',
      cta: 'Start Top-up',
      features: ['All Cards Supported', 'Low Fees', 'Instant Processing']
    },
    ku: { 
      badge: 'پڕکردنەوەی کارت', 
      title: 'بە ئاسانی کارتەکانت پڕبکەوە', 
      desc: 'خزمەتگوزاری پڕکردنەوەی کارتی بانکی بە باشترین نرخ و خێراترین کات. هەموو جۆرە کارتێکی ناوخۆ و نێودەوڵەتی پشتگیری دەکەین.',
      cta: 'دەستپێکردنی پڕکردنەوە',
      features: ['پشتگیری هەموو کارتەکان', 'کرێی کەم', 'جێبەجێکردنی یەکجار']
    }
  };
  const t = text[isKurdish ? 'ku' : isArabic ? 'ar' : 'en'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
      {/* Image */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <img 
            src={ASSETS.heroCardHand}
            alt="Payment Card"
            className="w-full max-w-lg mx-auto rounded-3xl shadow-2xl"
          />
          {/* Floating Card Badge */}
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              boxShadow: [
                '0 0 20px rgba(147,51,234,0.3)',
                '0 0 40px rgba(147,51,234,0.5)',
                '0 0 20px rgba(147,51,234,0.3)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`absolute -bottom-4 -right-4 w-20 h-20 rounded-2xl flex items-center justify-center ${
              isDark ? 'bg-purple-600' : 'bg-purple-500'
            } shadow-xl`}
          >
            <CreditCard className="w-10 h-10 text-white" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <span className={`inline-block px-4 py-2 mb-6 rounded-full text-sm font-medium ${
          isDark 
            ? 'bg-purple-500/20 border border-purple-500/30 text-purple-400'
            : 'bg-purple-500/10 border border-purple-500/20 text-purple-600'
        }`}>
          {t.badge}
        </span>

        <h3 className={`text-3xl sm:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {t.title}
        </h3>

        <p className={`text-lg mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          {t.desc}
        </p>

        {/* Features */}
        <div className="flex flex-wrap gap-3 mb-8">
          {t.features.map((feature, index) => (
            <div key={index} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
              isDark ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-500/5 text-purple-600'
            }`}>
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <motion.button
          onClick={() => navigate('/card-topup')}
          whileHover={{ scale: 1.05, x: 5 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all flex items-center gap-2"
        >
          {t.cta}
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </div>
  );
};

// USDT Section
const USDTSection = ({ isArabic, isKurdish, isDark }) => {
  const navigate = useNavigate();

  const text = {
    ar: { 
      badge: 'العملات الرقمية', 
      title: 'شحن USDT', 
      desc: 'خدمة شحن العملات الرقمية USDT بأمان تام وسرعة فائقة. نضمن لك أفضل الأسعار في السوق مع دعم فني على مدار الساعة.',
      cta: 'شحن USDT',
      features: ['أمان عالي', 'أفضل الأسعار', 'دعم 24/7']
    },
    en: { 
      badge: 'Cryptocurrency', 
      title: 'USDT Recharge', 
      desc: 'Safe and fast USDT cryptocurrency recharge service. We guarantee the best market rates with 24/7 technical support.',
      cta: 'Recharge USDT',
      features: ['High Security', 'Best Rates', '24/7 Support']
    },
    ku: { 
      badge: 'دراوی دیجیتاڵ', 
      title: 'پڕکردنەوەی USDT', 
      desc: 'خزمەتگوزاری پڕکردنەوەی دراوی دیجیتاڵی USDT بە پارێزراوی تەواو و خێرایی. باشترین نرخی بازار بۆت دابین دەکەین لەگەڵ پشتگیری تەکنیکی ٢٤/٧.',
      cta: 'پڕکردنەوەی USDT',
      features: ['ئاسایشی بەرز', 'باشترین نرخ', 'پشتگیری ٢٤/٧']
    }
  };
  const t = text[isKurdish ? 'ku' : isArabic ? 'ar' : 'en'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      {/* Content */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="lg:order-1"
      >
        <span className={`inline-block px-4 py-2 mb-6 rounded-full text-sm font-medium ${
          isDark 
            ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
            : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600'
        }`}>
          {t.badge}
        </span>

        <h3 className={`text-3xl sm:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {t.title}
        </h3>

        <p className={`text-lg mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          {t.desc}
        </p>

        {/* Features */}
        <div className="flex flex-wrap gap-3 mb-8">
          {t.features.map((feature, index) => (
            <div key={index} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
              isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-500/5 text-emerald-600'
            }`}>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <motion.button
          onClick={() => navigate('/usdt')}
          whileHover={{ scale: 1.05, x: 5 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-full shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all flex items-center gap-2"
        >
          {t.cta}
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.div>

      {/* USDT Image */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="lg:order-2 relative"
      >
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotateZ: [0, 5, 0, -5, 0]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <img 
            src={ASSETS.usdtCoin}
            alt="USDT"
            className="w-full max-w-md mx-auto drop-shadow-2xl"
          />
          {/* Glow Effect */}
          <div className={`absolute inset-0 rounded-full blur-3xl -z-10 ${
            isDark ? 'bg-emerald-500/30' : 'bg-emerald-500/20'
          }`} style={{ transform: 'scale(0.8)' }} />
        </motion.div>

        {/* Floating Badge */}
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            boxShadow: [
              '0 0 20px rgba(16,185,129,0.3)',
              '0 0 40px rgba(16,185,129,0.5)',
              '0 0 20px rgba(16,185,129,0.3)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`absolute -top-4 -left-4 w-16 h-16 rounded-2xl flex items-center justify-center ${
            isDark ? 'bg-emerald-600' : 'bg-emerald-500'
          } shadow-xl`}
        >
          <Coins className="w-8 h-8 text-white" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export const PaymentsSection3D = () => {
  const { currentLanguage } = useLanguage();
  const { isDark } = useTheme();
  const isArabic = currentLanguage === 'ar';
  const isKurdish = currentLanguage === 'ku';
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const text = {
    ar: { badge: 'خدمات الدفع', title: 'حلول الدفع المتقدمة' },
    en: { badge: 'Payment Services', title: 'Advanced Payment Solutions' },
    ku: { badge: 'خزمەتگوزارییەکانی پارەدان', title: 'چارەسەرە پێشکەوتووەکانی پارەدان' }
  };
  const t = text[currentLanguage] || text.ar;

  return (
    <section 
      ref={sectionRef}
      className={`relative py-24 md:py-32 overflow-hidden transition-colors duration-500 ${
        isDark 
          ? 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900'
          : 'bg-gradient-to-b from-slate-50 via-white to-slate-50'
      }`}
      id="payments"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className={`absolute top-1/3 left-1/4 w-80 h-80 rounded-full blur-3xl ${isDark ? 'bg-purple-500/10' : 'bg-purple-500/5'}`} />
        <div className={`absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-500/5'}`} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
            className={`inline-block px-4 py-2 mb-6 rounded-full text-sm font-medium ${
              isDark 
                ? 'bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#FCD34D]'
                : 'bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#B8860B]'
            }`}
          >
            {t.badge}
          </motion.span>
          
          <h2 className={`text-3xl sm:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {t.title}
          </h2>
        </motion.div>

        {/* Payment Card Section */}
        <PaymentCardSection isArabic={isArabic} isKurdish={isKurdish} isDark={isDark} />

        {/* USDT Section */}
        <USDTSection isArabic={isArabic} isKurdish={isKurdish} isDark={isDark} />
      </div>
    </section>
  );
};

export default PaymentsSection3D;
