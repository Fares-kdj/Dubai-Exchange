import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { CheckCircle, Copy, Download, Upload, X, Clock, MapPin, Calendar, DollarSign, CreditCard, Phone, User } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const SuccessPage = ({ orderData }) => {
  const { currentLanguage } = useLanguage();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [paymentProofs, setPaymentProofs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const isArabic = currentLanguage === 'ar';
  const isKurdish = currentLanguage === 'ku';

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
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-slate-50 pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto mb-8"
        >
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2 opacity-40">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                <CheckCircle className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-slate-500">
                {t('الشروط', 'Terms', 'مەرجەکان')}
              </span>
            </div>
            <div className="w-16 h-1 bg-green-500 rounded"></div>
            <div className="flex items-center gap-2 opacity-40">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                <CheckCircle className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-slate-500">
                {t('معلومات الحجز', 'Booking Details', 'زانیارییەکانی حجزکردن')}
              </span>
            </div>
            <div className="w-16 h-1 bg-green-500 rounded"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                <CheckCircle className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-slate-900">
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
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <CheckCircle className="w-14 h-14 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3">
            {t('تم تسجيل طلبك بنجاح!', 'Order Created Successfully!', 'داواکارییەکەت بە سەرکەوتوویی تۆمارکرا!')}
          </h1>
          <p className="text-lg text-slate-600">
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
                    <CheckCircle className="w-6 h-6 text-green-400" />
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
              className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl p-8"
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <User className="w-6 h-6 text-blue-600" />
                {t('بيانات العميل', 'Customer Information', 'زانیارییەکانی کڕیار')}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem
                  icon={User}
                  label={t('الاسم', 'Name', 'ناو')}
                  value={orderData?.fullName || '---'}
                  color="blue"
                />
                <InfoItem
                  icon={Phone}
                  label={t('رقم الهاتف', 'Phone', 'ژمارەی مۆبایل')}
                  value={orderData?.phone || '---'}
                  color="green"
                />
                <InfoItem
                  icon={MapPin}
                  label={t('عنوان السكن', 'Residential Address', 'ناونیشانی نیشتەجێبوون')}
                  value={orderData?.address || '---'}
                  color="purple"
                  className="md:col-span-2"
                />
              </div>
            </motion.div>

            {/* Travel Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl p-8"
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-purple-600" />
                {t('بيانات السفر', 'Travel Details', 'زانیارییەکانی گەشت')}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem
                  icon={MapPin}
                  label={t('الوجهة', 'Destination', 'شوێنی مەبەست')}
                  value={orderData?.destination || '---'}
                  color="purple"
                />
                <InfoItem
                  icon={Calendar}
                  label={t('تاريخ السفر', 'Travel Date', 'تاریخی گەشت')}
                  value={orderData?.travelDate || '---'}
                  color="pink"
                />
                <InfoItem
                  icon={MapPin}
                  label={t('مكان الاستلام', 'Pickup Location', 'شوێنی وەرگرتن')}
                  value={getPickupLabel(orderData?.pickupLocation)}
                  color="indigo"
                />
              </div>
            </motion.div>

            {/* Booking Amount */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl border-2 border-emerald-200 shadow-xl p-8"
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-emerald-600" />
                {t('المبلغ المحجوز', 'Booking Amount', 'بڕی حجزکراو')}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border-2 border-emerald-200">
                  <p className="text-sm text-slate-500 mb-1">{t('بالدولار', 'In USD', 'بە دۆلار')}</p>
                  <p className="text-3xl font-bold text-emerald-600">
                    ${orderData?.usdAmount || '0'}
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-6 border-2 border-teal-200">
                  <p className="text-sm text-slate-500 mb-1">{t('بالدينار', 'In IQD', 'بە دینار')}</p>
                  <p className="text-3xl font-bold text-teal-600">
                    {orderData?.iqdAmount ? Number(orderData.iqdAmount).toLocaleString() : '0'} {t('د.ع', 'IQD', 'د.ع')}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 text-sm text-slate-600">
                <CreditCard className="w-4 h-4" />
                <span>{t('طريقة الدفع:', 'Payment Method:', 'شێوازی پارەدان:')}</span>
                <span className="font-medium">{getPaymentMethodLabel(orderData?.paymentMethod)}</span>
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
              className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl p-8 text-center"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-6">
                {t('رمز QR للطلب', 'Order QR Code', 'کۆدی QRی داواکاری')}
              </h3>

              <div className="bg-slate-50 p-6 rounded-2xl mb-4 inline-block">
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

              <p className="text-xs text-slate-500 mb-4">
                {t(
                  'استخدم هذا الرمز للتحقق عند الاستلام',
                  'Use this code for verification at pickup',
                  'ئەم کۆدە بەکاربهێنە بۆ دووپاتکردنەوە لە کاتی وەرگرتندا'
                )}
              </p>

              <button className="w-full py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                {t('تحميل QR', 'Download QR', 'داگرتنی QR')}
              </button>
            </motion.div>

            {/* WhatsApp Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-6 text-white shadow-xl"
              data-testid="whatsapp-contact"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold">
                  {t('تواصل معنا عبر واتساب', 'Contact us via WhatsApp', 'پەیوەندیمان پێوە بکەن لە ڕێگەی واتسئەپ')}
                </h3>
              </div>

              <div className="bg-white/10 rounded-2xl p-4 mb-4">
                <p className="text-sm opacity-90 mb-2">
                  {t('رقم الواتساب:', 'WhatsApp Number:', 'ژمارەی واتسئەپ:')}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold tracking-wider" dir="ltr">+964 750 123 4567</span>
                  <motion.button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText('+9647501234567');
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
                href="https://wa.me/9647501234567"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 bg-white text-green-600 font-bold rounded-xl text-center hover:bg-green-50 transition-colors"
              >
                {t('فتح واتساب', 'Open WhatsApp', 'کردنەوەی واتسئەپ')}
              </a>
            </motion.div>

            {/* Payment Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-blue-50 border-2 border-blue-200 rounded-3xl p-6"
            >
              <h3 className="text-lg font-bold text-blue-900 mb-4">
                {t('تعليمات الدفع', 'Payment Instructions', 'ڕێنماییەکانی پارەدان')}
              </h3>

              <div className="space-y-3 text-sm text-blue-800">
                <p className="flex items-start gap-2">
                  <span className="font-bold">1.</span>
                  {t(
                    'قم بالدفع في أحد فروعنا أو عبر التحويل البنكي',
                    'Pay at our branch or via bank transfer',
                    'پارەکە لە یەکێک لە لقەکانمان یان لە ڕێگەی گواستنەوەی بانکی بدە'
                  )}
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

              <div className="mt-4 p-3 bg-blue-100 rounded-xl">
                <p className="text-xs text-blue-700">
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
              className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl p-6"
              data-testid="payment-proof-section"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                {t('إثبات الدفع', 'Payment Proof', 'بەڵگەی پارەدان')}
              </h3>

              {/* Upload Area */}
              {paymentProofs.length === 0 ? (
                <label className="block border-2 border-dashed border-slate-300 rounded-2xl p-6 hover:border-[#D4AF37] hover:bg-slate-50 transition-all cursor-pointer text-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    data-testid="payment-proof-input"
                  />
                  <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600 mb-1">
                    {t('اضغط لرفع الصور', 'Click to upload images', 'کلیک بکە بۆ بەرزکردنەوەی وێنەکان')}
                  </p>
                  <p className="text-xs text-slate-400">
                    {t('يمكنك رفع عدة صور', 'You can upload multiple images', 'دەتوانیت چەند وێنەیەک بەرز بکەیتەوە')}
                  </p>
                </label>
              ) : (
                <div className="space-y-3">
                  {paymentProofs.map((proof) => (
                    <div key={proof.id} className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-3">
                      <img src={proof.preview} alt="proof" className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{proof.name}</p>
                        <p className="text-xs text-green-600">
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
                    className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
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
            className="flex-1 py-4 bg-white border-2 border-slate-200 text-slate-900 font-bold rounded-2xl hover:border-slate-300 transition-colors"
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
const InfoItem = ({ icon: Icon, label, value, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    pink: 'bg-pink-100 text-pink-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    emerald: 'bg-emerald-100 text-emerald-600'
  };

  return (
    <div className="flex items-start gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClasses[color] || colorClasses.blue}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-slate-500 mb-1">{label}</p>
        <p className="text-sm font-medium text-slate-900">{value}</p>
      </div>
    </div>
  );
};

export default SuccessPage;
