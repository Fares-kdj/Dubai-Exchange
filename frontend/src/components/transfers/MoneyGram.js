import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { User, Phone, DollarSign, CheckCircle, AlertCircle, ArrowLeft, Upload, X, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '../home/Header';
import Footer from '../home/Footer';

const MoneyGram = () => {
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
    { value: 'pakistan', labelAr: 'باكستان', labelEn: 'Pakistan' }
  ];

  const currencies = [
    { value: 'USD', labelAr: 'دولار أمريكي', labelEn: 'US Dollar', symbol: '$' },
    { value: 'EUR', labelAr: 'يورو', labelEn: 'Euro', symbol: '€' },
    { value: 'GBP', labelAr: 'جنيه إسترليني', labelEn: 'British Pound', symbol: '£' },
    { value: 'AED', labelAr: 'درهم إماراتي', labelEn: 'UAE Dirham', symbol: 'د.إ' },
    { value: 'SAR', labelAr: 'ريال سعودي', labelEn: 'Saudi Riyal', symbol: 'ر.س' }
  ];

  const paymentMethods = [
    { value: 'cash', labelAr: 'نقداً', labelEn: 'Cash' },
    { value: 'bank_transfer', labelAr: 'تحويل بنكي', labelEn: 'Bank Transfer' },
    { value: 'card', labelAr: 'بطاقة', labelEn: 'Card' }
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
    await new Promise(resolve => setTimeout(resolve, 2000));
    navigate('/transfers/success', { 
      state: { 
        orderData: {
          ...formData,
          type: 'moneygram',
          serviceFee: calculateFee(),
          iqdAmount: calculateIQD(),
          total: calculateTotal(),
          orderId: `MG-${Date.now().toString().slice(-8)}`
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <Header />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/transfers/international')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            {currentLanguage === 'ar' ? 'العودة' : 'Back'}
          </motion.button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="w-24 h-24 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <span className="text-2xl font-black text-white">MG</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              {currentLanguage === 'ar' ? 'موني جرام' : 'MoneyGram'}
            </h1>
            <p className="text-slate-600">
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
            <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl p-8 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                  <User className="w-6 h-6 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {currentLanguage === 'ar' ? 'بيانات التحويل' : 'Transfer Details'}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>{currentLanguage === 'ar' ? 'اسم المرسل' : 'Sender Name'} *</Label>
                  <Input value={formData.senderName} onChange={(e) => handleInputChange('senderName', e.target.value)} className="h-12" data-testid="mg-sender-name" />
                  {errors.senderName && <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.senderName}</p>}
                </div>

                <div className="space-y-2">
                  <Label>{currentLanguage === 'ar' ? 'اسم المستلم' : 'Receiver Name'} *</Label>
                  <Input value={formData.receiverName} onChange={(e) => handleInputChange('receiverName', e.target.value)} className="h-12" data-testid="mg-receiver-name" />
                  {errors.receiverName && <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.receiverName}</p>}
                </div>

                <div className="space-y-2">
                  <Label>{currentLanguage === 'ar' ? 'دولة المرسل' : 'Sender Country'}</Label>
                  <Select value="iraq" disabled>
                    <SelectTrigger className="h-12 bg-slate-50"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="iraq">{currentLanguage === 'ar' ? 'العراق' : 'Iraq'}</SelectItem></SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{currentLanguage === 'ar' ? 'دولة المستلم' : 'Receiver Country'} *</Label>
                  <Select value={formData.receiverCountry} onValueChange={(v) => handleInputChange('receiverCountry', v)}>
                    <SelectTrigger className="h-12" data-testid="mg-receiver-country"><SelectValue placeholder={currentLanguage === 'ar' ? 'اختر' : 'Select'} /></SelectTrigger>
                    <SelectContent>
                      {countries.filter(c => c.value !== 'iraq').map(c => (
                        <SelectItem key={c.value} value={c.value}>{currentLanguage === 'ar' ? c.labelAr : c.labelEn}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.receiverCountry && <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.receiverCountry}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>{currentLanguage === 'ar' ? 'رقم الهاتف' : 'Phone'} *</Label>
                  <Input type="tel" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className="h-12" placeholder="+964 7XX XXX XXXX" data-testid="mg-phone" />
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
                <h2 className="text-2xl font-bold text-slate-900">{currentLanguage === 'ar' ? 'صورة الهوية' : 'ID Image'}</h2>
              </div>

              {!idImage ? (
                <label className="block border-2 border-dashed border-slate-300 rounded-2xl p-8 hover:border-orange-400 hover:bg-orange-50/50 transition-all cursor-pointer">
                  <input type="file" accept="image/*" onChange={handleIdUpload} className="hidden" data-testid="mg-id-upload" />
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-sm text-slate-600">{currentLanguage === 'ar' ? 'اضغط للرفع' : 'Click to upload'}</p>
                  </div>
                </label>
              ) : (
                <div className="border-2 border-green-200 bg-green-50 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={idImage.preview} alt="ID" className="w-16 h-16 rounded-lg object-cover" />
                    <div>
                      <p className="text-sm font-medium">{idImage.name}</p>
                      <p className="text-xs text-green-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" />{currentLanguage === 'ar' ? 'تم' : 'Done'}</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => setIdImage(null)} className="p-2 hover:bg-red-100 rounded-lg">
                    <X className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              )}
              {errors.idImage && <p className="text-sm text-red-600 flex items-center gap-1 mt-2"><AlertCircle className="w-4 h-4" />{errors.idImage}</p>}
            </div>

            {/* Amount */}
            <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl p-8 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">{currentLanguage === 'ar' ? 'المبلغ' : 'Amount'}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>{currentLanguage === 'ar' ? 'العملة' : 'Currency'} *</Label>
                  <Select value={formData.currency} onValueChange={(v) => handleInputChange('currency', v)}>
                    <SelectTrigger className="h-12" data-testid="mg-currency"><SelectValue placeholder={currentLanguage === 'ar' ? 'اختر' : 'Select'} /></SelectTrigger>
                    <SelectContent>
                      {currencies.map(c => (<SelectItem key={c.value} value={c.value}>{c.symbol} {currentLanguage === 'ar' ? c.labelAr : c.labelEn}</SelectItem>))}
                    </SelectContent>
                  </Select>
                  {errors.currency && <p className="text-sm text-red-600"><AlertCircle className="w-4 h-4 inline" /> {errors.currency}</p>}
                </div>

                <div className="space-y-2">
                  <Label>{currentLanguage === 'ar' ? 'المبلغ' : 'Amount'} *</Label>
                  <Input type="number" value={formData.amount} onChange={(e) => handleInputChange('amount', e.target.value)} className="h-12" min="1" data-testid="mg-amount" />
                  {errors.amount && <p className="text-sm text-red-600"><AlertCircle className="w-4 h-4 inline" /> {errors.amount}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>{currentLanguage === 'ar' ? 'طريقة الدفع' : 'Payment Method'} *</Label>
                  <Select value={formData.paymentMethod} onValueChange={(v) => handleInputChange('paymentMethod', v)}>
                    <SelectTrigger className="h-12" data-testid="mg-payment"><SelectValue placeholder={currentLanguage === 'ar' ? 'اختر' : 'Select'} /></SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map(m => (<SelectItem key={m.value} value={m.value}>{currentLanguage === 'ar' ? m.labelAr : m.labelEn}</SelectItem>))}
                    </SelectContent>
                  </Select>
                  {errors.paymentMethod && <p className="text-sm text-red-600"><AlertCircle className="w-4 h-4 inline" /> {errors.paymentMethod}</p>}
                </div>
              </div>

              {formData.amount && formData.currency && parseFloat(formData.amount) > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-2xl">
                  <h4 className="font-bold text-orange-900 mb-3">{currentLanguage === 'ar' ? 'ملخص' : 'Summary'}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span>{currentLanguage === 'ar' ? 'المبلغ' : 'Amount'}</span><span className="font-semibold">{formData.amount} {formData.currency}</span></div>
                    <div className="flex justify-between"><span>{currentLanguage === 'ar' ? 'بالدينار' : 'In IQD'}</span><span className="font-semibold">{calculateIQD().toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>{currentLanguage === 'ar' ? 'الرسوم' : 'Fee'}</span><span className="text-amber-600 font-semibold">{calculateFee().toLocaleString()}</span></div>
                    <div className="border-t pt-2"><div className="flex justify-between font-bold"><span>{currentLanguage === 'ar' ? 'الإجمالي' : 'Total'}</span><span className="text-orange-600">{calculateTotal().toLocaleString()} IQD</span></div></div>
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

      <Footer />
    </div>
  );
};

export default MoneyGram;
