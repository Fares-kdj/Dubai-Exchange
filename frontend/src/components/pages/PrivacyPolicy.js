import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, Database, Lock, Share2, Trash2 } from 'lucide-react';
import Header3D from '../landing/Header3D';
import Footer3D from '../landing/Footer3D';

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const { isDark } = useTheme();
  const isArabic = currentLanguage === 'ar' || currentLanguage === 'ku';

  const policyPoints = [
    {
      icon: Database,
      text: 'نجمع بيانات الطلب (الاسم، الهاتف، تفاصيل الخدمة، ملفات الإثبات) فقط لتنفيذ الخدمة والتحقق.'
    },
    {
      icon: Lock,
      text: 'لا نبيع البيانات ولا نشاركها إلا مع مزودي الخدمة عند الحاجة (مثل SMS).'
    },
    {
      icon: Trash2,
      text: 'المستخدم يستطيع طلب حذف بياناته عبر خدمة العملاء.'
    },
    {
      icon: Share2,
      text: 'نحتفظ بالبيانات لمدة لازمة للأغراض التشغيلية والامتثال.'
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
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-xl ${
              isDark ? 'shadow-green-500/30' : 'shadow-green-500/20'
            }`}>
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              سياسة الخصوصية
            </h1>
            <p className={`text-base ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              كيف نحمي بياناتك ونستخدمها
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
                {policyPoints.map((point, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 * (index + 1) }}
                    className={`flex items-start gap-4 p-4 rounded-xl ${
                      isDark ? 'bg-slate-700/50' : 'bg-slate-50'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isDark ? 'bg-green-500/20' : 'bg-green-100'
                    }`}>
                      <point.icon className="w-6 h-6 text-green-500" />
                    </div>
                    <p className={`text-lg leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {point.text}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Contact Note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className={`mt-8 rounded-2xl p-6 text-center ${
                isDark ? 'bg-green-900/20 border border-green-700/50' : 'bg-green-50 border border-green-200'
              }`}
            >
              <p className={isDark ? 'text-green-300' : 'text-green-800'}>
                للاستفسارات حول الخصوصية، يرجى التواصل عبر خدمة العملاء.
              </p>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer3D />
    </div>
  );
};

export default PrivacyPolicy;
