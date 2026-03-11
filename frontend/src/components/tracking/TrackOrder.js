import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';
import { useTheme } from '@/context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Package, User, Phone, MapPin, Calendar, DollarSign, CreditCard, FileText, Upload, X, CheckCircle, Clock, AlertCircle, Copy, Eye, Globe, Ban } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';
import Header3D from '../landing/Header3D';
import Footer3D from '../landing/Footer3D';

const TrackOrder = () => {
  const { currentLanguage } = useLanguage();
  const { isDark } = useTheme();
  const isArabic = currentLanguage === 'ar';
  const isKurdish = currentLanguage === 'ku';

  const t = (ar, en, ku) => {
    if (isKurdish) return ku || en;
    if (isArabic) return ar;
    return en;
  };
  const API_URL = process.env.REACT_APP_BACKEND_URL;

  const [searchData, setSearchData] = useState({ orderId: '', orderType: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderResult, setOrderResult] = useState(null);
  const [paymentProofs, setPaymentProofs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [methods, setMethods] = useState([]);

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/cms/predefined-methods`);
        setMethods(response.data);
      } catch (err) {
        console.error('Error fetching methods:', err);
      }
    };
    fetchMethods();
  }, [API_URL]);

  const orderTypes = [
    { value: 'traveler', labelAr: 'حجز الدولار للمسافرين', labelEn: 'Traveler USD Booking', labelKu: 'بۆردی دۆلار بۆ گەشتیاران' },
    { value: 'local', labelAr: 'تحويل محلي', labelEn: 'Local Transfer', labelKu: 'گواستنەوەی ناوخۆیی' },
    { value: 'western_union', labelAr: 'ويسترن يونيون', labelEn: 'Western Union', labelKu: 'وێستەرن یونیۆن' },
    { value: 'moneygram', labelAr: 'موني جرام', labelEn: 'MoneyGram', labelKu: 'مۆنی گرام' },
    { value: 'country_based', labelAr: 'تحويل حسب الدولة', labelEn: 'Country-based Transfer', labelKu: 'گواستنەوە بەپێی وڵات' },
    { value: 'card_recharge', labelAr: 'تعبئة بطاقات', labelEn: 'Card Recharge', labelKu: 'بارگاویکردنەوەی کارت' },
    { value: 'usdt_recharge', labelAr: 'شحن USDT', labelEn: 'USDT Transfer', labelKu: 'گواستنەوەی USDT' }
  ];

  const statusConfig = {
    waiting_payment: { labelAr: 'في انتظار الدفع', labelEn: 'Waiting for Payment', labelKu: 'لە چاوەڕوانی پارەدان', color: 'bg-amber-500', icon: Clock },
    pending_review: { labelAr: 'قيد المراجعة', labelEn: 'Pending Review', labelKu: 'لەژێر پێداچوونەوە', color: 'bg-yellow-500', icon: Search },
    under_review: { labelAr: 'قيد المراجعة', labelEn: 'Under Review', labelKu: 'لەژێر پێداچوونەوە', color: 'bg-yellow-500', icon: Search },
    approved: { labelAr: 'تم القبول', labelEn: 'Approved', labelKu: 'قبوڵکرا', color: 'bg-green-500', icon: CheckCircle },
    rejected: { labelAr: 'تم الرفض', labelEn: 'Rejected', labelKu: 'ڕەتکرایەوە', color: 'bg-red-500', icon: AlertCircle },
    ignored: { labelAr: 'تم التجاهل', labelEn: 'Ignored', labelKu: 'پشتگوێ خرا', color: 'bg-slate-500', icon: Ban }
  };

  const handleSearch = async () => {
    if (!searchData.orderId.trim()) {
      setError(t('أدخل رقم الطلب', 'Enter order ID', 'ژمارەی داواکاری لێرە بنووسە'));
      return;
    }
    if (!searchData.orderType) {
      setError(t('اختر نوع الطلب', 'Select order type', 'جۆری داواکاری هەڵبژێرە'));
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/orders/track`, {
        order_id: searchData.orderId.trim(),
        order_type: searchData.orderType
      });

      const order = response.data;
      // Map API response to component format
      setOrderResult({
        orderId: order.order_id,
        type: order.order_type,
        status: order.status,
        createdAt: order.created_at,
        customer: {
          fullName: order.customer?.full_name || '',
          phone: order.customer?.phone || ''
        },
        details: order.details || {},
        documents: {
          passport: order.documents?.some(d => d.doc_type === 'passport'),
          ticket: order.documents?.some(d => d.doc_type === 'ticket'),
          senderId: order.documents?.some(d => d.doc_type === 'id'),
          paymentProof: order.payment_proofs?.length > 0
        },
        customer_blocked: order.customer_blocked
      });
    } catch (err) {
      setError(t('الطلب غير موجود. تأكد من رقم الطلب ونوعه.', 'Order not found. Verify order ID and type.', 'داواکارییەکە نەدۆزرایەوە. دڵنیابەوە لە ژمارە و جۆری داواکارییەکە.'));
      setOrderResult(null);
    }

    setLoading(false);
  };

  const copyOrderId = async () => {
    try {
      await navigator.clipboard.writeText(orderResult?.orderId || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newProofs = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      preview: URL.createObjectURL(file),
      file: file
    }));
    setPaymentProofs(prev => [...prev, ...newProofs]);
  };

  const removeProof = (id) => {
    setPaymentProofs(prev => prev.filter(p => p.id !== id));
  };

  const submitPaymentProof = async () => {
    if (paymentProofs.length === 0 || !orderResult) return;
    setUploading(true);

    try {
      for (const proof of paymentProofs) {
        const formData = new FormData();
        formData.append('file', proof.file);

        await axios.post(`${API_URL}/api/orders/${orderResult.orderId}/payment-proof`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      toast.success(t('تم إرسال إثبات الدفع بنجاح!', 'Payment proof submitted!', 'بەڵگەی پارەدان بە سەرکەوتوویی نێردرا!'));
      setPaymentProofs([]);
      // Refresh order data
      handleSearch();
    } catch (err) {
      toast.error(t('حدث خطأ أثناء رفع الملف', 'Error uploading file', 'هەڵەیەک لە کاتی بارکردنی پەڕگەکە ڕوویدا'));
    }

    setUploading(false);
  };

  const getStatusLabel = (status) => {
    const config = statusConfig[status];
    return config ? t(config.labelAr, config.labelEn, config.labelKu) : status;
  };

  const getOrderTypeLabel = (type) => {
    const o = orderTypes.find(o => o.value === type);
    return o ? t(o.labelAr, o.labelEn, o.labelKu) : type;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(isKurdish ? 'ku-IQ' : (isArabic ? 'ar-IQ' : 'en-US'), {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark
      ? 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900'
      : 'bg-gradient-to-b from-slate-50 via-white to-slate-50'
      }`}>
      <Header3D />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-[#D4AF37] to-[#FCD34D] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Package className="w-10 h-10 text-slate-900" />
            </div>
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t('تتبع طلبك', 'Track Your Order', 'بەدواداچوونی داواکارییەکەت')}
            </h1>
            <p className={`text-lg max-w-xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {t(
                'أدخل رقم الطلب ونوعه لمعرفة حالته وتفاصيله الكاملة',
                'Enter your order ID and type to check its status and full details',
                'ژمارە و جۆری داواکارییەکەت بنووسە بۆ زانینی بارودۆخ و زانیارییە تەواوەکانی'
              )}
            </p>
          </motion.div>

          {/* Search Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <div className={`backdrop-blur-xl rounded-3xl border-2 p-8 shadow-2xl ${isDark
              ? 'bg-slate-800/50 border-slate-700'
              : 'bg-white border-slate-200'
              }`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <Label className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {t('رقم الطلب', 'Order ID', 'ژمارەی داواکاری')}
                  </Label>
                  <Input
                    value={searchData.orderId}
                    onChange={(e) => setSearchData(prev => ({ ...prev, orderId: e.target.value }))}
                    className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400' : 'bg-white border-slate-300 text-slate-900'}`}
                    placeholder={t('مثال: TRV-12345678', 'e.g., TRV-12345678', 'بۆ نموونە: TRV-12345678')}
                    data-testid="track-order-id"
                  />
                </div>
                <div className="space-y-2">
                  <Label className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {t('نوع الطلب', 'Order Type', 'جۆری داواکاری')}
                  </Label>
                  <Select value={searchData.orderType} onValueChange={(v) => setSearchData(prev => ({ ...prev, orderType: v }))}>
                    <SelectTrigger className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`} data-testid="track-order-type">
                      <SelectValue placeholder={t('اختر نوع الطلب', 'Select order type', 'جۆری داواکاری هەڵبژێرە')} />
                    </SelectTrigger>
                    <SelectContent>
                      {orderTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {t(type.labelAr, type.labelEn, type.labelKu)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-6 p-4 rounded-xl flex items-center gap-2 ${isDark
                    ? 'bg-red-500/20 border border-red-500/30 text-red-300'
                    : 'bg-red-50 border border-red-200 text-red-600'
                    }`}
                >
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </motion.div>
              )}

              <motion.button
                onClick={handleSearch}
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#FCD34D] text-slate-900 font-bold rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50"
                data-testid="track-search-btn"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <><Search className="w-5 h-5" />{t('بحث', 'Search', 'گەڕان')}</>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Order Result */}
          <AnimatePresence>
            {orderResult && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="max-w-5xl mx-auto"
              >
                {/* Order Header Card */}
                <div className={`backdrop-blur-xl rounded-3xl border-2 p-8 mb-6 ${isDark
                  ? 'bg-slate-800/50 border-slate-700'
                  : 'bg-white border-slate-200'
                  }`}>
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div>
                      <p className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('رقم الطلب', 'Order ID', 'ژمارەی داواکاری')}</p>
                      <div className="flex items-center gap-3">
                        <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{orderResult.orderId}</h2>
                        <button onClick={copyOrderId} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-slate-100'}`}>
                          {copied ? <CheckCircle className="w-5 h-5 text-green-400" /> : <Copy className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />}
                        </button>
                      </div>
                      <div className="flex items-center gap-4 mt-3">
                        <span className={`px-3 py-1 rounded-full text-sm ${isDark ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                          {getOrderTypeLabel(orderResult.type)}
                        </span>
                        <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {formatDate(orderResult.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className={`px-6 py-3 ${statusConfig[orderResult.status]?.color} rounded-2xl flex items-center gap-2`}>
                      {React.createElement(statusConfig[orderResult.status]?.icon || Clock, { className: 'w-5 h-5 text-white' })}
                      <span className="font-bold text-white">{getStatusLabel(orderResult.status)}</span>
                    </div>
                  </div>

                  {/* Status Timeline */}
                  <div className="mt-8 flex items-center justify-between max-w-xl">
                    {['waiting_payment', 'pending_review', 'approved'].map((s, i) => {
                      const statuses = ['waiting_payment', 'pending_review', 'approved', 'rejected'];
                      const currentIdx = statuses.indexOf(orderResult.status);
                      const isActive = statuses.indexOf(s) <= currentIdx && orderResult.status !== 'rejected';
                      const isRejected = orderResult.status === 'rejected';

                      return (
                        <React.Fragment key={s}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isRejected ? 'bg-red-500/30' : isActive ? 'bg-[#D4AF37]' : (isDark ? 'bg-slate-700' : 'bg-slate-200')
                            }`}>
                            {isActive && !isRejected && <CheckCircle className="w-4 h-4 text-white" />}
                          </div>
                          {i < 2 && <div className={`flex-1 h-1 mx-2 rounded ${isActive && statuses.indexOf(s) < currentIdx ? 'bg-[#D4AF37]' : (isDark ? 'bg-slate-700' : 'bg-slate-200')}`} />}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>

                {/* Blocked Status Warning */}
                {orderResult.customer_blocked && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-6 rounded-3xl border-2 mb-6 flex items-center gap-4 ${isDark
                      ? 'bg-red-500/20 border-red-500/50 text-red-200'
                      : 'bg-red-50 border-red-200 text-red-700'
                      }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${isDark ? 'bg-red-500/30' : 'bg-red-100'
                      }`}>
                      <Ban className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">
                        {t('حسابك محظور', 'Account Blocked', 'هەژمارەکەت بلۆک کراوە')}
                      </h3>
                      <p className="text-sm opacity-90">
                        {t(
                          'لقد تم حظر حسابك من استخدام خدماتنا. يرجى التواصل مع الدعم الفني لمزيد من المعلومات.',
                          'Your account has been blocked from using our services. Please contact support for more information.',
                          'هەژمارەکەت لە بەکارهێنانی خزمەتگوزارییەکانمان بلۆک کراوە. تکایە بۆ زانیاری زیاتر پەیوەندی بە پشتیوانی تەکنیکییەوە بکە.'
                        )}
                      </p>
                    </div>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column - Details */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Customer Info */}
                    <div className={`rounded-3xl border-2 p-8 shadow-xl ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
                      <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        <User className="w-6 h-6 text-blue-600" />
                        {t('بيانات العميل', 'Customer Information', 'زانیاری کڕیار')}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('الاسم', 'Name', 'ناو')}</p>
                            <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{orderResult.customer.fullName}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-green-500/20' : 'bg-green-100'}`}>
                            <Phone className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('الهاتف', 'Phone', 'مۆبایل')}</p>
                            <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{orderResult.customer.phone}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Service Details */}
                    <div className={`rounded-3xl border-2 p-8 shadow-xl ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
                      <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        <FileText className="w-6 h-6 text-purple-600" />
                        {t('تفاصيل الطلب', 'Order Details', 'زانیاری داواکاری')}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(() => {
                          const labels = {
                            travelType: { ar: 'نوع السفر', en: 'Travel Type', ku: 'جۆری گەشت' },
                            destination: { ar: 'الوجهة', en: 'Destination', ku: 'شوێنی مەبەست' },
                            travelDate: { ar: 'تاريخ السفر', en: 'Travel Date', ku: 'بەرواری گەشت' },
                            pickupLocation: { ar: 'مكان الاستلام', en: 'Pickup Location', ku: 'شوێنی وەرگرتن' },
                            usdAmount: { ar: 'المبلغ ($)', en: 'Amount ($)', ku: 'بڕ ($)' },
                            iqdAmount: { ar: 'المبلغ (د.ع)', en: 'Amount (IQD)', ku: 'بڕ (د.ع)' },
                            paymentMethod: { ar: 'طريقة الدفع', en: 'Payment Method', ku: 'شێوازی پارەدان' },
                            senderName: { ar: 'اسم المرسل', en: 'Sender Name', ku: 'ناوی نێرەر' },
                            receiverName: { ar: 'اسم المستلم', en: 'Receiver Name', ku: 'ناوی وەرگرەر' },
                            senderProvince: { ar: 'محافظة المرسل', en: 'Sender Province', ku: 'پارێزگای نێرەر' },
                            receiverProvince: { ar: 'محافظة المستلم', en: 'Receiver Province', ku: 'پارێزگای وەرگرەر' },
                            senderCountry: { ar: 'دولة المرسل', en: 'Sender Country', ku: 'وڵاتی نێرەر' },
                            receiverCountry: { ar: 'دولة المستلم', en: 'Receiver Country', ku: 'وڵاتی وەرگرەر' },
                            currency: { ar: 'العملة', en: 'Currency', ku: 'دراو' },
                            amount: { ar: 'المبلغ', en: 'Amount', ku: 'بڕ' },
                            serviceFee: { ar: 'رسوم الخدمة', en: 'Service Fee', ku: 'کرێی خزمەتگوزاری' },
                            amountUSD: { ar: 'المبلغ ($)', en: 'Amount ($)', ku: 'بڕ ($)' },
                            amountIQD: { ar: 'المبلغ (د.ع)', en: 'Amount (IQD)', ku: 'بڕ (د.ع)' },
                            phone: { ar: 'رقم الهاتف', en: 'Phone', ku: 'ژمارەی مۆبایل' },
                            senderPhone: { ar: 'هاتف المرسل', en: 'Sender Phone', ku: 'مۆبایلی نێرەر' },
                            receiverPhone: { ar: 'هاتف المستلم', en: 'Receiver Phone', ku: 'مۆبایلی وەرگرەر' },
                            senderCurrency: { ar: 'عملة المرسل', en: 'Sender Currency', ku: 'دراوی نێرەر' },
                            receiverCurrency: { ar: 'عملة المستلم', en: 'Receiver Currency', ku: 'دراوی وەرگرەر' },
                            exchangeRate: { ar: 'سعر الصرف', en: 'Exchange Rate', ku: 'نرخی ئاڵوگۆڕ' },
                            total: { ar: 'الإجمالي', en: 'Total', ku: 'تێکڕا' },
                            // Card Recharge specific
                            cardName: { ar: 'الاسم على البطاقة', en: 'Name on Card', ku: 'ناوی سەر کارتەکە' },
                            numberType: { ar: 'نوع الرقم', en: 'Number Type', ku: 'جۆری ژمارە' },
                            cardType: { ar: 'نوع البطاقة', en: 'Card Type', ku: 'جۆری کارت' },
                            cardNumber: { ar: 'رقم البطاقة', en: 'Card Number', ku: 'ژمارەی کارت' },
                            accountNumber: { ar: 'رقم الحساب', en: 'Account Number', ku: 'ژمارەی هەژمار' },
                            // USDT specific
                            networkName: { ar: 'الشبكة', en: 'Network', ku: 'تۆڕ' },
                            walletAddress: { ar: 'عنوان المحفظة', en: 'Wallet Address', ku: 'ناونیشانی وێڵێت' },
                            // International transfer fields
                            rip: { ar: 'رقم الحساب (RIP)', en: 'Account Number (RIP)', ku: 'ژمارەی ئەژمار (RIP)' },
                            bankName: { ar: 'اسم البنك', en: 'Bank Name', ku: 'ناوی بانک' },
                            beneficiaryName: { ar: 'اسم المستفيد', en: 'Beneficiary Name', ku: 'ناوی وەرگر' },
                            iban: { ar: 'رقم الآيبان (IBAN)', en: 'IBAN', ku: 'IBAN' },
                            swift: { ar: 'سويفت كود (SWIFT)', en: 'SWIFT Code', ku: 'کۆدی SWIFT' },
                            generic_account: { ar: 'رقم الحساب أو المعرف', en: 'Account or ID', ku: 'ژمارەی ئەژمار يان ناسێنەر' },
                            // Travel fields
                            passport_number: { ar: 'رقم الجواز', en: 'Passport Number', ku: 'ژمارەی پۆسپۆرت' },
                            mother_name: { ar: 'اسم الأم', en: 'Mother\'s Name', ku: 'ناوی دایک' },
                            ticket_number: { ar: 'رقم التذكرة', en: 'Ticket Number', ku: 'ژمارەی بلیت' },
                            batch_number: { ar: 'رقم الوجبة', en: 'Batch Number', ku: 'ژمارەی بەش' },
                            batch_date: { ar: 'تاريخ الوجبة', en: 'Batch Date', ku: 'بەرواری بەش' },
                            travel_time: { ar: 'وقت السفر', en: 'Travel Time', ku: 'کاتی گەشت' },
                            passport_issue_date: { ar: 'تاريخ إصدار الجواز', en: 'Passport Issue Date', ku: 'بەرواری دەرچوونی پۆسپۆرت' },
                            passport_expiry_date: { ar: 'تاريخ نفاذ الجواز', en: 'Passport Expiry Date', ku: 'بەرواری بەسەرچوونی پۆسپۆرت' },
                            travel_agency: { ar: 'مكتب السياحة', en: 'Travel Agency', ku: 'نووسینگەی گەشتياري' },
                            // International Transfer - Country & Method
                            countryCode: { ar: 'كود الدولة', en: 'Country Code', ku: 'کۆدی وڵات' },
                            countryName: { ar: 'الدولة', en: 'Country', ku: 'وڵات' },
                            methodId: { ar: 'معرف الطريقة', en: 'Method ID', ku: 'ناسنامەی ڕێگا' },
                            methodName: { ar: 'طريقة التحويل', en: 'Transfer Method', ku: 'ڕێگای گواستنەوە' },
                            receiveAmount: { ar: 'المبلغ المستلم', en: 'Receive Amount', ku: 'بڕی وەرگیراو' },
                            // MoneyGram New Fields
                            senderFirstName: { ar: 'الاسم الثلاثي للمرسل', en: 'Sender Full Name', ku: 'ناوی تەواوی نێرەر' },
                            senderLastName: { ar: 'اللقب للمرسل', en: 'Sender Nickname', ku: 'نازناوی نێرەر' },
                            senderAddress: { ar: 'عنوان المرسل', en: 'Sender Address', ku: 'ناونیشانی نێرەر' },
                            senderPhone: { ar: 'رقم هاتف المرسل', en: 'Sender Phone', ku: 'مۆبایلی نێرەر' },
                            senderDOB: { ar: 'تاريخ ميلاد المرسل', en: 'Sender Date of Birth', ku: 'بەرواری لەدایکبوونی نێرەر' },
                            senderPOB: { ar: 'مكان ميلاد المرسل', en: 'Sender Place of Birth', ku: 'شوێنی لەدایکبوونی نێرەر' },
                            receiverFirstName: { ar: 'الاسم الثلاثي للمستلم', en: 'Receiver Full Name', ku: 'ناوی تەواوی وەرگر' },
                            receiverLastName: { ar: 'اللقب للمستلم', en: 'Receiver Nickname', ku: 'نازناوی وەرگر' },
                            receiverDOB: { ar: 'تاريخ ميلاد المستلم', en: 'Receiver Date of Birth', ku: 'بەرواری لەدایکبوونی وەرگر' },
                            receiverPhone: { ar: 'رقم هاتف المستلم', en: 'Receiver Phone', ku: 'مۆبایلی وەرگر' },
                            // Western Union New Fields
                            receiverAddress: { ar: 'عنوان المستلم', en: 'Receiver Address', ku: 'ناونیشانی وەرگر' },
                            address: { ar: 'عنوان العميل', en: 'Customer Address', ku: 'ناونیشانی کڕیار' },
                            idType: { ar: 'نوع الهوية', en: 'ID Type', ku: 'جۆری ناسنامە' },
                            purpose: { ar: 'الغرض من التحويل', en: 'Transfer Purpose', ku: 'مەبەستی گواستنەوە' },
                            pickupLocationName: { ar: 'مكان الاستلام', en: 'Pickup Location', ku: 'شوێنی وەرگرتن' }
                          };

                          const valueMappings = {
                            'zain_cash': t('زين كاش', 'Zain Cash', 'زەین کاش'),
                            'mastercard_rafidain': t('ماستركارد الرافدين', 'Mastercard Rafidain', 'ماستەرکاردی ڕافیدەین'),
                            'fib': 'FIB',
                            'air': t('جوي', 'Air', 'ئاسمانی'),
                            'land': t('بري', 'Land', 'وشکانی'),
                            'USD': t('دولار أمريكي', 'US Dollar', 'دۆلاري ئەمریکی'),
                            'IQD': t('دينار عراقي', 'Iraqi Dinar', 'دیناري عێراقي'),
                            'card': t('رقم بطاقة (16 رقم)', 'Card Number (16 digits)', 'ژمارەی کارت (١٦ ژمارە)'),
                            'account': t('رقم حساب (10 أرقام)', 'Account Number (10 digits)', 'ژمارەی هەژمار (١٠ ژمارە)'),
                            'usdt_recharge': t('شحن USDT', 'USDT Recharge', 'بارگاويكردنەوەی USDT'),
                            'card_recharge': t('شحن بطاقة', 'Card Recharge', 'بارگاويكردنەوەی کارت'),
                            'usdt': 'USDT',
                            // Provinces
                            'baghdad': t('بغداد', 'Baghdad', 'بەغدا'),
                            'basra': t('البصرة', 'Basra', 'بەسرە'),
                            'erbil': t('أربيل', 'Erbil', 'هەولێر'),
                            'sulaymaniyah': t('السليمانية', 'Sulaymaniyah', 'سلێمانی'),
                            'duhok': t('دهوك', 'Duhok', 'دهۆک'),
                            'nineveh': t('نينوى', 'Nineveh', 'نەینەوا'),
                            'kirkuk': t('كركوك', 'Kirkuk', 'کەرکوک'),
                            'diyala': t('ديالى', 'Diyala', 'دیالە'),
                            'anbar': t('الأنبار', 'Anbar', 'ئەنبار'),
                            'najaf': t('النجف', 'Najaf', 'نەجەف'),
                            'karbala': t('كربلاء', 'Karbala', 'کەربەلا'),
                            'babylon': t('بابل', 'Babylon', 'بابل'),
                            'wasit': t('واسط', 'Wasit', 'واسیتی'),
                            'maysan': t('ميسان', 'Maysan', 'میسان'),
                            'dhiqar': t('ذي قار', 'Dhi Qar', 'زیقار'),
                            'muthanna': t('المثنى', 'Muthanna', 'موسەنا'),
                            'qadisiyyah': t('القادسية', 'Qadisiyyah', 'قادسیە'),
                            'saladin': t('صلاح الدين', 'Saladin', 'سەڵاحەدین'),
                            // Currencies
                            'DZD': t('دينار جزائري', 'Algerian Dinar', 'دیناری جەزائیری'),
                            'EUR': t('يورو', 'Euro', 'یۆرۆ'),
                            'TRY': t('ليرة تركية', 'Turkish Lira', 'لیرەی تورکی'),
                            'AED': t('درهم إماراتي', 'UAE Dirham', 'درهەمی ئیماراتی'),
                            'EGP': t('جنيه مصري', 'Egyptian Pound', 'جونەیهی میسری'),
                            // Countries & Methods (Values)
                            'iraq': t('العراق', 'Iraq', 'عێراق'),
                            'uae': t('الإمارات', 'UAE', 'ئیمارات'),
                            'saudi': t('السعودية', 'Saudi Arabia', 'سعودیە'),
                            'jordan': t('الأردن', 'Jordan', 'ئوردن'),
                            'egypt': t('مصر', 'Egypt', 'میسر'),
                            'usa': t('الولايات المتحدة', 'United States', 'ئەمریکا'),
                            'uk': t('بريطانيا', 'United Kingdom', 'بەریتانیا'),
                            'germany': t('ألمانيا', 'Germany', 'ئەڵمانیا'),
                            'france': t('فرنسا', 'France', 'فەڕەنسا'),
                            'canada': t('كندا', 'Canada', 'کەنەدا'),
                            'australia': t('أستراليا', 'Australia', 'ئوستورالیا'),
                            'india': t('الهند', 'India', 'هیندستان'),
                            'pakistan': t('باكستان', 'Pakistan', 'پاکستان'),
                            'lebanon': t('لبنان', 'Lebanon', 'لوبنان'),
                            'syria': t('سوريا', 'Syria', 'سوریا'),
                            'DZ': t('الجزائر', 'Algeria', 'جەزائیر'),
                            'Algeria': t('الجزائر', 'Algeria', 'جەزائیر'),
                            'algeria': t('الجزائر', 'Algeria', 'جەزائیر'),
                            'TR': t('تركيا', 'Turkey', 'تورکیا'),
                            'Turkey': t('تركيا', 'Turkey', 'تورکیا'),
                            'turkey': t('تركيا', 'Turkey', 'تورکیا'),
                            'TRY': t('ليرة تركية', 'Turkish Lira', 'لیرەی تورکی'),
                            'try': t('ليرة تركية', 'Turkish Lira', 'لیرەی تورکی'),
                            'TRY_TRY': t('ليرة تركية', 'Turkish Lira', 'ليرەی توركي'),
                            'BaridiMob': t('بريدي موب', 'BaridiMob', 'بەریدی مۆب'),
                            'western_union': t('ويسترن يونيون', 'Western Union', 'وێستەرن یونیۆن'),
                            'ria': t('ريا', 'Ria', 'ڕیا'),
                            'bank_dropdown_test': t('تحويل بنكي', 'Bank Transfer', 'گواستنەوەی بانكي'),
                            'Bank Transfer (Test)': t('تحويل بنكي', 'Bank Transfer', 'گواستنەوەی بانکی'),
                            'Bank Transfer (Dropdown Test)': t('تحويل بنكي', 'Bank Transfer', 'گواستنەوەی بانكي'),
                            'تحويل بنكي (تجريبي)': t('تحويل بنكي', 'Bank Transfer', 'گواستنەوەی بانكي'),
                            'bank_transfer': t('تحويل بنكي', 'Bank Transfer', 'گواستنەوەی بانكي'),
                            // ID Types (Western Union)
                            'passport': t('جواز سفر', 'Passport', 'پاسپۆرت'),
                            'national_id': t('بطاقة هوية', 'National ID Card', 'کارتی ناسنامە'),
                            // Purposes (Western Union)
                            'trade': t('تجارة', 'Trade', 'بازرگانی'),
                            'family_expenses': t('نفقات الأسرة', 'Family Expenses', 'خەرجی خێزان'),
                            'medical': t('علاج', 'Medical Treatment', 'چارە‌سەری پزیشکی')
                          };

                          const rawDetails = { ...orderResult.details };
                          if (rawDetails.customFields && typeof rawDetails.customFields === 'object') {
                            Object.assign(rawDetails, rawDetails.customFields);
                            delete rawDetails.customFields;
                          }

                          return Object.entries(rawDetails)
                            .filter(([key, value]) => {
                              if (value === null || value === undefined || value === '') return false;
                              // Hide internal IDs if friendly names are available
                              if (key === 'methodId' && rawDetails.methodName) return false;
                              if (key === 'countryCode' && rawDetails.countryName) return false;
                              if (key === 'pickupLocation' && rawDetails.pickupLocationName) return false;
                              // Hide internal tracking/stamping fields
                              if (key === 'pickupStampId' || key === 'pickupStampImage') return false;
                              // Hide image URLs (they will be shown in the Documents section)
                              if (typeof value === 'string' && (value.startsWith('/uploads/') || value.startsWith('http') || value.startsWith('data:image'))) return false;
                              return true;
                            })
                            .map(([key, value]) => {
                              // Try to find field definition in methods
                              let label = key;
                              if (labels[key]) {
                                label = t(labels[key].ar, labels[key].en, labels[key].ku);
                              } else if (orderResult.details?.methodId || orderResult.details?.methodName) {
                                const methodId = orderResult.details.methodId;
                                const method = methods.find(m => m.method_id === methodId);
                                const field = method?.fields?.find(f => f.field_id === key);
                                if (field) {
                                  label = t(field.name_ar, field.name_en, field.name_ku);
                                }
                              }

                              const displayValue = valueMappings[value] || value;

                              if (typeof value === 'object') return null;

                              return (
                                <div key={key} className={`p-4 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                                  <p className={`text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</p>
                                  {key === 'walletAddress' ? (
                                    <div className="flex items-center gap-2">
                                      <p className={`font-mono text-[10px] break-all flex-1 leading-relaxed ${isDark ? 'text-white' : 'text-slate-900'}`}>{displayValue}</p>
                                      <button
                                        onClick={() => {
                                          navigator.clipboard.writeText(displayValue);
                                          toast.success(t('تم نسخ العنوان', 'Address copied', 'ناونیشانەکە کۆپی کرا'));
                                        }}
                                        className={`p-1.5 rounded-lg shrink-0 transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-slate-200'}`}
                                      >
                                        <Copy className="w-4 h-4 text-slate-500" />
                                      </button>
                                    </div>
                                  ) : (
                                    <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{displayValue}</p>
                                  )}
                                </div>
                              );
                            });
                        })()}
                      </div>
                    </div>

                    {/* Documents */}
                    <div className={`rounded-3xl border-2 p-8 shadow-xl ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
                      <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        <Eye className="w-6 h-6 text-amber-600" />
                        {t('الوثائق المرفوعة', 'Uploaded Documents', 'بەڵگە بارکراوەکان')}
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {orderResult.documents.passport && (
                          <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-green-500/20 border border-green-500/30' : 'bg-green-50 border border-green-200'}`}>
                            <FileText className={`w-8 h-8 mx-auto mb-2 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                            <p className={`text-sm font-medium ${isDark ? 'text-green-300' : 'text-green-800'}`}>{t('جواز السفر', 'Passport', 'جواز سەفەر')}</p>
                          </div>
                        )}
                        {orderResult.documents.ticket && (
                          <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'}`}>
                            <FileText className={`w-8 h-8 mx-auto mb-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                            <p className={`text-sm font-medium ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>{t('التذكرة', 'Ticket', 'بلیت')}</p>
                          </div>
                        )}
                        {orderResult.documents.senderId && (
                          <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-purple-500/20 border border-purple-500/30' : 'bg-purple-50 border border-purple-200'}`}>
                            <FileText className={`w-8 h-8 mx-auto mb-2 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                            <p className={`text-sm font-medium ${isDark ? 'text-purple-300' : 'text-purple-800'}`}>{t('الهوية', 'ID', 'ناسنامە')}</p>
                          </div>
                        )}
                        {orderResult.documents.paymentProof && (
                          <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-amber-500/20 border border-amber-500/30' : 'bg-amber-50 border border-amber-200'}`}>
                            <FileText className={`w-8 h-8 mx-auto mb-2 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                            <p className={`text-sm font-medium ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>{t('إثبات الدفع', 'Payment Proof', 'بەڵگەی پارەدان')}</p>
                          </div>
                        )}

                        {/* New: Dynamic Images from Custom Fields */}
                        {orderResult.details && Object.entries(orderResult.details.customFields || {}).map(([key, value], idx) => {
                          if (typeof value === 'string' && (value.startsWith('/uploads/') || value.startsWith('http'))) {
                            return (
                              <a key={idx} href={value.startsWith('http') ? value : `${API_URL}${value}`} target="_blank" rel="noopener noreferrer"
                                className={`p-4 rounded-xl text-center transition-all ${isDark ? 'bg-indigo-500/20 border border-indigo-500/30 hover:bg-indigo-500/30' : 'bg-indigo-50 border border-indigo-200 hover:bg-indigo-100'}`}>
                                <div className="w-12 h-12 mx-auto mb-2 rounded-lg overflow-hidden border border-indigo-200">
                                  <img src={value.startsWith('http') ? value : `${API_URL}${value}`} alt="Account Code" className="w-full h-full object-cover" />
                                </div>
                                <p className={`text-sm font-medium ${isDark ? 'text-indigo-300' : 'text-indigo-800'}`}>{t('كود حسابك', 'Account Code', 'كۆدی ئەژمارەکەت')}</p>
                              </a>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - QR & Payment */}
                  <div className="space-y-6">
                    {/* QR Code */}
                    <div className={`rounded-3xl border-2 p-8 shadow-xl text-center ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
                      <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {t('رمز QR للطلب', 'Order QR Code', 'کۆدی QRی داواکاری')}
                      </h3>
                      <div className={`p-6 rounded-2xl inline-block ${isDark ? 'bg-white' : 'bg-slate-50'}`}>
                        <QRCodeSVG value={orderResult.orderId} size={150} level="H" />
                      </div>
                      <p className={`text-xs mt-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {t('للتحقق عند الاستلام', 'For verification at pickup', 'بۆ دڵنیابوونەوە لە کاتی وەرگرتن')}
                      </p>
                    </div>

                    {/* SMS Note */}
                    <div className={`rounded-2xl p-6 ${isDark ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'}`}>
                      <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>
                        📱 {t('ستصلك رسالة SMS عند تحديث حالة طلبك', 'You will receive an SMS when your order status updates', 'نامەیەکی SMSت پێدەگات کاتێک بارودۆخی داواکارییەکەت نوێکرایەوە')}
                      </p>
                    </div>

                    {/* Payment Proof Upload - Only if waiting and not blocked */}
                    {orderResult.status === 'waiting_payment' && !orderResult.customer_blocked && (
                      <div className={`rounded-3xl border-2 p-8 shadow-xl ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
                        <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {t('إرسال إثبات الدفع', 'Submit Payment Proof', 'ناردنی بەڵگەی پارەدان')}
                        </h3>

                        {paymentProofs.length === 0 ? (
                          <label className={`block border-2 border-dashed rounded-2xl p-6 cursor-pointer text-center transition-colors ${isDark
                            ? 'border-slate-600 hover:border-[#D4AF37]'
                            : 'border-slate-300 hover:border-[#D4AF37] hover:bg-slate-50'
                            }`}>
                            <input type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" />
                            <Upload className={`w-10 h-10 mx-auto mb-2 ${isDark ? 'text-slate-400' : 'text-slate-400'}`} />
                            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{t('رفع صورة', 'Upload image', 'وێنە بار بکە')}</p>
                          </label>
                        ) : (
                          <div className="space-y-3">
                            {paymentProofs.map(p => (
                              <div key={p.id} className={`flex items-center gap-3 rounded-xl p-3 ${isDark ? 'bg-green-500/20 border border-green-500/30' : 'bg-green-50 border border-green-200'}`}>
                                <img src={p.preview} alt="proof" className="w-12 h-12 rounded-lg object-cover" />
                                <span className={`flex-1 text-sm truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{p.name}</span>
                                <button onClick={() => removeProof(p.id)} className={`p-1 rounded ${isDark ? 'hover:bg-red-500/20' : 'hover:bg-red-100'}`}>
                                  <X className="w-4 h-4 text-red-600" />
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={submitPaymentProof}
                              disabled={uploading}
                              className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                              {uploading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><CheckCircle className="w-5 h-5" />{t('إرسال', 'Submit', 'ناردن')}</>}
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Payment Received Notice */}
                    {orderResult.status !== 'waiting_payment' && orderResult.documents.paymentProof && (
                      <div className={`rounded-2xl p-6 text-center ${isDark ? 'bg-green-500/20 border border-green-500/30' : 'bg-green-50 border border-green-200'}`}>
                        <CheckCircle className={`w-10 h-10 mx-auto mb-2 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                        <p className={`font-medium ${isDark ? 'text-green-300' : 'text-green-800'}`}>
                          {t('تم استلام إثبات الدفع', 'Payment proof received', 'بەڵگەی پارەدان وەرگیرا')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer3D />
    </div>
  );
};

export default TrackOrder;
