import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { CheckCircle, Copy, Download, Upload, X, Clock, MapPin, Calendar, DollarSign, CreditCard, Phone, User, AlertCircle } from 'lucide-react';
import QRCode from 'qrcode.react';

const SuccessPage = ({ orderData }) => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [paymentProofs, setPaymentProofs] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Generate Order ID
  const orderId = `TRV-${Date.now().toString().slice(-8)}`;
  const orderDate = new Date().toLocaleString(currentLanguage === 'ar' ? 'ar-IQ' : 'en-US');

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    setUploading(false);
    alert(currentLanguage === 'ar' ? 'تم إرسال إثبات الدفع بنجاح!' : 'Payment proof submitted successfully!');
  };

  return (
    <div className=\"min-h-screen bg-gradient-to-b from-green-50 via-white to-slate-50 pt-20\">
      <div className=\"container mx-auto px-4 sm:px-6 lg:px-8 py-12\">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: \"spring\", duration: 0.6 }}
          className=\"text-center mb-12\"
        >
          <div className=\"w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl\">
            <CheckCircle className=\"w-14 h-14 text-white\" />
          </div>
          <h1 className=\"text-4xl md:text-5xl font-bold text-slate-900 mb-3\">
            {currentLanguage === 'ar' ? 'تم تسجيل طلبك بنجاح!' : 'Order Created Successfully!'}
          </h1>
          <p className=\"text-lg text-slate-600\">
            {currentLanguage === 'ar' 
              ? 'احتفظ برقم الطلب لتتبع حالته'
              : 'Keep your order ID to track your request'}
          </p>
        </motion.div>

        <div className=\"max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8\">
          {/* Main Order Details - Left Side */}
          <div className=\"lg:col-span-2 space-y-6\">
            {/* Order ID Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className=\"bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-2xl\"
              data-testid=\"order-id-card\"
            >
              <div className=\"flex items-center justify-between mb-4\">
                <div>
                  <p className=\"text-sm text-slate-400 mb-1\">
                    {currentLanguage === 'ar' ? 'رقم الطلب' : 'Order ID'}
                  </p>
                  <h2 className=\"text-3xl font-bold tracking-wider\">{orderId}</h2>
                </div>
                <motion.button
                  onClick={copyOrderId}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className=\"p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors\"
                  data-testid=\"copy-order-id\"
                >
                  {copied ? (
                    <CheckCircle className=\"w-6 h-6 text-green-400\" />
                  ) : (
                    <Copy className=\"w-6 h-6\" />
                  )}
                </motion.button>
              </div>
              
              <div className=\"flex items-center gap-2 text-sm text-slate-400\">
                <Clock className=\"w-4 h-4\" />
                {orderDate}
              </div>

              {/* Status Badge */}
              <div className=\"mt-6 inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-full\">
                <div className=\"w-2 h-2 bg-amber-400 rounded-full animate-pulse\"></div>
                <span className=\"text-sm font-medium text-amber-300\">
                  {currentLanguage === 'ar' ? 'في انتظار الدفع' : 'Waiting for Payment'}
                </span>
              </div>
            </motion.div>

            {/* Customer Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className=\"bg-white rounded-3xl border-2 border-slate-200 shadow-xl p-8\"
            >
              <h3 className=\"text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2\">
                <User className=\"w-6 h-6 text-blue-600\" />
                {currentLanguage === 'ar' ? 'بيانات العميل' : 'Customer Information'}
              </h3>
              
              <div className=\"grid grid-cols-1 md:grid-cols-2 gap-6\">
                <InfoItem 
                  icon={User}
                  label={currentLanguage === 'ar' ? 'الاسم' : 'Name'}
                  value={orderData?.fullName || 'محمد أحمد'}
                  color=\"blue\"
                />
                <InfoItem 
                  icon={Phone}
                  label={currentLanguage === 'ar' ? 'رقم الهاتف' : 'Phone'}
                  value={orderData?.phone || '+964 7XX XXX XXXX'}
                  color=\"green\"
                />
              </div>
            </motion.div>

            {/* Travel Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className=\"bg-white rounded-3xl border-2 border-slate-200 shadow-xl p-8\"
            >
              <h3 className=\"text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2\">
                <MapPin className=\"w-6 h-6 text-purple-600\" />
                {currentLanguage === 'ar' ? 'بيانات السفر' : 'Travel Details'}
              </h3>
              
              <div className=\"grid grid-cols-1 md:grid-cols-2 gap-6\">
                <InfoItem 
                  icon={MapPin}
                  label={currentLanguage === 'ar' ? 'الوجهة' : 'Destination'}
                  value={orderData?.destination || 'دبي'}
                  color=\"purple\"
                />
                <InfoItem 
                  icon={Calendar}
                  label={currentLanguage === 'ar' ? 'تاريخ السفر' : 'Travel Date'}
                  value={orderData?.travelDate || '2025-03-15'}
                  color=\"pink\"
                />
                <InfoItem 
                  icon={MapPin}
                  label={currentLanguage === 'ar' ? 'مكان الاستلام' : 'Pickup Location'}
                  value={currentLanguage === 'ar' ? 'مطار بغداد الدولي' : 'Baghdad International Airport'}
                  color=\"indigo\"
                />
              </div>
            </motion.div>

            {/* Booking Amount */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className=\"bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl border-2 border-emerald-200 shadow-xl p-8\"
            >
              <h3 className=\"text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2\">
                <DollarSign className=\"w-6 h-6 text-emerald-600\" />
                {currentLanguage === 'ar' ? 'المبلغ المحجوز' : 'Booking Amount'}
              </h3>
              
              <div className=\"grid grid-cols-1 md:grid-cols-2 gap-6\">
                <div className=\"bg-white rounded-2xl p-6 border-2 border-emerald-200\">
                  <p className=\"text-sm text-slate-500 mb-1\">{currentLanguage === 'ar' ? 'بالدولار' : 'In USD'}</p>
                  <p className=\"text-3xl font-bold text-emerald-600\">
                    ${orderData?.usdAmount || '1,000'}
                  </p>
                </div>
                <div className=\"bg-white rounded-2xl p-6 border-2 border-teal-200\">
                  <p className=\"text-sm text-slate-500 mb-1\">{currentLanguage === 'ar' ? 'بالدينار' : 'In IQD'}</p>
                  <p className=\"text-3xl font-bold text-teal-600\">
                    {orderData?.iqdAmount || '1,500,000'} {currentLanguage === 'ar' ? 'د.ع' : 'IQD'}
                  </p>
                </div>
              </div>

              <div className=\"mt-6 flex items-center gap-2 text-sm text-slate-600\">
                <CreditCard className=\"w-4 h-4\" />
                <span>{currentLanguage === 'ar' ? 'طريقة الدفع:' : 'Payment Method:'}</span>
                <span className=\"font-medium\">{currentLanguage === 'ar' ? 'نقداً' : 'Cash'}</span>
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <div className=\"lg:col-span-1 space-y-6\">
            {/* QR Code */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className=\"bg-white rounded-3xl border-2 border-slate-200 shadow-xl p-8 text-center\"
            >
              <h3 className=\"text-lg font-bold text-slate-900 mb-6\">
                {currentLanguage === 'ar' ? 'رمز QR للطلب' : 'Order QR Code'}
              </h3>
              
              <div className=\"bg-slate-50 p-6 rounded-2xl mb-4 inline-block\">
                <QRCode 
                  value={orderId}
                  size={180}
                  level=\"H\"
                  includeMargin={true}
                />
              </div>

              <p className=\"text-xs text-slate-500 mb-4\">
                {currentLanguage === 'ar' 
                  ? 'استخدم هذا الرمز للتحقق عند الاستلام'
                  : 'Use this code for verification at pickup'}
              </p>

              <button className=\"w-full py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-center gap-2\">
                <Download className=\"w-4 h-4\" />
                {currentLanguage === 'ar' ? 'تحميل QR' : 'Download QR'}
              </button>
            </motion.div>

            {/* Payment Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className=\"bg-blue-50 border-2 border-blue-200 rounded-3xl p-6\"
            >
              <h3 className=\"text-lg font-bold text-blue-900 mb-4\">
                {currentLanguage === 'ar' ? 'تعليمات الدفع' : 'Payment Instructions'}
              </h3>
              
              <div className=\"space-y-3 text-sm text-blue-800\">
                <p className=\"flex items-start gap-2\">
                  <span className=\"font-bold\">1.</span>
                  {currentLanguage === 'ar' 
                    ? 'قم بالدفع في أحد فروعنا أو عبر التحويل البنكي'
                    : 'Pay at our branch or via bank transfer'}
                </p>
                <p className=\"flex items-start gap-2\">
                  <span className=\"font-bold\">2.</span>
                  {currentLanguage === 'ar' 
                    ? 'احتفظ بإيصال الدفع'
                    : 'Keep your payment receipt'}
                </p>
                <p className=\"flex items-start gap-2\">
                  <span className=\"font-bold\">3.</span>
                  {currentLanguage === 'ar' 
                    ? 'ارفع صورة الإيصال أدناه'
                    : 'Upload receipt image below'}
                </p>
              </div>
            </motion.div>

            {/* Payment Proof Upload */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className=\"bg-white rounded-3xl border-2 border-slate-200 shadow-xl p-6\"
              data-testid=\"payment-proof-section\"
            >
              <h3 className=\"text-lg font-bold text-slate-900 mb-4\">
                {currentLanguage === 'ar' ? 'إثبات الدفع' : 'Payment Proof'}
              </h3>

              {/* Upload Area */}
              {paymentProofs.length === 0 ? (
                <label className=\"block border-2 border-dashed border-slate-300 rounded-2xl p-6 hover:border-[#D4AF37] hover:bg-slate-50 transition-all cursor-pointer text-center\">
                  <input
                    type=\"file\"
                    accept=\"image/*\"
                    multiple
                    onChange={handleFileUpload}
                    className=\"hidden\"
                    data-testid=\"payment-proof-input\"
                  />
                  <Upload className=\"w-10 h-10 text-slate-400 mx-auto mb-2\" />
                  <p className=\"text-sm text-slate-600 mb-1\">
                    {currentLanguage === 'ar' ? 'اضغط لرفع الصور' : 'Click to upload images'}
                  </p>
                  <p className=\"text-xs text-slate-400\">
                    {currentLanguage === 'ar' ? 'يمكنك رفع عدة صور' : 'You can upload multiple images'}
                  </p>
                </label>
              ) : (
                <div className=\"space-y-3\">
                  {paymentProofs.map((proof) => (
                    <div key={proof.id} className=\"flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-3\">
                      <img src={proof.preview} alt=\"proof\" className=\"w-12 h-12 rounded-lg object-cover\" />
                      <div className=\"flex-1 min-w-0\">
                        <p className=\"text-sm font-medium text-slate-900 truncate\">{proof.name}</p>
                        <p className=\"text-xs text-green-600\">
                          {currentLanguage === 'ar' ? 'جاهز للإرسال' : 'Ready to submit'}
                        </p>
                      </div>
                      <button
                        onClick={() => removeProof(proof.id)}
                        className=\"p-2 hover:bg-red-100 rounded-lg transition-colors\"
                      >
                        <X className=\"w-4 h-4 text-red-600\" />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={submitPaymentProof}
                    disabled={uploading}
                    className=\"w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2\"
                    data-testid=\"submit-payment-proof\"
                  >
                    {uploading ? (
                      <>
                        <div className=\"w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin\"></div>
                        {currentLanguage === 'ar' ? 'جارٍ الإرسال...' : 'Submitting...'}
                      </>
                    ) : (
                      <>
                        <CheckCircle className=\"w-5 h-5\" />
                        {currentLanguage === 'ar' ? 'إرسال إثبات الدفع' : 'Submit Payment Proof'}
                      </>
                    )}
                  </button>

                  <label className=\"block text-center text-sm text-slate-600 hover:text-slate-900 cursor-pointer py-2\">
                    <input
                      type=\"file\"
                      accept=\"image/*\"
                      multiple
                      onChange={handleFileUpload}
                      className=\"hidden\"
                    />
                    + {currentLanguage === 'ar' ? 'إضافة المزيد' : 'Add More'}
                  </label>
                </div>
              )}

              <p className=\"text-xs text-slate-500 mt-4 text-center\">
                {currentLanguage === 'ar' 
                  ? 'يمكنك رفع إثبات الدفع لاحقاً من صفحة تتبع الطلب'
                  : 'You can upload payment proof later from order tracking page'}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className=\"max-w-6xl mx-auto mt-12 flex flex-col sm:flex-row gap-4\"
        >
          <button className=\"flex-1 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-colors\">
            {currentLanguage === 'ar' ? 'تتبع طلبي' : 'Track My Order'}
          </button>
          <button className=\"flex-1 py-4 bg-white border-2 border-slate-200 text-slate-900 font-bold rounded-2xl hover:border-slate-300 transition-colors\">
            {currentLanguage === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

// Info Item Component
const InfoItem = ({ icon: Icon, label, value, color }) => (
  <div className=\"flex items-start gap-3\">
    <div className={`w-10 h-10 bg-${color}-100 rounded-xl flex items-center justify-center flex-shrink-0`}>
      <Icon className={`w-5 h-5 text-${color}-600`} />
    </div>
    <div>
      <p className=\"text-xs text-slate-500 mb-1\">{label}</p>
      <p className=\"text-sm font-medium text-slate-900\">{value}</p>
    </div>
  </div>
);

export default SuccessPage;
