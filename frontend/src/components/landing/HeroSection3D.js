import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, Html, useProgress } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { ASSETS, COMPANY } from '@/config/assets';
import * as THREE from 'three';

// Loading Component
const Loader = () => {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
        <p className="text-white text-sm font-medium">{progress.toFixed(0)}%</p>
      </div>
    </Html>
  );
};

// Professional 3D Airplane
const Airplane3D = () => {
  const groupRef = useRef();
  
  useFrame((state) => {
    if (groupRef.current) {
      // Smooth flying animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3 + 0.5;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.03;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={groupRef} position={[-2.5, 0.5, 0]} rotation={[0, 0.5, 0]} scale={0.8}>
        {/* Fuselage (Body) */}
        <mesh position={[0, 0, 0]}>
          <capsuleGeometry args={[0.25, 2, 16, 32]} />
          <meshStandardMaterial color="#E8E8E8" metalness={0.9} roughness={0.1} />
        </mesh>
        
        {/* Nose Cone */}
        <mesh position={[1.2, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.25, 0.5, 32]} />
          <meshStandardMaterial color="#E0E0E0" metalness={0.9} roughness={0.1} />
        </mesh>
        
        {/* Main Wings */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.08, 3, 0.6]} />
          <meshStandardMaterial color="#D0D0D0" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Wing Tips */}
        <mesh position={[0, 0, 1.5]} rotation={[0.3, 0, Math.PI / 2]}>
          <boxGeometry args={[0.06, 0.3, 0.2]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0, -1.5]} rotation={[-0.3, 0, Math.PI / 2]}>
          <boxGeometry args={[0.06, 0.3, 0.2]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.1} />
        </mesh>
        
        {/* Tail Wing Vertical */}
        <mesh position={[-1, 0.3, 0]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.4, 0.5, 0.05]} />
          <meshStandardMaterial color="#D0D0D0" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Tail Wing Horizontal */}
        <mesh position={[-0.9, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.05, 0.8, 0.3]} />
          <meshStandardMaterial color="#D0D0D0" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Engines */}
        <mesh position={[0.2, -0.2, 0.7]}>
          <cylinderGeometry args={[0.12, 0.1, 0.4, 16]} rotation={[0, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#404040" metalness={0.9} roughness={0.3} />
        </mesh>
        <mesh position={[0.2, -0.2, -0.7]}>
          <cylinderGeometry args={[0.12, 0.1, 0.4, 16]} rotation={[0, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#404040" metalness={0.9} roughness={0.3} />
        </mesh>
        
        {/* Windows */}
        {[0.6, 0.3, 0, -0.3, -0.6].map((x, i) => (
          <mesh key={i} position={[x, 0.15, 0.24]}>
            <boxGeometry args={[0.1, 0.08, 0.02]} />
            <meshStandardMaterial color="#87CEEB" metalness={0.5} roughness={0.3} emissive="#87CEEB" emissiveIntensity={0.2} />
          </mesh>
        ))}
        
        {/* Gold Stripe */}
        <mesh position={[0, 0, 0.26]}>
          <boxGeometry args={[2, 0.03, 0.01]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    </Float>
  );
};

// Professional 3D Credit Card
const CreditCard3D = () => {
  const cardRef = useRef();
  
  useFrame((state) => {
    if (cardRef.current) {
      cardRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.2 + 0.3;
      cardRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
      cardRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.15;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.4}>
      <group ref={cardRef} position={[2.5, 0, 0]} scale={1.2}>
        {/* Card Base */}
        <mesh>
          <boxGeometry args={[1.7, 1.05, 0.04]} />
          <meshStandardMaterial 
            color="#1a1a2e" 
            metalness={0.7} 
            roughness={0.3}
          />
        </mesh>
        
        {/* Gold Border */}
        <mesh position={[0, 0, 0.021]}>
          <boxGeometry args={[1.68, 1.03, 0.001]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.1} />
        </mesh>
        
        {/* Inner Dark */}
        <mesh position={[0, 0, 0.022]}>
          <boxGeometry args={[1.58, 0.93, 0.001]} />
          <meshStandardMaterial color="#16213e" metalness={0.6} roughness={0.4} />
        </mesh>
        
        {/* Chip */}
        <mesh position={[-0.45, 0.2, 0.025]}>
          <boxGeometry args={[0.25, 0.2, 0.015]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.95} roughness={0.05} />
        </mesh>
        
        {/* Chip Lines */}
        {[0, 0.04, -0.04].map((y, i) => (
          <mesh key={i} position={[-0.45, 0.2 + y, 0.034]}>
            <boxGeometry args={[0.2, 0.008, 0.001]} />
            <meshStandardMaterial color="#B8860B" metalness={0.9} roughness={0.1} />
          </mesh>
        ))}
        
        {/* Contactless Symbol */}
        <mesh position={[-0.15, 0.2, 0.025]} rotation={[0, 0, Math.PI / 4]}>
          <torusGeometry args={[0.04, 0.008, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#ffffff" metalness={0.5} roughness={0.5} />
        </mesh>
        <mesh position={[-0.15, 0.2, 0.025]} rotation={[0, 0, Math.PI / 4]}>
          <torusGeometry args={[0.06, 0.006, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#ffffff" metalness={0.5} roughness={0.5} />
        </mesh>
        
        {/* Card Number Dots */}
        {[0, 1, 2, 3].map((group) => (
          <group key={group} position={[-0.55 + group * 0.35, -0.1, 0.025]}>
            {[0, 1, 2, 3].map((dot) => (
              <mesh key={dot} position={[dot * 0.06, 0, 0]}>
                <sphereGeometry args={[0.015, 8, 8]} />
                <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
              </mesh>
            ))}
          </group>
        ))}
        
        {/* Visa-like Logo Area */}
        <mesh position={[0.55, -0.35, 0.025]}>
          <boxGeometry args={[0.3, 0.12, 0.005]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    </Float>
  );
};

// Globe with Countries indicator
const Globe3D = () => {
  const globeRef = useRef();
  
  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={globeRef} position={[0, -2, -3]} scale={0.6}>
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          color="#1e3a5f" 
          metalness={0.3} 
          roughness={0.7}
          transparent
          opacity={0.6}
        />
      </mesh>
      {/* Latitude lines */}
      {[-0.5, 0, 0.5].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[Math.sqrt(1 - y * y), 0.01, 8, 64]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
};

// Main 3D Scene
const HeroScene = () => {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} color="#D4AF37" />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#D4AF37" />
      <spotLight position={[5, 10, 5]} angle={0.3} intensity={0.8} color="#ffffff" />
      
      <Suspense fallback={<Loader />}>
        <Airplane3D />
        <CreditCard3D />
        <Globe3D />
        <Environment preset="city" />
      </Suspense>
    </>
  );
};

// Hero Section Component
export const HeroSection3D = () => {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const { isDark } = useTheme();
  const isArabic = currentLanguage === 'ar';
  const isKurdish = currentLanguage === 'ku';
  const [isWebGLSupported, setIsWebGLSupported] = useState(true);

  // Text content based on language
  const content = {
    ar: {
      name: 'شركة دبي العالمية للصرافة',
      slogan: 'خدمات مالية آمنة وسريعة للمسافرين والشركات',
      feature1: 'تحويلات لجميع دول العالم',
      feature2: 'حجز الدولار للمسافرين',
      cta1: 'حجز الدولار للمسافرين',
      cta2: 'التحويلات المالية',
      licensed: 'مرخصة رسمياً',
      instant: 'خدمة فورية',
      countries: '+50 دولة'
    },
    en: {
      name: 'Dubai International for Exchange',
      slogan: 'Secure and Fast Financial Services for Travelers and Businesses',
      feature1: 'Transfers to All Countries',
      feature2: 'USD Booking for Travelers',
      cta1: 'Book USD for Travelers',
      cta2: 'Money Transfers',
      licensed: 'Licensed',
      instant: 'Instant Service',
      countries: '50+ Countries'
    },
    ku: {
      name: 'کۆمپانیای دوبەی نێودەوڵەتی بۆ ئاڵوگۆڕی دراو',
      slogan: 'خزمەتگوزارییە دارایییە پارێزراو و خێراکان بۆ گەشتیاران و کۆمپانیاکان',
      feature1: 'گواستنەوە بۆ هەموو وڵاتەکان',
      feature2: 'نۆرەکردنی دۆلار بۆ گەشتیاران',
      cta1: 'نۆرەکردنی دۆلار بۆ گەشتیاران',
      cta2: 'گواستنەوەی پارە',
      licensed: 'مۆڵەتپێدراو',
      instant: 'خزمەتگوزاری یەکجار',
      countries: '+٥٠ وڵات'
    }
  };

  const t = content[currentLanguage] || content.ar;

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setIsWebGLSupported(!!gl);
    } catch (e) {
      setIsWebGLSupported(false);
    }
  }, []);

  return (
    <section className={`relative min-h-screen overflow-hidden transition-colors duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
        : 'bg-gradient-to-br from-slate-100 via-white to-blue-50'
    }`}>
      {/* 3D Canvas */}
      {isWebGLSupported && (
        <div className="absolute inset-0 z-0">
          <Canvas
            camera={{ position: [0, 0, 8], fov: 45 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true }}
            onCreated={({ gl }) => {
              gl.setClearColor(new THREE.Color(isDark ? '#0f172a' : '#f1f5f9'), 0);
            }}
          >
            <HeroScene />
          </Canvas>
        </div>
      )}

      {/* Overlay gradient */}
      <div className={`absolute inset-0 z-10 ${
        isDark 
          ? 'bg-gradient-to-t from-slate-900/90 via-transparent to-slate-900/50'
          : 'bg-gradient-to-t from-white/80 via-transparent to-white/50'
      }`} />

      {/* Animated Background Shapes */}
      <div className="absolute inset-0 z-5">
        <motion.div
          className={`absolute top-20 right-20 w-64 h-64 rounded-full blur-3xl ${isDark ? 'bg-[#D4AF37]/10' : 'bg-[#D4AF37]/20'}`}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className={`absolute bottom-20 left-20 w-80 h-80 rounded-full blur-3xl ${isDark ? 'bg-blue-500/10' : 'bg-blue-500/20'}`}
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full py-20">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: isArabic || isKurdish ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className={`${isArabic || isKurdish ? 'lg:order-2' : 'lg:order-1'}`}
          >
            {/* Logo */}
            <motion.img
              src={isDark ? ASSETS.logoWhite : ASSETS.logoColor}
              alt="Dubai International Exchange"
              className="h-16 md:h-20 mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              data-testid="hero-logo"
            />

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
              data-testid="hero-title"
            >
              {t.name}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`text-lg md:text-xl mb-6 max-w-xl ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
              data-testid="hero-subtitle"
            >
              {t.slogan}
            </motion.p>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="flex flex-wrap gap-4 mb-8"
            >
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                isDark ? 'bg-[#D4AF37]/20 text-[#FCD34D]' : 'bg-[#D4AF37]/10 text-[#B8860B]'
              }`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium">{t.feature1}</span>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-500/10 text-blue-600'
              }`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium">{t.feature2}</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                onClick={() => navigate('/traveler-booking')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#FCD34D] text-slate-900 font-bold rounded-full shadow-xl shadow-[#D4AF37]/30 hover:shadow-[#D4AF37]/50 transition-all"
                data-testid="cta-booking"
              >
                {t.cta1}
              </motion.button>

              <motion.button
                onClick={() => navigate('/transfers')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-4 backdrop-blur-sm border-2 font-bold rounded-full transition-all ${
                  isDark 
                    ? 'bg-white/10 border-white/30 text-white hover:bg-white/20'
                    : 'bg-slate-900/10 border-slate-900/30 text-slate-900 hover:bg-slate-900/20'
                }`}
                data-testid="cta-transfers"
              >
                {t.cta2}
              </motion.button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap items-center gap-6 mt-10"
            >
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-green-500/20' : 'bg-green-500/10'}`}>
                  <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t.licensed}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-blue-500/20' : 'bg-blue-500/10'}`}>
                  <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t.instant}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-purple-500/20' : 'bg-purple-500/10'}`}>
                  <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t.countries}</span>
              </div>
            </motion.div>
          </motion.div>

          <div className={`hidden lg:block ${isArabic || isKurdish ? 'lg:order-1' : 'lg:order-2'}`} />
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className={`w-6 h-10 rounded-full border-2 flex items-start justify-center p-2 ${
            isDark ? 'border-white/30' : 'border-slate-900/30'
          }`}
        >
          <motion.div className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-white' : 'bg-slate-900'}`} />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection3D;
