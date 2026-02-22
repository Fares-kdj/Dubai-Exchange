import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { Scale, ArrowLeft, Building2, Globe, Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import Header3D from '../landing/Header3D';
import Footer3D from '../landing/Footer3D';

const LegalNotice = () => {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const { isDark } = useTheme();
  const isArabic = currentLanguage === 'ar' || currentLanguage === 'ku';

  const content = {
    ar: {
      title: 'إشعار قانوني',
      subtitle: 'المعلومات القانونية والتنظيمية',
      lastUpdate: 'آخر تحديث: فبراير 2026',
      sections: [
        {
          icon: Building2,
          title: 'معلومات الشركة',
          items: [
            { label: 'الاسم القانوني', value: 'Dubai International Company LLC' },
            { label: 'النشاط', value: 'خدمات الصرافة والتحويلات المالية' },
            { label: 'الترخيص', value: 'مرخصة من البنك المركزي العراقي' }
          ]
        },
        {
          icon: Globe,
          title: 'نطاق الخدمات',
          content: [
            'تقدم الشركة خدمات الصرافة والتحويلات المالية وفقاً للأنظمة والقوانين المحلية المعمول بها في جمهورية العراق',
            'جميع الخدمات تخضع للرقابة والإشراف من الجهات التنظيمية المختصة',
            'الموقع الإلكتروني مخصص لتسهيل وصول العملاء إلى خدماتنا وليس بديلاً عن الحضور الفعلي عند الحاجة'
          ]
        }
      ],
      contactTitle: 'قنوات التواصل الرسمية',
      contactNote: 'للتواصل الرسمي مع الشركة، يرجى استخدام القنوات التالية فقط:',
      contacts: [
        { icon: Phone, label: 'الهاتف', value: '+964 XXX XXX XXXX' },
        { icon: MessageCircle, label: 'واتساب', value: '+964 XXX XXX XXXX' },
        { icon: Mail, label: 'البريد الإلكتروني', value: 'info@dubaiexchange.iq' },
        { icon: MapPin, label: 'العنوان', value: 'بغداد، العراق - الفروع متوفرة في عدة مدن' }
      ],
      disclaimer: 'أي تواصل من خارج هذه القنوات الرسمية لا يمثل الشركة. يرجى الحذر من محاولات الاحتيال.',
      copyright: '© 2026 Dubai International Company LLC. جميع الحقوق محفوظة.'
    },
    en: {
      title: 'Legal Notice',
      subtitle: 'Legal and regulatory information',
      lastUpdate: 'Last updated: February 2026',
      sections: [
        {
          icon: Building2,
          title: 'Company Information',
          items: [
            { label: 'Legal Name', value: 'Dubai International Company LLC' },
            { label: 'Activity', value: 'Currency Exchange & Money Transfer Services' },
            { label: 'License', value: 'Licensed by the Central Bank of Iraq' }
          ]
        },
        {
          icon: Globe,
          title: 'Scope of Services',
          content: [
            'The company provides currency exchange and money transfer services in accordance with local regulations and laws applicable in the Republic of Iraq',
            'All services are subject to supervision by relevant regulatory authorities',
            'This website is designed to facilitate customer access to our services and is not a substitute for in-person visits when required'
          ]
        }
      ],
      contactTitle: 'Official Contact Channels',
      contactNote: 'For official communication with the company, please use only the following channels:',
      contacts: [
        { icon: Phone, label: 'Phone', value: '+964 XXX XXX XXXX' },
        { icon: MessageCircle, label: 'WhatsApp', value: '+964 XXX XXX XXXX' },
        { icon: Mail, label: 'Email', value: 'info@dubaiexchange.iq' },
        { icon: MapPin, label: 'Address', value: 'Baghdad, Iraq - Branches available in multiple cities' }
      ],
      disclaimer: 'Any communication from outside these official channels does not represent the company. Please be cautious of fraud attempts.',
      copyright: '© 2026 Dubai International Company LLC. All rights reserved.'
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
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center mx-auto mb-6 shadow-xl ${
              isDark ? 'shadow-purple-500/30' : 'shadow-purple-500/20'
            }`}>
              <Scale className="w-10 h-10 text-white" />
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

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Company Info & Scope */}
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
                    isDark ? 'bg-purple-500/20' : 'bg-purple-100'
                  }`}>
                    <section.icon className="w-6 h-6 text-purple-500" />
                  </div>
                  <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {section.title}
                  </h2>
                </div>
                
                {section.items ? (
                  <div className="space-y-4">
                    {section.items.map((item, idx) => (
                      <div key={idx} className={`flex justify-between items-center p-4 rounded-xl ${
                        isDark ? 'bg-slate-700/50' : 'bg-slate-50'
                      }`}>
                        <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>{item.label}</span>
                        <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {section.content.map((item, idx) => (
                      <li key={idx} className={`flex items-start gap-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        <span className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}

            {/* Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`rounded-3xl border-2 p-8 ${
                isDark 
                  ? 'bg-slate-800/50 border-slate-700' 
                  : 'bg-white border-slate-200'
              }`}
            >
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {t.contactTitle}
              </h2>
              <p className={`mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {t.contactNote}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {t.contacts.map((contact, idx) => (
                  <div 
                    key={idx}
                    className={`flex items-center gap-4 p-4 rounded-xl ${
                      isDark ? 'bg-slate-700/50' : 'bg-slate-50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isDark ? 'bg-[#D4AF37]/20' : 'bg-[#D4AF37]/10'
                    }`}>
                      <contact.icon className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <div>
                      <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{contact.label}</p>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{contact.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Disclaimer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className={`rounded-2xl p-6 ${
                isDark ? 'bg-red-900/20 border border-red-700/50' : 'bg-red-50 border border-red-200'
              }`}
            >
              <p className={`text-sm text-center ${isDark ? 'text-red-300' : 'text-red-700'}`}>
                {t.disclaimer}
              </p>
            </motion.div>

            {/* Copyright */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center pt-8"
            >
              <p className={`text-sm font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {t.copyright}
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
