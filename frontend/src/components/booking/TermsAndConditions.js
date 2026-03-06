import React, { useState } from 'react';
// Removed useTranslation for custom t helper consistency
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, FileText, ArrowRight } from 'lucide-react';

const TermsAndConditions = ({ onAccept }) => {
  const { currentLanguage } = useLanguage();
  const { isDark } = useTheme();
  const [accepted, setAccepted] = useState(false);
  const [showError, setShowError] = useState(false);

  const isArabic = currentLanguage === 'ar';
  const isKurdish = currentLanguage === 'ku';

  const t = (ar, en, ku) => {
    if (isKurdish) return ku || en;
    if (isArabic) return ar;
    return en;
  };

  const handleContinue = () => {
    if (!accepted) {
      setShowError(true);
      return;
    }
    onAccept();
  };

  const terms = [
    {
      titleAr: 'شروط الحجز',
      titleEn: 'Booking Terms',
      titleKu: 'مەرجەکانی حجزکردن',
      pointsAr: [
        'يجب أن يكون جواز السفر ساري المفعول لمدة لا تقل عن 6 أشهر',
        'تذكرة السفر يجب أن تكون مؤكدة ومطابقة للبيانات المدخلة',
        'المبالغ المحجوزة غير قابلة للاسترجاع إلا في حالات محددة',
        'يجب استلام المبلغ قبل موعد السفر بـ 48 ساعة على الأقل'
      ],
      pointsEn: [
        'Passport must be valid for at least 6 months',
        'Flight ticket must be confirmed and match entered data',
        'Booked amounts are non-refundable except in specific cases',
        'Amount must be collected at least 48 hours before travel'
      ],
      pointsKu: [
        'دەبێت پاسپۆرتەکەت بەلایەنی کەمەوە بۆ ماوەی ٦ مانگ کارا بێت',
        'دەبێت تیکتی گەشتەکەت دووپاتکراوە بێت و لەگەڵ زانیارییەکان بگونجێت',
        'بڕی پارەی حجزکراو ناگەڕێتەوە تەنها لە هەندێک حاڵەتی تایبەتدا',
        'دەبێت بڕی پارەکە بەلایەنی کەمەوە ٤٨ کاتژمێر پێش کاتی گەشت وەر بگیرێت'
      ]
    },
    {
      titleAr: 'الوثائق المطلوبة',
      titleEn: 'Required Documents',
      titleKu: 'بەڵگەنامە داواکراوەکان',
      pointsAr: [
        'صورة واضحة من جواز السفر (الصفحة الأولى)',
        'صورة من تذكرة السفر المؤكدة',
        'صورة شخصية حديثة (اختياري)'
      ],
      pointsEn: [
        'Clear copy of passport (first page)',
        'Copy of confirmed flight ticket',
        'Recent personal photo (optional)'
      ],
      pointsKu: [
        'وێنەیەکی ڕوونی پاسپۆرت (لاپەڕەی یەکەم)',
        'وێنەی تیکتی گەشتی دووپاتکراوە',
        'وێنەیەکی کەسی نوێ (ئارەزوومەندانە)'
      ]
    },
    {
      titleAr: 'سياسة الإلغاء',
      titleEn: 'Cancellation Policy',
      titleKu: 'بەرنامەی هەڵوەشاندنەوە',
      pointsAr: [
        'يمكن إلغاء الحجز قبل 72 ساعة من موعد الاستلام',
        'رسوم إلغاء 5% في حالة الإلغاء قبل 48-72 ساعة',
        'رسوم إلغاء 10% في حالة الإلغاء قبل 24-48 ساعة',
        'لا يمكن الإلغاء أو استرجاع المبلغ قبل أقل من 24 ساعة'
      ],
      pointsEn: [
        'Booking can be cancelled 72 hours before pickup',
        '5% cancellation fee if cancelled 48-72 hours before',
        '10% cancellation fee if cancelled 24-48 hours before',
        'No cancellation or refund less than 24 hours before'
      ],
      pointsKu: [
        'دەتوانرێت حجزەکە هەڵبوەشێنرێتەوە ٧٢ کاتژمێر پێش کاتی وەرگرتن',
        '%٥ ڕسومات دەسەپێنرێت ئەگەر ٤٨-٧٢ کاتژمێر پێشتر هەڵبوەشێنرێتەوە',
        '%١٠ ڕسومات دەسەپێنرێت ئەگەر ٢٤-٤٨ کاتژمێر پێشتر هەڵبوەشێنرێتەوە',
        'ناکرێت هەڵبوەشێنرێتەوە یان پارەکە بگەڕێندرێتەوە لە کەمتر لە ٢٤ کاتژمێردا'
      ]
    },
    {
      titleAr: 'الدول المحظورة',
      titleEn: 'Restricted Countries',
      titleKu: 'وڵاتە قەدەغەکراوەکان',
      pointsAr: [
        'بعض الدول قد تكون غير متاحة للحجز حسب القوانين المحلية',
        'يرجى التأكد من توفر الخدمة لوجهتك قبل إتمام الحجز'
      ],
      pointsEn: [
        'Some countries may be unavailable based on local regulations',
        'Please confirm service availability for your destination before booking'
      ],
      pointsKu: [
        'هەندێک وڵات ڕەنگە بەردەست نەبن بۆ حجزکردن بەپێی یاسا ناوخۆییەکان',
        'تکایە دڵنیا بەرەوە لە بەردەستبوونی خزمەتگوزاری بۆ مەبەستەکەت پێش تەواوکردنی حجزکردن'
      ]
    }
  ];

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto mb-8"
        >
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-white flex items-center justify-center text-sm font-bold">
                1
              </div>
              <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {t('الشروط والأحكام', 'Terms & Conditions', 'مەرجەکان و ڕێساکان')}
              </span>
            </div>
            <div className={`w-16 h-1 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
            <div className="flex items-center gap-2 opacity-40">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-500'}`}>
                2
              </div>
              <span className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {t('معلومات الحجز', 'Booking Details', 'زانیارییەکانی حجزکردن')}
              </span>
            </div>
            <div className={`w-16 h-1 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
            <div className="flex items-center gap-2 opacity-40">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-500'}`}>
                3
              </div>
              <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {t('الشروط والأحكام', 'Terms & Conditions', 'مەرجەکان و ڕێساکان')}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Terms Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`max-w-4xl mx-auto rounded-3xl border-2 shadow-xl overflow-hidden ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
            }`}
          data-testid="terms-card"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-white">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-8 h-8 text-[#D4AF37]" />
              <h1 className="text-3xl font-bold">
                {t('الشروط والأحكام', 'Terms & Conditions', 'مەرجەکان و ڕێساکان')}
              </h1>
            </div>
            <p className="text-slate-300 text-sm">
              {t(
                'يرجى قراءة الشروط والأحكام بعناية قبل المتابعة',
                'Please read the terms and conditions carefully before proceeding',
                'تکایە مەرجەکان و ڕێساکان بە وریایی بخوێنەرەوە پێش دەستپێکردن'
              )}
            </p>
          </div>

          {/* Terms Content */}
          <div className="p-8 max-h-[500px] overflow-y-auto">
            {terms.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="mb-8 last:mb-0"
              >
                <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  {currentLanguage === 'ar'
                    ? section.titleAr
                    : currentLanguage === 'ku'
                      ? section.titleKu
                      : section.titleEn}
                </h3>
                <ul className="space-y-3">
                  {(currentLanguage === 'ar'
                    ? section.pointsAr
                    : currentLanguage === 'ku'
                      ? section.pointsKu
                      : section.pointsEn
                  ).map((point, idx) => (
                    <li key={idx} className={`flex items-start gap-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      <span className="w-2 h-2 rounded-full bg-[#D4AF37] mt-2 flex-shrink-0"></span>
                      <span className="text-sm leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Acceptance Section */}
          <div className={`border-t-2 p-8 ${isDark ? 'border-slate-700 bg-slate-800/80' : 'border-slate-50'}`}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              {/* Checkbox */}
              <div className="flex items-start gap-3">
                <div className="flex items-center h-6">
                  <input
                    type="checkbox"
                    id="accept-terms"
                    checked={accepted}
                    onChange={(e) => {
                      setAccepted(e.target.checked);
                      setShowError(false);
                    }}
                    className="w-5 h-5 rounded border-slate-300 text-[#D4AF37] focus:ring-[#D4AF37] cursor-pointer"
                    data-testid="accept-checkbox"
                  />
                </div>
                <label htmlFor="accept-terms" className={`text-sm cursor-pointer leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {t(
                    'لقد قرأت وأوافق على الشروط والأحكام المذكورة أعلاه. أدرك أن المعلومات المقدمة يجب أن تكون دقيقة وصحيحة.',
                    'I have read and agree to the terms and conditions stated above. I understand that the information provided must be accurate and correct.',
                    'من مەرجەکان و ڕێساکانی سەرەوەم خوێندەوە و هاوڕام لەسەریان. تێدەگەم کە دەبێت ئەو زانیارییانەی پێشکەش دەکرێن ورد و ڕاست بن.'
                  )}
                </label>
              </div>

              {/* Error Message */}
              {showError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <span className="text-sm text-red-700">
                    {t(
                      'يجب الموافقة على الشروط والأحكام للمتابعة',
                      'You must accept the terms and conditions to continue',
                      'دەبێت مەرجەکان و ڕێساکان قبوڵ بکەیت بۆ بەردەوامبوون'
                    )}
                  </span>
                </motion.div>
              )}

              {/* Privacy Note */}
              <div className={`flex items-start gap-2 p-4 rounded-xl ${isDark ? 'bg-blue-900/30 border border-blue-700/50' : 'bg-blue-50 border border-blue-200'}`}>
                <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                <p className={`text-xs leading-relaxed ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                  {t(
                    'جميع المعلومات والوثائق المقدمة سيتم استخدامها فقط لأغراض التحقق والمعالجة. نحن ملتزمون بحماية خصوصيتك وأمان بياناتك.',
                    'All information and documents provided will be used solely for verification and processing purposes. We are committed to protecting your privacy and data security.',
                    'هەموو ئەو زانیاری و بەڵگەنامانەی پێشکەش دەکرێن تەنها بۆ مەبەستی دڵنیابوونەوە و ڕاییکردن بەکاردەهێنرێن. ئێمە پابەندین بە پاراستنی تایبەت مەندی و ئاسایشی زانیارییەکانت.'
                  )}
                </p>
              </div>

              {/* Continue Button */}
              <motion.button
                onClick={handleContinue}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                data-testid="continue-button"
                className={`w-full py-4 font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 group ${isDark ? 'bg-[#D4AF37] text-slate-900 hover:bg-[#E5C048]' : 'bg-slate-900 text-white'}`}
              >
                {t('المتابعة إلى الحجز', 'Continue to Booking', 'بەردەوام بە بۆ حجزکردن')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
