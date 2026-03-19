import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { CheckCircle, Copy, Download, Upload, X, Clock, MapPin, Calendar, DollarSign, CreditCard, Phone, User } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const SuccessPage = ({ orderData }) => {
  const { currentLanguage } = useLanguage();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [paymentProofs, setPaymentProofs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('+9647800000000'); // Default fallback
  const isArabic = currentLanguage === 'ar';
  const isKurdish = currentLanguage === 'ku';

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await fetch(`${API_URL}/api/cms/contact`);
        if (res.ok) {
          const data = await res.json();
          const lang = isKurdish ? 'ku' : isArabic ? 'ar' : 'en';
          const whatsapp = data[lang]?.whatsapp || data['ar']?.whatsapp || data[lang]?.phone || data['ar']?.phone;
          if (whatsapp) setWhatsappNumber(whatsapp);
        }
      } catch (err) {
        console.error('Failed to fetch contact for WhatsApp:', err);
      }
    };
    fetchContact();
  }, [isArabic, isKurdish]);

  const t = (ar, en, ku) => {
    if (isKurdish) return ku || en;
    if (isArabic) return ar;
    return en;
  };

  // Use Order ID from the created order
  const orderId = orderData?.orderId || `TRV-${Date.now().toString().slice(-8)}`;
  const orderDate = new Date().toLocaleString(isKurdish ? 'ku-IQ' : (isArabic ? 'ar-IQ' : 'en-US'));

  const copyOrderId = async () => {
    try {
      // Try modern Clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(orderId);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = orderId;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Even if copy fails, show feedback
      console.warn('Copy failed:', err);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newProofs = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      preview: URL.createObjectURL(file),
      file
    }));
    setPaymentProofs(prev => [...prev, ...newProofs]);
  };

  const removeProof = (id) => {
    setPaymentProofs(prev => prev.filter(p => p.id !== id));
  };

  const submitPaymentProof = async () => {
    if (paymentProofs.length === 0 || !orderId) return;

    setUploading(true);

    try {
      for (const proof of paymentProofs) {
        const formData = new FormData();
        formData.append('file', proof.file);

        const response = await fetch(`${API_URL}/api/orders/${orderId}/payment-proof`, {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error('Failed to upload some proofs');
        }
      }

      toast.success(t('تم إرسال إثبات الدفع بنجاح!', 'Payment proof submitted successfully!', 'بەڵگەی پارەدان بە سەرکەوتوویی نێردرا!'));
      setPaymentProofs([]);
    } catch (err) {
      console.error('Upload error:', err);
      toast.error(t('حدث خطأ أثناء الرفع', 'Error uploading proof', 'کێشەیەک لە کاتي بەرزکردنەوەدا دروست بوو'));
    }

    setUploading(false);
  };

  // Get pickup location label
  const getPickupLabel = (value) => {
    // If we have a friendly name from the order data, use it
    if (orderData?.pickupLocationName) return orderData.pickupLocationName;

    const locations = {
      'baghdad': { ar: 'مطار بغداد الدولي', en: 'Baghdad International Airport', ku: 'فڕۆکەخانەی نێودەوڵەتی بەغدا' },
      'erbil': { ar: 'مطار أربيل الدولي', en: 'Erbil International Airport', ku: 'فڕۆکەخانەی نێودەوڵەتی هەولێر' },
      'basra': { ar: 'مطار البصرة الدولي', en: 'Basra International Airport', ku: 'فڕۆکەخانەی نێودەوڵەتی بەسرە' },
      'najaf': { ar: 'مطار النجف الدولي', en: 'Najaf International Airport', ku: 'فڕۆکەخانەی نێودەوڵەتی نەجەف' },
      'sulaymaniyah': { ar: 'مطار السليمانية الدولي', en: 'Sulaymaniyah International Airport', ku: 'فڕۆکەخانەی نێودەوڵەتی سلێمانی' },
      'ibrahim_khalil': { ar: 'منفذ إبراهيم الخليل', en: 'Ibrahim Khalil Border', ku: 'دەروازەی ئیبراهیم خەلیل' },
      'trebil': { ar: 'منفذ طريبيل', en: 'Trebil Border', ku: 'دەروازەی تڕێبیل' },
      'safwan': { ar: 'منفذ سفوان', en: 'Safwan Border', ku: 'دەروازەی سەفوان' },
      'shalamcheh': { ar: 'منفذ شلامجة', en: 'Shalamcheh Border', ku: 'دەروازەی شەلامچە' }
    };
    const loc = locations[value];
    return loc ? t(loc.ar, loc.en, loc.ku) : value;
  };

  const getPaymentMethodLabel = (value) => {
    const methods = {
      'cash': { ar: 'نقداً', en: 'Cash', ku: 'بە کاش' },
      'bank_transfer': { ar: 'تحويل بنكي', en: 'Bank Transfer', ku: 'گواستنەوەی بانکی' },
      'card': { ar: 'بطاقة', en: 'Card', ku: 'کارت' }
    };
    const method = methods[value];
    return method ? t(method.ar, method.en, method.ku) : value;
  };

  return (
    <div className={`min-h-screen pt-20 transition-colors duration-300 ${
      isDark ? 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-b from-blue-50 via-white to-slate-50'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto mb-8"
        >
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2 opacity-40">
              <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-white flex items-center justify-center text-sm font-bold">
                <CheckCircle className="w-5 h-5" />
              </div>
              <span className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {t('الشروط', 'Terms', 'مەرجەکان')}
              </span>
            </div>
            <div className="w-16 h-1 bg-[#D4AF37] rounded"></div>
            <div className="flex items-center gap-2 opacity-40">
              <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-white flex items-center justify-center text-sm font-bold">
                <CheckCircle className="w-5 h-5" />
              </div>
              <span className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {t('معلومات الحجز', 'Booking Details', 'زانیارییەکانی حجزکردن')}
              </span>
            </div>
            <div className="w-16 h-1 bg-[#D4AF37] rounded"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-white flex items-center justify-center text-sm font-bold">
                <CheckCircle className="w-5 h-5" />
              </div>
              <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {t('التأكيد', 'Confirmation', 'دووپاتکردنەوە')}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="w-24 h-24 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <CheckCircle className="w-14 h-14 text-white" />
          </div>
          <h1 className={`text-4xl md:text-5xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {t('تم تسجيل طلبك بنجاح!', 'Order Created Successfully!', 'داواکارییەکەت بە سەرکەوتوویی تۆمارکرا!')}
          </h1>
          <p className={`text-lg ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {t(
              'احتفظ برقم الطلب لتتبع حالته',
              'Keep your order ID to track your request',
              'ژمارەی داواکارییەکە بپارێزە بۆ تتبعکردنی بارودۆخی'
            )}
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Order Details - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order ID Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-2xl"
              data-testid="order-id-card"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-slate-400 mb-1">
                    {t('رقم الطلب', 'Order ID', 'ژمارەی داواکاری')}
                  </p>
                  <h2 className="text-3xl font-bold tracking-wider">{orderId}</h2>
                </div>
                <motion.button
                  onClick={copyOrderId}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                  data-testid="copy-order-id"
                >
                  {copied ? (
                    <CheckCircle className="w-6 h-6 text-[#D4AF37]" />
                  ) : (
                    <Copy className="w-6 h-6" />
                  )}
                </motion.button>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Clock className="w-4 h-4" />
                {orderDate}
              </div>

              {/* Status Badge */}
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-full">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-amber-300">
                  {t('في انتظار الدفع', 'Waiting for Payment', 'چاوەڕوانی پارەدانە')}
                </span>
              </div>
            </motion.div>

            {/* Customer Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`rounded-3xl border-2 shadow-xl p-8 ${
                isDark ? 'bg-slate-800/80 border-slate-700/50' : 'bg-white border-slate-200'
              }`}
            >
              <h3 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                <User className="w-6 h-6 text-blue-600" />
                {t('بيانات العميل', 'Customer Information', 'زانیارییەکانی کڕیار')}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem
                  icon={User}
                  label={t('الاسم', 'Name', 'ناو')}
                  value={orderData?.fullName || '---'}
                  color="blue"
                  isDark={isDark}
                />
                <InfoItem
                  icon={Phone}
                  label={t('رقم الهاتف', 'Phone', 'ژمارەی مۆبایل')}
                  value={orderData?.phone || '---'}
                  color="blue"
                  isDark={isDark}
                />
                <InfoItem
                  icon={MapPin}
                  label={t('عنوان السكن', 'Residential Address', 'ناونیشانی نیشتەجێبوون')}
                  value={orderData?.address || '---'}
                  color="purple"
                  className="md:col-span-2"
                  isDark={isDark}
                />
              </div>
            </motion.div>

            {/* Travel Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`rounded-3xl border-2 shadow-xl p-8 ${
                isDark ? 'bg-slate-800/80 border-slate-700/50' : 'bg-white border-slate-200'
              }`}
            >
              <h3 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                <MapPin className="w-6 h-6 text-purple-600" />
                {t('بيانات السفر', 'Travel Details', 'زانیارییەکانی گەشت')}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem
                  icon={MapPin}
                  label={t('الوجهة', 'Destination', 'شوێنی مەبەست')}
                  value={orderData?.destination || '---'}
                  color="purple"
                  isDark={isDark}
                />
                <InfoItem
                  icon={Calendar}
                  label={t('تاريخ السفر', 'Travel Date', 'تاریخی گەشت')}
                  value={orderData?.travelDate || '---'}
                  color="pink"
                  isDark={isDark}
                />
                <InfoItem
                  icon={MapPin}
                  label={t('مكان الاستلام', 'Pickup Location', 'شوێنی وەرگرتن')}
                  value={getPickupLabel(orderData?.pickupLocation)}
                  color="indigo"
                  isDark={isDark}
                />
              </div>
            </motion.div>

            {/* Booking Amount */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`rounded-3xl border-2 shadow-xl p-8 ${
                isDark ? 'bg-blue-900/20 border-blue-800/50' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'
              }`}
            >
              <h3 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                <DollarSign className="w-6 h-6 text-[#D4AF37]" />
                {t('المبلغ المحجوز', 'Booking Amount', 'بڕی حجزکراو')}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`rounded-2xl p-6 border-2 ${
                  isDark ? 'bg-slate-800/80 border-slate-700/50' : 'bg-white border-slate-200'
                }`}>
                  <p className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {t('بالدولار', 'In USD', 'بە دۆلار')}
                  </p>
                  <p className="text-3xl font-bold text-[#D4AF37]">
                    ${orderData?.usdAmount ? Number(orderData.usdAmount).toLocaleString() : '0'}
                  </p>
                </div>
                <div className={`rounded-2xl p-6 border-2 ${
                  isDark ? 'bg-slate-800/80 border-slate-700/50' : 'bg-white border-slate-200'
                }`}>
                  <p className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {t('بالدينار', 'In IQD', 'بە دینار')}
                  </p>
                  <p className="text-3xl font-bold text-[#D4AF37]">
                    {orderData?.iqdAmount ? Number(orderData.iqdAmount).toLocaleString() : '0'} {t('د.ع', 'IQD', 'د.ع')}
                  </p>
                </div>
              </div>

              <div className={`mt-6 flex items-center gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                <CreditCard className="w-4 h-4" />
                <span>{t('طريقة الدفع:', 'Payment Method:', 'شێوازی پارەدان:')}</span>
                <span className={`font-medium ${isDark ? 'text-white' : ''}`}>
                  {getPaymentMethodLabel(orderData?.paymentMethod)}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* QR Code */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className={`rounded-3xl border-2 shadow-xl p-8 text-center ${
                isDark ? 'bg-slate-800/80 border-slate-700/50' : 'bg-white border-slate-200'
              }`}
            >
              <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {t('رمز QR للطلب', 'Order QR Code', 'کۆدی QRی داواکاری')}
              </h3>

              <div className="bg-white p-6 rounded-2xl mb-4 inline-block shadow-sm">
                <QRCodeSVG
                  value={`رقم الطلب: ${orderId}
الاسم: ${orderData?.fullName || ''}
التاريخ: ${orderDate}
http://dubai-international-iq.online/track-order?id=${orderId}`}
                  size={180}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <p className={`text-xs mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {t(
                  'استخدم هذا الرمز للتحقق عند الاستلام',
                  'Use this code for verification at pickup',
                  'ئەم کۆدە بەکاربهێنە بۆ دووپاتکردنەوە لە کاتی وەرگرتندا'
                )}
              </p>

              <button className={`w-full py-2 text-sm rounded-lg transition-colors flex items-center justify-center gap-2 ${
                isDark ? 'text-slate-300 hover:text-white hover:bg-slate-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}>
                <Download className="w-4 h-4" />
                {t('تحميل QR', 'Download QR', 'داگرتنی QR')}
              </button>
            </motion.div>

            {/* Deposit Warning Note */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.62 }}
              className="bg-red-600/90 border-2 border-red-500 rounded-2xl p-4 flex items-start gap-3 shadow-lg"
            >
              <span className="text-white text-xl mt-0.5">⚠️</span>
              <p className="text-white text-sm font-semibold leading-relaxed" dir="rtl">
                {t(
                  'يرجى إكمال الإيداع خلال فترة زمنية لا تتجاوز ساعتين وخلاف ذلك سيتم إهمال الطلب.',
                  'Please complete the deposit within 2 hours, otherwise the order will be cancelled.',
                  'تکایە سپاردنەکە ناوی کاتژمێر ٢ کاتژمێر تەواو بکە، وەکو ئەوە نەبێت داواکاری پشتگوێ دەخرێت.'
                )}
              </p>
            </motion.div>

            {/* WhatsApp Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl"
              data-testid="whatsapp-contact"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold">
                  {t('لطلب حساب الايداع تواصل معنا عبر الواتساب', 'To request the deposit account, contact us via WhatsApp', 'بۆ داواکردنی هەژماری سپاردن، لە ڕێگەی واتسئەپەوە پەیوەندیمان پێوە بکە')}
                </h3>
              </div>

              <div className="bg-white/10 rounded-2xl p-4 mb-4">
                <p className="text-sm opacity-90 mb-2">
                  {t('رقم الواتساب:', 'WhatsApp Number:', 'ژمارەی واتسئەپ:')}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold tracking-wider" dir="ltr">{whatsappNumber}</span>
                  <motion.button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(whatsappNumber.replace(/\s/g, ''));
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      } catch (err) {
                        console.warn('Copy failed:', err);
                      }
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                    data-testid="copy-whatsapp"
                  >
                    {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </motion.button>
                </div>
              </div>

              <a
                href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 bg-white text-blue-600 font-bold rounded-xl text-center hover:bg-blue-50 transition-colors"
              >
                {t('فتح واتساب', 'Open WhatsApp', 'کردنەوەی واتسئەپ')}
              </a>
            </motion.div>

            {/* Payment Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className={`border-2 rounded-3xl p-6 ${
                isDark ? 'bg-blue-900/10 border-blue-800/30' : 'bg-blue-50 border-blue-200'
              }`}
            >
              <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-blue-400' : 'text-blue-900'}`}>
                {t('تعليمات الدفع', 'Payment Instructions', 'ڕێنماییەکانی پارەدان')}
              </h3>

              <div className={`space-y-3 text-sm ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>
                <p className="flex items-start gap-2">
                  <span className="font-bold">1.</span>
                  {t('قم بالدفع من حسابك او من احد الوكلاء في منطقتك', 'Pay from your account or a local agent', 'لە هەژمارەکەتەوە یان لە بریکارێکی ناوخۆیی پارە بدە')}
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-bold">2.</span>
                  {t('احتفظ بإيصال الدفع', 'Keep your payment receipt', 'پسووڵەی پارەدانەکە بپارێزە')}
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-bold">3.</span>
                  {t('ارفع صورة الإيصال أدناه', 'Upload receipt image below', 'وێنەی پسووڵەکە لە خوارەوە بەرز بکەرەوە')}
                </p>
              </div>

              <div className={`mt-4 p-3 rounded-xl ${isDark ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                <p className={`text-xs ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                  {t(
                    '📱 سيصلك إشعار SMS عند تغيير حالة طلبك',
                    '📱 You will receive SMS notification when your order status changes',
                    '📱 نامەیەک (SMS)ت بۆ دێت کاتێک باری داواکارییەکەت دەگۆڕێت'
                  )}
                </p>
              </div>
            </motion.div>

            {/* Payment Proof Upload */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className={`rounded-3xl border-2 shadow-xl p-6 ${
                isDark ? 'bg-slate-800/80 border-slate-700/50' : 'bg-white border-slate-200'
              }`}
              data-testid="payment-proof-section"
            >
              <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {t('إثبات الدفع', 'Payment Proof', 'بەڵگەی پارەدان')}
              </h3>

              {/* Upload Area */}
              {paymentProofs.length === 0 ? (
                <label className={`block border-2 border-dashed rounded-2xl p-6 transition-all cursor-pointer text-center ${
                  isDark ? 'border-slate-600 hover:border-[#D4AF37] hover:bg-slate-800' : 'border-slate-300 hover:border-[#D4AF37] hover:bg-slate-50'
                }`}>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    data-testid="payment-proof-input"
                  />
                  <Upload className={`w-10 h-10 mx-auto mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                  <p className={`text-sm mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {t('اضغط لرفع الصور', 'Click to upload images', 'کلیک بکە بۆ بەرزکردنەوەی وێنەکان')}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {t('يمكنك رفع عدة صور', 'You can upload multiple images', 'دەتوانیت چەند وێنەیەک بەرز بکەیتەوە')}
                  </p>
                </label>
              ) : (
                <div className="space-y-3">
                  {paymentProofs.map((proof) => (
                    <div key={proof.id} className={`flex items-center gap-3 border rounded-xl p-3 ${
                      isDark ? 'bg-slate-800 border-slate-700' : 'bg-blue-50 border-blue-200'
                    }`}>
                      <img src={proof.preview} alt="proof" className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{proof.name}</p>
                        <p className={`text-xs ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                          {t('جاهز للإرسال', 'Ready to submit', 'ئامادەیە بۆ ناردن')}
                        </p>
                      </div>
                      <button
                        onClick={() => removeProof(proof.id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={submitPaymentProof}
                    disabled={uploading}
                    className="w-full py-3 bg-[#D4AF37] text-white font-bold rounded-xl hover:bg-[#B8962E] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    data-testid="submit-payment-proof"
                  >
                    {uploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        {t('جارٍ الإرسال...', 'Submitting...', 'خەریکی ناردنە...')}
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        {t('إرسال إثبات الدفع', 'Submit Payment Proof', 'ناردنی بەڵگەی پارەدان')}
                      </>
                    )}
                  </button>

                  <label className="block text-center text-sm text-slate-600 hover:text-slate-900 cursor-pointer py-2">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    + {t('إضافة المزيد', 'Add More', 'زیاتر زیاد بکە')}
                  </label>
                </div>
              )}

              <p className="text-xs text-slate-500 mt-4 text-center">
                {t(
                  'يمكنك رفع إثبات الدفع لاحقاً من صفحة تتبع الطلب',
                  'You can upload payment proof later from order tracking page',
                  'دەتوانیت بەڵگەی پارەدان دواتر لە لاپەڕەی تتبعکردنی داواکاری بەرز بکەیتەوە'
                )}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="max-w-6xl mx-auto mt-12 flex flex-col sm:flex-row gap-4"
        >
          <button
            onClick={() => navigate('/track-order', { state: { orderId } })}
            className="flex-1 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-colors"
            data-testid="track-order-btn"
          >
            {t('تتبع طلبي', 'Track My Order', 'تتبعکردنی داواکارییەکەم')}
          </button>
          <button
            onClick={() => navigate('/')}
            className={`flex-1 py-4 border-2 font-bold rounded-2xl transition-colors ${
              isDark ? 'bg-slate-800 border-slate-700 text-white hover:border-slate-600' : 'bg-white border-slate-200 text-slate-900 hover:border-slate-300'
            }`}
            data-testid="back-home-btn"
          >
            {t('العودة للرئيسية', 'Back to Home', 'گەڕانەوە بۆ سەرەتا')}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

// Info Item Component
const InfoItem = ({ icon: Icon, label, value, color, isDark }) => {
  const colorClasses = {
    blue: isDark ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-100 text-blue-600',
    green: isDark ? 'bg-green-900/40 text-green-400' : 'bg-blue-100 text-blue-600',
    purple: isDark ? 'bg-purple-900/40 text-purple-400' : 'bg-purple-100 text-purple-600',
    pink: isDark ? 'bg-pink-900/40 text-pink-400' : 'bg-pink-100 text-pink-600',
    indigo: isDark ? 'bg-indigo-900/40 text-indigo-400' : 'bg-indigo-100 text-indigo-600',
    emerald: isDark ? 'bg-emerald-900/40 text-emerald-400' : 'bg-blue-100 text-blue-600'
  };

  return (
    <div className="flex items-start gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClasses[color] || colorClasses.blue}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className={`text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</p>
        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{value}</p>
      </div>
    </div>
  );
};

export default SuccessPage;
