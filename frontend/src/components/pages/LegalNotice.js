import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { Scale, ArrowLeft, Building2, Globe } from 'lucide-react';
import Header3D from '../landing/Header3D';
import Footer3D from '../landing/Footer3D';

const LegalNotice = () => {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const { isDark } = useTheme();
  const isArabic = currentLanguage === 'ar' || currentLanguage === 'ku';

  const legalPoints = [
    {
      icon: Building2,
      label: 'اسم الشركة القانوني',
      text: 'Dubai International Company LLC'
    },
    {
      icon: Globe,
      label: 'نطاق الخدمات',
      text: 'الموقع لأغراض الخدمات المالية/الصرافة وفق الأنظمة المحلية.'
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-b from-slate-50 via-white to-slate-50'
    }`} dir="rtl">
      <Header3D />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/')}
            className={`flex items-center gap-2 mb-8 group ${
              isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
            data-testid="back-to-home-btn"
          >
            <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
            العودة للرئيسية
          </motion.button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center mx-auto mb-6 shadow-xl ${
              isDark ? 'shadow-purple-500/30' : 'shadow-purple-500/20'
            }`}>
              <Scale className="w-10 h-10 text-white" />
            </div>
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              إشعار قانوني
            </h1>
            <p className={`text-base ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              المعلومات القانونية والتنظيمية
            </p>
          </motion.div>

          {/* Content */}
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`rounded-3xl border-2 p-8 ${
                isDark 
                  ? 'bg-slate-800/50 border-slate-700' 
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="space-y-6">
                {legalPoints.map((point, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 * (index + 1) }}
                    className={`p-6 rounded-xl ${
                      isDark ? 'bg-slate-700/50' : 'bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isDark ? 'bg-purple-500/20' : 'bg-purple-100'
                      }`}>
                        <point.icon className="w-6 h-6 text-purple-500" />
                      </div>
                      <h3 className={`text-lg font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        {point.label}
                      </h3>
                    </div>
                    <p className={`text-xl font-bold mr-16 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {point.text}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Copyright */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className={`mt-8 rounded-2xl p-6 text-center ${
                isDark ? 'bg-purple-900/20 border border-purple-700/50' : 'bg-purple-50 border border-purple-200'
              }`}
            >
              <p className={`font-semibold ${isDark ? 'text-purple-300' : 'text-purple-800'}`}>
                © 2026 Dubai International Company LLC. جميع الحقوق محفوظة.
              </p>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer3D />
    </div>
  );
};

export default LegalNotice;
