import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { CheckCircle, Copy, Download, Upload, X, Clock, MapPin, DollarSign, CreditCard, Phone, User, Globe, ArrowRight } from 'lucide-react';
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

  const orderData = location.state?.orderData || {};
  const orderId = orderData.orderId || `TRF-${Date.now().toString().slice(-8)}`;
  const orderDate = new Date().toLocaleString(currentLanguage === 'ar' ? 'ar-IQ' : 'en-US');

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
    if (paymentProofs.length === 0) return;
    setUploading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setUploading(false);
    alert(currentLanguage === 'ar' ? 'تم إرسال إثبات الدفع!' : 'Payment proof submitted!');
  };

  const getTransferTypeLabel = () => {
    const types = {
      local: { ar: 'تحويل محلي', en: 'Local Transfer' },
      western_union: { ar: 'ويسترن يونيون', en: 'Western Union' },
      moneygram: { ar: 'موني جرام', en: 'MoneyGram' },
      country_based: { ar: 'تحويل حسب الدولة', en: 'Country-based Transfer' }
    };
    const type = types[orderData.type];
    return type ? (currentLanguage === 'ar' ? type.ar : type.en) : orderData.type;
  };

  const getTypeColor = () => {
    const colors = {
      local: 'from-emerald-500 to-teal-600',
      western_union: 'from-yellow-400 to-yellow-600',
      moneygram: 'from-orange-500 to-red-500',
      country_based: 'from-indigo-500 to-purple-600'
    };
    return colors[orderData.type] || 'from-slate-500 to-slate-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-slate-50">
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
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <CheckCircle className="w-14 h-14 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3">
              {currentLanguage === 'ar' ? 'تم تسجيل طلبك بنجاح!' : 'Order Created Successfully!'}
            </h1>
            <p className="text-lg text-slate-600">
              {currentLanguage === 'ar' ? 'احتفظ برقم الطلب لتتبع حالته' : 'Keep your order ID to track status'}
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
                      {currentLanguage === 'ar' ? 'رقم الطلب' : 'Order ID'}
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
                    {currentLanguage === 'ar' ? 'في انتظار الدفع' : 'Waiting for Payment'}
                  </span>
                </div>
              </motion.div>

              {/* Transfer Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl p-8"
              >
                <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <User className="w-6 h-6 text-blue-600" />
                  {currentLanguage === 'ar' ? 'تفاصيل التحويل' : 'Transfer Details'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {orderData.senderName && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">{currentLanguage === 'ar' ? 'المرسل' : 'Sender'}</p>
                        <p className="font-medium">{orderData.senderName}</p>
                      </div>
                    </div>
                  )}
                  
                  {orderData.receiverName && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                        <User className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">{currentLanguage === 'ar' ? 'المستلم' : 'Receiver'}</p>
                        <p className="font-medium">{orderData.receiverName}</p>
                      </div>
                    </div>
                  )}

                  {orderData.phone && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Phone className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">{currentLanguage === 'ar' ? 'الهاتف' : 'Phone'}</p>
                        <p className="font-medium">{orderData.phone}</p>
                      </div>
                    </div>
                  )}

                  {(orderData.receiverCountry || orderData.countryName) && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                        <Globe className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">{currentLanguage === 'ar' ? 'الدولة' : 'Country'}</p>
                        <p className="font-medium">{orderData.countryName || orderData.receiverCountry}</p>
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
                className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl border-2 border-emerald-200 shadow-xl p-8"
              >
                <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-emerald-600" />
                  {currentLanguage === 'ar' ? 'تفاصيل المبلغ' : 'Amount Details'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {orderData.amount && (
                    <div className="bg-white rounded-2xl p-6 border-2 border-emerald-200">
                      <p className="text-sm text-slate-500 mb-1">
                        {currentLanguage === 'ar' ? 'المبلغ' : 'Amount'}
                      </p>
                      <p className="text-3xl font-bold text-emerald-600">
                        {orderData.currency ? `${orderData.amount} ${orderData.currency}` : `${Number(orderData.amount).toLocaleString()} ${currentLanguage === 'ar' ? 'د.ع' : 'IQD'}`}
                      </p>
                    </div>
                  )}
                  
                  {(orderData.total || orderData.iqdAmount) && (
                    <div className="bg-white rounded-2xl p-6 border-2 border-teal-200">
                      <p className="text-sm text-slate-500 mb-1">
                        {currentLanguage === 'ar' ? 'الإجمالي للدفع' : 'Total to Pay'}
                      </p>
                      <p className="text-3xl font-bold text-teal-600">
                        {Number(orderData.total || orderData.iqdAmount).toLocaleString()} {currentLanguage === 'ar' ? 'د.ع' : 'IQD'}
                      </p>
                    </div>
                  )}
                </div>

                {orderData.serviceFee && (
                  <div className="mt-4 p-4 bg-white/50 rounded-xl">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">{currentLanguage === 'ar' ? 'رسوم الخدمة' : 'Service Fee'}</span>
                      <span className="font-semibold text-amber-600">{Number(orderData.serviceFee).toLocaleString()} {currentLanguage === 'ar' ? 'د.ع' : 'IQD'}</span>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* QR Code */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl p-8 text-center"
              >
                <h3 className="text-lg font-bold text-slate-900 mb-6">
                  {currentLanguage === 'ar' ? 'رمز QR' : 'QR Code'}
                </h3>
                
                <div className="bg-slate-50 p-6 rounded-2xl mb-4 inline-block">
                  <QRCodeSVG value={orderId} size={160} level="H" includeMargin={true} />
                </div>

                <p className="text-xs text-slate-500 mb-4">
                  {currentLanguage === 'ar' ? 'للتحقق عند الاستلام' : 'For verification'}
                </p>
              </motion.div>

              {/* WhatsApp Contact Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-6 text-white shadow-xl"
                data-testid="transfer-whatsapp-contact"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold">
                    {currentLanguage === 'ar' ? 'تواصل معنا عبر واتساب' : 'Contact us via WhatsApp'}
                  </h3>
                </div>
                
                <div className="bg-white/10 rounded-2xl p-4 mb-4">
                  <p className="text-sm opacity-90 mb-2">
                    {currentLanguage === 'ar' ? 'رقم الواتساب:' : 'WhatsApp Number:'}
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
                      data-testid="copy-transfer-whatsapp"
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
                  {currentLanguage === 'ar' ? 'فتح واتساب' : 'Open WhatsApp'}
                </a>
              </motion.div>

              {/* Payment Instructions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-blue-50 border-2 border-blue-200 rounded-3xl p-6"
              >
                <h3 className="text-lg font-bold text-blue-900 mb-4">
                  {currentLanguage === 'ar' ? 'تعليمات الدفع' : 'Payment Instructions'}
                </h3>
                
                <div className="space-y-3 text-sm text-blue-800">
                  <p className="flex items-start gap-2">
                    <span className="font-bold">1.</span>
                    {currentLanguage === 'ar' ? 'قم بالدفع في أحد فروعنا' : 'Pay at our branch'}
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-bold">2.</span>
                    {currentLanguage === 'ar' ? 'احتفظ بإيصال الدفع' : 'Keep the receipt'}
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-bold">3.</span>
                    {currentLanguage === 'ar' ? 'ارفع صورة الإيصال' : 'Upload receipt image'}
                  </p>
                </div>

                <div className="mt-4 p-3 bg-blue-100 rounded-xl">
                  <p className="text-xs text-blue-700">
                    📱 {currentLanguage === 'ar' ? 'سيصلك إشعار عند تغيير الحالة' : 'You will be notified when status changes'}
                  </p>
                </div>
              </motion.div>

              {/* Payment Proof Upload */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl p-6"
                data-testid="transfer-payment-proof"
              >
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  {currentLanguage === 'ar' ? 'إثبات الدفع' : 'Payment Proof'}
                </h3>

                {paymentProofs.length === 0 ? (
                  <label className="block border-2 border-dashed border-slate-300 rounded-2xl p-6 hover:border-[#D4AF37] hover:bg-slate-50 transition-all cursor-pointer text-center">
                    <input type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" />
                    <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-600">{currentLanguage === 'ar' ? 'رفع صورة' : 'Upload image'}</p>
                  </label>
                ) : (
                  <div className="space-y-3">
                    {paymentProofs.map((proof) => (
                      <div key={proof.id} className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-3">
                        <img src={proof.preview} alt="proof" className="w-12 h-12 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{proof.name}</p>
                        </div>
                        <button onClick={() => removeProof(proof.id)} className="p-2 hover:bg-red-100 rounded-lg">
                          <X className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    ))}

                    <button
                      onClick={submitPaymentProof}
                      disabled={uploading}
                      className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {uploading ? (
                        <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{currentLanguage === 'ar' ? 'جارٍ...' : 'Submitting...'}</>
                      ) : (
                        <><CheckCircle className="w-5 h-5" />{currentLanguage === 'ar' ? 'إرسال' : 'Submit'}</>
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
              onClick={() => navigate('/track-order')}
              className="flex-1 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
            >
              {currentLanguage === 'ar' ? 'تتبع طلبي' : 'Track My Order'}
              <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => navigate('/')}
              className="flex-1 py-4 bg-white border-2 border-slate-200 text-slate-900 font-bold rounded-2xl hover:border-slate-300 transition-colors"
            >
              {currentLanguage === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
            </button>
          </motion.div>
        </div>
      </main>

      <Footer3D />
    </div>
  );
};

export default TransferSuccess;
