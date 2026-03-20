import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { User, Phone, DollarSign, CheckCircle, AlertCircle, ArrowLeft, Upload, X, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CountryPhoneSelect from '@/components/ui/CountryPhoneSelect';
import { DatePicker } from '@/components/ui/DatePicker';
import { format } from 'date-fns';
import Header3D from '../landing/Header3D';
import Footer3D from '../landing/Footer3D';

const MoneyGram = () => {
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
  const [hoveredMethod, setHoveredMethod] = useState(null);

  const [formData, setFormData] = useState({
    senderFirstName: '',
    senderLastName: '',
    senderAddress: '',
    senderPhone: '',
    senderDOB: '',
    senderPOB: '',
    receiverFirstName: '',
    receiverLastName: '',
    receiverAddress: '',
    receiverDOB: '',
    receiverPhone: '',
    senderCountry: 'iraq',
    receiverCountry: '',
    idType: '',
    currency: '',
    amount: '',
    purpose: '',
    paymentMethod: ''
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
    { value: 'pakistan', labelAr: 'باكستان', labelEn: 'Pakistan', labelKu: 'پاکستان' }
  ];

  const currencies = [
    { value: 'USD', labelAr: 'دولار أمريكي', labelEn: 'US Dollar', symbol: '$', labelKu: 'دۆلاری ئەمریکی' },
    { value: 'EUR', labelAr: 'يورو', labelEn: 'Euro', symbol: '€', labelKu: 'یۆرۆ' },
    { value: 'GBP', labelAr: 'جنيه إسترليني', labelEn: 'British Pound', symbol: '£', labelKu: 'پاوەندی بەریتانی' },
    { value: 'AED', labelAr: 'درهم إماراتي', labelEn: 'UAE Dirham', symbol: 'د.إ', labelKu: 'درهەمی ئیماراتی' },
    { value: 'SAR', labelAr: 'ريال سعودي', labelEn: 'Saudi Riyal', symbol: 'ر.س', labelKu: 'ڕیاڵی سعودی' }
  ];

  // Unified payment methods
  const paymentMethods = [
    { value: 'zain_cash', labelAr: 'زين كاش', labelEn: 'Zain Cash', labelKu: 'زەین کاش' },
    { value: 'mastercard_rafidain', labelAr: 'ماستركارد الرافدين', labelEn: 'Mastercard Al-Rafidain', labelKu: 'ماستەرکارد الڕافدین' },
    { value: 'fib', labelAr: 'FIB', labelEn: 'FIB', labelKu: 'FIB' }
  ];

  const [exchangeRates, setExchangeRates] = useState({});

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/rates?active_only=true`);
        if (response.ok) {
          const ratesData = await response.json();
          const ratesMap = {};
          ratesData.forEach(r => {
            if (r.sell_rate) ratesMap[r.currency_code] = r.sell_rate;
          });
          setExchangeRates(ratesMap);
        }
      } catch (err) {
        console.error('Error fetching exchange rates:', err);
      }
    };
    fetchRates();
  }, []);
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
        setErrors(prev => ({ ...prev, idImage: t('حجم الملف كبير', 'File too large', 'قەبارەی فایلەکە زۆر گەورەیە') }));
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
    if (!formData.senderFirstName.trim()) newErrors.senderFirstName = t('مطلوب', 'Required', 'پێویستە');
    if (!formData.senderLastName.trim()) newErrors.senderLastName = t('مطلوب', 'Required', 'پێویستە');
    if (!formData.senderAddress.trim()) newErrors.senderAddress = t('مطلوب', 'Required', 'پێویستە');
    if (!formData.senderPhone.trim()) newErrors.senderPhone = t('مطلوب', 'Required', 'پێویستە');
    if (!formData.senderDOB) newErrors.senderDOB = t('مطلوب', 'Required', 'پێویستە');
    if (!formData.senderPOB.trim()) newErrors.senderPOB = t('مطلوب', 'Required', 'پێویستە');

    if (!formData.receiverFirstName.trim()) newErrors.receiverFirstName = t('مطلوب', 'Required', 'پێویستە');
    if (!formData.receiverLastName.trim()) newErrors.receiverLastName = t('مطلوب', 'Required', 'پێویستە');
    if (!formData.receiverAddress.trim()) newErrors.receiverAddress = t('مطلوب', 'Required', 'پێویستە');
    if (!formData.receiverDOB) newErrors.receiverDOB = t('مطلوب', 'Required', 'پێویستە');
    if (!formData.receiverPhone.trim()) newErrors.receiverPhone = t('مطلوب', 'Required', 'پێویستە');

    if (!formData.receiverCountry) newErrors.receiverCountry = t('مطلوب', 'Required', 'پێویستە');
    if (!formData.currency) newErrors.currency = t('مطلوب', 'Required', 'پێویستە');
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = t('مطلوب', 'Required', 'پێویستە');
    if (!formData.paymentMethod) newErrors.paymentMethod = t('مطلوب', 'Required', 'پێویستە');
    if (!formData.purpose) newErrors.purpose = t('مطلوب', 'Required', 'پێویستە');
    if (!formData.idType) newErrors.idType = t('نوع الهوية مطلوب', 'ID type required', 'جۆری ناسنامە پێویستە');
    if (!idImage) newErrors.idImage = t('مطلوب', 'Required', 'پێویستە');
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
      const senderFullName = `${formData.senderFirstName} ${formData.senderLastName}`.trim();
      const blockRes = await fetch(`${API_URL}/api/blocklist/check?full_name=${encodeURIComponent(senderFullName)}&phone=${encodeURIComponent(formData.senderPhone)}`);
      if (blockRes.ok) {
        const blockData = await blockRes.json();
        if (blockData.blocked) {
          toast.error(blockData.message || t('عذراً، لا يمكن إتمام طلبك حالياً.', 'Sorry, your request cannot be processed at this time.', 'ببوورە، داواکارییەکەت لە ئێستادا جێبەجێ ناکرێت.'));
          setLoading(false);
          return;
        }
      }

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
        customer: { full_name: senderFullName, phone: formData.senderPhone },
        details: {
          senderFirstName: formData.senderFirstName,
          senderLastName: formData.senderLastName,
          senderAddress: formData.senderAddress,
          senderPhone: formData.senderPhone,
          senderDOB: formData.senderDOB,
          senderPOB: formData.senderPOB,
          receiverFirstName: formData.receiverFirstName,
          receiverLastName: formData.receiverLastName,
          receiverAddress: formData.receiverAddress,
          receiverDOB: formData.receiverDOB,
          receiverPhone: formData.receiverPhone,
          senderCountry: formData.senderCountry,
          receiverCountry: formData.receiverCountry,
          idType: formData.idType,
          currency: formData.currency,
          amount: formData.amount,
          iqdAmount: calculateIQD(),
          serviceFee: calculateFee(),
          total: calculateTotal(),
          totalInCurrency: (parseFloat(formData.amount) * (1 + serviceFeePercent / 100)).toFixed(2),
          purpose: formData.purpose,
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
      toast.error(t('حدث خطأ أثناء إرسال الطلب', 'Error submitting request', 'هەڵەیەک ڕوویدا لە کاتی ناردنی داواکارییەکە'));
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
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/transfers/international')}
            className={`flex items-center gap-2 mb-8 group ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            {t('العودة', 'Back', 'گەڕانەوە')}
          </motion.button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="w-24 h-24 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <span className="text-2xl font-black text-white">MG</span>
            </div>
            <h1 className={`text-3xl md:text-4xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t('موني جرام', 'MoneyGram', 'مۆنی گرام')}
            </h1>
            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              {t('تحويل دولي سريع وآمن', 'Fast and secure international transfer', 'گواستنەوەی نێودەوڵەتی خێرا و پارێزراو')}
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
            <div className={`rounded-3xl border-2 shadow-xl p-8 mb-6 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
              }`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-orange-500/20' : 'bg-orange-100'}`}>
                  <User className="w-6 h-6 text-orange-600" />
                </div>
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {t('بيانات التحويل', 'Transfer Details', 'زانیاری گواستنەوە')}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <h3 className={`font-bold mb-4 border-b pb-2 ${isDark ? 'text-orange-400 border-slate-700' : 'text-orange-600 border-slate-200'}`}>
                    {t('بيانات المرسل', 'Sender Information', 'زانیاری نێرەر')}
                  </h3>
                </div>

                <div className="space-y-2">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>{t('الاسم الثلاثي للمرسل', 'Sender Full Name', 'ناوی تەواوی نێرەر')} *</Label>
                  <Input value={formData.senderFirstName} onChange={(e) => handleInputChange('senderFirstName', e.target.value)} className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`} />
                  {errors.senderFirstName && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.senderFirstName}</p>}
                </div>

                <div className="space-y-2">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>{t('اللقب للمرسل', 'Sender Nickname', 'نازناوی نێرەر')} *</Label>
                  <Input value={formData.senderLastName} onChange={(e) => handleInputChange('senderLastName', e.target.value)} className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`} />
                  {errors.senderLastName && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.senderLastName}</p>}
                </div>

                <div className="space-y-2">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>{t('تاريخ ميلاد المرسل', 'Sender Date of Birth', 'بەرواری لەدایکبوونی نێرەر')} *</Label>
                  <DatePicker
                    date={formData.senderDOB ? new Date(formData.senderDOB) : undefined}
                    setDate={(date) => {
                      handleInputChange('senderDOB', date ? format(date, 'yyyy-MM-dd') : '');
                    }}
                    maxDate={new Date()}
                    placeholder={t('اختر السنة/الشهر/اليوم', 'Select YYYY/MM/DD', 'بەروار هەڵبژێرە')}
                  />
                  {errors.senderDOB && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.senderDOB}</p>}
                </div>

                <div className="space-y-2">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>{t('مكان ميلاد المرسل', 'Sender Place of Birth', 'شوێنی لەدایکبوونی نێرەر')} *</Label>
                  <Input value={formData.senderPOB} onChange={(e) => handleInputChange('senderPOB', e.target.value)} className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`} />
                  {errors.senderPOB && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.senderPOB}</p>}
                </div>

                <div className="space-y-2">
                  <CountryPhoneSelect
                    value={formData.senderPhone}
                    onChange={(val) => handleInputChange('senderPhone', val)}
                    isDark={isDark}
                  />
                  {errors.senderPhone && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.senderPhone}</p>}
                </div>

                <div className="space-y-2">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>{t('عنوان المرسل', 'Sender Address', 'ناونیشانی نێرەر')} *</Label>
                  <Input value={formData.senderAddress} onChange={(e) => handleInputChange('senderAddress', e.target.value)} className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`} />
                  {errors.senderAddress && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.senderAddress}</p>}
                </div>

                <div className="md:col-span-2 mt-6">
                  <h3 className={`font-bold mb-4 border-b pb-2 ${isDark ? 'text-orange-400 border-slate-700' : 'text-orange-600 border-slate-200'}`}>
                    {t('بيانات المستلم', 'Receiver Information', 'زانیاری وەرگر')}
                  </h3>
                </div>

                <div className="space-y-2">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>{t('الاسم الثلاثي للمستلم', 'Receiver Full Name', 'ناوی تەواوی وەرگر')} *</Label>
                  <Input value={formData.receiverFirstName} onChange={(e) => handleInputChange('receiverFirstName', e.target.value)} className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`} />
                  {errors.receiverFirstName && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.receiverFirstName}</p>}
                </div>

                <div className="space-y-2">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>{t('اللقب للمستلم', 'Receiver Nickname', 'نازناوی وەرگر')} *</Label>
                  <Input value={formData.receiverLastName} onChange={(e) => handleInputChange('receiverLastName', e.target.value)} className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`} />
                  {errors.receiverLastName && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.receiverLastName}</p>}
                </div>

                <div className="space-y-2">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>{t('تاريخ ميلاد المستلم', 'Receiver Date of Birth', 'بەرواری لەدایکبوونی وەرگر')} *</Label>
                  <DatePicker
                    date={formData.receiverDOB ? new Date(formData.receiverDOB) : undefined}
                    setDate={(date) => {
                      handleInputChange('receiverDOB', date ? format(date, 'yyyy-MM-dd') : '');
                    }}
                    maxDate={new Date()}
                    placeholder={t('اختر السنة/الشهر/اليوم', 'Select YYYY/MM/DD', 'بەروار هەڵبژێرە')}
                  />
                  {errors.receiverDOB && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.receiverDOB}</p>}
                </div>

                <div className="space-y-2 text-right">
                  <CountryPhoneSelect
                    value={formData.receiverPhone}
                    onChange={(val) => handleInputChange('receiverPhone', val)}
                    isDark={isDark}
                  />
                  {errors.receiverPhone && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.receiverPhone}</p>}
                </div>

                <div className="space-y-2">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>{t('عنوان المستلم', 'Receiver Address', 'ناونیشانی وەرگر')} *</Label>
                  <Input value={formData.receiverAddress} onChange={(e) => handleInputChange('receiverAddress', e.target.value)} className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`} />
                  {errors.receiverAddress && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.receiverAddress}</p>}
                </div>

                <div className="space-y-2">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>{t('دولة المستلم', 'Receiver Country', 'وڵاتی وەرگر')} *</Label>
                  <Select value={formData.receiverCountry} onValueChange={(v) => handleInputChange('receiverCountry', v)}>
                    <SelectTrigger className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`}><SelectValue placeholder={t('اختر', 'Select', 'هەڵبژاردن')} /></SelectTrigger>
                    <SelectContent>
                      {countries.filter(c => c.value !== 'iraq').map(c => (
                        <SelectItem key={c.value} value={c.value}>{t(c.labelAr, c.labelEn, c.labelKu)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.receiverCountry && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.receiverCountry}</p>}
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
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('الهوية', 'Identity Document', 'ناسنامەی کەسی')}</h2>
              </div>

              {/* ID Type Selector */}
              <div className="space-y-2 mb-6">
                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  {t('نوع الهوية', 'ID Type', 'جۆری ناسنامە')} *
                </Label>
                <Select value={formData.idType} onValueChange={(v) => handleInputChange('idType', v)}>
                  <SelectTrigger className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`} data-testid="mg-id-type">
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
                <label className={`block border-2 border-dashed rounded-2xl p-8 hover:border-orange-400 transition-all cursor-pointer ${isDark ? 'border-slate-600 hover:bg-orange-500/10' : 'border-slate-300 hover:bg-orange-50/50'}`}>
                  <input type="file" accept="image/*" onChange={handleIdUpload} className="hidden" data-testid="mg-id-upload" />
                  <div className="text-center">
                    <Upload className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{t('اضغط للرفع', 'Click to upload', 'بۆ بارکردن لێرە بدە')}</p>
                  </div>
                </label>
              ) : (
                <div className="border-2 border-[#D4AF37]/50 bg-[#D4AF37]/10 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={idImage.preview} alt="ID" className="w-16 h-16 rounded-lg object-cover" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{idImage.name}</p>
                      <p className="text-xs text-[#D4AF37] flex items-center gap-1"><CheckCircle className="w-3 h-3" />{t('تم', 'Done', 'تەواو')}</p>
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
            <div className={`rounded-3xl border-2 shadow-xl p-8 mb-6 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
              }`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                  <DollarSign className="w-6 h-6 text-emerald-600" />
                </div>
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('المبلغ', 'Amount', 'بڕ')}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>{t('عملة الاستلام', 'Receiving Currency', 'دراوی وەرگر')} *</Label>
                  <Select value={formData.currency} onValueChange={(v) => handleInputChange('currency', v)}>
                    <SelectTrigger className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`} data-testid="mg-currency"><SelectValue placeholder={t('اختر', 'Select', 'هەڵبژاردن')} /></SelectTrigger>
                    <SelectContent>
                      {currencies.map(c => (<SelectItem key={c.value} value={c.value}>{c.symbol} {t(c.labelAr, c.labelEn, c.labelKu)}</SelectItem>))}
                    </SelectContent>
                  </Select>
                  {errors.currency && <p className="text-sm text-red-500"><AlertCircle className="w-4 h-4 inline" /> {errors.currency}</p>}
                </div>

                <div className="space-y-2">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>{t('المبلغ', 'Amount', 'بڕ')} *</Label>
                  <Input type="number" value={formData.amount} onWheel={(e) => e.target.blur()} onChange={(e) => handleInputChange('amount', e.target.value)} className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`} min="1" data-testid="mg-amount" />
                  {errors.amount && <p className="text-sm text-red-500"><AlertCircle className="w-4 h-4 inline" /> {errors.amount}</p>}
                </div>

                <div className="space-y-2">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>{t('الغرض من التحويل', 'Transfer Purpose', 'مەبەستی گواستنەوە')} *</Label>
                  <Select value={formData.purpose} onValueChange={(v) => handleInputChange('purpose', v)}>
                    <SelectTrigger className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`} data-testid="mg-purpose">
                      <SelectValue placeholder={t('اختر الغرض', 'Select Purpose', 'مەبەست هەڵبژێرە')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trade">{t('تجارة', 'Trade', 'بازرگانی')}</SelectItem>
                      <SelectItem value="family_expenses">{t('نفقات الأسرة', 'Family Expenses', 'خەرجی خێزان')}</SelectItem>
                      <SelectItem value="medical">{t('علاج', 'Medical Treatment', 'چارەسەری پزیشکی')}</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.purpose && <p className="text-sm text-red-500 flex items-center gap-1 mt-1"><AlertCircle className="w-4 h-4" />{errors.purpose}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>{t('طريقة الدفع', 'Payment Method', 'شێوازى پارەدان')} *</Label>
                  <div className={`p-4 rounded-xl mb-4 flex items-center gap-3 border ${
                    isDark 
                      ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' 
                      : 'bg-orange-50 border-orange-200 text-orange-700'
                  }`}>
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm md:text-base font-bold">
                      {t('حدد كيف تدفع لنا', 'Select how you pay us', 'چۆنێتی پارەدانەکەمان بۆ دیاری بکە')}
                    </p>
                  </div>
                  <div className={`p-6 rounded-2xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                      {paymentMethods.map(m => (
                        <motion.button
                          key={m.value}
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          onMouseEnter={() => setHoveredMethod(m.value)}
                          onMouseLeave={() => setHoveredMethod(null)}
                          onClick={() => handleInputChange('paymentMethod', m.value)}
                          className={`p-4 rounded-xl border-2 text-center transition-colors ${formData.paymentMethod === m.value
                            ? 'border-orange-500 bg-orange-500/10'
                            : hoveredMethod === m.value
                              ? 'border-orange-500'
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
                  {errors.paymentMethod && <p className="text-sm text-red-500"><AlertCircle className="w-4 h-4 inline" /> {errors.paymentMethod}</p>}
                </div>
              </div>

              {formData.amount && formData.currency && parseFloat(formData.amount) > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`mt-6 p-4 rounded-2xl ${isDark ? 'bg-orange-900/30 border border-orange-700/50' : 'bg-orange-50 border border-orange-200'}`}>
                  <h4 className={`font-bold mb-3 ${isDark ? 'text-orange-300' : 'text-orange-900'}`}>{t('ملخص', 'Summary', 'پوختە')}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className={isDark ? 'text-orange-200' : 'text-orange-800'}>{t('المبلغ', 'Amount', 'بڕ')}</span><span dir="ltr" className={`font-semibold ${isDark ? 'text-white' : ''}`}>{formData.amount} {formData.currency}</span></div>
                    <div className="flex justify-between"><span className={isDark ? 'text-orange-200' : 'text-orange-800'}>{t('بالدينار', 'In IQD', 'بە دینار')}</span><span dir="ltr" className={`font-semibold ${isDark ? 'text-white' : ''}`}>{calculateIQD().toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className={isDark ? 'text-orange-200' : 'text-orange-800'}>{t(`الرسوم (${serviceFeePercent}%)`, `Fee (${serviceFeePercent}%)`, `رسووم (${serviceFeePercent}%)`)}</span><span dir="ltr" className="text-amber-500 font-semibold">{calculateFee().toLocaleString()}</span></div>
                    <div className={`border-t pt-2 ${isDark ? 'border-orange-700/50' : 'border-orange-200'}`}><div className="flex justify-between font-bold"><span className={isDark ? 'text-white' : 'text-orange-900'}>{t('الإجمالي', 'Total', 'کۆی گشتی')}</span><span dir="ltr" className="text-orange-500">{calculateTotal().toLocaleString()} {t('د.ع', 'IQD', 'IQD')}</span></div></div>
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
                <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />{t('جارٍ...', 'Submitting...', 'تۆمارکردن...')}</>
              ) : (
                <><CheckCircle className="w-5 h-5" />{t('تسجيل الطلب', 'Submit Request', 'تۆمارکردنی داواکاری')}</>
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
