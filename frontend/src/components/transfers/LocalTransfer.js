import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { MapPin, User, Phone, DollarSign, CreditCard, CheckCircle, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header3D from '../landing/Header3D';
import Footer3D from '../landing/Footer3D';

const LocalTransfer = () => {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    senderName: '',
    receiverName: '',
    senderProvince: '',
    receiverProvince: '',
    phone: '',
    amount: '',
    paymentMethod: ''
  });

  // Iraqi provinces
  const provinces = [
    { value: 'baghdad', labelAr: 'بغداد', labelEn: 'Baghdad' },
    { value: 'basra', labelAr: 'البصرة', labelEn: 'Basra' },
    { value: 'erbil', labelAr: 'أربيل', labelEn: 'Erbil' },
    { value: 'sulaymaniyah', labelAr: 'السليمانية', labelEn: 'Sulaymaniyah' },
    { value: 'duhok', labelAr: 'دهوك', labelEn: 'Duhok' },
    { value: 'nineveh', labelAr: 'نينوى', labelEn: 'Nineveh' },
    { value: 'kirkuk', labelAr: 'كركوك', labelEn: 'Kirkuk' },
    { value: 'diyala', labelAr: 'ديالى', labelEn: 'Diyala' },
    { value: 'anbar', labelAr: 'الأنبار', labelEn: 'Anbar' },
    { value: 'najaf', labelAr: 'النجف', labelEn: 'Najaf' },
    { value: 'karbala', labelAr: 'كربلاء', labelEn: 'Karbala' },
    { value: 'babylon', labelAr: 'بابل', labelEn: 'Babylon' },
    { value: 'wasit', labelAr: 'واسط', labelEn: 'Wasit' },
    { value: 'maysan', labelAr: 'ميسان', labelEn: 'Maysan' },
    { value: 'dhiqar', labelAr: 'ذي قار', labelEn: 'Dhi Qar' },
    { value: 'muthanna', labelAr: 'المثنى', labelEn: 'Muthanna' },
    { value: 'qadisiyyah', labelAr: 'القادسية', labelEn: 'Qadisiyyah' },
    { value: 'saladin', labelAr: 'صلاح الدين', labelEn: 'Saladin' }
  ];

  const paymentMethods = [
    { value: 'zain_cash', labelAr: 'زين كاش', labelEn: 'Zain Cash', labelKu: 'زەین کاش' },
    { value: 'mastercard_rafidain', labelAr: 'ماستركارد الرافدين', labelEn: 'Mastercard Al-Rafidain', labelKu: 'ماستەرکارد الڕافدین' },
    { value: 'fib', labelAr: 'FIB', labelEn: 'FIB', labelKu: 'FIB' }
  ];

  const serviceFeePercent = 2; // This would come from admin settings

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const calculateFee = () => {
    if (!formData.amount) return 0;
    return (parseFloat(formData.amount) * serviceFeePercent / 100).toFixed(0);
  };

  const calculateTotal = () => {
    if (!formData.amount) return 0;
    return (parseFloat(formData.amount) + parseFloat(calculateFee())).toFixed(0);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.senderName.trim()) newErrors.senderName = currentLanguage === 'ar' ? 'اسم المرسل مطلوب' : 'Sender name required';
    if (!formData.receiverName.trim()) newErrors.receiverName = currentLanguage === 'ar' ? 'اسم المستلم مطلوب' : 'Receiver name required';
    if (!formData.senderProvince) newErrors.senderProvince = currentLanguage === 'ar' ? 'محافظة المرسل مطلوبة' : 'Sender province required';
    if (!formData.receiverProvince) newErrors.receiverProvince = currentLanguage === 'ar' ? 'محافظة المستلم مطلوبة' : 'Receiver province required';
    if (!formData.phone.trim()) newErrors.phone = currentLanguage === 'ar' ? 'رقم الهاتف مطلوب' : 'Phone required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = currentLanguage === 'ar' ? 'المبلغ مطلوب' : 'Amount required';
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
        order_type: 'local',
        customer: {
          full_name: formData.senderName,
          phone: formData.senderPhone
        },
        details: {
          senderName: formData.senderName,
          senderPhone: formData.senderPhone,
          senderProvince: formData.senderProvince,
          receiverName: formData.receiverName,
          receiverPhone: formData.receiverPhone,
          receiverProvince: formData.receiverProvince,
          amount: formData.amount,
          serviceFee: calculateFee(),
          total: calculateTotal(),
          paymentMethod: formData.paymentMethod,
          notes: formData.notes
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
      alert(currentLanguage === 'ar' ? 'حدث خطأ. حاول مرة أخرى.' : 'An error occurred.');
    }
    
    setLoading(false);
  };

  const getProvinceLabel = (value) => {
    const province = provinces.find(p => p.value === value);
    return province ? (currentLanguage === 'ar' ? province.labelAr : province.labelEn) : value;
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
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/transfers')}
            className={`flex items-center gap-2 mb-8 group ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            {currentLanguage === 'ar' ? 'العودة للتحويلات' : 'Back to Transfers'}
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
              {currentLanguage === 'ar' ? 'تحويل محلي' : 'Local Transfer'}
            </h1>
            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              {currentLanguage === 'ar' ? 'تحويل أموال داخل العراق' : 'Transfer money within Iraq'}
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
            <div className={`rounded-3xl border-2 shadow-xl p-8 mb-6 ${
              isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                  <User className="w-6 h-6 text-blue-500" />
                </div>
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {currentLanguage === 'ar' ? 'بيانات التحويل' : 'Transfer Details'}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sender Name */}
                <div className="space-y-2">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    {currentLanguage === 'ar' ? 'اسم المرسل' : 'Sender Name'} *
                  </Label>
                  <Input
                    value={formData.senderName}
                    onChange={(e) => handleInputChange('senderName', e.target.value)}
                    className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`}
                    placeholder={currentLanguage === 'ar' ? 'أدخل اسم المرسل' : 'Enter sender name'}
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
                    {currentLanguage === 'ar' ? 'اسم المستلم' : 'Receiver Name'} *
                  </Label>
                  <Input
                    value={formData.receiverName}
                    onChange={(e) => handleInputChange('receiverName', e.target.value)}
                    className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`}
                    placeholder={currentLanguage === 'ar' ? 'أدخل اسم المستلم' : 'Enter receiver name'}
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
                    {currentLanguage === 'ar' ? 'محافظة المرسل' : 'Sender Province'} *
                  </Label>
                  <Select value={formData.senderProvince} onValueChange={(v) => handleInputChange('senderProvince', v)}>
                    <SelectTrigger className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`} data-testid="sender-province-select">
                      <SelectValue placeholder={currentLanguage === 'ar' ? 'اختر المحافظة' : 'Select province'} />
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
                    {currentLanguage === 'ar' ? 'محافظة المستلم' : 'Receiver Province'} *
                  </Label>
                  <Select value={formData.receiverProvince} onValueChange={(v) => handleInputChange('receiverProvince', v)}>
                    <SelectTrigger className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`} data-testid="receiver-province-select">
                      <SelectValue placeholder={currentLanguage === 'ar' ? 'اختر المحافظة' : 'Select province'} />
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

                {/* Phone */}
                <div className="space-y-2 md:col-span-2">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    {currentLanguage === 'ar' ? 'رقم الهاتف' : 'Phone Number'} *
                  </Label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`}
                    placeholder="+964 7XX XXX XXXX"
                    data-testid="phone-input"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />{errors.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Amount & Payment */}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Amount */}
                <div className="space-y-2">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    {currentLanguage === 'ar' ? 'المبلغ (دينار عراقي)' : 'Amount (IQD)'} *
                  </Label>
                  <Input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`}
                    placeholder="1,000,000"
                    min="1"
                    data-testid="amount-input"
                  />
                  {errors.amount && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />{errors.amount}
                    </p>
                  )}
                </div>

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
                  {errors.paymentMethod && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />{errors.paymentMethod}
                    </p>
                  )}
                </div>
              </div>

              {/* Fee Summary */}
              {formData.amount && parseFloat(formData.amount) > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className={`mt-6 p-4 rounded-2xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                      {currentLanguage === 'ar' ? 'المبلغ' : 'Amount'}
                    </span>
                    <span className={`font-semibold ${isDark ? 'text-white' : ''}`}>{Number(formData.amount).toLocaleString()} {currentLanguage === 'ar' ? 'د.ع' : 'IQD'}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                      {currentLanguage === 'ar' ? `رسوم الخدمة (${serviceFeePercent}%)` : `Service Fee (${serviceFeePercent}%)`}
                    </span>
                    <span className="font-semibold text-amber-500">{Number(calculateFee()).toLocaleString()} {currentLanguage === 'ar' ? 'د.ع' : 'IQD'}</span>
                  </div>
                  <div className={`border-t pt-2 mt-2 ${isDark ? 'border-slate-600' : 'border-slate-200'}`}>
                    <div className="flex justify-between items-center">
                      <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {currentLanguage === 'ar' ? 'الإجمالي' : 'Total'}
                      </span>
                      <span className="font-bold text-lg text-emerald-500">{Number(calculateTotal()).toLocaleString()} {currentLanguage === 'ar' ? 'د.ع' : 'IQD'}</span>
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
                  {currentLanguage === 'ar' ? 'جارٍ التسجيل...' : 'Submitting...'}
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  {currentLanguage === 'ar' ? 'تسجيل طلب التحويل' : 'Submit Transfer Request'}
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
