import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { CheckCircle, Copy, ArrowRight, CreditCard, Wallet, Phone, User, DollarSign, Network } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import Header3D from '../landing/Header3D';
import Footer3D from '../landing/Footer3D';

const ServiceSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const { isDark } = useTheme();
  const [copied, setCopied] = useState(false);

  const orderData = location.state?.orderData || {};
  const orderId = orderData.orderId || 'SVC-' + Date.now().toString().slice(-8);
  const isUSDT = orderData.type === 'usdt_recharge';
  const isCard = orderData.type === 'card_recharge';

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-b from-green-50 via-white to-slate-50'
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
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl ${
              isDark ? 'bg-green-600' : 'bg-green-500'
            }`}>
              <CheckCircle className="w-14 h-14 text-white" />
            </div>
            <h1 className={`text-4xl md:text-5xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {currentLanguage === 'ar' ? 'تم تسجيل طلبك بنجاح!' : 'Order Created Successfully!'}
            </h1>
            <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {currentLanguage === 'ar' ? 'احتفظ برقم الطلب لتتبع حالته' : 'Keep your order ID to track status'}
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order ID Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`rounded-3xl border-2 shadow-xl p-8 ${
                  isDark 
                    ? 'bg-gradient-to-br from-[#D4AF37]/20 to-amber-900/20 border-[#D4AF37]/50' 
                    : 'bg-gradient-to-br from-[#D4AF37]/10 to-amber-100 border-[#D4AF37]'
                }`}
              >
                <p className={`text-sm mb-2 ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                  {currentLanguage === 'ar' ? 'رقم الطلب' : 'Order ID'}
                </p>
                <div className="flex items-center justify-between gap-4">
                  <code className={`text-2xl md:text-3xl font-bold font-mono ${isDark ? 'text-[#D4AF37]' : 'text-amber-800'}`}>
                    {orderId}
                  </code>
                  <button
                    onClick={copyOrderId}
                    className={`p-3 rounded-xl transition-colors ${
                      isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-white hover:bg-slate-100'
                    }`}
                  >
                    <Copy className={`w-5 h-5 ${copied ? 'text-green-500' : isDark ? 'text-slate-300' : 'text-slate-600'}`} />
                  </button>
                </div>
              </motion.div>

              {/* Order Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`rounded-3xl border-2 shadow-xl p-8 ${
                  isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
                }`}
              >
                <h3 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {isUSDT ? <Wallet className="w-6 h-6 text-teal-500" /> : <CreditCard className="w-6 h-6 text-purple-500" />}
                  {currentLanguage === 'ar' ? 'تفاصيل الطلب' : 'Order Details'}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {orderData.fullName && (
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                        <User className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{currentLanguage === 'ar' ? 'الاسم' : 'Name'}</p>
                        <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{orderData.fullName}</p>
                      </div>
                    </div>
                  )}

                  {orderData.phone && (
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-green-500/20' : 'bg-green-100'}`}>
                        <Phone className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{currentLanguage === 'ar' ? 'الهاتف' : 'Phone'}</p>
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
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{currentLanguage === 'ar' ? 'الشبكة' : 'Network'}</p>
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
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{currentLanguage === 'ar' ? 'عنوان المحفظة' : 'Wallet Address'}</p>
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
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{currentLanguage === 'ar' ? 'نوع البطاقة' : 'Card Type'}</p>
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
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{currentLanguage === 'ar' ? 'رقم البطاقة' : 'Card Number'}</p>
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
                className={`rounded-3xl border-2 shadow-xl p-8 ${
                  isDark 
                    ? 'bg-emerald-900/20 border-emerald-700/50' 
                    : 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200'
                }`}
              >
                <h3 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <DollarSign className="w-6 h-6 text-emerald-500" />
                  {currentLanguage === 'ar' ? 'تفاصيل المبلغ' : 'Amount Details'}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`rounded-2xl p-6 border-2 ${
                    isDark ? 'bg-slate-800/50 border-emerald-700/50' : 'bg-white border-emerald-200'
                  }`}>
                    <p className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {isUSDT ? 'USDT' : (currentLanguage === 'ar' ? 'المبلغ' : 'Amount')}
                    </p>
                    <p className="text-3xl font-bold text-emerald-500">
                      {isUSDT ? `${orderData.amount} USDT` : `${Number(orderData.amount).toLocaleString()} IQD`}
                    </p>
                  </div>

                  <div className={`rounded-2xl p-6 border-2 ${
                    isDark ? 'bg-slate-800/50 border-teal-700/50' : 'bg-white border-teal-200'
                  }`}>
                    <p className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {currentLanguage === 'ar' ? 'الإجمالي للدفع' : 'Total to Pay'}
                    </p>
                    <p className="text-3xl font-bold text-teal-500">
                      {Number(orderData.total).toLocaleString()} IQD
                    </p>
                  </div>
                </div>

                {orderData.serviceFee && (
                  <div className={`mt-4 p-4 rounded-xl ${isDark ? 'bg-slate-800/30' : 'bg-white/50'}`}>
                    <div className="flex justify-between items-center text-sm">
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>{currentLanguage === 'ar' ? 'رسوم الخدمة' : 'Service Fee'}</span>
                      <span className="font-semibold text-amber-500">{Number(orderData.serviceFee).toLocaleString()} IQD</span>
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
                className={`rounded-3xl border-2 shadow-xl p-8 text-center ${
                  isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
                }`}
              >
                <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {currentLanguage === 'ar' ? 'رمز QR' : 'QR Code'}
                </h3>

                <div className={`p-6 rounded-2xl mb-4 inline-block ${isDark ? 'bg-white' : 'bg-slate-50'}`}>
                  <QRCodeSVG value={orderId} size={160} level="H" includeMargin={true} />
                </div>

                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {currentLanguage === 'ar' ? 'للتحقق عند الدفع' : 'For verification'}
                </p>
              </motion.div>

              {/* Instructions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className={`rounded-3xl p-6 border-2 ${
                  isDark ? 'bg-blue-900/20 border-blue-700/50' : 'bg-blue-50 border-blue-200'
                }`}
              >
                <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-blue-400' : 'text-blue-900'}`}>
                  {currentLanguage === 'ar' ? 'الخطوات التالية' : 'Next Steps'}
                </h3>

                <div className={`space-y-3 text-sm ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>
                  <p className="flex items-start gap-2">
                    <span className="font-bold">1.</span>
                    {currentLanguage === 'ar' ? 'قم بالدفع في أحد فروعنا' : 'Pay at our branch'}
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-bold">2.</span>
                    {currentLanguage === 'ar' ? 'أظهر رقم الطلب أو رمز QR' : 'Show order ID or QR code'}
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-bold">3.</span>
                    {isUSDT 
                      ? (currentLanguage === 'ar' ? 'ستصلك العملات خلال 15 دقيقة' : 'Receive crypto within 15 minutes')
                      : (currentLanguage === 'ar' ? 'سيتم تعبئة الرصيد فوراً' : 'Balance recharged instantly')}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="max-w-4xl mx-auto mt-12 flex flex-col sm:flex-row gap-4"
          >
            <button
              onClick={() => navigate('/track-order')}
              className={`flex-1 py-4 font-bold rounded-2xl transition-colors flex items-center justify-center gap-2 ${
                isDark
                  ? 'bg-[#D4AF37] text-slate-900 hover:bg-[#FCD34D]'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              {currentLanguage === 'ar' ? 'تتبع طلبي' : 'Track My Order'}
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/')}
              className={`flex-1 py-4 border-2 font-bold rounded-2xl transition-colors ${
                isDark
                  ? 'bg-transparent border-slate-600 text-white hover:border-slate-500'
                  : 'bg-white border-slate-200 text-slate-900 hover:border-slate-300'
              }`}
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

export default ServiceSuccess;
