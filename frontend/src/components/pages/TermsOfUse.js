import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { FileText, ArrowLeft, UserCheck, Clock, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';
import Header3D from '../landing/Header3D';
import Footer3D from '../landing/Footer3D';

const TermsOfUse = () => {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const { isDark } = useTheme();
  const isArabic = currentLanguage === 'ar' || currentLanguage === 'ku';

  const content = {
    ar: {
      title: 'شروط الاستخدام',
      subtitle: 'الشروط والأحكام التي تحكم استخدام خدماتنا',
      lastUpdate: 'آخر تحديث: فبراير 2026',
      intro: 'باستخدامك لموقع وخدمات شركة دبي العالمية للصرافة، فإنك توافق على الالتزام بالشروط والأحكام التالية. يرجى قراءتها بعناية.',
      sections: [
        {
          icon: UserCheck,
          title: 'مسؤولية المستخدم',
          content: [
            'المستخدم مسؤول مسؤولية كاملة عن صحة ودقة جميع البيانات المقدمة',
            'يجب تقديم وثائق هوية سارية المفعول عند الطلب',
            'المستخدم مسؤول عن الحفاظ على سرية معلومات الطلب الخاصة به',
            'يُحظر استخدام الخدمات لأي أغراض غير قانونية'
          ]
        },
        {
          icon: Clock,
          title: 'مواعيد الإيداع والتنفيذ',
          content: [
            'يجب إتمام الإيداع خلال المدة المحددة في تفاصيل الطلب (عادةً ساعتين)',
            'الطلبات التي لا يتم إيداعها في الوقت المحدد قد تُلغى تلقائياً',
            'أسعار الصرف المعروضة صالحة لفترة محدودة وقد تتغير',
            'التنفيذ يتم بعد التحقق من الإيداع والمستندات المطلوبة'
          ]
        },
        {
          icon: DollarSign,
          title: 'الأسعار والرسوم',
          content: [
            'الأسعار والعمولات قابلة للتحديث دون إشعار مسبق',
            'رسوم الخدمة (2%) تُطبق على معظم الخدمات ويتم عرضها بوضوح',
            'أسعار الصرف تعتمد على السوق وقت تنفيذ الطلب',
            'أي رسوم إضافية من البنوك أو مزودي الخدمة تكون على حساب العميل'
          ]
        },
        {
          icon: AlertTriangle,
          title: 'رفض وإلغاء الطلبات',
          content: [
            'نحتفظ بحق رفض أو إلغاء أي طلب دون إبداء الأسباب',
            'قد تُرفض الطلبات في حالة عدم اكتمال المستندات المطلوبة',
            'الطلبات المشبوهة أو التي تنتهك سياساتنا ستُرفض',
            'في حال الإلغاء بعد الإيداع، سيتم إرجاع المبلغ وفق سياسة الاسترداد'
          ]
        },
        {
          icon: CheckCircle,
          title: 'القبول والموافقة',
          content: [
            'استخدام الموقع أو تقديم طلب يعني الموافقة على هذه الشروط',
            'نحتفظ بحق تعديل الشروط في أي وقت',
            'التعديلات تصبح سارية فور نشرها على الموقع',
            'استمرار استخدام الخدمات يعني قبول الشروط المحدثة'
          ]
        }
      ],
      disclaimer: 'شركة دبي العالمية للصرافة غير مسؤولة عن أي خسائر ناتجة عن تقديم معلومات خاطئة أو عدم الالتزام بالشروط المذكورة.'
    },
    en: {
      title: 'Terms of Use',
      subtitle: 'Terms and conditions governing use of our services',
      lastUpdate: 'Last updated: February 2026',
      intro: 'By using Dubai International Exchange website and services, you agree to comply with the following terms and conditions. Please read them carefully.',
      sections: [
        {
          icon: UserCheck,
          title: 'User Responsibility',
          content: [
            'User is fully responsible for the accuracy of all provided information',
            'Valid identification documents must be provided when requested',
            'User is responsible for maintaining confidentiality of their order information',
            'Using services for any illegal purposes is prohibited'
          ]
        },
        {
          icon: Clock,
          title: 'Deposit & Execution Deadlines',
          content: [
            'Deposit must be completed within the specified time (usually 2 hours)',
            'Orders without timely deposit may be automatically cancelled',
            'Displayed exchange rates are valid for a limited time and may change',
            'Execution occurs after verification of deposit and required documents'
          ]
        },
        {
          icon: DollarSign,
          title: 'Pricing & Fees',
          content: [
            'Prices and commissions are subject to change without prior notice',
            'Service fee (2%) applies to most services and is clearly displayed',
            'Exchange rates depend on market conditions at order execution time',
            'Any additional fees from banks or service providers are customer responsibility'
          ]
        },
        {
          icon: AlertTriangle,
          title: 'Order Rejection & Cancellation',
          content: [
            'We reserve the right to reject or cancel any order without stating reasons',
            'Orders may be rejected if required documents are incomplete',
            'Suspicious orders or those violating our policies will be rejected',
            'If cancelled after deposit, amount will be refunded per refund policy'
          ]
        },
        {
          icon: CheckCircle,
          title: 'Acceptance & Agreement',
          content: [
            'Using the website or submitting an order means agreeing to these terms',
            'We reserve the right to modify terms at any time',
            'Modifications become effective immediately upon publication',
            'Continued use of services means accepting updated terms'
          ]
        }
      ],
      disclaimer: 'Dubai International Exchange is not responsible for any losses resulting from providing incorrect information or non-compliance with these terms.'
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
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-xl ${
              isDark ? 'shadow-blue-500/30' : 'shadow-blue-500/20'
            }`}>
              <FileText className="w-10 h-10 text-white" />
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

          {/* Intro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`max-w-4xl mx-auto mb-8 p-6 rounded-2xl text-center ${
              isDark ? 'bg-slate-800/30 border border-slate-700' : 'bg-slate-50 border border-slate-200'
            }`}
          >
            <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
              {t.intro}
            </p>
          </motion.div>

          {/* Content Sections */}
          <div className="max-w-4xl mx-auto space-y-8">
            {t.sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 * index }}
                className={`rounded-3xl border-2 p-8 ${
                  isDark 
                    ? 'bg-slate-800/50 border-slate-700' 
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isDark ? 'bg-blue-500/20' : 'bg-blue-100'
                  }`}>
                    <section.icon className="w-6 h-6 text-blue-500" />
                  </div>
                  <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {section.title}
                  </h2>
                </div>
                <ul className="space-y-3">
                  {section.content.map((item, idx) => (
                    <li key={idx} className={`flex items-start gap-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}

            {/* Disclaimer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className={`rounded-2xl p-6 ${
                isDark ? 'bg-amber-900/20 border border-amber-700/50' : 'bg-amber-50 border border-amber-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                <p className={`text-sm ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>
                  {t.disclaimer}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer3D />
    </div>
  );
};

export default TermsOfUse;
