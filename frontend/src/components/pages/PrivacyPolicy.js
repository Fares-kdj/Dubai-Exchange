import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, Lock, Database, Trash2, Share2, Clock } from 'lucide-react';
import Header3D from '../landing/Header3D';
import Footer3D from '../landing/Footer3D';

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const { isDark } = useTheme();
  const isArabic = currentLanguage === 'ar' || currentLanguage === 'ku';

  const content = {
    ar: {
      title: 'سياسة الخصوصية',
      subtitle: 'كيف نحمي بياناتك ونستخدمها',
      lastUpdate: 'آخر تحديث: فبراير 2026',
      sections: [
        {
          icon: Database,
          title: 'البيانات التي نجمعها',
          content: [
            'بيانات الطلب: الاسم الكامل، رقم الهاتف، تفاصيل الخدمة المطلوبة',
            'ملفات الإثبات: صور الهوية، إيصالات الدفع (عند الحاجة)',
            'بيانات التواصل: رسائل خدمة العملاء والاستفسارات',
            'بيانات تقنية: نوع المتصفح، عنوان IP (للأمان فقط)'
          ]
        },
        {
          icon: Lock,
          title: 'كيف نستخدم بياناتك',
          content: [
            'تنفيذ الخدمات المطلوبة (تحويلات، حجوزات، شحن رصيد)',
            'التحقق من هوية العملاء وفقاً للمتطلبات التنظيمية',
            'إرسال تحديثات حالة الطلب عبر الرسائل النصية',
            'تحسين خدماتنا وتجربة المستخدم'
          ]
        },
        {
          icon: Share2,
          title: 'مشاركة البيانات',
          content: [
            'لا نبيع بياناتك الشخصية لأي طرف ثالث',
            'قد نشارك البيانات مع مزودي الخدمات الضروريين (مثل خدمات الرسائل النصية)',
            'نلتزم بالإفصاح عن البيانات للجهات الرسمية عند الطلب القانوني'
          ]
        },
        {
          icon: Clock,
          title: 'الاحتفاظ بالبيانات',
          content: [
            'نحتفظ ببياناتك للمدة اللازمة لتنفيذ الخدمات',
            'بيانات المعاملات تُحفظ وفقاً لمتطلبات الامتثال التنظيمي',
            'يمكنك طلب حذف بياناتك عبر التواصل مع خدمة العملاء'
          ]
        },
        {
          icon: Trash2,
          title: 'حقوقك',
          content: [
            'الاطلاع على بياناتك الشخصية المحفوظة لدينا',
            'طلب تصحيح أي بيانات غير دقيقة',
            'طلب حذف بياناتك (مع مراعاة المتطلبات القانونية)',
            'التواصل معنا لأي استفسار حول الخصوصية'
          ]
        }
      ],
      contact: 'للاستفسارات حول الخصوصية، يرجى التواصل عبر صفحة الاتصال أو زيارة أحد فروعنا.'
    },
    en: {
      title: 'Privacy Policy',
      subtitle: 'How we protect and use your data',
      lastUpdate: 'Last updated: February 2026',
      sections: [
        {
          icon: Database,
          title: 'Data We Collect',
          content: [
            'Order data: Full name, phone number, service details',
            'Proof files: ID images, payment receipts (when required)',
            'Communication data: Customer service messages and inquiries',
            'Technical data: Browser type, IP address (for security only)'
          ]
        },
        {
          icon: Lock,
          title: 'How We Use Your Data',
          content: [
            'Execute requested services (transfers, bookings, recharges)',
            'Verify customer identity per regulatory requirements',
            'Send order status updates via SMS',
            'Improve our services and user experience'
          ]
        },
        {
          icon: Share2,
          title: 'Data Sharing',
          content: [
            'We do not sell your personal data to any third party',
            'We may share data with essential service providers (e.g., SMS services)',
            'We comply with legal disclosure requirements when officially requested'
          ]
        },
        {
          icon: Clock,
          title: 'Data Retention',
          content: [
            'We retain your data for the duration needed to execute services',
            'Transaction data is kept per regulatory compliance requirements',
            'You can request data deletion by contacting customer support'
          ]
        },
        {
          icon: Trash2,
          title: 'Your Rights',
          content: [
            'Access your personal data stored with us',
            'Request correction of any inaccurate data',
            'Request deletion of your data (subject to legal requirements)',
            'Contact us for any privacy-related inquiries'
          ]
        }
      ],
      contact: 'For privacy inquiries, please contact us via the Contact page or visit one of our branches.'
    }
  };

  const t = content[isArabic ? 'ar' : 'en'];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-b from-slate-50 via-white to-slate-50'
    }`}>
      <Header3D />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/')}
            className={`flex items-center gap-2 mb-8 group ${
              isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            {isArabic ? 'العودة للرئيسية' : 'Back to Home'}
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
              {t.title}
            </h1>
            <p className={`text-lg mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {t.subtitle}
            </p>
            <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              {t.lastUpdate}
            </p>
          </motion.div>

          {/* Content Sections */}
          <div className="max-w-4xl mx-auto space-y-8">
            {t.sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`rounded-3xl border-2 p-8 ${
                  isDark 
                    ? 'bg-slate-800/50 border-slate-700' 
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isDark ? 'bg-green-500/20' : 'bg-green-100'
                  }`}>
                    <section.icon className="w-6 h-6 text-green-500" />
                  </div>
                  <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {section.title}
                  </h2>
                </div>
                <ul className="space-y-3">
                  {section.content.map((item, idx) => (
                    <li key={idx} className={`flex items-start gap-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      <span className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}

            {/* Contact Note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className={`rounded-2xl p-6 text-center ${
                isDark ? 'bg-green-900/20 border border-green-700/50' : 'bg-green-50 border border-green-200'
              }`}
            >
              <p className={isDark ? 'text-green-300' : 'text-green-800'}>
                {t.contact}
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
