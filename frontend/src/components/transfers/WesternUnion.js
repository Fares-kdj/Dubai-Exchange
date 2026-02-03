import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { User, Phone, DollarSign, CreditCard, CheckCircle, AlertCircle, ArrowLeft, Upload, X, Globe, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '../home/Header';
import Footer from '../home/Footer';

const WesternUnion = () => {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [idImage, setIdImage] = useState(null);

  const [formData, setFormData] = useState({
    senderName: '',
    receiverName: '',
    senderCountry: 'iraq',
    receiverCountry: '',
    phone: '',
    currency: '',
    amount: '',
    paymentMethod: ''
  });

  const countries = [
    { value: 'iraq', labelAr: 'العراق', labelEn: 'Iraq' },
    { value: 'uae', labelAr: 'الإمارات', labelEn: 'UAE' },
    { value: 'saudi', labelAr: 'السعودية', labelEn: 'Saudi Arabia' },
    { value: 'jordan', labelAr: 'الأردن', labelEn: 'Jordan' },
    { value: 'egypt', labelAr: 'مصر', labelEn: 'Egypt' },
    { value: 'turkey', labelAr: 'تركيا', labelEn: 'Turkey' },
    { value: 'usa', labelAr: 'الولايات المتحدة', labelEn: 'United States' },
    { value: 'uk', labelAr: 'بريطانيا', labelEn: 'United Kingdom' },
    { value: 'germany', labelAr: 'ألمانيا', labelEn: 'Germany' },
    { value: 'france', labelAr: 'فرنسا', labelEn: 'France' },
    { value: 'canada', labelAr: 'كندا', labelEn: 'Canada' },
    { value: 'australia', labelAr: 'أستراليا', labelEn: 'Australia' },
    { value: 'india', labelAr: 'الهند', labelEn: 'India' },
    { value: 'pakistan', labelAr: 'باكستان', labelEn: 'Pakistan' },
    { value: 'lebanon', labelAr: 'لبنان', labelEn: 'Lebanon' },
    { value: 'syria', labelAr: 'سوريا', labelEn: 'Syria' }
  ];

  const currencies = [
    { value: 'USD', labelAr: 'دولار أمريكي', labelEn: 'US Dollar', symbol: '$' },
    { value: 'EUR', labelAr: 'يورو', labelEn: 'Euro', symbol: '€' },
    { value: 'GBP', labelAr: 'جنيه إسترليني', labelEn: 'British Pound', symbol: '£' },
    { value: 'AED', labelAr: 'درهم إماراتي', labelEn: 'UAE Dirham', symbol: 'د.إ' },
    { value: 'SAR', labelAr: 'ريال سعودي', labelEn: 'Saudi Riyal', symbol: 'ر.س' },
    { value: 'TRY', labelAr: 'ليرة تركية', labelEn: 'Turkish Lira', symbol: '₺' }
  ];

  const paymentMethods = [
    { value: 'cash', labelAr: 'نقداً', labelEn: 'Cash' },
    { value: 'bank_transfer', labelAr: 'تحويل بنكي', labelEn: 'Bank Transfer' },
    { value: 'card', labelAr: 'بطاقة', labelEn: 'Card' }
  ];

  // Exchange rates (mock - should come from API)
  const exchangeRates = {
    USD: 1500,
    EUR: 1600,
    GBP: 1900,
    AED: 410,
    SAR: 400,
    TRY: 45
  };

  const serviceFeePercent = 2;

  const calculateIQD = () => {
    if (!formData.amount || !formData.currency) return 0;
    const rate = exchangeRates[formData.currency] || 1;
    return Math.round(parseFloat(formData.amount) * rate);
  };

  const calculateFee = () => {
    const iqd = calculateIQD();
    return Math.round(iqd * serviceFeePercent / 100);
  };

  const calculateTotal = () => {
    return calculateIQD() + calculateFee();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleIdUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, idImage: currentLanguage === 'ar' ? 'حجم الملف كبير جداً' : 'File too large' }));
        return;
      }
      setFormData(prev => ({ ...prev, idFile: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdImage({ name: file.name, preview: reader.result });
        setErrors(prev => ({ ...prev, idImage: '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.senderName.trim()) newErrors.senderName = currentLanguage === 'ar' ? 'اسم المرسل مطلوب' : 'Sender name required';
    if (!formData.receiverName.trim()) newErrors.receiverName = currentLanguage === 'ar' ? 'اسم المستلم مطلوب' : 'Receiver name required';
    if (!formData.receiverCountry) newErrors.receiverCountry = currentLanguage === 'ar' ? 'دولة المستلم مطلوبة' : 'Receiver country required';
    if (!formData.phone.trim()) newErrors.phone = currentLanguage === 'ar' ? 'رقم الهاتف مطلوب' : 'Phone required';
    if (!formData.currency) newErrors.currency = currentLanguage === 'ar' ? 'العملة مطلوبة' : 'Currency required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = currentLanguage === 'ar' ? 'المبلغ مطلوب' : 'Amount required';
    if (!formData.paymentMethod) newErrors.paymentMethod = currentLanguage === 'ar' ? 'طريقة الدفع مطلوبة' : 'Payment method required';
    if (!idImage) newErrors.idImage = currentLanguage === 'ar' ? 'صورة الهوية مطلوبة' : 'ID image required';

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
      // Upload ID document
      const documents = [];
      if (formData.idFile) {
        const idForm = new FormData();
        idForm.append('file', formData.idFile);
        idForm.append('order_type', 'western_union');
        idForm.append('doc_type', 'id');
        const idRes = await fetch(`${API_URL}/api/orders/upload-document`, { method: 'POST', body: idForm });
        if (idRes.ok) documents.push(await idRes.json());
      }
      
      const orderData = {
        order_type: 'western_union',
        customer: {
          full_name: formData.senderName,
          phone: formData.phone
        },
        details: {
          senderName: formData.senderName,
          senderCountry: formData.senderCountry,
          receiverName: formData.receiverName,
          receiverCountry: formData.receiverCountry,
          currency: formData.currency,
          amount: formData.amount,
          iqdAmount: calculateIQD(),
          serviceFee: calculateFee(),
          total: calculateTotal(),
          paymentMethod: formData.paymentMethod
        },
        documents: documents
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
              type: 'western_union',
              serviceFee: calculateFee(),
              iqdAmount: calculateIQD(),
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <Header />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/transfers/international')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            {currentLanguage === 'ar' ? 'العودة للتحويل الدولي' : 'Back to International'}
          </motion.button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-24 h-24 bg-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <span className="text-3xl font-black text-black">WU</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              {currentLanguage === 'ar' ? 'ويسترن يونيون' : 'Western Union'}
            </h1>
            <p className="text-slate-600">
              {currentLanguage === 'ar' ? 'تحويل دولي سريع وموثوق' : 'Fast and reliable international transfer'}
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="max-w-3xl mx-auto"
            data-testid="western-union-form"
          >
            {/* Sender & Receiver Info */}
            <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl p-8 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {currentLanguage === 'ar' ? 'بيانات المرسل والمستلم' : 'Sender & Receiver Details'}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">
                    {currentLanguage === 'ar' ? 'اسم المرسل' : 'Sender Name'} *
                  </Label>
                  <Input
                    value={formData.senderName}
                    onChange={(e) => handleInputChange('senderName', e.target.value)}
                    className="h-12 border-slate-300"
                    placeholder={currentLanguage === 'ar' ? 'الاسم كما في الهوية' : 'Name as on ID'}
                    data-testid="sender-name"
                  />
                  {errors.senderName && <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.senderName}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">
                    {currentLanguage === 'ar' ? 'اسم المستلم' : 'Receiver Name'} *
                  </Label>
                  <Input
                    value={formData.receiverName}
                    onChange={(e) => handleInputChange('receiverName', e.target.value)}
                    className="h-12 border-slate-300"
                    placeholder={currentLanguage === 'ar' ? 'الاسم كما في الهوية' : 'Name as on ID'}
                    data-testid="receiver-name"
                  />
                  {errors.receiverName && <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.receiverName}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">
                    {currentLanguage === 'ar' ? 'دولة المرسل' : 'Sender Country'}
                  </Label>
                  <Select value={formData.senderCountry} disabled>
                    <SelectTrigger className="h-12 border-slate-300 bg-slate-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="iraq">{currentLanguage === 'ar' ? 'العراق' : 'Iraq'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">
                    {currentLanguage === 'ar' ? 'دولة المستلم' : 'Receiver Country'} *
                  </Label>
                  <Select value={formData.receiverCountry} onValueChange={(v) => handleInputChange('receiverCountry', v)}>
                    <SelectTrigger className="h-12 border-slate-300" data-testid="receiver-country">
                      <SelectValue placeholder={currentLanguage === 'ar' ? 'اختر الدولة' : 'Select country'} />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.filter(c => c.value !== 'iraq').map(c => (
                        <SelectItem key={c.value} value={c.value}>
                          {currentLanguage === 'ar' ? c.labelAr : c.labelEn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.receiverCountry && <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.receiverCountry}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-slate-700 font-medium">
                    {currentLanguage === 'ar' ? 'رقم الهاتف' : 'Phone Number'} *
                  </Label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="h-12 border-slate-300"
                    placeholder="+964 7XX XXX XXXX"
                    data-testid="phone"
                  />
                  {errors.phone && <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* ID Upload */}
            <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl p-8 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {currentLanguage === 'ar' ? 'صورة الهوية' : 'ID Image'}
                </h2>
              </div>

              {!idImage ? (
                <label className="block border-2 border-dashed border-slate-300 rounded-2xl p-8 hover:border-yellow-400 hover:bg-yellow-50/50 transition-all cursor-pointer">
                  <input type="file" accept="image/*" onChange={handleIdUpload} className="hidden" data-testid="id-upload" />
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-sm text-slate-600 mb-1">
                      {currentLanguage === 'ar' ? 'اضغط لرفع صورة الهوية' : 'Click to upload ID image'}
                    </p>
                    <p className="text-xs text-slate-400">PNG, JPG (max 5MB)</p>
                  </div>
                </label>
              ) : (
                <div className="border-2 border-green-200 bg-green-50 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={idImage.preview} alt="ID" className="w-16 h-16 rounded-lg object-cover" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{idImage.name}</p>
                      <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                        <CheckCircle className="w-3 h-3" />
                        {currentLanguage === 'ar' ? 'تم الرفع' : 'Uploaded'}
                      </p>
                    </div>
                  </div>
                  <button type="button" onClick={() => setIdImage(null)} className="p-2 hover:bg-red-100 rounded-lg">
                    <X className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              )}
              {errors.idImage && <p className="text-sm text-red-600 flex items-center gap-1 mt-2"><AlertCircle className="w-4 h-4" />{errors.idImage}</p>}
            </div>

            {/* Amount & Currency */}
            <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl p-8 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {currentLanguage === 'ar' ? 'المبلغ والعملة' : 'Amount & Currency'}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">
                    {currentLanguage === 'ar' ? 'العملة' : 'Currency'} *
                  </Label>
                  <Select value={formData.currency} onValueChange={(v) => handleInputChange('currency', v)}>
                    <SelectTrigger className="h-12 border-slate-300" data-testid="currency-select">
                      <SelectValue placeholder={currentLanguage === 'ar' ? 'اختر العملة' : 'Select currency'} />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map(c => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.symbol} {currentLanguage === 'ar' ? c.labelAr : c.labelEn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.currency && <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.currency}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">
                    {currentLanguage === 'ar' ? 'المبلغ' : 'Amount'} *
                  </Label>
                  <Input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    className="h-12 border-slate-300"
                    placeholder="1000"
                    min="1"
                    data-testid="amount"
                  />
                  {errors.amount && <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.amount}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-slate-700 font-medium">
                    {currentLanguage === 'ar' ? 'طريقة الدفع' : 'Payment Method'} *
                  </Label>
                  <Select value={formData.paymentMethod} onValueChange={(v) => handleInputChange('paymentMethod', v)}>
                    <SelectTrigger className="h-12 border-slate-300" data-testid="payment-method">
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
                  {errors.paymentMethod && <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.paymentMethod}</p>}
                </div>
              </div>

              {/* Summary */}
              {formData.amount && formData.currency && parseFloat(formData.amount) > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl"
                >
                  <h4 className="font-bold text-yellow-900 mb-3">
                    {currentLanguage === 'ar' ? 'ملخص التحويل' : 'Transfer Summary'}
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-yellow-800">{currentLanguage === 'ar' ? 'المبلغ المرسل' : 'Amount to Send'}</span>
                      <span className="font-semibold">{formData.amount} {formData.currency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-yellow-800">{currentLanguage === 'ar' ? 'المقابل بالدينار' : 'Amount in IQD'}</span>
                      <span className="font-semibold">{calculateIQD().toLocaleString()} {currentLanguage === 'ar' ? 'د.ع' : 'IQD'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-yellow-800">{currentLanguage === 'ar' ? `رسوم الخدمة (${serviceFeePercent}%)` : `Service Fee (${serviceFeePercent}%)`}</span>
                      <span className="font-semibold text-amber-600">{calculateFee().toLocaleString()} {currentLanguage === 'ar' ? 'د.ع' : 'IQD'}</span>
                    </div>
                    <div className="border-t border-yellow-300 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-bold text-yellow-900">{currentLanguage === 'ar' ? 'الإجمالي للدفع' : 'Total to Pay'}</span>
                        <span className="font-bold text-lg text-yellow-700">{calculateTotal().toLocaleString()} {currentLanguage === 'ar' ? 'د.ع' : 'IQD'}</span>
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
              data-testid="submit-wu"
              className="w-full py-5 bg-yellow-400 text-black font-bold rounded-2xl shadow-xl hover:bg-yellow-500 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
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

      <Footer />
    </div>
  );
};

export default WesternUnion;
