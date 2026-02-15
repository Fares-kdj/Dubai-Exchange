import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Float, Environment, PresentationControls, Html, useProgress } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { ASSETS, COMPANY } from '@/config/assets';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

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

// 3D Airplane Component
const Airplane = ({ scrollProgress }) => {
  const { scene } = useGLTF(ASSETS.airplane);
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      // Animate based on scroll
      const progress = scrollProgress.current;
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1 + progress * Math.PI * 0.5;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2 + 1;
      ref.current.position.x = -2 + progress * 6;
      ref.current.position.z = progress * -3;
    }
  });

  return (
    <primitive 
      ref={ref} 
      object={scene} 
      scale={0.5} 
      position={[-2, 1, 0]} 
    />
  );
};

// 3D Credit Card Component  
const CreditCard = ({ scrollProgress }) => {
  const { scene } = useGLTF(ASSETS.creditCard);
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.3;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <primitive 
        ref={ref} 
        object={scene} 
        scale={1.5} 
        position={[2, 0, -1]} 
      />
    </Float>
  );
};

// 3D USDT Token Component
const USDTToken = () => {
  const { scene } = useGLTF(ASSETS.usdt);
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <primitive 
        ref={ref} 
        object={scene} 
        scale={2} 
        position={[0, 0, 0]} 
      />
    </Float>
  );
};

// Main 3D Scene for Hero
const HeroScene = ({ scrollProgress }) => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#D4AF37" />
      
      <Suspense fallback={<Loader />}>
        <PresentationControls
          global
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 4, Math.PI / 4]}
          azimuth={[-Math.PI / 4, Math.PI / 4]}
        >
          <Airplane scrollProgress={scrollProgress} />
          <CreditCard scrollProgress={scrollProgress} />
        </PresentationControls>
        <Environment preset="city" />
      </Suspense>
    </>
  );
};

// Hero Section Component
export const HeroSection3D = () => {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const isArabic = currentLanguage === 'ar';
  const scrollProgress = useRef(0);
  const [isWebGLSupported, setIsWebGLSupported] = useState(true);

  useEffect(() => {
    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setIsWebGLSupported(!!gl);
    } catch (e) {
      setIsWebGLSupported(false);
    }

    // Setup scroll progress
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.current = Math.min(scrollTop / docHeight, 1);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* 3D Canvas */}
      {isWebGLSupported ? (
        <div className="absolute inset-0 z-0">
          <Canvas
            camera={{ position: [0, 0, 8], fov: 45 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true }}
          >
            <HeroScene scrollProgress={scrollProgress} />
          </Canvas>
        </div>
      ) : (
        // Fallback for non-WebGL browsers
        <div className="absolute inset-0 z-0">
          <img 
            src={ASSETS.cardTexture} 
            alt="Background" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
      )}

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-slate-900/50 z-10" />

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full py-20">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: isArabic ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className={`${isArabic ? 'lg:order-2' : 'lg:order-1'}`}
          >
            {/* Logo */}
            <motion.img
              src={ASSETS.logoWhite}
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
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
              data-testid="hero-title"
            >
              {isArabic ? COMPANY.nameAr : COMPANY.nameEn}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-slate-300 mb-10 max-w-xl"
              data-testid="hero-subtitle"
            >
              {isArabic ? COMPANY.sloganAr : COMPANY.sloganEn}
            </motion.p>

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
                {isArabic ? 'حجز الدولار للمسافرين' : 'Book USD for Travelers'}
              </motion.button>

              <motion.button
                onClick={() => navigate('/transfers')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-bold rounded-full hover:bg-white/20 transition-all"
                data-testid="cta-transfers"
              >
                {isArabic ? 'التحويلات المالية' : 'Money Transfers'}
              </motion.button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-6 mt-12"
            >
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-slate-300 text-sm">{isArabic ? 'مرخصة رسمياً' : 'Licensed'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-slate-300 text-sm">{isArabic ? 'خدمة فورية' : 'Instant'}</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Visual placeholder for balance */}
          <div className={`hidden lg:block ${isArabic ? 'lg:order-1' : 'lg:order-2'}`} />
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
          className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2"
        >
          <motion.div className="w-1.5 h-1.5 bg-white rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
};

// Preload 3D models
useGLTF.preload(ASSETS.airplane);
useGLTF.preload(ASSETS.creditCard);
useGLTF.preload(ASSETS.usdt);

export default HeroSection3D;
