import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { CreditCard, User, Phone, DollarSign, CheckCircle, AlertCircle, ArrowLeft, Smartphone, Wifi, Gamepad2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header3D from '../landing/Header3D';
import Footer3D from '../landing/Footer3D';

const CardRecharge = () => {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    cardType: '',
    cardNumber: '',
    amount: '',
    paymentMethod: ''
  });

  const cardTypes = [
    { value: 'zain', labelAr: 'زين', labelEn: 'Zain', icon: Smartphone, color: 'from-purple-500 to-purple-600' },
    { value: 'asiacell', labelAr: 'آسياسيل', labelEn: 'Asiacell', icon: Smartphone, color: 'from-red-500 to-red-600' },
    { value: 'korek', labelAr: 'كورك', labelEn: 'Korek', icon: Smartphone, color: 'from-orange-500 to-orange-600' },
    { value: 'internet', labelAr: 'إنترنت', labelEn: 'Internet', icon: Wifi, color: 'from-blue-500 to-blue-600' },
    { value: 'gaming', labelAr: 'ألعاب', labelEn: 'Gaming', icon: Gamepad2, color: 'from-green-500 to-green-600' },
    { value: 'mastercard', labelAr: 'ماستركارد', labelEn: 'Mastercard', icon: CreditCard, color: 'from-amber-500 to-amber-600' },
    { value: 'visa', labelAr: 'فيزا', labelEn: 'Visa', icon: CreditCard, color: 'from-indigo-500 to-indigo-600' }
  ];

  const amounts = [
    { value: '5000', labelAr: '5,000 د.ع', labelEn: '5,000 IQD' },
    { value: '10000', labelAr: '10,000 د.ع', labelEn: '10,000 IQD' },
    { value: '15000', labelAr: '15,000 د.ع', labelEn: '15,000 IQD' },
    { value: '25000', labelAr: '25,000 د.ع', labelEn: '25,000 IQD' },
    { value: '50000', labelAr: '50,000 د.ع', labelEn: '50,000 IQD' },
    { value: '100000', labelAr: '100,000 د.ع', labelEn: '100,000 IQD' }
  ];

  const paymentMethods = [
    { value: 'cash', labelAr: 'نقداً', labelEn: 'Cash' },
    { value: 'bank_transfer', labelAr: 'تحويل بنكي', labelEn: 'Bank Transfer' },
    { value: 'card', labelAr: 'بطاقة', labelEn: 'Card' }
  ];

  const serviceFeePercent = 1;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const calculateFee = () => {
    if (!formData.amount) return 0;
    return Math.round(parseFloat(formData.amount) * serviceFeePercent / 100);
  };

  const calculateTotal = () => {
    if (!formData.amount) return 0;
    return parseFloat(formData.amount) + calculateFee();
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = currentLanguage === 'ar' ? 'الاسم مطلوب' : 'Name required';
    if (!formData.phone.trim()) newErrors.phone = currentLanguage === 'ar' ? 'الهاتف مطلوب' : 'Phone required';
    if (!formData.cardType) newErrors.cardType = currentLanguage === 'ar' ? 'نوع البطاقة مطلوب' : 'Card type required';
    if (!formData.cardNumber.trim()) newErrors.cardNumber = currentLanguage === 'ar' ? 'رقم البطاقة مطلوب' : 'Card number required';
    if (!formData.amount) newErrors.amount = currentLanguage === 'ar' ? 'المبلغ مطلوب' : 'Amount required';
    if (!formData.paymentMethod) newErrors.paymentMethod = currentLanguage === 'ar' ? 'طريقة الدفع مطلوبة' : 'Payment method required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    const API_URL = process.env.REACT_APP_BACKEND_URL;

    try {
      const orderData = {
        order_type: 'card_recharge',
        customer: { full_name: formData.fullName, phone: formData.phone },
        details: {
          cardType: formData.cardType,
          cardNumber: formData.cardNumber,
          amount: formData.amount,
          serviceFee: calculateFee(),
          total: calculateTotal(),
          paymentMethod: formData.paymentMethod
        }
      };

      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const order = await response.json();
        navigate('/services/card-recharge/success', {
          state: {
            orderData: {
              ...formData,
              type: 'card_recharge',
              serviceFee: calculateFee(),
              total: calculateTotal(),
              orderId: order.order_id
            }
          }
        });
      } else {
        throw new Error('Failed');
      }
    } catch (err) {
      console.error('Error:', err);
      alert(currentLanguage === 'ar' ? 'حدث خطأ' : 'Error occurred');
    }

    setLoading(false);
  };

  const selectedCard = cardTypes.find(c => c.value === formData.cardType);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-b from-slate-50 via-white to-slate-50'
    }`}>
      <Header3D />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/')}
            className={`flex items-center gap-2 mb-8 group ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            {currentLanguage === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
          </motion.button>

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <CreditCard className="w-10 h-10 text-white" />
            </div>
            <h1 className={`text-3xl md:text-4xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {currentLanguage === 'ar' ? 'تعبئة البطاقات' : 'Card Recharge'}
            </h1>
            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              {currentLanguage === 'ar' ? 'تعبئة رصيد الهاتف والإنترنت والبطاقات' : 'Recharge phone, internet and cards'}
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="max-w-3xl mx-auto"
            data-testid="card-recharge-form"
          >
            {/* Personal Info */}
            <div className={`rounded-3xl border-2 shadow-xl p-8 mb-6 ${
              isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                  <User className="w-6 h-6 text-blue-500" />
                </div>
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {currentLanguage === 'ar' ? 'البيانات الشخصية' : 'Personal Info'}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    {currentLanguage === 'ar' ? 'الاسم الكامل' : 'Full Name'} *
                  </Label>
                  <Input
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`}
                    data-testid="full-name-input"
                  />
                  {errors.fullName && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.fullName}</p>}
                </div>

                <div className="space-y-2">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    {currentLanguage === 'ar' ? 'رقم الهاتف' : 'Phone'} *
                  </Label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`}
                    placeholder="+964 7XX XXX XXXX"
                    data-testid="phone-input"
                  />
                  {errors.phone && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Card Type Selection */}
            <div className={`rounded-3xl border-2 shadow-xl p-8 mb-6 ${
              isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                  <CreditCard className="w-6 h-6 text-purple-500" />
                </div>
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {currentLanguage === 'ar' ? 'نوع البطاقة' : 'Card Type'}
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                {cardTypes.map(card => (
                  <motion.button
                    key={card.value}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleInputChange('cardType', card.value)}
                    className={`p-4 rounded-2xl border-2 text-center transition-all ${
                      formData.cardType === card.value
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                        : isDark ? 'border-slate-600 hover:border-slate-500' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mx-auto mb-2`}>
                      <card.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {currentLanguage === 'ar' ? card.labelAr : card.labelEn}
                    </span>
                  </motion.button>
                ))}
              </div>
              {errors.cardType && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.cardType}</p>}

              {/* Card Number */}
              <div className="space-y-2">
                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  {currentLanguage === 'ar' ? 'رقم البطاقة / الهاتف' : 'Card / Phone Number'} *
                </Label>
                <Input
                  value={formData.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                  className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`}
                  placeholder={currentLanguage === 'ar' ? 'أدخل الرقم' : 'Enter number'}
                  data-testid="card-number-input"
                />
                {errors.cardNumber && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.cardNumber}</p>}
              </div>
            </div>

            {/* Amount Selection */}
            <div className={`rounded-3xl border-2 shadow-xl p-8 mb-6 ${
              isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                  <DollarSign className="w-6 h-6 text-emerald-500" />
                </div>
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {currentLanguage === 'ar' ? 'المبلغ والدفع' : 'Amount & Payment'}
                </h2>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {amounts.map(amt => (
                  <motion.button
                    key={amt.value}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleInputChange('amount', amt.value)}
                    className={`p-4 rounded-xl border-2 font-bold transition-all ${
                      formData.amount === amt.value
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500'
                        : isDark ? 'border-slate-600 text-white hover:border-slate-500' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {currentLanguage === 'ar' ? amt.labelAr : amt.labelEn}
                  </motion.button>
                ))}
              </div>
              {errors.amount && <p className="text-sm text-red-500 flex items-center gap-1 mb-4"><AlertCircle className="w-4 h-4" />{errors.amount}</p>}

              {/* Payment Method */}
              <div className="space-y-2">
                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  {currentLanguage === 'ar' ? 'طريقة الدفع' : 'Payment Method'} *
                </Label>
                <Select value={formData.paymentMethod} onValueChange={(v) => handleInputChange('paymentMethod', v)}>
                  <SelectTrigger className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`} data-testid="payment-method-select">
                    <SelectValue placeholder={currentLanguage === 'ar' ? 'اختر طريقة الدفع' : 'Select payment method'} />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map(m => (
                      <SelectItem key={m.value} value={m.value}>
                        {currentLanguage === 'ar' ? m.labelAr : m.labelEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.paymentMethod && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.paymentMethod}</p>}
              </div>

              {/* Summary */}
              {formData.amount && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`mt-6 p-4 rounded-2xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>{currentLanguage === 'ar' ? 'المبلغ' : 'Amount'}</span>
                    <span className={`font-semibold ${isDark ? 'text-white' : ''}`}>{Number(formData.amount).toLocaleString()} {currentLanguage === 'ar' ? 'د.ع' : 'IQD'}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>{currentLanguage === 'ar' ? `رسوم (${serviceFeePercent}%)` : `Fee (${serviceFeePercent}%)`}</span>
                    <span className="font-semibold text-amber-500">{Number(calculateFee()).toLocaleString()} {currentLanguage === 'ar' ? 'د.ع' : 'IQD'}</span>
                  </div>
                  <div className={`border-t pt-2 mt-2 ${isDark ? 'border-slate-600' : 'border-slate-200'}`}>
                    <div className="flex justify-between items-center">
                      <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{currentLanguage === 'ar' ? 'الإجمالي' : 'Total'}</span>
                      <span className="font-bold text-lg text-emerald-500">{Number(calculateTotal()).toLocaleString()} {currentLanguage === 'ar' ? 'د.ع' : 'IQD'}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              data-testid="submit-card-recharge"
              className="w-full py-5 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {currentLanguage === 'ar' ? 'جارٍ التسجيل...' : 'Submitting...'}
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  {currentLanguage === 'ar' ? 'تأكيد التعبئة' : 'Confirm Recharge'}
                </>
              )}
            </motion.button>
          </motion.form>
        </div>
      </main>

      <Footer3D />
    </div>
  );
};

export default CardRecharge;
