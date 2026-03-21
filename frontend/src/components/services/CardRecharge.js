import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { CreditCard, User, Phone, DollarSign, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CountryPhoneSelect from '@/components/ui/CountryPhoneSelect';
import Header3D from '../landing/Header3D';
import Footer3D from '../landing/Footer3D';
import { PAYMENT_METHODS, SERVICE_FEES, calculateFee, calculateTotal } from '@/config/payments';

const CardRecharge = () => {
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

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [hoveredMethod, setHoveredMethod] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    cardName: '',
    cardType: '',
    numberType: 'card', // 'card' (16 digits) or 'account' (10 digits)
    cardNumber: '',
    accountNumber: '',
    amount: '',
    paymentMethod: ''
  });

  const [usdToIQD, setUsdToIQD] = useState(1480);

  // Fetch exchange rate on mount
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/rates?active_only=true`);
        if (response.ok) {
          const ratesData = await response.json();
          const usdData = ratesData.find(r => r.currency_code === 'USD');
          if (usdData && usdData.sell_rate) {
            setUsdToIQD(usdData.sell_rate);
          }
        }
      } catch (err) {
        console.error('Failed to fetch exchange rate:', err);
      }
    };
    fetchRate();
  }, []);
  const serviceFee = SERVICE_FEES.card_recharge; // 2%

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const calculateIQD = () => {
    if (!formData.amount) return 0;
    return Math.round(parseFloat(formData.amount) * usdToIQD);
  };

  const calculateFeeAmount = () => {
    return calculateFee(calculateIQD(), 'card_recharge');
  };

  const calculateTotalAmount = () => {
    return calculateTotal(calculateIQD(), 'card_recharge');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = t('الاسم الكامل مطلوب', 'Full name required', 'ناوی تەواو پێویستە');
    }
    if (!formData.phone.trim()) {
      newErrors.phone = t('رقم الهاتف مطلوب', 'Phone required', 'ژمارەی مۆبایل پێویستە');
    }
    if (!formData.cardName.trim()) {
      newErrors.cardName = t('الاسم على البطاقة مطلوب', 'Card name required', 'ناو لەسەر کارت پێویستە');
    }
    if (!formData.cardType.trim()) {
      newErrors.cardType = t('نوع البطاقة مطلوب', 'Card type required', 'جۆری کارت پێویستە');
    }

    // Validate card number (16 digits) or account number (10 digits)
    if (formData.numberType === 'card') {
      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = t('رقم البطاقة مطلوب', 'Card number required', 'ژمارەی کارت پێویستە');
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = t('رقم البطاقة يجب أن يكون 16 رقم', 'Card number must be 16 digits', 'ژمارەی کارت دەبێت ١٦ ژمارە بێت');
      }
    } else {
      if (!formData.accountNumber.trim()) {
        newErrors.accountNumber = t('رقم الحساب مطلوب', 'Account number required', 'ژمارەی هەژمار پێویستە');
      } else if (!/^\d{10}$/.test(formData.accountNumber.replace(/\s/g, ''))) {
        newErrors.accountNumber = t('رقم الحساب يجب أن يكون 10 أرقام', 'Account number must be 10 digits', 'ژمارەی هەژمار دەبێت ١٠ ژمارە بێت');
      }
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = t('المبلغ مطلوب', 'Amount required', 'بڕ پێویستە');
    }
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = t('طريقة الدفع مطلوبة', 'Payment method required', 'شێوازی پارەدان پێویستە');
    }

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
      // 0. Perform Block Check for better UX
      const blockRes = await fetch(`${API_URL}/api/blocklist/check?full_name=${encodeURIComponent(formData.fullName)}&phone=${encodeURIComponent(formData.phone)}`);
      if (blockRes.ok) {
        const blockData = await blockRes.json();
        if (blockData.blocked) {
          toast.error(blockData.message || t('عذراً، لا يمكن إتمام طلبك حالياً.', 'Sorry, your request cannot be processed at this time.', 'ببوورە، داواکارییەکەت لە ئێستادا جێبەجێ ناکرێت.'));
          setLoading(false);
          return;
        }
      }

      const orderData = {
        order_type: 'card_recharge',
        customer: {
          full_name: formData.fullName,
          phone: formData.phone
        },
        details: {
          cardName: formData.cardName,
          cardType: formData.cardType,
          numberType: formData.numberType,
          cardNumber: formData.numberType === 'card' ? formData.cardNumber : null,
          accountNumber: formData.numberType === 'account' ? formData.accountNumber : null,
          amountUSD: formData.amount,
          amountIQD: calculateIQD(),
          serviceFee: calculateFeeAmount(),
          total: calculateTotalAmount(),
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
              currency: 'USD',
              amountIQD: calculateIQD(),
              serviceFee: calculateFeeAmount(),
              total: calculateTotalAmount(),
              orderId: order.order_id
            }
          }
        });
      } else {
        throw new Error('Failed');
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error(t('حدث خطأ', 'Error occurred', 'هەڵەیەک ڕوویدا'));
    }

    setLoading(false);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark
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
            {t('العودة للرئيسية', 'Back to Home', 'گەڕانەوە بۆ سەرەکی')}
          </motion.button>

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <CreditCard className="w-10 h-10 text-white" />
            </div>
            <h1 className={`text-3xl md:text-4xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t('تعبئة البطاقات', 'Card Recharge', 'تێکردنەوەی کارت')}
            </h1>
            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              {t('تعبئة رصيد البطاقات المصرفية', 'Recharge bank cards', 'تێکردنەوەی کارتی بانکی')}
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto"
            data-testid="card-recharge-form"
          >
            {/* Personal Info */}
            <div className={`rounded-3xl border-2 shadow-xl p-8 mb-6 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
              }`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                  <User className="w-6 h-6 text-blue-500" />
                </div>
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {t('البيانات الشخصية', 'Personal Info', 'زانیارییە کەسییەکان')}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    {t('الاسم الكامل', 'Full Name', 'ناوی تەواو')} *
                  </Label>
                  <Input
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`}
                    data-testid="full-name-input"
                    placeholder={t('أدخل الاسم الكامل', 'Enter full name', 'ناوی تەواو بنووسە')}
                  />
                  {errors.fullName && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.fullName}</p>}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    {t('رقم الهاتف', 'Phone', 'ژمارەی مۆبایل')} *
                  </Label>
                  <CountryPhoneSelect
                    value={formData.phone}
                    onChange={(val) => handleInputChange('phone', val)}
                    isDark={isDark}
                    data-testid="phone-input"
                  />
                  {errors.phone && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Card Info */}
            <div className={`rounded-3xl border-2 shadow-xl p-8 mb-6 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
              }`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                  <CreditCard className="w-6 h-6 text-purple-500" />
                </div>
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {t('بيانات البطاقة', 'Card Details', 'زانیارییەکانی کارت')}
                </h2>
              </div>

              <div className="space-y-6">
                {/* Card Name */}
                <div className="space-y-2">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    {t('الاسم على البطاقة', 'Name on Card', 'ناو لەسەر کارت')} *
                  </Label>
                  <Input
                    value={formData.cardName}
                    onChange={(e) => handleInputChange('cardName', e.target.value)}
                    className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`}
                    data-testid="card-name-input"
                    placeholder={t('أدخل الاسم كما في البطاقة', 'Enter name as on card', 'ناو بنووسە وەک لەسەر کارتەکە هەیە')}
                  />
                  {errors.cardName && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.cardName}</p>}
                </div>

                {/* Card Type */}
                <div className="space-y-2">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    {t('نوع البطاقة', 'Card Type', 'جۆری کارت')} *
                  </Label>
                  <Input
                    value={formData.cardType}
                    onChange={(e) => handleInputChange('cardType', e.target.value)}
                    className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`}
                    placeholder={t('مثال: ماستركارد، فيزا...', 'e.g., Mastercard, Visa...', 'بۆ نموونە: ماستەرکارد، ڤیزا...')}
                    data-testid="card-type-input"
                  />
                  {errors.cardType && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.cardType}</p>}
                </div>

                {/* Number Type Selection */}
                <div className="space-y-3">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    {t('نوع الرقم', 'Number Type', 'جۆری ژمارە')} *
                  </Label>
                  <div className="flex gap-4">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleInputChange('numberType', 'card')}
                      className={`flex-1 py-4 px-6 rounded-xl border-2 font-bold transition-all ${formData.numberType === 'card'
                        ? 'border-purple-500 bg-purple-500/10 text-purple-500'
                        : isDark ? 'border-slate-600 text-white hover:border-slate-500' : 'border-slate-200 hover:border-slate-300'
                        }`}
                    >
                      {t('رقم البطاقة (16 رقم)', 'Card Number (16 digits)', 'ژمارەی کارت (١٦ ژمارە)')}
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleInputChange('numberType', 'account')}
                      className={`flex-1 py-4 px-6 rounded-xl border-2 font-bold transition-all ${formData.numberType === 'account'
                        ? 'border-purple-500 bg-purple-500/10 text-purple-500'
                        : isDark ? 'border-slate-600 text-white hover:border-slate-500' : 'border-slate-200 hover:border-slate-300'
                        }`}
                    >
                      {t('رقم الحساب (10 أرقام)', 'Account Number (10 digits)', 'ژمارەی هەژمار (١٠ ژمارە)')}
                    </motion.button>
                  </div>
                </div>

                {/* Card Number (16 digits) */}
                {formData.numberType === 'card' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                  >
                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                      {t('رقم البطاقة', 'Card Number', 'ژمارەی کارت')} * ({t('16 رقم', '16 digits', '١٦ ژمارە')})
                    </Label>
                    <Input
                      value={formData.cardNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 16);
                        handleInputChange('cardNumber', value);
                      }}
                      className={`h-12 font-mono text-lg tracking-wider ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`}
                      placeholder="XXXX XXXX XXXX XXXX"
                      maxLength={16}
                      data-testid="card-number-input"
                    />
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {formData.cardNumber.length}/16 {t('رقم', 'digits', 'ژمارە')}
                    </p>
                    {errors.cardNumber && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.cardNumber}</p>}
                  </motion.div>
                )}

                {/* Account Number (10 digits) */}
                {formData.numberType === 'account' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                  >
                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                      {t('رقم الحساب', 'Account Number', 'ژمارەی هەژمار')} * ({t('10 أرقام', '10 digits', '١٠ ژمارە')})
                    </Label>
                    <Input
                      value={formData.accountNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                        handleInputChange('accountNumber', value);
                      }}
                      className={`h-12 font-mono text-lg tracking-wider ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`}
                      placeholder="XXXXXXXXXX"
                      maxLength={10}
                      data-testid="account-number-input"
                    />
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {formData.accountNumber.length}/10 {t('أرقام', 'digits', 'ژمارە')}
                    </p>
                    {errors.accountNumber && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.accountNumber}</p>}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Amount & Payment */}
            <div className={`rounded-3xl border-2 shadow-xl p-8 mb-6 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
              }`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                  <DollarSign className="w-6 h-6 text-emerald-500" />
                </div>
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {t('المبلغ والدفع', 'Amount & Payment', 'بڕ و پارەدان')}
                </h2>
              </div>

              <div className="space-y-6">
                {/* Amount in USD */}
                <div className="space-y-2">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    {t('المبلغ بالدولار ($)', 'Amount in USD ($)', 'بڕ بە دۆلار ($)')} *
                  </Label>
                  <Input
                    type="number"
                    value={formData.amount}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    className={`h-14 text-xl font-bold ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`}
                    placeholder="100"
                    min="1"
                    data-testid="amount-input"
                  />
                  {errors.amount && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.amount}</p>}
                </div>

                {/* Payment Method */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-4">
                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                      {t('طريقة الدفع', 'Payment Method', 'شێوازی پارەدان')} *
                    </Label>
                    <span className="text-red-500 text-sm font-bold">
                      {t('حدد كيف تدفع لنا', 'Select how you pay us', 'چۆنێتی پارەدانەکەمان بۆ دیاری بکە')}
                    </span>
                  </div>
                  <div className={`p-6 rounded-2xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {PAYMENT_METHODS.filter(m => m.active).map(m => (
                        <motion.button
                          key={m.value}
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          onMouseEnter={() => setHoveredMethod(m.value)}
                          onMouseLeave={() => setHoveredMethod(null)}
                          onClick={() => handleInputChange('paymentMethod', m.value)}
                          className={`p-4 rounded-xl border-2 text-center transition-colors ${formData.paymentMethod === m.value
                            ? 'border-purple-500 bg-purple-500/10'
                            : hoveredMethod === m.value
                              ? 'border-purple-500'
                              : isDark ? 'border-slate-600' : 'border-slate-200'
                            }`}
                        >
                          <span className={`font-bold block text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {t(m.labelAr, m.labelEn, m.labelKu)}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  {errors.paymentMethod && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.paymentMethod}</p>}
                </div>
              </div>

              {/* Summary */}
              {formData.amount && parseFloat(formData.amount) > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`mt-6 p-6 rounded-2xl ${isDark ? 'bg-emerald-900/20 border border-emerald-700/50' : 'bg-emerald-50 border border-emerald-200'}`}
                >
                  <h4 className={`font-bold mb-4 ${isDark ? 'text-emerald-400' : 'text-emerald-800'}`}>
                    {t('ملخص الطلب', 'Order Summary', 'پوختەی داواکاری')}
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>{t('المبلغ USD', 'Amount USD', 'بڕ بە دۆلار')}</span>
                      <span dir="ltr" className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>${formData.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>{t('المقابل بالدينار', 'Amount in IQD', 'بڕ بە دینار')}</span>
                      <span dir="ltr" className={`font-semibold ${isDark ? 'text-white' : ''}`}>{calculateIQD().toLocaleString()} IQD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>{t(`رسوم الخدمة (${serviceFee}%)`, `Service Fee (${serviceFee}%)`, `رسوومی خزمەتگوزاری (${serviceFee}%)`)}</span>
                      <span dir="ltr" className="font-semibold text-amber-500">{calculateFeeAmount().toLocaleString()} IQD</span>
                    </div>
                    <div className={`border-t pt-3 mt-3 ${isDark ? 'border-emerald-700/50' : 'border-emerald-200'}`}>
                      <div className="flex justify-between items-center">
                        <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('الإجمالي للدفع', 'Total to Pay', 'تێکڕای پارەدان')}</span>
                        <span dir="ltr" className="font-bold text-2xl text-emerald-500">{calculateTotalAmount().toLocaleString()} IQD</span>
                      </div>
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
                  {t('جارٍ التسجيل...', 'Submitting...', 'تۆمارکردن...')}
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  {t('تأكيد التعبئة', 'Confirm Recharge', 'دڵنیابوونەوە لە تێکردنەوە')}
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
