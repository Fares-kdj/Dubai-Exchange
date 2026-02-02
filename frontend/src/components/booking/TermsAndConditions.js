import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, FileText, ArrowRight } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const TermsAndConditions = ({ onAccept }) => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const [accepted, setAccepted] = useState(false);
  const [showError, setShowError] = useState(false);

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
      ]
    },
    {
      titleAr: 'الوثائق المطلوبة',
      titleEn: 'Required Documents',
      pointsAr: [
        'صورة واضحة من جواز السفر (الصفحة الأولى)',
        'صورة من تذكرة السفر المؤكدة',
        'صورة شخصية حديثة (اختياري)'
      ],
      pointsEn: [
        'Clear copy of passport (first page)',
        'Copy of confirmed flight ticket',
        'Recent personal photo (optional)'
      ]
    },
    {
      titleAr: 'سياسة الإلغاء',
      titleEn: 'Cancellation Policy',
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
      ]
    },
    {
      titleAr: 'الدول المحظورة',
      titleEn: 'Restricted Countries',
      pointsAr: [
        'بعض الدول قد تكون غير متاحة للحجز حسب القوانين المحلية',
        'يرجى التأكد من توفر الخدمة لوجهتك قبل إتمام الحجز'
      ],
      pointsEn: [
        'Some countries may be unavailable based on local regulations',
        'Please confirm service availability for your destination before booking'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-20">
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
              <span className="text-sm font-medium text-slate-900">
                {currentLanguage === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'}
              </span>
            </div>
            <div className="w-16 h-1 bg-slate-200 rounded"></div>
            <div className="flex items-center gap-2 opacity-40">
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-sm font-bold">
                2
              </div>
              <span className="text-sm font-medium text-slate-500">
                {currentLanguage === 'ar' ? 'معلومات الحجز' : 'Booking Details'}
              </span>
            </div>
            <div className="w-16 h-1 bg-slate-200 rounded"></div>
            <div className="flex items-center gap-2 opacity-40">
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-sm font-bold">
                3
              </div>
              <span className="text-sm font-medium text-slate-500">
                {currentLanguage === 'ar' ? 'التأكيد' : 'Confirmation'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Terms Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto bg-white rounded-3xl border-2 border-slate-200 shadow-xl overflow-hidden"
          data-testid="terms-card"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-white">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-8 h-8 text-[#D4AF37]" />
              <h1 className="text-3xl font-bold">
                {currentLanguage === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'}
              </h1>
            </div>
            <p className="text-slate-300 text-sm">
              {currentLanguage === 'ar' 
                ? 'يرجى قراءة الشروط والأحكام بعناية قبل المتابعة'
                : 'Please read the terms and conditions carefully before proceeding'}
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
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  {currentLanguage === 'ar' ? section.titleAr : section.titleEn}
                </h3>
                <ul className="space-y-3">
                  {(currentLanguage === 'ar' ? section.pointsAr : section.pointsEn).map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-600">
                      <span className="w-2 h-2 rounded-full bg-[#D4AF37] mt-2 flex-shrink-0"></span>
                      <span className="text-sm leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Acceptance Section */}
          <div className="border-t-2 border-slate-100 p-8 bg-slate-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              {/* Checkbox */}
              <div className="flex items-start gap-3">
                <Checkbox
                  id="accept-terms"
                  checked={accepted}
                  onCheckedChange={(checked) => {
                    setAccepted(checked);
                    setShowError(false);
                  }}
                  className="mt-1"
                  data-testid="accept-checkbox"
                />
                <label htmlFor="accept-terms" className="text-sm text-slate-700 cursor-pointer leading-relaxed">
                  {currentLanguage === 'ar'
                    ? 'لقد قرأت وأوافق على الشروط والأحكام المذكورة أعلاه. أدرك أن المعلومات المقدمة يجب أن تكون دقيقة وصحيحة.'
                    : 'I have read and agree to the terms and conditions stated above. I understand that the information provided must be accurate and correct.'}
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
                    {currentLanguage === 'ar'
                      ? 'يجب الموافقة على الشروط والأحكام للمتابعة'
                      : 'You must accept the terms and conditions to continue'}
                  </span>
                </motion.div>
              )}

              {/* Privacy Note */}
              <div className="flex items-start gap-2 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700 leading-relaxed">
                  {currentLanguage === 'ar'
                    ? 'جميع المعلومات والوثائق المقدمة سيتم استخدامها فقط لأغراض التحقق والمعالجة. نحن ملتزمون بحماية خصوصيتك وأمان بياناتك.'
                    : 'All information and documents provided will be used solely for verification and processing purposes. We are committed to protecting your privacy and data security.'}
                </p>
              </div>

              {/* Continue Button */}
              <motion.button
                onClick={handleContinue}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                data-testid="continue-button"
                className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                {currentLanguage === 'ar' ? 'المتابعة إلى الحجز' : 'Continue to Booking'}
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
