import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { SERVICES } from '@/config/assets';
import { Plane, Send, CreditCard, Coins, ArrowRight } from 'lucide-react';

const iconMap = {
  plane: Plane,
  send: Send,
  'credit-card': CreditCard,
  coins: Coins
};

const ServiceCard = ({ service, index, isArabic, isKurdish, isDark }) => {
  const navigate = useNavigate();
  const Icon = iconMap[service.icon] || CreditCard;

  const gradients = [
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-teal-500',
    'from-purple-500 to-pink-500',
    'from-amber-500 to-orange-500'
  ];

  const ctaText = {
    ar: 'ابدأ الآن',
    en: 'Start Now',
    ku: 'دەست پێبکە'
  };

  const getTitle = () => {
    if (isKurdish && service.titleKu) return service.titleKu;
    if (isArabic) return service.titleAr;
    return service.titleEn;
  };

  const getDesc = () => {
    if (isKurdish && service.descKu) return service.descKu;
    if (isArabic) return service.descAr;
    return service.descEn;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateY: -15 }}
      whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      whileHover={{ 
        scale: 1.05, 
        rotateY: 5,
        z: 50 
      }}
      style={{ transformStyle: 'preserve-3d' }}
      className="group cursor-pointer perspective-1000"
      onClick={() => navigate(service.link)}
      data-testid={`service-card-${service.id}`}
    >
      <div className={`relative backdrop-blur-xl border rounded-3xl p-8 h-full overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-[#D4AF37]/20 ${
        isDark 
          ? 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/30'
          : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-[#D4AF37]/30 shadow-lg'
      }`}>
        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index % 4]} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
        
        {/* Glow Effect */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#D4AF37]/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Icon */}
        <motion.div
          whileHover={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
          className={`w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br ${gradients[index % 4]} flex items-center justify-center shadow-lg`}
        >
          <Icon className="w-8 h-8 text-white" />
        </motion.div>

        {/* Title */}
        <h3 className={`text-xl font-bold mb-3 transition-colors ${
          isDark 
            ? 'text-white group-hover:text-[#FCD34D]'
            : 'text-slate-900 group-hover:text-[#B8860B]'
        }`}>
          {getTitle()}
        </h3>

        {/* Description */}
        <p className={`text-sm leading-relaxed mb-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          {getDesc()}
        </p>

        {/* CTA */}
        <div className={`flex items-center gap-2 font-medium group-hover:gap-3 transition-all ${
          isDark ? 'text-[#D4AF37]' : 'text-[#B8860B]'
        }`}>
          <span>{isKurdish ? ctaText.ku : isArabic ? ctaText.ar : ctaText.en}</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </motion.div>
  );
};

export const ServicesSection3D = () => {
  const { currentLanguage } = useLanguage();
  const { isDark } = useTheme();
  const isArabic = currentLanguage === 'ar';
  const isKurdish = currentLanguage === 'ku';
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const text = {
    ar: {
      badge: 'خدماتنا',
      title: 'خدمات مالية متكاملة',
      subtitle: 'نقدم مجموعة شاملة من الخدمات المالية لتلبية جميع احتياجاتك'
    },
    en: {
      badge: 'Our Services',
      title: 'Complete Financial Services',
      subtitle: 'We offer a comprehensive range of financial services to meet all your needs'
    },
    ku: {
      badge: 'خزمەتگوزاریەکانمان',
      title: 'خزمەتگوزارییە دارایییە تەواوەکان',
      subtitle: 'کۆمەڵێک تەواوی خزمەتگوزارییە دارایییەکان پێشکەش دەکەین بۆ دابینکردنی هەموو پێداویستییەکانت'
    }
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
      id="services"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl ${isDark ? 'bg-[#D4AF37]/10' : 'bg-[#D4AF37]/5'}`} />
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl ${isDark ? 'bg-blue-500/10' : 'bg-blue-500/5'}`} />
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
          
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {t.subtitle}
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service, index) => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              index={index}
              isArabic={isArabic}
              isKurdish={isKurdish}
              isDark={isDark}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection3D;
