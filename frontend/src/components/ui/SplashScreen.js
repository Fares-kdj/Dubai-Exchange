import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { useBranding } from '@/context/BrandingContext';

// Background images for splash screen
const SPLASH_BACKGROUNDS = {
  dark: '/assets/external/hero-dark-splash-opt.jpg',
  light: '/assets/external/hero-light-splash-opt.jpg'
};

const SplashScreen = ({ onComplete, minDuration = 2000 }) => {
  const { isDark } = useTheme();
  const { logoLight, logoDark, isBrandingLoading } = useBranding();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  useEffect(() => {
    // Animate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 100);

    // Ensure minimum display time
    const minTimeoutId = setTimeout(() => {
      setProgress(100);
      clearInterval(progressInterval);

      // Fade out after progress completes
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          onComplete?.();
        }, 400); // Match exit animation duration
      }, 300);
    }, minDuration);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(minTimeoutId);
    };
  }, [minDuration, onComplete]);

  // Animation variants
  const logoVariants = prefersReducedMotion ? {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  } : {
    initial: { opacity: 0, scale: 0.2, rotate: -15 },
    animate: {
      opacity: 1,
      scale: [0.2, 1.15, 0.95, 1.05, 1],
      rotate: [-15, 8, -4, 2, 0],
      transition: {
        opacity: { duration: 0.4 },
        scale: { duration: 1, times: [0, 0.5, 0.7, 0.85, 1], ease: 'easeOut' },
        rotate: { duration: 1, times: [0, 0.5, 0.7, 0.85, 1], ease: 'easeOut' }
      }
    }
  };

  const textVariants = prefersReducedMotion ? {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { delay: 0.2 } }
  } : {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: 0.3, ease: "easeOut" }
    }
  };

  const subtitleVariants = prefersReducedMotion ? {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { delay: 0.4 } }
  } : {
    initial: { opacity: 0, y: 15 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: 0.5, ease: "easeOut" }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center ${isDark
            ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
            : 'bg-gradient-to-br from-amber-50/50 via-white to-slate-50'
            }`}
          data-testid="splash-screen"
        >
          {/* Background Image with low opacity */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500"
            style={{
              backgroundImage: `url(${isDark ? SPLASH_BACKGROUNDS.dark : SPLASH_BACKGROUNDS.light})`,
              opacity: isDark ? 0.15 : 0.2
            }}
          />

          {/* Overlay gradient for better text readability */}
          <div className={`absolute inset-0 ${isDark
            ? 'bg-gradient-to-br from-slate-900/70 via-slate-800/60 to-slate-900/70'
            : 'bg-gradient-to-br from-white/60 via-amber-50/50 to-white/60'
            }`} />

          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            {!prefersReducedMotion && (
              <>
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl ${isDark ? 'bg-[#D4AF37]/10' : 'bg-[#D4AF37]/15'
                    }`}
                />
                <motion.div
                  animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.2, 0.4, 0.2]
                  }}
                  transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                  className={`absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl ${isDark ? 'bg-blue-500/10' : 'bg-amber-400/10'
                    }`}
                />
              </>
            )}
          </div>

          {/* Content Container */}
          <div className="relative z-10 flex flex-col items-center text-center px-6">
            {/* 3D Logo */}
            <motion.div
              variants={logoVariants}
              initial="initial"
              animate="animate"
              className="relative mb-8"
            >
              {/* Rotating ring around logo */}
              {!prefersReducedMotion && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  className="absolute -inset-4 rounded-full border-2 border-dashed border-[#D4AF37]/30"
                />
              )}
              {/* Logo Glow Effect */}
              {!prefersReducedMotion && (
                <motion.div
                  animate={{
                    boxShadow: [
                      '0 0 30px rgba(212, 175, 55, 0.3)',
                      '0 0 60px rgba(212, 175, 55, 0.5)',
                      '0 0 30px rgba(212, 175, 55, 0.3)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-3xl"
                />
              )}

              {/* Logo Container */}
              <div
                className={`relative w-28 h-28 rounded-3xl flex items-center justify-center ${isDark
                  ? 'shadow-[0_8px_32px_rgba(212,175,55,0.4),0_4px_16px_rgba(0,0,0,0.3)]'
                  : 'shadow-[0_8px_32px_rgba(212,175,55,0.3),0_4px_16px_rgba(0,0,0,0.1)]'
                  }`}
                style={{
                  background: isDark ? '#1e293b' : '#fff',
                  transform: 'perspective(500px) rotateX(5deg)',
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* Inner Highlight */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 to-transparent opacity-50" />

                {isBrandingLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full"
                  />
                ) : (
                  <motion.img
                    src={isDark ? logoDark : logoLight}
                    alt="شعار الشركة"
                    fetchpriority="high"
                    loading="eager"
                    className="w-20 h-20 object-contain relative z-10"
                    initial={{ opacity: 0, scale: 0, rotate: -180 }}
                    animate={prefersReducedMotion ? { opacity: 1, scale: 1, rotate: 0 } : {
                      opacity: [0, 1, 1, 1, 1],
                      scale: [0, 1.3, 0.9, 1.08, 1],
                      rotate: [-180, 15, -8, 5, 0],
                      y: [0, 0, 0, 0, 0, -6, 0, -6, 0],
                    }}
                    transition={{
                      duration: 1.2,
                      times: [0, 0.4, 0.6, 0.8, 1],
                      ease: 'easeOut',
                      y: { duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }
                    }}
                    style={{
                      filter: isDark
                        ? 'drop-shadow(0 0 12px rgba(212,175,55,0.6)) drop-shadow(0 0 24px rgba(212,175,55,0.3))'
                        : 'drop-shadow(0 4px 12px rgba(212,175,55,0.5))'
                    }}
                  />
                )}

                {/* Bottom Shadow for 3D depth */}
                <div className="absolute -bottom-2 left-2 right-2 h-4 bg-[#8B6914]/30 rounded-b-3xl blur-md -z-10" />
              </div>
            </motion.div>

            {/* Welcome Headline */}
            <motion.h1
              variants={textVariants}
              initial="initial"
              animate="animate"
              className={`text-2xl md:text-3xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'
                }`}
              dir="rtl"
            >
              مرحباً بكم في شركة دبي العالمية للصرافة
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={subtitleVariants}
              initial="initial"
              animate="animate"
              className={`text-base mb-10 ${isDark ? 'text-slate-400' : 'text-slate-600'
                }`}
              dir="rtl"
            >
              نجهّز منصّتكم الآن…
            </motion.p>

            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="w-64 md:w-80"
            >
              <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-200'
                }`}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#FCD34D]"
                  style={{
                    boxShadow: isDark ? '0 0 10px rgba(212, 175, 55, 0.5)' : '0 0 8px rgba(212, 175, 55, 0.3)'
                  }}
                />
              </div>

              {/* Loading Text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className={`text-sm mt-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}
              >
                {progress >= 100 ? (isDark ? '✓' : '✓') : 'جار التحميل…'}
              </motion.p>
            </motion.div>
          </div>

          {/* Company Name Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-8 left-0 right-0 text-center"
          >
            <p className={`text-xs ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
              Dubai International Exchange LLC
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
