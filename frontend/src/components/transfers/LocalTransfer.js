import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { MapPin, User, Phone, DollarSign, CreditCard, CheckCircle, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header3D from '../landing/Header3D';
import Footer3D from '../landing/Footer3D';

const LocalTransfer = () => {
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
    senderName: '',
    receiverName: '',
    senderProvince: '',
    receiverProvince: '',
    receiverDistrict: '',
    senderPhone: '',
    receiverPhone: '',
    amountUSD: '', // Keep for backward compatibility or rename if safe, but user said "as we did for receiver"
    amount: '',
    senderCurrency: '', // IQD or USD
    receiverCurrency: '', // IQD or USD
    paymentMethod: ''
  });

  // Currency options for local transfer
  const currencies = [
    { value: 'IQD', labelAr: 'دينار عراقي', labelEn: 'Iraqi Dinar (IQD)', symbol: 'د.ع', labelKu: 'دیناری عێراقی' },
    { value: 'USD', labelAr: 'دولار أمريكي', labelEn: 'US Dollar (USD)', symbol: '$', labelKu: 'دۆلاری ئەمریکی' }
  ];

  const receiverCurrencies = currencies; // Reuse for consistency if needed

  // Iraqi provinces
  const provinces = [
    { value: 'baghdad', labelAr: 'بغداد', labelEn: 'Baghdad', labelKu: 'بەغداد' },
    { value: 'basra', labelAr: 'البصرة', labelEn: 'Basra', labelKu: 'بەسڕە' },
    { value: 'erbil', labelAr: 'أربيل', labelEn: 'Erbil', labelKu: 'هەولێر' },
    { value: 'sulaymaniyah', labelAr: 'السليمانية', labelEn: 'Sulaymaniyah', labelKu: 'سلێمانی' },
    { value: 'duhok', labelAr: 'دهوك', labelEn: 'Duhok', labelKu: 'دهۆک' },
    { value: 'nineveh', labelAr: 'نينوى', labelEn: 'Nineveh', labelKu: 'نەینەوا' },
    { value: 'kirkuk', labelAr: 'كركوك', labelEn: 'Kirkuk', labelKu: 'کەرکوک' },
    { value: 'diyala', labelAr: 'ديالى', labelEn: 'Diyala', labelKu: 'دیالە' },
    { value: 'anbar', labelAr: 'الأنبار', labelEn: 'Anbar', labelKu: 'ئەنبار' },
    { value: 'najaf', labelAr: 'النجف', labelEn: 'Najaf', labelKu: 'نەجەف' },
    { value: 'karbala', labelAr: 'كربلاء', labelEn: 'Karbala', labelKu: 'کەربەلا' },
    { value: 'babylon', labelAr: 'بابل', labelEn: 'Babylon', labelKu: 'بابل' },
    { value: 'wasit', labelAr: 'واسط', labelEn: 'Wasit', labelKu: 'واست' },
    { value: 'maysan', labelAr: 'ميسان', labelEn: 'Maysan', labelKu: 'میسان' },
    { value: 'dhiqar', labelAr: 'ذي قار', labelEn: 'Dhi Qar', labelKu: 'زیقار' },
    { value: 'muthanna', labelAr: 'المثنى', labelEn: 'Muthanna', labelKu: 'موسەننا' },
    { value: 'qadisiyyah', labelAr: 'القادسية', labelEn: 'Qadisiyyah', labelKu: 'قادسیە' },
    { value: 'saladin', labelAr: 'صلاح الدين', labelEn: 'Saladin', labelKu: 'سەڵاحەددین' }
  ];

  const paymentMethods = [
    { value: 'zain_cash', labelAr: 'زين كاش', labelEn: 'Zain Cash', labelKu: 'زەین کاش' },
    { value: 'mastercard_rafidain', labelAr: 'ماستركارد الرافدين', labelEn: 'Mastercard Al-Rafidain', labelKu: 'ماستەرکارد الڕافدین' },
    { value: 'fib', labelAr: 'FIB', labelEn: 'FIB', labelKu: 'FIB' }
  ];

  const serviceFeePercent = 2; // This would come from admin settings
  const [usdToIqdRate, setUsdToIqdRate] = useState(1480); // Fallback rate

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/rates?active_only=true`);
        if (response.ok) {
          const ratesData = await response.json();
          const usdRate = ratesData.find(r => r.currency_code === 'USD');
          if (usdRate && usdRate.sell_rate) {
            setUsdToIqdRate(usdRate.sell_rate);
          }
        }
      } catch (err) {
        console.error('Error fetching exchange rates:', err);
      }
    };
    fetchRates();
  }, []);
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Calculate amount in IQD based on user input and selected sender currency
  const calculateAmountIQD = () => {
    if (!formData.amount) return 0;
    const amount = parseFloat(formData.amount);
    if (formData.senderCurrency === 'IQD') return Math.round(amount);
    return Math.round(amount * usdToIqdRate);
  };

  const calculateFee = () => {
    const amountIQD = calculateAmountIQD();
    if (!amountIQD) return 0;
    return Math.round(amountIQD * serviceFeePercent / 100);
  };

  const calculateTotal = () => {
    const amountIQD = calculateAmountIQD();
    if (!amountIQD) return 0;
    return amountIQD + calculateFee();
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.senderName.trim()) newErrors.senderName = t('رقم الهاتف مطلوب', 'Sender name required', 'ناوی نێرەر پێویستە');
    if (!formData.receiverName.trim()) newErrors.receiverName = t('اسم المستلم مطلوب', 'Receiver name required', 'ناوی وەرگر پێویستە');
    if (!formData.senderProvince) newErrors.senderProvince = t('محافظة المرسل مطلوبة', 'Sender province required', 'پارێزگای نێرەر پێویستە');
    if (!formData.receiverProvince) newErrors.receiverProvince = t('محافظة المستلم مطلوبة', 'Receiver province required', 'پارێزگای وەرگر پێویستە');
    if (!formData.receiverDistrict.trim()) newErrors.receiverDistrict = t('القضاء مطلوب', 'District required', 'قەزا پێویستە');
    if (!formData.senderPhone.trim()) newErrors.senderPhone = t('رقم هاتف المرسل مطلوب', 'Sender phone required', 'ژمارەی مۆبایلی نێرەر پێویستە');
    if (!formData.receiverPhone.trim()) newErrors.receiverPhone = t('رقم هاتف المستلم مطلوب', 'Receiver phone required', 'ژمارەی مۆبایلی وەرگر پێویستە');
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = t('المبلغ مطلوب', 'Amount required', 'بڕی پارە پێويستە');
    if (!formData.senderCurrency) newErrors.senderCurrency = t('عملة المرسل مطلوبة', 'Sender currency required', 'دراوی نێرەر پێویستە');
    if (!formData.receiverCurrency) newErrors.receiverCurrency = t('عملة المستلم مطلوبة', 'Receiver currency required', 'دراوی وەرگر پێویستە');
    if (!formData.paymentMethod) newErrors.paymentMethod = t('طريقة الدفع مطلوبة', 'Payment method required', 'شێوازی پارەدان پێویستە');

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
      const blockRes = await fetch(`${API_URL}/api/blocklist/check?full_name=${encodeURIComponent(formData.senderName)}&phone=${encodeURIComponent(formData.senderPhone)}`);
      if (blockRes.ok) {
        const blockData = await blockRes.json();
        if (blockData.blocked) {
          toast.error(blockData.message || t('عذراً، لا يمكن إتمام طلبك حالياً.', 'Sorry, your request cannot be processed at this time.', 'ببوورە، داواکارییەکەت لە ئێستادا جێبەجێ ناکرێت.'));
          setLoading(false);
          return;
        }
      }

      const orderData = {
        order_type: 'local',
        customer: {
          full_name: formData.senderName,
          phone: formData.senderPhone
        },
        details: {
          senderName: formData.senderName,
          senderProvince: formData.senderProvince,
          receiverName: formData.receiverName,
          receiverProvince: formData.receiverProvince,
          receiverDistrict: formData.receiverDistrict,
          senderPhone: formData.senderPhone,
          receiverPhone: formData.receiverPhone,
          amount: formData.amount,
          senderCurrency: formData.senderCurrency,
          receiverCurrency: formData.receiverCurrency,
          amountIQD: calculateAmountIQD(),
          serviceFee: calculateFee(),
          total: calculateTotal(),
          paymentMethod: formData.paymentMethod,
          exchangeRate: usdToIqdRate
        }
      };

      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const order = await response.json();
        navigate('/transfers/success', {
          state: {
            orderData: {
              ...formData,
              type: 'local',
              currency: formData.senderCurrency,
              amountIQD: calculateAmountIQD(),
              serviceFee: calculateFee(),
              total: calculateTotal(),
              orderId: order.order_id
            }
          }
        });
      } else {
        throw new Error('Failed to create order');
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error(t('حدث خطأ. حاول مرة أخرى.', 'An error occurred.', 'هەڵەیەک ڕوویدا. دووبارە هەوڵ بدەرەوە.'));
    }

    setLoading(false);
  };

  const getProvinceLabel = (value) => {
    const province = provinces.find(p => p.value === value);
    return province ? t(province.labelAr, province.labelEn, province.labelKu) : value;
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
            onClick={() => navigate('/transfers')}
            className={`flex items-center gap-2 mb-8 group ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            {t('العودة للتحويلات', 'Back to Transfers', 'گەڕانەوە بۆ گواستنەوەکان')}
          </motion.button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <MapPin className="w-10 h-10 text-white" />
            </div>
            <h1 className={`text-3xl md:text-4xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t('تحويل محلي', 'Local Transfer', 'گواستنەوەی ناوخۆیی')}
            </h1>
            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              {t('تحويل أموال داخل العراق', 'Transfer money within Iraq', 'گواستنەوەی پارە لەناو عێراقدا')}
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="max-w-3xl mx-auto"
            data-testid="local-transfer-form"
          >
            {/* Sender & Receiver Info */}
            <div className={`rounded-3xl border-2 shadow-xl p-8 mb-6 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
              }`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                  <User className="w-6 h-6 text-blue-500" />
                </div>
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {t('بيانات التحويل', 'Transfer Details', 'زانیاری گواستنەوە')}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sender Name */}
                <div className="space-y-2">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    {t('اسم المرسل', 'Sender Name', 'ناوی نێرەر')} *
                  </Label>
                  <Input
                    value={formData.senderName}
                    onChange={(e) => handleInputChange('senderName', e.target.value)}
                    className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`}
                    placeholder={t('أدخل اسم المرسل', 'Enter sender name', 'ناوی نێرەر بنووسە')}
                    data-testid="sender-name-input"
                  />
                  {errors.senderName && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />{errors.senderName}
                    </p>
                  )}
                </div>

                {/* Receiver Name */}
                <div className="space-y-2">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    {t('اسم المستلم', 'Receiver Name', 'ناوی وەرگر')} *
                  </Label>
                  <Input
                    value={formData.receiverName}
                    onChange={(e) => handleInputChange('receiverName', e.target.value)}
                    className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`}
                    placeholder={t('أدخل اسم المستلم', 'Enter receiver name', 'ناوی وەرگر بنووسە')}
                    data-testid="receiver-name-input"
                  />
                  {errors.receiverName && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />{errors.receiverName}
                    </p>
                  )}
                </div>

                {/* Sender Province */}
                <div className="space-y-2">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    {t('محافظة المرسل', 'Sender Province', 'پارێزگای نێرەر')} *
                  </Label>
                  <Select value={formData.senderProvince} onValueChange={(v) => handleInputChange('senderProvince', v)}>
                    <SelectTrigger className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`} data-testid="sender-province-select">
                      <SelectValue placeholder={t('اختر المحافظة', 'Select province', 'پارێزگا هەڵبژێرە')} />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.map(p => (
                        <SelectItem key={p.value} value={p.value}>
                          {currentLanguage === 'ar' ? p.labelAr : p.labelEn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.senderProvince && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />{errors.senderProvince}
                    </p>
                  )}
                </div>

                {/* Receiver Province */}
                <div className="space-y-2">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    {t('محافظة المستلم', 'Receiver Province', 'پارێزگای وەرگر')} *
                  </Label>
                  <Select value={formData.receiverProvince} onValueChange={(v) => handleInputChange('receiverProvince', v)}>
                    <SelectTrigger className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`} data-testid="receiver-province-select">
                      <SelectValue placeholder={t('اختر المحافظة', 'Select province', 'پارێزگا هەڵبژێرە')} />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.map(p => (
                        <SelectItem key={p.value} value={p.value}>
                          {currentLanguage === 'ar' ? p.labelAr : p.labelEn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.receiverProvince && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />{errors.receiverProvince}
                    </p>
                  )}
                </div>

                {/* Sender Phone - moved beside District */}
                <div className="space-y-2">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    {t('رقم هاتف المرسل', 'Sender Phone', 'ژمارەی مۆبایلی نێرەر')} *
                  </Label>
                  <Input
                    type="tel"
                    value={formData.senderPhone}
                    onChange={(e) => handleInputChange('senderPhone', e.target.value)}
                    className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`}
                    placeholder="+964 7XX XXX XXXX"
                    data-testid="sender-phone-input"
                  />
                  {errors.senderPhone && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />{errors.senderPhone}
                    </p>
                  )}
                </div>

                {/* Receiver District - beside Sender Phone */}
                <div className="space-y-2">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    {t('القضاء', 'District', 'قەزا')} *
                  </Label>
                  <Input
                    value={formData.receiverDistrict}
                    onChange={(e) => handleInputChange('receiverDistrict', e.target.value)}
                    className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`}
                    placeholder={t('أدخل القضاء', 'Enter district', 'ناوی قەزا بنووسە')}
                    data-testid="receiver-district-input"
                  />
                  {errors.receiverDistrict && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />{errors.receiverDistrict}
                    </p>
                  )}
                </div>

                {/* Receiver Phone */}
                <div className="space-y-2">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    {t('رقم هاتف المستلم', 'Receiver Phone', 'ژمارەی مۆبایلی وەرگر')} *
                  </Label>
                  <Input
                    type="tel"
                    value={formData.receiverPhone}
                    onChange={(e) => handleInputChange('receiverPhone', e.target.value)}
                    className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`}
                    placeholder="+964 7XX XXX XXXX"
                    data-testid="receiver-phone-input"
                  />
                  {errors.receiverPhone && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />{errors.receiverPhone}
                    </p>
                  )}
                </div>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Amount */}
                <div className="space-y-2">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    {t('المبلغ', 'Amount', 'بڕ')} *
                  </Label>
                  <Input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`}
                    placeholder="100"
                    min="1"
                    data-testid="amount-input"
                  />
                  {errors.amount && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />{errors.amount}
                    </p>
                  )}
                </div>

                {/* Sender Currency */}
                <div className="space-y-2">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    {t('عملة المرسل', 'Sender Currency', 'دراوی نێرەر')} *
                  </Label>
                  <Select value={formData.senderCurrency} onValueChange={(v) => handleInputChange('senderCurrency', v)}>
                    <SelectTrigger className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`} data-testid="sender-currency-select">
                      <SelectValue placeholder={t('اختر العملة', 'Select currency', 'دراو هەڵبژێرە')} />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map(c => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.symbol} {t(c.labelAr, c.labelEn, c.labelKu)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.senderCurrency && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />{errors.senderCurrency}
                    </p>
                  )}
                </div>

                {/* Receiver Currency */}
                <div className="space-y-2 md:col-span-2">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    {t('عملة المستلم', 'Receiver Currency', 'دراوی وەرگر')} *
                  </Label>
                  <Select value={formData.receiverCurrency} onValueChange={(v) => handleInputChange('receiverCurrency', v)}>
                    <SelectTrigger className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`} data-testid="receiver-currency-select">
                      <SelectValue placeholder={t('اختر العملة', 'Select currency', 'دراو هەڵبژێرە')} />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map(c => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.symbol} {t(c.labelAr, c.labelEn, c.labelKu)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.receiverCurrency && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />{errors.receiverCurrency}
                    </p>
                  )}
                </div>

                {/* Payment Method */}
                <div className="space-y-2 md:col-span-2">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    {t('طريقة الدفع', 'Payment Method', 'شێوازی پارەدان')} *
                  </Label>
                  <div className={`p-6 rounded-2xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {paymentMethods.map(m => (
                        <motion.button
                          key={m.value}
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          onMouseEnter={() => setHoveredMethod(m.value)}
                          onMouseLeave={() => setHoveredMethod(null)}
                          onClick={() => handleInputChange('paymentMethod', m.value)}
                          className={`p-4 rounded-xl border-2 text-center transition-colors ${formData.paymentMethod === m.value
                            ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                            : hoveredMethod === m.value
                              ? 'border-[#D4AF37]'
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
                  {errors.paymentMethod && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />{errors.paymentMethod}
                    </p>
                  )}
                </div>
              </div>

              {/* Summary with USD → IQD conversion */}
              {formData.amountUSD && parseFloat(formData.amountUSD) > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className={`mt-6 p-6 rounded-2xl ${isDark ? 'bg-emerald-900/30 border border-emerald-700/50' : 'bg-emerald-50 border border-emerald-200'
                    }`}
                >
                  <h4 className={`font-bold mb-4 ${isDark ? 'text-emerald-300' : 'text-emerald-900'}`}>
                    {t('ملخص التحويل', 'Transfer Summary', 'پوختەی گواستنەوە')}
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-emerald-200' : 'text-emerald-800'}>
                        {t('المبلغ', 'Amount', 'بڕ')} ({formData.senderCurrency})
                      </span>
                      <span className={`font-semibold ${isDark ? 'text-white' : ''}`}>
                        {formData.senderCurrency === 'USD' ? '$' : ''}{parseFloat(formData.amount).toLocaleString()} {formData.senderCurrency === 'IQD' ? 'IQD' : ''}
                      </span>
                    </div>
                    {formData.senderCurrency === 'USD' && (
                      <div className="flex justify-between">
                        <span className={isDark ? 'text-emerald-200' : 'text-emerald-800'}>
                          {t('المقابل بالدينار', 'Amount in IQD', 'بڕ بە دینار')}
                        </span>
                        <span className={`font-semibold ${isDark ? 'text-white' : ''}`}>
                          {calculateAmountIQD().toLocaleString()} IQD
                        </span>
                      </div>
                    )}
                    {formData.receiverCurrency && (
                      <div className="flex justify-between">
                        <span className={isDark ? 'text-emerald-200' : 'text-emerald-800'}>
                          {t('عملة المستلم', 'Receiver Currency', 'دراوی وەرگر')}
                        </span>
                        <span className={`font-semibold ${isDark ? 'text-white' : ''}`}>
                          {formData.receiverCurrency}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-emerald-200' : 'text-emerald-800'}>
                        {t(`رسوم الخدمة (${serviceFeePercent}%)`, `Service Fee (${serviceFeePercent}%)`, `رسوومى خزمەتگوزاری (${serviceFeePercent}%)`)}
                      </span>
                      <span className="font-semibold text-amber-500">
                        {calculateFee().toLocaleString()} IQD
                      </span>
                    </div>
                    <div className={`border-t pt-3 mt-3 ${isDark ? 'border-emerald-700/50' : 'border-emerald-300'}`}>
                      <div className="flex justify-between">
                        <span className={`font-bold ${isDark ? 'text-white' : 'text-emerald-900'}`}>
                          {t('الإجمالي للدفع', 'Total to Pay', 'کۆی گشتی بۆ پارەدان')}
                        </span>
                        <span className="font-bold text-lg text-emerald-500">
                          {calculateTotal().toLocaleString()} IQD
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              data-testid="submit-local-transfer"
              className="w-full py-5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t('جارٍ التسجيل...', 'Submitting...', 'تۆمارکردن...')}
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  {t('تسجيل طلب التحويل', 'Submit Transfer Request', 'تۆمارکردنی داواکاری گواستنەوە')}
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

export default LocalTransfer;
