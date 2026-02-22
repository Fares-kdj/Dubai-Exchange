import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Package, User, Phone, MapPin, Calendar, DollarSign, CreditCard, FileText, Upload, X, CheckCircle, Clock, AlertCircle, Copy, Eye, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QRCodeSVG } from 'qrcode.react';
import Header3D from '../landing/Header3D';
import Footer3D from '../landing/Footer3D';

const TrackOrder = () => {
  const { currentLanguage } = useLanguage();
  const { isDark } = useTheme();
  const isArabic = currentLanguage === 'ar';
  const API_URL = process.env.REACT_APP_BACKEND_URL;
  
  const [searchData, setSearchData] = useState({ orderId: '', orderType: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderResult, setOrderResult] = useState(null);
  const [paymentProofs, setPaymentProofs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(false);

  const orderTypes = [
    { value: 'traveler', labelAr: 'حجز الدولار للمسافرين', labelEn: 'Traveler USD Booking' },
    { value: 'local', labelAr: 'تحويل محلي', labelEn: 'Local Transfer' },
    { value: 'western_union', labelAr: 'ويسترن يونيون', labelEn: 'Western Union' },
    { value: 'moneygram', labelAr: 'موني جرام', labelEn: 'MoneyGram' },
    { value: 'country_based', labelAr: 'تحويل حسب الدولة', labelEn: 'Country-based Transfer' }
  ];

  const statusConfig = {
    waiting_payment: { labelAr: 'في انتظار الدفع', labelEn: 'Waiting for Payment', color: 'bg-amber-500', icon: Clock },
    under_review: { labelAr: 'قيد المراجعة', labelEn: 'Under Review', color: 'bg-yellow-500', icon: Search },
    approved: { labelAr: 'تم القبول', labelEn: 'Approved', color: 'bg-green-500', icon: CheckCircle },
    rejected: { labelAr: 'تم الرفض', labelEn: 'Rejected', color: 'bg-red-500', icon: AlertCircle }
  };

  const handleSearch = async () => {
    if (!searchData.orderId.trim()) {
      setError(isArabic ? 'أدخل رقم الطلب' : 'Enter order ID');
      return;
    }
    if (!searchData.orderType) {
      setError(isArabic ? 'اختر نوع الطلب' : 'Select order type');
      return;
    }

    setError('');
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/api/orders/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: searchData.orderId.trim(),
          order_type: searchData.orderType
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Order not found');
      }
      
      const order = await response.json();
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
        }
      });
    } catch (err) {
      setError(isArabic ? 'الطلب غير موجود. تأكد من رقم الطلب ونوعه.' : 'Order not found. Verify order ID and type.');
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
        
        await fetch(`${API_URL}/api/orders/${orderResult.orderId}/payment-proof`, {
          method: 'POST',
          body: formData
        });
      }
      alert(isArabic ? 'تم إرسال إثبات الدفع بنجاح!' : 'Payment proof submitted!');
      setPaymentProofs([]);
      // Refresh order data
      handleSearch();
    } catch (err) {
      alert(isArabic ? 'حدث خطأ أثناء رفع الملف' : 'Error uploading file');
    }
    
    setUploading(false);
  };

  const getStatusLabel = (status) => {
    const config = statusConfig[status];
    return config ? (isArabic ? config.labelAr : config.labelEn) : status;
  };

  const getOrderTypeLabel = (type) => {
    const t = orderTypes.find(o => o.value === type);
    return t ? (isArabic ? t.labelAr : t.labelEn) : type;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(isArabic ? 'ar-IQ' : 'en-US', { 
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
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
              {isArabic ? 'تتبع طلبك' : 'Track Your Order'}
            </h1>
            <p className={`text-lg max-w-xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {isArabic 
                ? 'أدخل رقم الطلب ونوعه لمعرفة حالته وتفاصيله الكاملة'
                : 'Enter your order ID and type to check its status and full details'}
            </p>
          </motion.div>

          {/* Search Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <div className={`backdrop-blur-xl rounded-3xl border-2 p-8 shadow-2xl ${
              isDark 
                ? 'bg-slate-800/50 border-slate-700' 
                : 'bg-white border-slate-200'
            }`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <Label className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {isArabic ? 'رقم الطلب' : 'Order ID'}
                  </Label>
                  <Input
                    value={searchData.orderId}
                    onChange={(e) => setSearchData(prev => ({ ...prev, orderId: e.target.value }))}
                    className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400' : 'bg-white border-slate-300 text-slate-900'}`}
                    placeholder={isArabic ? 'مثال: TRV-12345678' : 'e.g., TRV-12345678'}
                    data-testid="track-order-id"
                  />
                </div>
                <div className="space-y-2">
                  <Label className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {isArabic ? 'نوع الطلب' : 'Order Type'}
                  </Label>
                  <Select value={searchData.orderType} onValueChange={(v) => setSearchData(prev => ({ ...prev, orderType: v }))}>
                    <SelectTrigger className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`} data-testid="track-order-type">
                      <SelectValue placeholder={isArabic ? 'اختر نوع الطلب' : 'Select order type'} />
                    </SelectTrigger>
                    <SelectContent>
                      {orderTypes.map(t => (
                        <SelectItem key={t.value} value={t.value}>
                          {isArabic ? t.labelAr : t.labelEn}
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
                  className={`mb-6 p-4 rounded-xl flex items-center gap-2 ${
                    isDark 
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
                  <><Search className="w-5 h-5" />{isArabic ? 'بحث' : 'Search'}</>
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
                <div className={`backdrop-blur-xl rounded-3xl border-2 p-8 mb-6 ${
                  isDark 
                    ? 'bg-slate-800/50 border-slate-700' 
                    : 'bg-white border-slate-200'
                }`}>
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div>
                      <p className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{isArabic ? 'رقم الطلب' : 'Order ID'}</p>
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
                    {['waiting_payment', 'under_review', 'approved'].map((s, i) => {
                      const statuses = ['waiting_payment', 'under_review', 'approved', 'rejected'];
                      const currentIdx = statuses.indexOf(orderResult.status);
                      const isActive = statuses.indexOf(s) <= currentIdx && orderResult.status !== 'rejected';
                      const isRejected = orderResult.status === 'rejected';
                      
                      return (
                        <React.Fragment key={s}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isRejected ? 'bg-red-500/30' : isActive ? 'bg-[#D4AF37]' : (isDark ? 'bg-slate-700' : 'bg-slate-200')
                          }`}>
                            {isActive && !isRejected && <CheckCircle className="w-4 h-4 text-white" />}
                          </div>
                          {i < 2 && <div className={`flex-1 h-1 mx-2 rounded ${isActive && statuses.indexOf(s) < currentIdx ? 'bg-[#D4AF37]' : (isDark ? 'bg-slate-700' : 'bg-slate-200')}`} />}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column - Details */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Customer Info */}
                    <div className="bg-white rounded-3xl p-8 shadow-xl">
                      <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <User className="w-6 h-6 text-blue-600" />
                        {isArabic ? 'بيانات العميل' : 'Customer Information'}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">{isArabic ? 'الاسم' : 'Name'}</p>
                            <p className="font-medium text-slate-900">{orderResult.customer.fullName}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                            <Phone className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">{isArabic ? 'الهاتف' : 'Phone'}</p>
                            <p className="font-medium text-slate-900">{orderResult.customer.phone}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Service Details */}
                    <div className="bg-white rounded-3xl p-8 shadow-xl">
                      <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <FileText className="w-6 h-6 text-purple-600" />
                        {isArabic ? 'تفاصيل الطلب' : 'Order Details'}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(orderResult.details).map(([key, value]) => {
                          const labels = {
                            travelType: { ar: 'نوع السفر', en: 'Travel Type' },
                            destination: { ar: 'الوجهة', en: 'Destination' },
                            travelDate: { ar: 'تاريخ السفر', en: 'Travel Date' },
                            pickupLocation: { ar: 'مكان الاستلام', en: 'Pickup Location' },
                            usdAmount: { ar: 'المبلغ ($)', en: 'Amount ($)' },
                            iqdAmount: { ar: 'المبلغ (د.ع)', en: 'Amount (IQD)' },
                            paymentMethod: { ar: 'طريقة الدفع', en: 'Payment Method' },
                            senderName: { ar: 'اسم المرسل', en: 'Sender Name' },
                            receiverName: { ar: 'اسم المستلم', en: 'Receiver Name' },
                            senderProvince: { ar: 'محافظة المرسل', en: 'Sender Province' },
                            receiverProvince: { ar: 'محافظة المستلم', en: 'Receiver Province' },
                            senderCountry: { ar: 'دولة المرسل', en: 'Sender Country' },
                            receiverCountry: { ar: 'دولة المستلم', en: 'Receiver Country' },
                            currency: { ar: 'العملة', en: 'Currency' },
                            amount: { ar: 'المبلغ', en: 'Amount' },
                            serviceFee: { ar: 'رسوم الخدمة', en: 'Service Fee' }
                          };
                          const label = labels[key] || { ar: key, en: key };
                          
                          return (
                            <div key={key} className="p-4 bg-slate-50 rounded-xl">
                              <p className="text-xs text-slate-500 mb-1">{isArabic ? label.ar : label.en}</p>
                              <p className="font-medium text-slate-900">{value}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Documents */}
                    <div className="bg-white rounded-3xl p-8 shadow-xl">
                      <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Eye className="w-6 h-6 text-amber-600" />
                        {isArabic ? 'الوثائق المرفوعة' : 'Uploaded Documents'}
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {orderResult.documents.passport && (
                          <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center">
                            <FileText className="w-8 h-8 text-green-600 mx-auto mb-2" />
                            <p className="text-sm font-medium text-green-800">{isArabic ? 'جواز السفر' : 'Passport'}</p>
                          </div>
                        )}
                        {orderResult.documents.ticket && (
                          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-center">
                            <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                            <p className="text-sm font-medium text-blue-800">{isArabic ? 'التذكرة' : 'Ticket'}</p>
                          </div>
                        )}
                        {orderResult.documents.senderId && (
                          <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl text-center">
                            <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                            <p className="text-sm font-medium text-purple-800">{isArabic ? 'الهوية' : 'ID'}</p>
                          </div>
                        )}
                        {orderResult.documents.paymentProof && (
                          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-center">
                            <FileText className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                            <p className="text-sm font-medium text-amber-800">{isArabic ? 'إثبات الدفع' : 'Payment Proof'}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - QR & Payment */}
                  <div className="space-y-6">
                    {/* QR Code */}
                    <div className="bg-white rounded-3xl p-8 shadow-xl text-center">
                      <h3 className="text-lg font-bold text-slate-900 mb-4">
                        {isArabic ? 'رمز QR للطلب' : 'Order QR Code'}
                      </h3>
                      <div className="bg-slate-50 p-6 rounded-2xl inline-block">
                        <QRCodeSVG value={orderResult.orderId} size={150} level="H" />
                      </div>
                      <p className="text-xs text-slate-500 mt-4">
                        {isArabic ? 'للتحقق عند الاستلام' : 'For verification at pickup'}
                      </p>
                    </div>

                    {/* SMS Note */}
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                      <p className="text-sm text-blue-800">
                        📱 {isArabic ? 'ستصلك رسالة SMS عند تحديث حالة طلبك' : 'You will receive an SMS when your order status updates'}
                      </p>
                    </div>

                    {/* Payment Proof Upload - Only if waiting */}
                    {orderResult.status === 'waiting_payment' && (
                      <div className="bg-white rounded-3xl p-8 shadow-xl">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">
                          {isArabic ? 'إرسال إثبات الدفع' : 'Submit Payment Proof'}
                        </h3>
                        
                        {paymentProofs.length === 0 ? (
                          <label className="block border-2 border-dashed border-slate-300 rounded-2xl p-6 hover:border-[#D4AF37] cursor-pointer text-center">
                            <input type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" />
                            <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                            <p className="text-sm text-slate-600">{isArabic ? 'رفع صورة' : 'Upload image'}</p>
                          </label>
                        ) : (
                          <div className="space-y-3">
                            {paymentProofs.map(p => (
                              <div key={p.id} className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-3">
                                <img src={p.preview} alt="proof" className="w-12 h-12 rounded-lg object-cover" />
                                <span className="flex-1 text-sm truncate">{p.name}</span>
                                <button onClick={() => removeProof(p.id)} className="p-1 hover:bg-red-100 rounded">
                                  <X className="w-4 h-4 text-red-600" />
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={submitPaymentProof}
                              disabled={uploading}
                              className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                              {uploading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><CheckCircle className="w-5 h-5" />{isArabic ? 'إرسال' : 'Submit'}</>}
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Payment Received Notice */}
                    {orderResult.status !== 'waiting_payment' && orderResult.documents.paymentProof && (
                      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
                        <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-2" />
                        <p className="font-medium text-green-800">
                          {isArabic ? 'تم استلام إثبات الدفع' : 'Payment proof received'}
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
