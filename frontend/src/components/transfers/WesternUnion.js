import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { User, Phone, DollarSign, CreditCard, CheckCircle, AlertCircle, ArrowLeft, Upload, X, Globe, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header3D from '../landing/Header3D';
import Footer3D from '../landing/Footer3D';

const WesternUnion = () => {
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
  const [idImage, setIdImage] = useState(null);

  const [formData, setFormData] = useState({
    senderName: '',
    senderAddress: '',
    senderPhone: '',
    receiverName: '',
    receiverAddress: '',
    receiverPhone: '',
    senderCountry: 'iraq',
    receiverCountry: '',
    idType: '',
    currency: '',
    amount: '',
    paymentMethod: '',
    purpose: ''
  });

  const countries = [
    { value: 'iraq', labelAr: 'العراق', labelEn: 'Iraq', labelKu: 'عێراق' },
    { value: 'uae', labelAr: 'الإمارات', labelEn: 'UAE', labelKu: 'ئیمارات' },
    { value: 'saudi', labelAr: 'السعودية', labelEn: 'Saudi Arabia', labelKu: 'سعودیە' },
    { value: 'jordan', labelAr: 'الأردن', labelEn: 'Jordan', labelKu: 'ئوردن' },
    { value: 'egypt', labelAr: 'مصر', labelEn: 'Egypt', labelKu: 'میسر' },
    { value: 'turkey', labelAr: 'تركيا', labelEn: 'Turkey', labelKu: 'تورکیا' },
    { value: 'usa', labelAr: 'الولايات المتحدة', labelEn: 'United States', labelKu: 'ئەمریکا' },
    { value: 'uk', labelAr: 'بريطانيا', labelEn: 'United Kingdom', labelKu: 'بەریتانیا' },
    { value: 'germany', labelAr: 'ألمانيا', labelEn: 'Germany', labelKu: 'ئەڵمانیا' },
    { value: 'france', labelAr: 'فرنسا', labelEn: 'France', labelKu: 'فەڕەنسا' },
    { value: 'canada', labelAr: 'كندا', labelEn: 'Canada', labelKu: 'کەنەدا' },
    { value: 'australia', labelAr: 'أستراليا', labelEn: 'Australia', labelKu: 'ئوستورالیا' },
    { value: 'india', labelAr: 'الهند', labelEn: 'India', labelKu: 'هیندستان' },
    { value: 'pakistan', labelAr: 'باكستان', labelEn: 'Pakistan', labelKu: 'پاکستان' },
    { value: 'lebanon', labelAr: 'لبنان', labelEn: 'Lebanon', labelKu: 'لوبنان' },
    { value: 'syria', labelAr: 'سوريا', labelEn: 'Syria', labelKu: 'سوریا' }
  ];

  const currencies = [
    { value: 'USD', labelAr: 'دولار أمريكي', labelEn: 'US Dollar', symbol: '$', labelKu: 'دۆلاری ئەمریکی' },
    { value: 'EUR', labelAr: 'يورو', labelEn: 'Euro', symbol: '€', labelKu: 'یۆرۆ' },
    { value: 'GBP', labelAr: 'جنيه إسترليني', labelEn: 'British Pound', symbol: '£', labelKu: 'پاوەندی بەریتانی' },
    { value: 'AED', labelAr: 'درهم إماراتي', labelEn: 'UAE Dirham', symbol: 'د.إ', labelKu: 'درهەمی ئیماراتی' },
    { value: 'SAR', labelAr: 'ريال سعودي', labelEn: 'Saudi Riyal', symbol: 'ر.س', labelKu: 'ڕیاڵی سعودی' },
    { value: 'TRY', labelAr: 'ليرة تركية', labelEn: 'Turkish Lira', symbol: '₺', labelKu: 'لیرەی تورکی' }
  ];

  const paymentMethods = [
    { value: 'zain_cash', labelAr: 'زين كاش', labelEn: 'Zain Cash', labelKu: 'زەین کاش' },
    { value: 'mastercard_rafidain', labelAr: 'ماستركارد الرافدين', labelEn: 'Mastercard Al-Rafidain', labelKu: 'ماستەرکارد الڕافدین' },
    { value: 'fib', labelAr: 'FIB', labelEn: 'FIB', labelKu: 'FIB' }
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

  const calculateExchangeRateToUSD = () => {
    if (!formData.currency) return 1;
    if (formData.currency === 'USD') return 1;
    const rateToIQD = exchangeRates[formData.currency] || 1;
    const usdToIQD = exchangeRates['USD'] || 1500;
    return rateToIQD / usdToIQD;
  };

  const calculateUSDAmount = () => {
    if (!formData.amount || !formData.currency) return 0;
    const rate = calculateExchangeRateToUSD();
    return parseFloat(formData.amount) * rate;
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
        setErrors(prev => ({ ...prev, idImage: t('حجم الملف كبير جداً', 'File too large', 'قەبارەی فایلەکە زۆر گەورەیە') }));
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
    if (!formData.senderName.trim()) newErrors.senderName = t('اسم المرسل مطلوب', 'Sender name required', 'ناوی نێرەر پێویستە');
    if (!formData.senderPhone.trim()) newErrors.senderPhone = t('رقم هاتف المرسل مطلوب', 'Sender phone required', 'مۆبایلی نێرەر پێویستە');
    if (!formData.receiverName.trim()) newErrors.receiverName = t('اسم المستلم مطلوب', 'Receiver name required', 'ناوی وەرگر پێویستە');
    if (!formData.receiverCountry) newErrors.receiverCountry = t('دولة المستلم مطلوبة', 'Receiver country required', 'وڵاتی وەرگر پێویستە');
    if (!formData.currency) newErrors.currency = t('العملة مطلوبة', 'Currency required', 'دراو پێویستە');
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = t('المبلغ مطلوب', 'Amount required', 'بڕ پێویستە');
    if (!formData.paymentMethod) newErrors.paymentMethod = t('طريقة الدفع مطلوبة', 'Payment method required', 'شێوازى پارەدان پێویستە');
    if (!formData.idType) newErrors.idType = t('نوع الهوية مطلوب', 'ID type required', 'جۆری ناسنامە پێویستە');
    if (!idImage) newErrors.idImage = t('صورة الهوية مطلوبة', 'ID image required', 'وێنەی ناسنامە پێویستە');

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
          phone: formData.senderPhone
        },
        details: {
          senderName: formData.senderName,
          senderAddress: formData.senderAddress,
          senderPhone: formData.senderPhone,
          senderCountry: formData.senderCountry,
          receiverName: formData.receiverName,
          receiverAddress: formData.receiverAddress,
          receiverPhone: formData.receiverPhone,
          receiverCountry: formData.receiverCountry,
          idType: formData.idType,
          currency: formData.currency,
          amount: formData.amount,
          exchangeRateUSD: calculateExchangeRateToUSD(),
          usdAmount: calculateUSDAmount(),
          iqdAmount: calculateIQD(),
          serviceFee: calculateFee(),
          total: calculateTotal(),
          paymentMethod: formData.paymentMethod,
          ...(formData.purpose ? { purpose: formData.purpose } : {})
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
      toast.error(t('حدث خطأ أثناء المحاولة', 'Error occurred', 'هەڵەیەک ڕوویدا'));
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
            onClick={() => navigate('/transfers/international')}
            className={`flex items-center gap-2 mb-8 group ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            {t('العودة للتحويل الدولي', 'Back to International', 'گەڕانەوە بۆ گواستنەوەی نێودەوڵەتی')}
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
            <h1 className={`text-3xl md:text-4xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t('ويسترن يونيون', 'Western Union', 'وێستەرن یونن')}
            </h1>
            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              {t('تحويل دولي سريع وموثوق', 'Fast and reliable international transfer', 'گواستنەوەی نێودەوڵەتی خێرا و جێی متمانە')}
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
            <div className={`rounded-3xl border-2 shadow-xl p-8 mb-6 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
              }`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                  <User className="w-6 h-6 text-blue-500" />
                </div>
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {t('بيانات المرسل والمستلم', 'Sender & Receiver Details', 'زانیاری نێرەر و وەرگر')}
                </h2>
              </div>

              {/* Sender Section */}
              <div className="mb-6">
                <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-yellow-300' : 'text-slate-700'}`}>{t('بيانات المرسل', 'Sender Details', 'زانیاری نێرەر')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                      {t('اسم المرسل', 'Sender Name', 'ناوی نێرەر')} *
                    </Label>
                    <Input
                      value={formData.senderName}
                      onChange={(e) => handleInputChange('senderName', e.target.value)}
                      className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`}
                      placeholder={t('الاسم كما في الهوية', 'Name as on ID', 'ناو وەک لە ناسنامەدا هەیە')}
                      data-testid="sender-name"
                    />
                    {errors.senderName && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.senderName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                      {t('رقم هاتف المرسل', 'Sender Phone', 'مۆبایلی نێرەر')} *
                    </Label>
                    <Input
                      type="tel"
                      value={formData.senderPhone}
                      onChange={(e) => handleInputChange('senderPhone', e.target.value)}
                      className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`}
                      placeholder="+964 7XX XXX XXXX"
                      data-testid="sender-phone"
                    />
                    {errors.senderPhone && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.senderPhone}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                      {t('عنوان المرسل', 'Sender Address', 'ناونیشانی نێرەر')}
                    </Label>
                    <Input
                      value={formData.senderAddress}
                      onChange={(e) => handleInputChange('senderAddress', e.target.value)}
                      className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`}
                      placeholder={t('العنوان التفصيلي', 'Detailed address', 'ناونیشانی تەواو')}
                      data-testid="sender-address"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                      {t('دولة المرسل', 'Sender Country', 'وڵاتی نێرەر')}
                    </Label>
                    <Select value={formData.senderCountry} disabled>
                      <SelectTrigger className={`h-12 ${isDark ? 'bg-slate-600 border-slate-500 text-white' : 'bg-slate-50 border-slate-300'}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="iraq">{t('العراق', 'Iraq', 'عێراق')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className={`border-t my-4 ${isDark ? 'border-slate-600' : 'border-slate-200'}`} />

              {/* Receiver Section */}
              <div>
                <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-yellow-300' : 'text-slate-700'}`}>{t('بيانات المستلم', 'Receiver Details', 'زانیاری وەرگر')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                      {t('اسم المستلم', 'Receiver Name', 'ناوی وەرگر')} *
                    </Label>
                    <Input
                      value={formData.receiverName}
                      onChange={(e) => handleInputChange('receiverName', e.target.value)}
                      className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`}
                      placeholder={t('الاسم كما في الهوية', 'Name as on ID', 'ناو وەک لە ناسنامەدا هەیە')}
                      data-testid="receiver-name"
                    />
                    {errors.receiverName && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.receiverName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                      {t('رقم هاتف المستلم', 'Receiver Phone', 'مۆبایلی وەرگر')}
                    </Label>
                    <Input
                      type="tel"
                      value={formData.receiverPhone}
                      onChange={(e) => handleInputChange('receiverPhone', e.target.value)}
                      className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`}
                      placeholder="+1 XXX XXX XXXX"
                      data-testid="receiver-phone"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                      {t('عنوان المستلم', 'Receiver Address', 'ناونیشانی وەرگر')}
                    </Label>
                    <Input
                      value={formData.receiverAddress}
                      onChange={(e) => handleInputChange('receiverAddress', e.target.value)}
                      className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`}
                      placeholder={t('العنوان التفصيلي', 'Detailed address', 'ناونیشانی تەواو')}
                      data-testid="receiver-address"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                      {t('دولة المستلم', 'Receiver Country', 'وڵاتی وەرگر')} *
                    </Label>
                    <Select value={formData.receiverCountry} onValueChange={(v) => handleInputChange('receiverCountry', v)}>
                      <SelectTrigger className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`} data-testid="receiver-country">
                        <SelectValue placeholder={t('اختر الدولة', 'Select country', 'وڵات هەڵبژێرە')} />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.filter(c => c.value !== 'iraq').map(c => (
                          <SelectItem key={c.value} value={c.value}>
                            {t(c.labelAr, c.labelEn, c.labelKu)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.receiverCountry && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.receiverCountry}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* ID Upload */}
            <div className={`rounded-3xl border-2 shadow-xl p-8 mb-6 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
              }`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {t('الهوية', 'Identity Document', 'ناسنامەی کەسی')}
                </h2>
              </div>

              {/* ID Type Selector */}
              <div className="space-y-2 mb-6">
                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  {t('نوع الهوية', 'ID Type', 'جۆری ناسنامە')} *
                </Label>
                <Select value={formData.idType} onValueChange={(v) => handleInputChange('idType', v)}>
                  <SelectTrigger className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`} data-testid="id-type">
                    <SelectValue placeholder={t('اختر نوع الهوية', 'Select ID type', 'جۆری ناسنامە هەڵبژێرە')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="passport">{t('جواز سفر', 'Passport', 'پاسپۆرت')}</SelectItem>
                    <SelectItem value="national_id">{t('بطاقة هوية', 'National ID Card', 'کارتی ناسنامە')}</SelectItem>
                  </SelectContent>
                </Select>
                {errors.idType && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.idType}</p>}
              </div>

              {!idImage ? (
                <label className={`block border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer ${isDark ? 'border-slate-600 hover:border-yellow-400 hover:bg-yellow-500/10' : 'border-slate-300 hover:border-yellow-400 hover:bg-yellow-50/50'}`}>
                  <input type="file" accept="image/*" onChange={handleIdUpload} className="hidden" data-testid="id-upload" />
                  <div className="text-center">
                    <Upload className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                    <p className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {t('اضغط لرفع صورة الهوية', 'Click to upload ID image', 'بۆ بارکردنی وێنەی ناسنامە لێرە بدە')}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>PNG, JPG (max 5MB)</p>
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
                        {t('تم الرفع', 'Uploaded', 'بارکرا')}
                      </p>
                    </div>
                  </div>
                  <button type="button" onClick={() => setIdImage(null)} className="p-2 hover:bg-red-100 rounded-lg">
                    <X className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              )}
              {errors.idImage && <p className="text-sm text-red-500 flex items-center gap-1 mt-2"><AlertCircle className="w-4 h-4" />{errors.idImage}</p>}
            </div>

            {/* Amount & Currency */}
            <div className={`rounded-3xl border-2 shadow-xl p-8 mb-6 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
              }`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                  <DollarSign className="w-6 h-6 text-emerald-600" />
                </div>
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {t('المبلغ والعملة', 'Amount & Currency', 'بڕ و دراو')}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    {t('العملة', 'Currency', 'دراو')} *
                  </Label>
                  <Select value={formData.currency} onValueChange={(v) => handleInputChange('currency', v)}>
                    <SelectTrigger className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`} data-testid="currency-select">
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
                  {errors.currency && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.currency}</p>}
                </div>

                <div className="space-y-2">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    {t('المبلغ', 'Amount', 'بڕ')} *
                  </Label>
                  <Input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`}
                    placeholder="1000"
                    min="1"
                    data-testid="amount"
                  />
                  {errors.amount && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.amount}</p>}
                </div>

                <div className="space-y-2">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    {t('طريقة الدفع', 'Payment Method', 'شێوازى پارەدان')} *
                  </Label>
                  <Select value={formData.paymentMethod} onValueChange={(v) => handleInputChange('paymentMethod', v)}>
                    <SelectTrigger className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`} data-testid="payment-method">
                      <SelectValue placeholder={t('اختر طريقة الدفع', 'Select payment method', 'شێوازى پارەدان هەڵبژێرە')} />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map(m => (
                        <SelectItem key={m.value} value={m.value}>
                          {t(m.labelAr, m.labelEn, m.labelKu)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.paymentMethod && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.paymentMethod}</p>}
                </div>

                <div className="space-y-2">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    {t('الغرض من التحويل', 'Transfer Purpose', 'مەبەستی گواستنەوە')}
                  </Label>
                  <Select value={formData.purpose} onValueChange={(v) => handleInputChange('purpose', v)}>
                    <SelectTrigger className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`} data-testid="purpose">
                      <SelectValue placeholder={t('اختياري', 'Optional', 'ئارەزوومەندانە')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trade">{t('تجارة', 'Trade', 'بازرگانی')}</SelectItem>
                      <SelectItem value="family_expenses">{t('نفقات الأسرة', 'Family Expenses', 'خەرجی خێزان')}</SelectItem>
                      <SelectItem value="medical">{t('علاج', 'Medical Treatment', 'چاره‌سەری پزیشکی')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Summary */}
              {formData.amount && formData.currency && parseFloat(formData.amount) > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className={`mt-6 p-4 rounded-2xl ${isDark ? 'bg-yellow-900/30 border border-yellow-700/50' : 'bg-yellow-50 border border-yellow-200'}`}
                >
                  <h4 className={`font-bold mb-3 ${isDark ? 'text-yellow-300' : 'text-yellow-900'}`}>
                    {t('ملخص التحويل', 'Transfer Summary', 'پوختەی گواستنەوە')}
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-yellow-200' : 'text-yellow-800'}>{t('المبلغ المرسل', 'Amount to Send', 'بڕی نێردراو')}</span>
                      <span className={`font-semibold ${isDark ? 'text-white' : ''}`}>{formData.amount} {formData.currency}</span>
                    </div>
                    {formData.currency !== 'USD' && (
                      <>
                        <div className="flex justify-between">
                          <span className={isDark ? 'text-yellow-200' : 'text-yellow-800'}>{t('سعر الصرف (مقابل الدولار)', 'Exchange Rate (vs USD)', 'ڕێژەی گۆڕین (بەرامبەر دۆلار)')}</span>
                          <span className={`font-semibold ${isDark ? 'text-white' : ''}`}>{calculateExchangeRateToUSD().toFixed(4)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={isDark ? 'text-yellow-200' : 'text-yellow-800'}>{t('المبلغ بالدولار', 'Amount in USD', 'بڕ بە دۆلار')}</span>
                          <span className={`font-semibold ${isDark ? 'text-white' : ''}`}>{calculateUSDAmount().toFixed(2)} $</span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-yellow-200' : 'text-yellow-800'}>{t('المقابل بالدينار', 'Amount in IQD', 'بڕ بە دینار')}</span>
                      <span className={`font-semibold ${isDark ? 'text-white' : ''}`}>{calculateIQD().toLocaleString()} {t('د.ع', 'IQD', 'IQD')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-yellow-200' : 'text-yellow-800'}>{t(`رسوم الخدمة (${serviceFeePercent}%)`, `Service Fee (${serviceFeePercent}%)`, `رسوومی خزمەتگوزاری (${serviceFeePercent}%)`)}</span>
                      <span className="font-semibold text-amber-500">{calculateFee().toLocaleString()} {t('د.ع', 'IQD', 'IQD')}</span>
                    </div>
                    <div className={`border-t pt-2 mt-2 ${isDark ? 'border-yellow-700/50' : 'border-yellow-300'}`}>
                      <div className="flex justify-between">
                        <span className={`font-bold ${isDark ? 'text-white' : 'text-yellow-900'}`}>{t('الإجمالي للدفع', 'Total to Pay', 'تێکڕای پارەدان')}</span>
                        <span className="font-bold text-lg text-yellow-500">{calculateTotal().toLocaleString()} {t('د.ع', 'IQD', 'IQD')}</span>
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

export default WesternUnion;
