import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { useBranding } from '@/context/BrandingContext';

const LightSplashScreen = ({ onComplete, minDuration = 800 }) => {
  const { isDark } = useTheme();
  const { logoLight, logoDark } = useBranding();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onComplete?.();
      }, 500); // Wait for exit animation
    }, minDuration);

    return () => clearTimeout(timer);
  }, [minDuration, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center ${
            isDark ? 'bg-[#0f172a]' : 'bg-white'
          }`}
        >
          <div className="relative flex flex-col items-center">
            {/* Minimal Logo Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                ease: [0.16, 1, 0.3, 1] // Custom cubic-bezier for a "premium" pop
              }}
              className="relative"
            >
              <img
                src={isDark ? logoDark : logoLight}
                alt="Logo"
                className="w-40 h-40 object-contain"
                style={{
                  filter: isDark 
                    ? 'drop-shadow(0 0 20px rgba(212,175,55,0.3))' 
                    : 'drop-shadow(0 4px 12px rgba(0,0,0,0.05))'
                }}
              />
            </motion.div>

            {/* Very subtle loading indicator (optional, but requested "lightweight") */}
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: minDuration / 1000, ease: "linear" }}
              className="absolute -bottom-8 left-0 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent w-full opacity-40"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LightSplashScreen;
