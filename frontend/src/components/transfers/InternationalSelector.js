import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { Globe, ArrowLeft, ArrowRight, Zap, Building2 } from 'lucide-react';
import Header from '../home/Header';
import Footer from '../home/Footer';

// Western Union Icon
const WesternUnionIcon = () => (
  <svg viewBox="0 0 48 48" className="w-12 h-12">
    <rect fill="#FFCC00" width="48" height="48" rx="8"/>
    <text x="24" y="30" textAnchor="middle" fill="#000" fontSize="16" fontWeight="bold">WU</text>
  </svg>
);

// MoneyGram Icon
const MoneyGramIcon = () => (
  <svg viewBox="0 0 48 48" className="w-12 h-12">
    <rect fill="#FF6600" width="48" height="48" rx="8"/>
    <text x="24" y="30" textAnchor="middle" fill="#FFF" fontSize="14" fontWeight="bold">MG</text>
  </svg>
);

const InternationalSelector = () => {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();

  const options = [
    {
      id: 'western-union',
      icon: WesternUnionIcon,
      titleAr: 'ويسترن يونيون',
      titleEn: 'Western Union',
      descAr: 'تحويل سريع وموثوق لأكثر من 200 دولة',
      descEn: 'Fast and reliable transfer to 200+ countries',
      gradient: 'from-yellow-400 to-yellow-600',
      bgColor: 'bg-yellow-50',
      link: '/transfers/western-union',
      badge: { ar: 'الأكثر شعبية', en: 'Most Popular' }
    },
    {
      id: 'moneygram',
      icon: MoneyGramIcon,
      titleAr: 'موني جرام',
      titleEn: 'MoneyGram',
      descAr: 'خدمة تحويل دولية سريعة وآمنة',
      descEn: 'Fast and secure international transfer',
      gradient: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      link: '/transfers/moneygram'
    },
    {
      id: 'country-based',
      icon: () => <Globe className="w-12 h-12 text-indigo-600" />,
      titleAr: 'تحويل حسب الدولة',
      titleEn: 'Country-based Transfer',
      descAr: 'اختر الدولة واكتشف أفضل طرق التحويل المتاحة',
      descEn: 'Choose a country and discover available transfer methods',
      gradient: 'from-indigo-500 to-purple-600',
      bgColor: 'bg-indigo-50',
      link: '/transfers/country-wizard',
      badge: { ar: 'تجربة جديدة', en: 'New Experience' }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <Header />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/transfers')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            {currentLanguage === 'ar' ? 'العودة للتحويلات' : 'Back to Transfers'}
          </motion.button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Globe className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              {currentLanguage === 'ar' ? 'التحويل الدولي' : 'International Transfer'}
            </h1>
            <p className="text-slate-600 max-w-xl mx-auto">
              {currentLanguage === 'ar' 
                ? 'اختر طريقة التحويل المناسبة لإرسال الأموال إلى الخارج'
                : 'Choose the appropriate transfer method to send money abroad'}
            </p>
          </motion.div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {options.map((option, index) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => navigate(option.link)}
                className="cursor-pointer group"
                data-testid={`international-option-${option.id}`}
              >
                <div className="relative bg-white rounded-3xl p-8 border-2 border-slate-100 shadow-xl hover:shadow-2xl hover:border-slate-200 transition-all duration-500 h-full">
                  {/* Badge */}
                  {option.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#D4AF37] to-[#FCD34D] rounded-full text-xs font-bold text-slate-900 shadow-lg">
                      {currentLanguage === 'ar' ? option.badge.ar : option.badge.en}
                    </div>
                  )}

                  {/* Gold accent on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/0 to-[#D4AF37]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

                  <div className="relative z-10 text-center">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                      className={`w-20 h-20 ${option.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6`}
                    >
                      <option.icon />
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                      {currentLanguage === 'ar' ? option.titleAr : option.titleEn}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-600 text-sm mb-6">
                      {currentLanguage === 'ar' ? option.descAr : option.descEn}
                    </p>

                    {/* CTA */}
                    <div className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-700 group-hover:text-slate-900 group-hover:gap-3 transition-all">
                      {currentLanguage === 'ar' ? 'اختيار' : 'Select'}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="max-w-3xl mx-auto mt-12 p-6 bg-blue-50 border border-blue-200 rounded-2xl"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-blue-900 mb-1">
                  {currentLanguage === 'ar' ? 'نصيحة' : 'Tip'}
                </h4>
                <p className="text-sm text-blue-800">
                  {currentLanguage === 'ar' 
                    ? 'لأفضل أسعار الصرف والرسوم المنخفضة، جرب "تحويل حسب الدولة" لاكتشاف الخيارات المحلية المتاحة في البلد المستهدف.'
                    : 'For the best exchange rates and low fees, try "Country-based Transfer" to discover local options available in the destination country.'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default InternationalSelector;
