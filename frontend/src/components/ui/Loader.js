import React from 'react';
import { motion } from 'framer-motion';
import { useBranding } from '@/context/BrandingContext';

// Full Page Loader - للصفحات الكبيرة مثل الرئيسية
const FullPageLoader = ({ isDark = true }) => {
  const { logoLight, logoDark, primaryColor } = useBranding();
  const logo = isDark ? logoDark : logoLight;

  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center ${isDark
      ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
      : 'bg-gradient-to-br from-amber-50 via-white to-slate-50'
      }`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Central Bank Logo Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <img
          src="/assets/cbi-logo.png"
          alt=""
          className="w-96 h-96 object-contain"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {/* Logo Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 1, bounce: 0.4 }}
          className="mb-8"
        >
          <div className="relative">
            {/* Outer Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-32 h-32 mx-auto"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#D4AF37"
                  strokeWidth="2"
                  strokeDasharray="10 5"
                  opacity="0.5"
                />
              </svg>
            </motion.div>

            {/* Inner Logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    "0 0 20px rgba(212, 175, 55, 0.3)",
                    "0 0 40px rgba(212, 175, 55, 0.5)",
                    "0 0 20px rgba(212, 175, 55, 0.3)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-2xl p-4"
              >
                <img src={logo} alt="Logo" className="w-full h-full object-contain" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Company Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h1 className={`text-2xl md:text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            دبي العالمية للصرافة
          </h1>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Dubai International for Exchange
          </p>
        </motion.div>

        {/* Loading Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-10"
        >
          {/* Progress Bar */}
          <div className={`w-48 h-1 mx-auto rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="h-full w-1/2 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"
            />
          </div>

          {/* Loading Text */}
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className={`mt-4 text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}
          >
            جارٍ التحميل...
          </motion.p>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#D4AF37]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#D4AF37]/10 rounded-full blur-3xl" />
      </div>

      {/* Bottom Decorative Line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"
      />
    </div>
  );
};

// Overlay Loader - للتنقل والاستمارات
const OverlayLoader = ({ message, isDark = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className={`px-8 py-6 rounded-2xl shadow-2xl flex items-center gap-4 ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'
          }`}
      >
        {/* Spinner */}
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10"
          >
            <svg viewBox="0 0 50 50" className="w-full h-full">
              <circle
                cx="25"
                cy="25"
                r="20"
                fill="none"
                stroke={isDark ? "#334155" : "#e2e8f0"}
                strokeWidth="4"
              />
              <circle
                cx="25"
                cy="25"
                r="20"
                fill="none"
                stroke="#D4AF37"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="80 50"
              />
            </svg>
          </motion.div>
        </div>

        {/* Message */}
        <div>
          <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {message || 'جارٍ المعالجة...'}
          </p>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            يرجى الانتظار
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Mini Loader - للأزرار
const ButtonLoader = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      className={sizes[size]}
    >
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  );
};

export { FullPageLoader, OverlayLoader, ButtonLoader };
export default FullPageLoader;
