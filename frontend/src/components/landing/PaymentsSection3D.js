import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, Html, useProgress } from '@react-three/drei';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { ASSETS } from '@/config/assets';

// Loader
const Loader = () => {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
    </Html>
  );
};

// Simple 3D Card Shape
const Card3D = () => {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.3;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh ref={ref}>
        <boxGeometry args={[3.5, 2.2, 0.1]} />
        <meshStandardMaterial 
          color="#8B5CF6" 
          metalness={0.8} 
          roughness={0.2}
        />
      </mesh>
      {/* Card chip */}
      <mesh position={[-0.8, 0.3, 0.06]}>
        <boxGeometry args={[0.5, 0.4, 0.02]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.1} />
      </mesh>
    </Float>
  );
};

// Simple 3D Coin Shape - Facing Camera
const Coin3D = () => {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      // Rotate on Y axis but keep facing camera
      ref.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={ref} rotation={[Math.PI / 2, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[1.5, 1.5, 0.3, 32]} />
          <meshStandardMaterial 
            color="#10B981" 
            metalness={0.9} 
            roughness={0.1}
          />
        </mesh>
        {/* T symbol on coin - front face */}
        <mesh position={[0, 0.16, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.6, 0.1, 0.1]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0, 0.16, -0.2]}>
          <boxGeometry args={[0.1, 0.5, 0.1]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>
    </Float>
  );
};

// Payment Card Section
const PaymentCardSection = ({ isArabic, isKurdish, isDark }) => {
  const navigate = useNavigate();

  const text = {
    ar: { badge: 'تعبئة البطاقات', title: 'اشحن بطاقاتك بسهولة', desc: 'خدمة تعبئة البطاقات المصرفية بأفضل الأسعار وأسرع وقت. ندعم جميع أنواع البطاقات.', cta: 'ابدأ التعبئة' },
    en: { badge: 'Card Top-up', title: 'Top Up Your Cards Easily', desc: 'Bank card top-up service at the best rates and fastest time. We support all card types.', cta: 'Start Top-up' },
    ku: { badge: 'پڕکردنەوەی کارت', title: 'بە ئاسانی کارتەکانت پڕبکەوە', desc: 'خزمەتگوزاری پڕکردنەوەی کارتی بانکی بە باشترین نرخ و خێراترین کات. هەموو جۆرە کارتێک پشتگیری دەکەین.', cta: 'دەستپێکردنی پڕکردنەوە' }
  };
  const t = text[isKurdish ? 'ku' : isArabic ? 'ar' : 'en'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
      {/* 3D Card */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="h-[400px] relative"
      >
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-5, -5, -5]} intensity={0.3} color="#D4AF37" />
          <Suspense fallback={<Loader />}>
            <Card3D />
            <Environment preset="city" />
          </Suspense>
        </Canvas>

        {/* Card Image Fallback/Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <img 
            src={ASSETS.cardSvg}
            alt="Payment Card"
            className="w-full max-w-xs mx-auto drop-shadow-2xl"
          />
        </div>
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

        <p className={`text-lg mb-8 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          {t.desc}
        </p>

        <motion.button
          onClick={() => navigate('/card-topup')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all"
        >
          {t.cta}
        </motion.button>
      </motion.div>
    </div>
  );
};

// USDT Section
const USDTSection = ({ isArabic, isKurdish, isDark }) => {
  const navigate = useNavigate();

  const text = {
    ar: { badge: 'العملات الرقمية', title: 'شحن USDT', desc: 'خدمة شحن العملات الرقمية USDT بأمان وسرعة. نضمن لك أفضل الأسعار في السوق.', cta: 'شحن USDT' },
    en: { badge: 'Cryptocurrency', title: 'USDT Recharge', desc: 'Safe and fast USDT cryptocurrency recharge service. We guarantee the best market rates.', cta: 'Recharge USDT' },
    ku: { badge: 'دراوی دیجیتاڵ', title: 'پڕکردنەوەی USDT', desc: 'خزمەتگوزاری پڕکردنەوەی دراوی دیجیتاڵی USDT بە پارێزراوی و خێرایی. باشترین نرخی بازار بۆت دابین دەکەین.', cta: 'پڕکردنەوەی USDT' }
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

        <p className={`text-lg mb-8 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          {t.desc}
        </p>

        <motion.button
          onClick={() => navigate('/usdt')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-full shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all"
        >
          {t.cta}
        </motion.button>
      </motion.div>

      {/* 3D USDT */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="h-[400px] lg:order-2"
      >
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-5, -5, -5]} intensity={0.5} color="#10B981" />
          <Suspense fallback={<Loader />}>
            <Coin3D />
            <Environment preset="city" />
          </Suspense>
        </Canvas>
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
          ? 'bg-gradient-to-b from-slate-800 to-slate-900'
          : 'bg-gradient-to-b from-white to-slate-50'
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
