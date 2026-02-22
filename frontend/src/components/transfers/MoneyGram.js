import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { User, Phone, DollarSign, CheckCircle, AlertCircle, ArrowLeft, Upload, X, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header3D from '../landing/Header3D';
import Footer3D from '../landing/Footer3D';

const MoneyGram = () => {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const { isDark } = useTheme();
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
    { value: 'pakistan', labelAr: 'باكستان', labelEn: 'Pakistan' }
  ];

  const currencies = [
    { value: 'USD', labelAr: 'دولار أمريكي', labelEn: 'US Dollar', symbol: '$' },
    { value: 'EUR', labelAr: 'يورو', labelEn: 'Euro', symbol: '€' },
    { value: 'GBP', labelAr: 'جنيه إسترليني', labelEn: 'British Pound', symbol: '£' },
    { value: 'AED', labelAr: 'درهم إماراتي', labelEn: 'UAE Dirham', symbol: 'د.إ' },
    { value: 'SAR', labelAr: 'ريال سعودي', labelEn: 'Saudi Riyal', symbol: 'ر.س' }
  ];

  // Unified payment methods
  const paymentMethods = [
    { value: 'zain_cash', labelAr: 'زين كاش', labelEn: 'Zain Cash', labelKu: 'زەین کاش' },
    { value: 'mastercard_rafidain', labelAr: 'ماستركارد الرافدين', labelEn: 'Mastercard Al-Rafidain', labelKu: 'ماستەرکارد الڕافدین' },
    { value: 'fib', labelAr: 'FIB', labelEn: 'FIB', labelKu: 'FIB' }
  ];

  const exchangeRates = { USD: 1500, EUR: 1600, GBP: 1900, AED: 410, SAR: 400 };
  const serviceFeePercent = 2;

  const calculateIQD = () => {
    if (!formData.amount || !formData.currency) return 0;
    return Math.round(parseFloat(formData.amount) * (exchangeRates[formData.currency] || 1));
  };

  const calculateFee = () => Math.round(calculateIQD() * serviceFeePercent / 100);
  const calculateTotal = () => calculateIQD() + calculateFee();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleIdUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, idImage: currentLanguage === 'ar' ? 'حجم الملف كبير' : 'File too large' }));
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
    if (!formData.senderName.trim()) newErrors.senderName = currentLanguage === 'ar' ? 'مطلوب' : 'Required';
    if (!formData.receiverName.trim()) newErrors.receiverName = currentLanguage === 'ar' ? 'مطلوب' : 'Required';
    if (!formData.receiverCountry) newErrors.receiverCountry = currentLanguage === 'ar' ? 'مطلوب' : 'Required';
    if (!formData.phone.trim()) newErrors.phone = currentLanguage === 'ar' ? 'مطلوب' : 'Required';
    if (!formData.currency) newErrors.currency = currentLanguage === 'ar' ? 'مطلوب' : 'Required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = currentLanguage === 'ar' ? 'مطلوب' : 'Required';
    if (!formData.paymentMethod) newErrors.paymentMethod = currentLanguage === 'ar' ? 'مطلوب' : 'Required';
    if (!idImage) newErrors.idImage = currentLanguage === 'ar' ? 'مطلوب' : 'Required';
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
      const documents = [];
      if (formData.idFile) {
        const idForm = new FormData();
        idForm.append('file', formData.idFile);
        idForm.append('order_type', 'moneygram');
        idForm.append('doc_type', 'id');
        const idRes = await fetch(`${API_URL}/api/orders/upload-document`, { method: 'POST', body: idForm });
        if (idRes.ok) documents.push(await idRes.json());
      }
      
      const orderData = {
        order_type: 'moneygram',
        customer: { full_name: formData.senderName, phone: formData.phone },
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
              type: 'moneygram',
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
      alert(currentLanguage === 'ar' ? 'حدث خطأ' : 'Error');
    }
    setLoading(false);
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
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/transfers/international')}
            className={`flex items-center gap-2 mb-8 group ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            {currentLanguage === 'ar' ? 'العودة' : 'Back'}
          </motion.button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="w-24 h-24 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <span className="text-2xl font-black text-white">MG</span>
            </div>
            <h1 className={`text-3xl md:text-4xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {currentLanguage === 'ar' ? 'موني جرام' : 'MoneyGram'}
            </h1>
            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              {currentLanguage === 'ar' ? 'تحويل دولي سريع وآمن' : 'Fast and secure international transfer'}
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="max-w-3xl mx-auto"
            data-testid="moneygram-form"
          >
            {/* Sender & Receiver */}
            <div className={`rounded-3xl border-2 shadow-xl p-8 mb-6 ${
              isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-orange-500/20' : 'bg-orange-100'}`}>
                  <User className="w-6 h-6 text-orange-600" />
                </div>
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {currentLanguage === 'ar' ? 'بيانات التحويل' : 'Transfer Details'}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>{currentLanguage === 'ar' ? 'اسم المرسل' : 'Sender Name'} *</Label>
                  <Input value={formData.senderName} onChange={(e) => handleInputChange('senderName', e.target.value)} className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`} data-testid="mg-sender-name" />
                  {errors.senderName && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.senderName}</p>}
                </div>

                <div className="space-y-2">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>{currentLanguage === 'ar' ? 'اسم المستلم' : 'Receiver Name'} *</Label>
                  <Input value={formData.receiverName} onChange={(e) => handleInputChange('receiverName', e.target.value)} className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`} data-testid="mg-receiver-name" />
                  {errors.receiverName && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.receiverName}</p>}
                </div>

                <div className="space-y-2">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>{currentLanguage === 'ar' ? 'دولة المرسل' : 'Sender Country'}</Label>
                  <Select value="iraq" disabled>
                    <SelectTrigger className={`h-12 ${isDark ? 'bg-slate-600 border-slate-500 text-white' : 'bg-slate-50 border-slate-300'}`}><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="iraq">{currentLanguage === 'ar' ? 'العراق' : 'Iraq'}</SelectItem></SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>{currentLanguage === 'ar' ? 'دولة المستلم' : 'Receiver Country'} *</Label>
                  <Select value={formData.receiverCountry} onValueChange={(v) => handleInputChange('receiverCountry', v)}>
                    <SelectTrigger className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`} data-testid="mg-receiver-country"><SelectValue placeholder={currentLanguage === 'ar' ? 'اختر' : 'Select'} /></SelectTrigger>
                    <SelectContent>
                      {countries.filter(c => c.value !== 'iraq').map(c => (
                        <SelectItem key={c.value} value={c.value}>{currentLanguage === 'ar' ? c.labelAr : c.labelEn}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.receiverCountry && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.receiverCountry}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>{currentLanguage === 'ar' ? 'رقم الهاتف' : 'Phone'} *</Label>
                  <Input type="tel" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`} placeholder="+964 7XX XXX XXXX" data-testid="mg-phone" />
                  {errors.phone && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* ID Upload */}
            <div className={`rounded-3xl border-2 shadow-xl p-8 mb-6 ${
              isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{currentLanguage === 'ar' ? 'صورة الهوية' : 'ID Image'}</h2>
              </div>

              {!idImage ? (
                <label className={`block border-2 border-dashed rounded-2xl p-8 hover:border-orange-400 transition-all cursor-pointer ${isDark ? 'border-slate-600 hover:bg-orange-500/10' : 'border-slate-300 hover:bg-orange-50/50'}`}>
                  <input type="file" accept="image/*" onChange={handleIdUpload} className="hidden" data-testid="mg-id-upload" />
                  <div className="text-center">
                    <Upload className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{currentLanguage === 'ar' ? 'اضغط للرفع' : 'Click to upload'}</p>
                  </div>
                </label>
              ) : (
                <div className="border-2 border-green-200 bg-green-50 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={idImage.preview} alt="ID" className="w-16 h-16 rounded-lg object-cover" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{idImage.name}</p>
                      <p className="text-xs text-green-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" />{currentLanguage === 'ar' ? 'تم' : 'Done'}</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => setIdImage(null)} className="p-2 hover:bg-red-100 rounded-lg">
                    <X className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              )}
              {errors.idImage && <p className="text-sm text-red-500 flex items-center gap-1 mt-2"><AlertCircle className="w-4 h-4" />{errors.idImage}</p>}
            </div>

            {/* Amount */}
            <div className={`rounded-3xl border-2 shadow-xl p-8 mb-6 ${
              isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                  <DollarSign className="w-6 h-6 text-emerald-600" />
                </div>
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{currentLanguage === 'ar' ? 'المبلغ' : 'Amount'}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>{currentLanguage === 'ar' ? 'العملة' : 'Currency'} *</Label>
                  <Select value={formData.currency} onValueChange={(v) => handleInputChange('currency', v)}>
                    <SelectTrigger className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`} data-testid="mg-currency"><SelectValue placeholder={currentLanguage === 'ar' ? 'اختر' : 'Select'} /></SelectTrigger>
                    <SelectContent>
                      {currencies.map(c => (<SelectItem key={c.value} value={c.value}>{c.symbol} {currentLanguage === 'ar' ? c.labelAr : c.labelEn}</SelectItem>))}
                    </SelectContent>
                  </Select>
                  {errors.currency && <p className="text-sm text-red-500"><AlertCircle className="w-4 h-4 inline" /> {errors.currency}</p>}
                </div>

                <div className="space-y-2">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>{currentLanguage === 'ar' ? 'المبلغ' : 'Amount'} *</Label>
                  <Input type="number" value={formData.amount} onChange={(e) => handleInputChange('amount', e.target.value)} className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`} min="1" data-testid="mg-amount" />
                  {errors.amount && <p className="text-sm text-red-500"><AlertCircle className="w-4 h-4 inline" /> {errors.amount}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>{currentLanguage === 'ar' ? 'طريقة الدفع' : 'Payment Method'} *</Label>
                  <Select value={formData.paymentMethod} onValueChange={(v) => handleInputChange('paymentMethod', v)}>
                    <SelectTrigger className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`} data-testid="mg-payment"><SelectValue placeholder={currentLanguage === 'ar' ? 'اختر' : 'Select'} /></SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map(m => (<SelectItem key={m.value} value={m.value}>{currentLanguage === 'ar' ? m.labelAr : m.labelEn}</SelectItem>))}
                    </SelectContent>
                  </Select>
                  {errors.paymentMethod && <p className="text-sm text-red-500"><AlertCircle className="w-4 h-4 inline" /> {errors.paymentMethod}</p>}
                </div>
              </div>

              {formData.amount && formData.currency && parseFloat(formData.amount) > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`mt-6 p-4 rounded-2xl ${isDark ? 'bg-orange-900/30 border border-orange-700/50' : 'bg-orange-50 border border-orange-200'}`}>
                  <h4 className={`font-bold mb-3 ${isDark ? 'text-orange-300' : 'text-orange-900'}`}>{currentLanguage === 'ar' ? 'ملخص' : 'Summary'}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className={isDark ? 'text-orange-200' : 'text-orange-800'}>{currentLanguage === 'ar' ? 'المبلغ' : 'Amount'}</span><span className={`font-semibold ${isDark ? 'text-white' : ''}`}>{formData.amount} {formData.currency}</span></div>
                    <div className="flex justify-between"><span className={isDark ? 'text-orange-200' : 'text-orange-800'}>{currentLanguage === 'ar' ? 'بالدينار' : 'In IQD'}</span><span className={`font-semibold ${isDark ? 'text-white' : ''}`}>{calculateIQD().toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className={isDark ? 'text-orange-200' : 'text-orange-800'}>{currentLanguage === 'ar' ? `الرسوم (${serviceFeePercent}%)` : `Fee (${serviceFeePercent}%)`}</span><span className="text-amber-500 font-semibold">{calculateFee().toLocaleString()}</span></div>
                    <div className={`border-t pt-2 ${isDark ? 'border-orange-700/50' : 'border-orange-200'}`}><div className="flex justify-between font-bold"><span className={isDark ? 'text-white' : 'text-orange-900'}>{currentLanguage === 'ar' ? 'الإجمالي' : 'Total'}</span><span className="text-orange-500">{calculateTotal().toLocaleString()} {currentLanguage === 'ar' ? 'د.ع' : 'IQD'}</span></div></div>
                  </div>
                </motion.div>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              data-testid="submit-mg"
              className="w-full py-5 bg-orange-500 text-white font-bold rounded-2xl shadow-xl hover:bg-orange-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />{currentLanguage === 'ar' ? 'جارٍ...' : 'Submitting...'}</>
              ) : (
                <><CheckCircle className="w-5 h-5" />{currentLanguage === 'ar' ? 'تسجيل الطلب' : 'Submit Request'}</>
              )}
            </motion.button>
          </motion.form>
        </div>
      </main>

      <Footer3D />
    </div>
  );
};

export default MoneyGram;
