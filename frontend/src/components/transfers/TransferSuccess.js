import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { CheckCircle, Copy, Download, Upload, X, Clock, MapPin, DollarSign, Banknote, CreditCard, Phone, User, Globe, ArrowRight, FileText, AlertTriangle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import Header3D from '../landing/Header3D';
import Footer3D from '../landing/Footer3D';

const TransferSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const { isDark } = useTheme();

  const [copied, setCopied] = useState(false);
  const [paymentProofs, setPaymentProofs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('+9647501234567'); // Dynamic fallback

  const isArabic = currentLanguage === 'ar';
  const isKurdish = currentLanguage === 'ku';

  const t = (ar, en, ku) => {
    if (isKurdish) return ku || en;
    if (isArabic) return ar;
    return en;
  };

  const API_URL = process.env.REACT_APP_BACKEND_URL;

  const orderData = location.state?.orderData || {};
  const orderId = orderData.orderId || `TRF-${Date.now().toString().slice(-8)}`;
  const orderDate = new Date().toLocaleString(isKurdish ? 'ku-IQ' : (isArabic ? 'ar-IQ' : 'en-US'));

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
  }, [API_URL, isArabic, isKurdish]);

  const copyOrderId = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(orderId);
      } else {
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
      toast.error(t('حدث خطأ أثناء الرفع', 'Error uploading proof', 'هەڵەیەک لە کاتی بارکردن ڕوویدا'));
    }

    setUploading(false);
  };

  const getTransferTypeLabel = () => {
    const types = {
      local: { ar: 'تحويل محلي', en: 'Local Transfer', ku: 'گواستنەوەی ناوخۆیی' },
      western_union: { ar: 'ويسترن يونيون', en: 'Western Union', ku: 'وێستەرن یونیۆن' },
      moneygram: { ar: 'موني جرام', en: 'MoneyGram', ku: 'مۆنی گرام' },
      country_based: { ar: 'تحويل حسب الدولة', en: 'Country-based Transfer', ku: 'گواستنەوە بەپێی وڵات' }
    };
    const type = types[orderData.type];
    return type ? t(type.ar, type.en, type.ku) : orderData.type;
  };

  const getCountryLabel = (countryCode) => {
    if (!countryCode) return '';
    const countries = {
      iraq: { ar: 'العراق', en: 'Iraq', ku: 'عێراق' },
      uae: { ar: 'الإمارات', en: 'UAE', ku: 'ئیمارات' },
      saudi: { ar: 'السعودية', en: 'Saudi Arabia', ku: 'سعودیە' },
      jordan: { ar: 'الأردن', en: 'Jordan', ku: 'ئوردن' },
      egypt: { ar: 'مصر', en: 'Egypt', ku: 'میسر' },
      turkey: { ar: 'تركيا', en: 'Turkey', ku: 'تورکیا' },
      usa: { ar: 'الولايات المتحدة', en: 'United States', ku: 'ئەمریکا' },
      uk: { ar: 'بريطانيا', en: 'United Kingdom', ku: 'بەریتانیا' },
      germany: { ar: 'ألمانيا', en: 'Germany', ku: 'ئەڵمانیا' },
      france: { ar: 'فرنسا', en: 'France', ku: 'فەڕەنسا' },
      canada: { ar: 'كندا', en: 'Canada', ku: 'کەنەدا' },
      australia: { ar: 'أستراليا', en: 'Australia', ku: 'ئوستورالیا' },
      india: { ar: 'الهند', en: 'India', ku: 'هیندستان' },
      pakistan: { ar: 'باكستان', en: 'Pakistan', ku: 'پاکستان' },
      lebanon: { ar: 'لبنان', en: 'Lebanon', ku: 'لوبنان' },
      syria: { ar: 'سوريا', en: 'Syria', ku: 'سوریا' }
    };
    const country = countries[countryCode.toLowerCase()];
    return country ? t(country.ar, country.en, country.ku) : countryCode;
  };

  const getProvinceLabel = (province) => {
    if (!province) return '';
    const provinces = {
      baghdad: { ar: 'بغداد', en: 'Baghdad', ku: 'بەغداد' },
      basra: { ar: 'البصرة', en: 'Basra', ku: 'بەسڕە' },
      erbil: { ar: 'أربيل', en: 'Erbil', ku: 'هەولێر' },
      sulaymaniyah: { ar: 'السليمانية', en: 'Sulaymaniyah', ku: 'سلێمانی' },
      duhok: { ar: 'دهوك', en: 'Duhok', ku: 'دهۆک' },
      nineveh: { ar: 'نينوى', en: 'Nineveh', ku: 'نەینەوا' },
      kirkuk: { ar: 'كركوك', en: 'Kirkuk', ku: 'کەرکوک' },
      diyala: { ar: 'ديالى', en: 'Diyala', ku: 'دیالە' },
      anbar: { ar: 'الأنبار', en: 'Anbar', ku: 'ئەنبار' },
      najaf: { ar: 'النجف', en: 'Najaf', ku: 'نەجەف' },
      karbala: { ar: 'كربلاء', en: 'Karbala', ku: 'کەربەلا' },
      babylon: { ar: 'بابل', en: 'Babylon', ku: 'بابل' },
      wasit: { ar: 'واسط', en: 'Wasit', ku: 'واست' },
      maysan: { ar: 'ميسان', en: 'Maysan', ku: 'میسان' },
      dhiqar: { ar: 'ذي قار', en: 'Dhi Qar', ku: 'زیقار' },
      muthanna: { ar: 'المثنى', en: 'Muthanna', ku: 'موسەننا' },
      qadisiyyah: { ar: 'القادسية', en: 'Qadisiyyah', ku: 'قادسیە' },
      saladin: { ar: 'صلاح الدين', en: 'Saladin', ku: 'سەڵاحەددین' },
    };
    const p = provinces[province.toLowerCase()];
    return p ? t(p.ar, p.en, p.ku) : province;
  };

  const getTypeColor = () => {
    const colors = {
      local: 'from-blue-500 to-indigo-600',
      western_union: 'from-yellow-400 to-yellow-600',
      moneygram: 'from-orange-500 to-red-500',
      country_based: 'from-indigo-500 to-purple-600'
    };
    return colors[orderData.type] || 'from-slate-500 to-slate-700';
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
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl ${isDark ? 'bg-[#D4AF37]' : 'bg-[#D4AF37]'
              }`}>
              <CheckCircle className="w-14 h-14 text-white" />
            </div>
            <h1 className={`text-4xl md:text-5xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t('تم تسجيل طلبك بنجاح!', 'Order Created Successfully!', 'داواکارییەکەت بە سەرکەوتوویی تۆمارکرا!')}
            </h1>
            <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {t('احتفظ برقم الطلب لتتبع حالته', 'Keep your order ID to track status', 'ژمارەی داواکارییەکە بپارێزە بۆ بەدواداچوونی بارودۆخەکەی')}
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order ID Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`bg-gradient-to-br ${getTypeColor()} rounded-3xl p-8 text-white shadow-2xl`}
                data-testid="transfer-order-card"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-white/70 mb-1">
                      {t('رقم الطلب', 'Order ID', 'ژمارەی داواکاری')}
                    </p>
                    <h2 className="text-3xl font-bold tracking-wider">{orderId}</h2>
                  </div>
                  <motion.button
                    onClick={copyOrderId}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
                    data-testid="copy-transfer-id"
                  >
                    {copied ? <CheckCircle className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                  </motion.button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <Clock className="w-4 h-4" />
                    {orderDate}
                  </div>
                  <div className="px-3 py-1 bg-white/20 rounded-full text-sm">
                    {getTransferTypeLabel()}
                  </div>
                </div>

                {/* Status */}
                <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-amber-500/30 border border-amber-400/50 rounded-full">
                  <div className="w-2 h-2 bg-amber-300 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-amber-100">
                    {t('في انتظار الدفع', 'Waiting for Payment', 'لە چاوەڕوانی پارەدان')}
                  </span>
                </div>
              </motion.div>

              {/* Transfer Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`rounded-3xl border-2 shadow-xl p-8 ${isDark
                  ? 'bg-slate-800/50 border-slate-700'
                  : 'bg-white border-slate-200'
                  }`}
              >
                <h3 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <User className="w-6 h-6 text-blue-600" />
                  {t('تفاصيل التحويل', 'Transfer Details', 'زانیاری گواستنەوە')}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Sender Name */}
                  {(orderData.senderName || (orderData.senderFirstName && orderData.senderLastName)) && (
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('اسم المرسل', 'Sender Name', 'ناوی نێرەر')}</p>
                        <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {orderData.senderName || `${orderData.senderFirstName} ${orderData.senderLastName}`}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Receiver Name */}
                  {(orderData.receiverName || (orderData.receiverFirstName && orderData.receiverLastName)) && (
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('اسم المستلم', 'Receiver Name', 'ناوی وەرگر')}</p>
                        <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {orderData.receiverName || `${orderData.receiverFirstName} ${orderData.receiverLastName}`}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Total Amount to Pay */}
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-[#D4AF37]/20' : 'bg-amber-100'}`}>
                      <Banknote className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <div>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('المبلغ الاجمالي للدفع', 'Total Payment Amount', 'کۆی گشتی بۆ پارەدان')}</p>
                      <p className={`font-bold text-[#D4AF37] ${isDark ? '' : ''}`}>
                        {Number(orderData.total || 0).toLocaleString()} {t('د.ع', 'IQD', 'د.ع')}
                      </p>
                    </div>
                  </div>

                  {/* Country */}
                  {(orderData.receiverCountry || orderData.countryName) && (
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}>
                        <Globe className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('الدولة', 'Country', 'وڵات')}</p>
                        <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {orderData.countryName || getCountryLabel(orderData.receiverCountry)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Amount Details - Hidden for transfers as it is now in details */}
              {!['local', 'western_union', 'moneygram', 'country_based'].includes(orderData.type) && (
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
                    <Banknote className="w-6 h-6 text-[#D4AF37]" />
                    {t('تفاصيل المبلغ', 'Amount Details', 'زانیاری بڕی پارە')}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`rounded-2xl p-6 border-2 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'}`}>
                      <p className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('المبلغ', 'Amount', 'بڕ')}</p>
                      <p className="text-3xl font-bold text-[#D4AF37]">
                        {orderData.currency === 'USD' ? '$' : ''}{Number(orderData.amount || 0).toLocaleString()} {orderData.currency !== 'USD' && (orderData.currency === 'IQD' ? t('د.ع', 'IQD', 'د.ع') : orderData.currency)}
                      </p>
                    </div>

                    <div className={`rounded-xl p-4 border ${isDark ? 'bg-slate-700/30 border-slate-600' : 'bg-slate-50 border-slate-100'}`}>
                      <p className={`text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('المبلغ النهائي', 'Final Amount', 'بڕی کۆتایی')}</p>
                      <p className="text-xl font-bold text-blue-500">
                        {Number(orderData.total || 0).toLocaleString()} {t('د.ع', 'IQD', 'د.ع')}
                      </p>
                    </div>
                  </div>

                  {orderData.type === 'country' && (
                    <div className={`mt-4 p-4 rounded-xl ${isDark ? 'bg-slate-700/30' : 'bg-slate-50'}`}>
                      <div className="flex justify-between items-center text-sm">
                        <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>{t('عملة الاستلام', 'Receiving Currency', 'دراوی وەرگیراو')}</span>
                        <span className="font-semibold text-blue-500">{orderData.receiverCurrency || orderData.currencyName}</span>
                      </div>
                    </div>
                  )}

                  {orderData.serviceFee && (
                    <div className={`mt-4 p-4 rounded-xl ${isDark ? 'bg-slate-800/30' : 'bg-white/50'}`}>
                      <div className="flex justify-between items-center text-sm">
                        <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>{t('رسوم الخدمة', 'Service Fee', 'رسوومی خزمەتگوزاری')}</span>
                        <span className="font-semibold text-amber-600">{Number(orderData.serviceFee).toLocaleString()} {t('د.ع', 'IQD', 'د.ع')}</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
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

                <div className={`p-6 rounded-2xl mb-4 inline-block ${isDark ? 'bg-white' : 'bg-slate-50'}`}>
                  <QRCodeSVG
                    value={`رقم الطلب: ${orderId}
الاسم: ${orderData.senderName || orderData.senderFirstName || (orderData.details?.senderName) || ''}
التاريخ: ${orderDate}
http://dubai-international-iq.online/track-order?id=${orderId}`}
                    size={160}
                    level="H"
                    includeMargin={true}
                  />
                </div>

                <p className={`text-xs mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {t('للتحقق عند الاستلام', 'For verification', 'بۆ دڵنیابوونەوە لە کاتی وەرگرتن')}
                </p>
              </motion.div>

              {/* WhatsApp Contact Section */}
              <div className="space-y-4">
                {/* Deadline Alert */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`border-2 rounded-3xl p-5 flex items-start gap-4 shadow-sm ${isDark ? 'bg-red-900/20 border-red-800/50' : 'bg-red-50 border-red-100'
                    }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-red-900/40' : 'bg-red-100'
                    }`}>
                    <AlertTriangle className={`w-6 h-6 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
                  </div>
                  <div className="space-y-1">
                    <h4 className={`font-bold flex items-center gap-2 ${isDark ? 'text-red-400' : 'text-red-900'}`}>
                      {t('تنبيه هام', 'Important Alert', 'بەرگری گرنگ')}
                    </h4>
                    <p className={`text-sm leading-relaxed ${isDark ? 'text-red-300/90' : 'text-red-700'}`}>
                      {t(
                        'يرجى إكمال عملية الإيداع وارفاق صورة اثبات الدفع خلال فترة زمنية أقصاها ساعتين من الآن وخلاف ذلك سيتم إهمال الطلب .',
                        'Please complete the deposit and attach the payment proof within a maximum of 2 hours, otherwise the order will be ignored.',
                        'تکایە پڕۆسەی سپاردنەکە تەواو بکە و وێنەی بەڵگەی پارەدان لە ماوەی ٢ کاتژمێردا بار بکەرەوە، ئەگەرنا داواکارییەکە پشتگوێ دەخرێت.'
                      )}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                  className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl"
                  data-testid="transfer-whatsapp-contact"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Phone className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold">
                      {t('تواصل معنا عبر واتساب', 'Contact us via WhatsApp', 'پەیوەندیمان پێوە بکە لە ڕێگەی واتسئەپ')}
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
                        data-testid="copy-transfer-whatsapp"
                      >
                        {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      </motion.button>
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(t('مرحباً، لدي استفسار حول الطلب رقم: ', 'Hello, I have an inquiry about order number: ', 'سڵاو، پرسیارێکم هەیە دەربارەی داواکاری ژمارە: ') + orderId)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3 bg-white text-blue-600 font-bold rounded-xl text-center hover:bg-blue-50 transition-colors"
                  >
                    {t('فتح واتساب', 'Open WhatsApp', 'واتسئەپ بکەرەوە')}
                  </a>
                </motion.div>
              </div>

              {/* Payment Instructions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className={`rounded-3xl p-6 border-2 ${isDark ? 'bg-blue-900/20 border-blue-700/50' : 'bg-blue-50 border-blue-200'
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
                    {t('احتفظ بإيصال الدفع', 'Keep the receipt', 'وەسڵی پارەدانەکە بپارێزە')}
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-bold">3.</span>
                    {t('ارفع صورة الإيصال', 'Upload receipt image', 'وێنەی وەسڵەکە بار بکە')}
                  </p>
                </div>

                <div className={`mt-4 p-3 rounded-xl ${isDark ? 'bg-blue-800/30' : 'bg-blue-100'}`}>
                  <p className={`text-xs ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                    📱 {t('سيصلك إشعار عند تغيير الحالة', 'You will be notified when status changes', 'کاتێک بارودۆخەکە گۆڕا ئاگادارت دەکەینەوە')}
                  </p>
                </div>
              </motion.div>

              {/* Payment Proof Upload */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className={`rounded-3xl border-2 shadow-xl p-6 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
                  }`}
                data-testid="transfer-payment-proof"
              >
                <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {t('إثبات الدفع', 'Payment Proof', 'بەڵگەی پارەدان')}
                </h3>

                {paymentProofs.length === 0 ? (
                  <label className={`block border-2 border-dashed rounded-2xl p-6 transition-all cursor-pointer text-center ${isDark
                    ? 'border-slate-600 hover:border-[#D4AF37] hover:bg-slate-700/50'
                    : 'border-slate-300 hover:border-[#D4AF37] hover:bg-slate-50'
                    }`}>
                    <input type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" />
                    <Upload className={`w-10 h-10 mx-auto mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{t('رفع صورة', 'Upload image', 'وێنە بار بکە')}</p>
                  </label>
                ) : (
                  <div className="space-y-3">
                    {paymentProofs.map((proof) => (
                      <div key={proof.id} className={`flex items-center gap-3 rounded-xl p-3 ${isDark ? 'bg-blue-900/30 border border-blue-700/50' : 'bg-blue-50 border border-blue-200'
                        }`}>
                        <img src={proof.preview} alt="proof" className="w-12 h-12 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{proof.name}</p>
                        </div>
                        <button onClick={() => removeProof(proof.id)} className="p-2 hover:bg-red-100 rounded-lg">
                          <X className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    ))}

                    <button
                      onClick={submitPaymentProof}
                      disabled={uploading}
                      className="w-full py-3 bg-[#D4AF37] text-white font-bold rounded-xl hover:bg-[#B8962E] disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {uploading ? (
                        <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{t('جارٍ...', 'Submitting...', 'تۆمارکردن...')}</>
                      ) : (
                        <><CheckCircle className="w-5 h-5" />{t('إرسال', 'Submit', 'ناردن')}</>
                      )}
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="max-w-5xl mx-auto mt-12 flex flex-col sm:flex-row gap-4"
          >
            <button
              onClick={() => navigate('/track-order', { state: { orderId } })}
              className={`flex-1 py-4 font-bold rounded-2xl transition-colors flex items-center justify-center gap-2 ${isDark
                ? 'bg-[#D4AF37] text-slate-900 hover:bg-[#FCD34D]'
                : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
            >
              {t('تتبع طلبي', 'Track My Order', 'بەدواداچوونی داواکارییەکەم')}
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/')}
              className={`flex-1 py-4 border-2 font-bold rounded-2xl transition-colors ${isDark
                ? 'bg-transparent border-slate-600 text-white hover:border-slate-500'
                : 'bg-white border-slate-200 text-slate-900 hover:border-slate-300'
                }`}
            >
              {t('العودة للرئيسية', 'Back to Home', 'گەڕانەوە بۆ سەرەکی')}
            </button>
          </motion.div>
        </div>
      </main>

      <Footer3D />
    </div>
  );
};

export default TransferSuccess;
