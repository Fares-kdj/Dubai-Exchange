import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';
import { useTheme } from '@/context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle, Copy, ArrowRight, CreditCard, Wallet, Phone, User, DollarSign, Network,
  MessageCircle, Upload, X, Image as ImageIcon, FileText, AlertCircle, ExternalLink, SendHorizontal
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import Header3D from '../landing/Header3D';
import Footer3D from '../landing/Footer3D';

const ServiceSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const { isDark } = useTheme();

  const isArabic = currentLanguage === 'ar';
  const isKurdish = currentLanguage === 'ku';

  const t = (ar, en, ku) => {
    if (isKurdish) return ku || en;
    if (isArabic) return ar;
    return en;
  };
  const [copied, setCopied] = useState(false);
  const [proofImage, setProofImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef(null);
  const API_URL = process.env.REACT_APP_BACKEND_URL;

  const orderData = location.state?.orderData || {};
  const orderId = orderData.orderId || 'SVC-' + Date.now().toString().slice(-8);
  const isUSDT = orderData.type === 'usdt_recharge';
  const isCard = orderData.type === 'card_recharge';

  // WhatsApp configuration
  const [whatsappNumber, setWhatsappNumber] = useState('+9647800000000'); // Default fallback

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await fetch(`${API_URL}/api/cms/contact`);
        if (res.ok) {
          const data = await res.json();
          const lang = isKurdish ? 'ku' : isArabic ? 'ar' : 'en';
          const whatsapp = data[lang]?.whatsapp || data['ar']?.whatsapp || data[lang]?.phone || data['ar']?.phone;
          if (whatsapp) setWhatsappNumber(whatsapp.replace(/\s/g, ''));
        }
      } catch (err) {
        console.error('Failed to fetch contact for WhatsApp:', err);
      }
    };
    fetchContact();
  }, [isArabic, isKurdish, API_URL]);

  const whatsappMessage = encodeURIComponent(
    t(
      `مرحباً، رقم طلبي هو: ${orderId}\nالنوع: ${isUSDT ? 'شحن USDT' : isCard ? 'تعبئة بطاقات' : 'تحويل'}\nالمبلغ: ${orderData.total?.toLocaleString()} IQD`,
      `Hello, my order ID is: ${orderId}\nType: ${isUSDT ? 'USDT Recharge' : isCard ? 'Card Recharge' : 'Transfer'}\nAmount: ${orderData.total?.toLocaleString()} IQD`,
      `سڵاو، ژمارەی داواکارییەکەم بریتییە لە: ${orderId}\nجۆر: ${isUSDT ? 'بارگاویکردنەوەی USDT' : isCard ? 'بارگاویکردنەوەی کارت' : 'گواستنەوە'}\nبڕ: ${orderData.total?.toLocaleString()} دینار`
    )
  );

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t('حجم الملف كبير جداً (الحد الأقصى 5 ميجابايت)', 'File too large (max 5MB)', 'قەبارەی پەڕگەکە زۆر گەورەیە (زۆرترین ٥ مێگابایت)'));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImage({
          file,
          preview: reader.result,
          name: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadProof = async () => {
    if (!proofImage || !orderId) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', proofImage.file);

      const response = await fetch(`${API_URL}/api/orders/${orderId}/payment-proof`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      setUploadSuccess(true);
      toast.success(t('تم رفع إثبات الدفع بنجاح!', 'Payment proof uploaded successfully!', 'بەڵگەی پارەدان بە سەرکەوتوویی بارکرا!'));
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error(t('فشل رفع الإثبات', 'Failed to upload proof', 'بارکردنی بەڵگەکە سەرکەوتوو نەبوو'));
    } finally {
      setUploading(false);
    }
  };

  const removeProofImage = () => {
    setProofImage(null);
    setUploadSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark
      ? 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900'
      : 'bg-gradient-to-b from-blue-50 via-white to-slate-50'
      }`}>
      <Header3D />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.div
              className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl ${isDark ? 'bg-[#D4AF37]' : 'bg-[#D4AF37]'
                }`}
              animate={{
                boxShadow: [
                  '0 0 0 0 rgba(212, 175, 55, 0.4)',
                  '0 0 0 20px rgba(212, 175, 55, 0)',
                ]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <CheckCircle className="w-14 h-14 text-white" />
            </motion.div>
            <h1 className={`text-4xl md:text-5xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t('تم تسجيل طلبك بنجاح!', 'Order Created Successfully!', 'داواکارییەکەت بە سەرکەوتوویی تۆمارکرا!')}
            </h1>
            <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {t('احتفظ برقم الطلب لتتبع حالته', 'Keep your order ID to track status', 'ژمارەی داواکارییەکە بپارێزە بۆ بەدواداچوونی بارودۆخەکەی')}
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order ID Card - Premium Style */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`relative rounded-3xl border-2 shadow-xl p-8 overflow-hidden ${isDark
                  ? 'bg-gradient-to-br from-[#D4AF37]/20 to-amber-900/20 border-[#D4AF37]/50'
                  : 'bg-gradient-to-br from-[#D4AF37]/10 to-amber-100 border-[#D4AF37]'
                  }`}
              >
                {/* Animated Background */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-20 -right-20 w-40 h-40 bg-[#D4AF37]/10 rounded-full blur-2xl"
                />

                <div className="relative z-10">
                  <p className={`text-sm mb-2 ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                    {t('رقم الطلب', 'Order ID', 'ژمارەی داواکاری')}
                  </p>
                  <div className="flex items-center justify-between gap-4">
                    <code className={`text-2xl md:text-3xl font-bold font-mono ${isDark ? 'text-[#D4AF37]' : 'text-amber-800'}`}>
                      {orderId}
                    </code>
                    <motion.button
                      onClick={copyOrderId}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-3 rounded-xl transition-all ${copied
                        ? 'bg-[#D4AF37] text-white'
                        : isDark
                          ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                          : 'bg-white hover:bg-slate-100 text-slate-600'
                        }`}
                    >
                      {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Order Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`rounded-3xl border-2 shadow-xl p-8 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
                  }`}
              >
                <h3 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {isUSDT ? <Wallet className="w-6 h-6 text-teal-500" /> : <CreditCard className="w-6 h-6 text-purple-500" />}
                  {t('تفاصيل الطلب', 'Order Details', 'زانیاری داواکاری')}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {orderData.fullName && (
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                        <User className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('الاسم', 'Name', 'ناو')}</p>
                        <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{orderData.fullName}</p>
                      </div>
                    </div>
                  )}

                  {orderData.phone && (
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                        <Phone className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('الهاتف', 'Phone', 'مۆبایل')}</p>
                        <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{orderData.phone}</p>
                      </div>
                    </div>
                  )}

                  {isUSDT && orderData.networkName && (
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                        <Network className="w-5 h-5 text-purple-500" />
                      </div>
                      <div>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('الشبكة', 'Network', 'تۆڕ')}</p>
                        <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{orderData.networkName}</p>
                      </div>
                    </div>
                  )}

                  {isUSDT && orderData.walletAddress && (
                    <div className="flex items-start gap-3 md:col-span-2">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-teal-500/20' : 'bg-teal-100'}`}>
                        <Wallet className="w-5 h-5 text-teal-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('عنوان المحفظة', 'Wallet Address', 'ناونیشانی جزدان')}</p>
                        <p className={`font-mono text-sm truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{orderData.walletAddress}</p>
                      </div>
                    </div>
                  )}

                  {isCard && orderData.cardType && (
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                        <CreditCard className="w-5 h-5 text-purple-500" />
                      </div>
                      <div>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('نوع البطاقة', 'Card Type', 'جۆری کارت')}</p>
                        <p className={`font-medium capitalize ${isDark ? 'text-white' : 'text-slate-900'}`}>{orderData.cardType}</p>
                      </div>
                    </div>
                  )}

                  {isCard && orderData.cardNumber && (
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}>
                        <CreditCard className="w-5 h-5 text-indigo-500" />
                      </div>
                      <div>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('رقم البطاقة', 'Card Number', 'ژمارەی کارت')}</p>
                        <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{orderData.cardNumber}</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Amount Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`rounded-3xl border-2 shadow-xl p-8 ${isDark
                  ? 'bg-blue-900/20 border-blue-700/50'
                  : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'
                  }`}
              >
                <h3 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <DollarSign className="w-6 h-6 text-[#D4AF37]" />
                  {t('تفاصيل المبلغ', 'Amount Details', 'زانیاری بڕی پارە')}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`rounded-2xl p-6 border-2 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'
                    }`}>
                    <p className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {isUSDT ? 'USDT' : t('المبلغ', 'Amount', 'بڕ')}
                    </p>
                    <p className="text-3xl font-bold text-[#D4AF37]">
                      {isUSDT ? `${orderData.amount} USDT` : `${orderData.currency || 'IQD'} ${Number(orderData.amountIQD || orderData.amount || 0).toLocaleString()}`}
                    </p>
                  </div>

                  <div className={`rounded-2xl p-6 border-2 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'
                    }`}>
                    <p className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {t('الإجمالي للدفع', 'Total to Pay', 'کۆی گشتی بۆ پارەدان')}
                    </p>
                    <p className="text-3xl font-bold text-[#D4AF37]">
                      {Number(orderData.total || 0).toLocaleString()} IQD
                    </p>
                  </div>
                </div>

                {orderData.serviceFee && (
                  <div className={`mt-4 p-4 rounded-xl ${isDark ? 'bg-slate-800/30' : 'bg-white/50'}`}>
                    <div className="flex justify-between items-center text-sm">
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>{t('رسوم الخدمة (2%)', 'Service Fee (2%)', 'رسوومی خزمەتگوزاری (٢٪)')}</span>
                      <span className="font-semibold text-amber-500">{Number(orderData.serviceFee || 0).toLocaleString()} IQD</span>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Sidebar - Right Column */}
            <div className="lg:col-span-1 space-y-6">
              {/* QR Code */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className={`rounded-3xl border-2 shadow-xl p-8 text-center ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
                  }`}
              >
                <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {t('رمز QR', 'QR Code', 'کۆدی QR')}
                </h3>

                <motion.div
                  className={`p-6 rounded-2xl mb-4 inline-block ${isDark ? 'bg-white' : 'bg-slate-50'}`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring" }}
                >
                  <QRCodeSVG
                    value={`رقم الطلب: ${orderId}
الاسم: ${orderData.fullName || ''}
التاريخ: ${new Date().toLocaleString(isKurdish ? 'ku-IQ' : (isArabic ? 'ar-IQ' : 'en-US'))}
http://dubai-international-iq.online/track-order?id=${orderId}`}
                    size={160}
                    level="H"
                    includeMargin={true}
                    bgColor="transparent"
                  />
                </motion.div>

                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {t('امسح للتحقق عند الدفع', 'Scan to verify at payment', 'بۆ دڵنیابوونەوە لە کاتی پارەدان بیگۆڕەوە')}
                </p>
              </motion.div>

              {/* WhatsApp Contact Block */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className={`rounded-3xl border-2 shadow-xl p-6 ${isDark ? 'bg-blue-900/20 border-blue-700/50' : 'bg-blue-50 border-blue-200'
                  }`}
              >
                <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-blue-400' : 'text-blue-900'}`}>
                  <MessageCircle className="w-5 h-5" />
                  {t('لطلب حساب الايداع تواصل معنا عبر الواتساب', 'To request the deposit account, contact us via WhatsApp', 'بۆ داواکردنی هەژماری سپاردن، لە ڕێگەی واتسئەپەوە پەیوەندیمان پێوە بکە')}
                </h3>

                <p className={`text-sm mb-4 ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                  {t(
                    'هل لديك استفسار؟ تواصل معنا مباشرة عبر واتساب',
                    'Have a question? Contact us directly via WhatsApp',
                    'پسیارێکت هەیە؟ ڕاستەوخۆ لە ڕێگەی واتسئەپ پەیوەندیمان پێوە بکە'
                  )}
                </p>

                <motion.a
                  href={`https://wa.me/${whatsappNumber.replace('+', '')}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
                  data-testid="whatsapp-link"
                >
                  <MessageCircle className="w-5 h-5" />
                  {t('ابدأ المحادثة', 'Start Chat', 'دەتەوێت دەست پێ بکەیت')}
                  <ExternalLink className="w-4 h-4" />
                </motion.a>
              </motion.div>

              {/* Instructions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className={`rounded-3xl p-6 border-2 ${isDark ? 'bg-blue-900/20 border-blue-700/50' : 'bg-blue-50 border-blue-200'
                  }`}
              >
                <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-blue-400' : 'text-blue-900'}`}>
                  {t('الخطوات التالية', 'Next Steps', 'هەنگاوەکانی داهاتوو')}
                </h3>

                <div className={`space-y-3 text-sm ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>
                  <p className="flex items-start gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                    {t('قم بالدفع من حسابك او من احد الوكلاء في منطقتك', 'Pay from your account or a local agent', 'لە هەژمارەکەتەوە یان لە بریکارێکی ناوخۆیی پارە بدە')}
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                    {t('ارفع صورة إثبات الدفع', 'Upload payment proof', 'وێنەی بەڵگەی پارەدان بار بکە')}
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                    {isUSDT
                      ? t('ستصلك العملات خلال 15 دقيقة', 'Receive crypto within 15 minutes', 'دروەکان لە ماوەی ١٥ خولەکدا دەستت دەکەوێت')
                      : t('سيتم تنفيذ الخدمة فوراً', 'Service executed instantly', 'خزمەتگوزارییەکە دەستبەجێ ئەنجام دەدرێت')}
                  </p>
                </div>
              </motion.div>

              {/* Payment Proof Upload Section (Side) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className={`rounded-3xl border-2 shadow-xl p-6 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
                  }`}
              >
                <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <Upload className="w-5 h-5 text-blue-500" />
                  {t('رفع إثبات الدفع', 'Upload Payment Proof', 'بارکردنی بەڵگەی پارەدان')}
                </h3>

                <AnimatePresence mode="wait">
                  {!proofImage ? (
                    <motion.label
                      key="upload-area-side"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`block border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all ${isDark
                        ? 'border-slate-600 hover:border-blue-500 hover:bg-blue-500/10'
                        : 'border-slate-300 hover:border-blue-400 hover:bg-blue-50'
                        }`}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        data-testid="proof-upload-side"
                      />
                      <div className="text-center">
                        <ImageIcon className={`w-8 h-8 mx-auto mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {t('رفع صورة الإيصال', 'Upload receipt', 'وێنەی وەسڵەکە بار بکە')}
                        </p>
                      </div>
                    </motion.label>
                  ) : (
                    <motion.div
                      key="preview-side"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className={`rounded-xl border-2 p-3 ${uploadSuccess
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                        : isDark
                          ? 'border-slate-600 bg-slate-800'
                          : 'border-slate-200 bg-slate-50'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={proofImage.preview}
                          alt="Proof"
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-medium truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{proofImage.name}</p>
                          {uploadSuccess && (
                             <p className="text-[10px] text-[#D4AF37] flex items-center gap-1">
                               <CheckCircle className="w-3 h-3" /> {t('تم الرفع', 'Uploaded', 'بارکرا')}
                             </p>
                          )}
                        </div>
                        <button onClick={removeProofImage} className="p-1 hover:bg-red-500/20 rounded">
                          <X className="w-4 h-4 text-red-500" />
                        </button>
                      </div>

                      {!uploadSuccess && (
                        <motion.button
                          onClick={handleUploadProof}
                          disabled={uploading}
                          className="w-full mt-3 py-2 bg-blue-500 text-white text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                        >
                          {uploading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <SendHorizontal className="w-4 h-4" />}
                          {uploading ? t('جاري...', 'Uploading...', 'بارکردن...') : t('رفع الآن', 'Upload Now', 'ئێستا بار بکە')}
                        </motion.button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Important Notice */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
                className={`rounded-2xl p-4 flex items-start gap-3 ${isDark ? 'bg-amber-900/20 border border-amber-700/50' : 'bg-amber-50 border border-amber-200'
                  }`}
              >
                <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                <p className={`text-xs ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
                  {t(
                    'يرجى الاحتفاظ برقم الطلب. ستحتاجه عند التحقق من حالة طلبك.',
                    'Please save your order ID. You will need it to check your order status.',
                    'تکایە ژمارەی داواکارییەکە بپارێزە. پێویستت پێی دەبێت بۆ پشکنینی بارودۆخی داواکارییەکەت.'
                  )}
                </p>
              </motion.div>
            </div>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="max-w-5xl mx-auto mt-12 flex flex-col sm:flex-row gap-4"
          >
            <motion.button
              onClick={() => navigate('/track-order', { state: { orderId } })}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 py-4 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 ${isDark
                ? 'bg-[#D4AF37] text-slate-900 hover:bg-[#FCD34D]'
                : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
            >
              <FileText className="w-5 h-5" />
              {t('تتبع طلبي', 'Track My Order', 'بەدواداچوونی داواکارییەکەم')}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 py-4 border-2 font-bold rounded-2xl transition-all ${isDark
                ? 'bg-transparent border-slate-600 text-white hover:border-slate-500 hover:bg-slate-800/50'
                : 'bg-white border-slate-200 text-slate-900 hover:border-slate-300 hover:bg-slate-50'
                }`}
            >
              {t('العودة للرئيسية', 'Back to Home', 'گەڕانەوە بۆ سەرەکی')}
            </motion.button>
          </motion.div>
        </div>
      </main>

      <Footer3D />
    </div>
  );
};

export default ServiceSuccess;
