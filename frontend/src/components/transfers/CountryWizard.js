import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, DollarSign, Globe, CreditCard, CheckCircle, AlertCircle, Search, Clock, User, Star, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ReactCountryFlag from 'react-country-flag';
import Header3D from '../landing/Header3D';
import Footer3D from '../landing/Footer3D';

const CountryWizard = () => {
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

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [countries, setCountries] = useState([]);
  const [methods, setMethods] = useState([]);
  const [exchangeRates, setExchangeRates] = useState({});
  const API_URL = process.env.REACT_APP_BACKEND_URL;

  const [wizardData, setWizardData] = useState({
    amount: '',
    country: null,
    method: null,
    receiverCurrency: '', // New: Receiver's currency
    customCurrencyName: '', // New: Free-text currency name for "Other Countries"
    customCountryName: '', // New: Free-text country name for "Other Countries"
    senderName: '',
    receiverName: '',
    senderPhone: '',
    receiverPhone: '',
    purpose: '',
    customFields: {},
    fieldUploads: {} // New: Store upload progress/status for dynamic fields
  });

  // Check if selected country is "Other Countries"
  const isOtherCountry = wizardData.country === 'OTHER';

  // Currency names map for display
  const currencyNames = {
    'DZD': { ar: 'دينار جزائري', en: 'Algerian Dinar', ku: 'دیناری جەزائیری' },
    'EGP': { ar: 'جنيه مصري', en: 'Egyptian Pound', ku: 'جونیەی میسری' },
    'TRY': { ar: 'ليرة تركية', en: 'Turkish Lira', ku: 'لیرەی تورکی' },
    'JOD': { ar: 'دينار أردني', en: 'Jordanian Dinar', ku: 'دیناری ئوردنی' },
    'INR': { ar: 'روبية هندية', en: 'Indian Rupee', ku: 'ڕوپیەی هیندی' },
    'PKR': { ar: 'روبية باكستانية', en: 'Pakistani Rupee', ku: 'ڕوپیەی پاکستانی' },
    'AED': { ar: 'درهم إماراتي', en: 'UAE Dirham', ku: 'درههەمی ئیماراتی' },
    'SAR': { ar: 'ريال سعودي', en: 'Saudi Riyal', ku: 'ڕیاڵی سعودی' },
    'LBP': { ar: 'ليرة لبنانية', en: 'Lebanese Pound', ku: 'لیرەی لوبنانی' },
    'SYP': { ar: 'ليرة سورية', en: 'Syrian Pound', ku: 'لیرەی سووری' },
    'USD': { ar: 'دولار أمريكي', en: 'US Dollar', ku: 'دۆلاری ئەمریکی' },
    'EUR': { ar: 'يورو', en: 'Euro', ku: 'یۆرۆ' }
  };

  // Check if selected method is bank transfer
  const isBankTransfer = wizardData.method?.toLowerCase().includes('bank') || wizardData.method === 'bank_transfer_other';

  // Get available currencies for receiver based on method
  const getAvailableCurrencies = () => {
    if (!wizardData.country) return [];
    const country = countries.find(c => c.country_code === wizardData.country);
    if (!country) return [];

    const localCurrencyCode = country.currency;
    const localCurrencyInfo = {
      code: localCurrencyCode,
      nameAr: currencyNames[localCurrencyCode]?.ar || localCurrencyCode,
      nameEn: currencyNames[localCurrencyCode]?.en || localCurrencyCode,
      nameKu: currencyNames[localCurrencyCode]?.ku || localCurrencyCode
    };

    if (isBankTransfer) {
      // For bank transfers: local currency first, then USD and EUR
      return [
        localCurrencyInfo,
        { code: 'USD', nameAr: currencyNames['USD'].ar, nameEn: currencyNames['USD'].en, nameKu: currencyNames['USD'].ku },
        { code: 'EUR', nameAr: currencyNames['EUR'].ar, nameEn: currencyNames['EUR'].en, nameKu: currencyNames['EUR'].ku }
      ];
    } else {
      // For non-bank methods: local currency only
      return [localCurrencyInfo];
    }
  };

  // Load countries and exchange rates data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [countriesRes, ratesRes] = await Promise.all([
          fetch(`${API_URL}/api/cms/countries?active_only=true`),
          fetch(`${API_URL}/api/rates?active_only=true`)
        ]);

        if (countriesRes.ok) {
          const data = await countriesRes.json();
          setCountries(data);
        }

        if (ratesRes.ok) {
          const ratesData = await ratesRes.json();
          const ratesMap = {};
          ratesData.forEach(r => {
            ratesMap[r.currency_code] = r;
          });
          setExchangeRates(ratesMap);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
      setLoading(false);
    };
    fetchData();
  }, [API_URL]);

  // Load methods when country changes
  useEffect(() => {
    if (!wizardData.country) {
      setMethods([]);
      return;
    }
    if (wizardData.country === 'OTHER') {
      // For "Other Countries", only bank transfer is available
      setMethods([{
        method_id: 'bank_transfer_other',
        name_ar: 'تحويل بنكي',
        name_en: 'Bank Transfer',
        name_ku: 'گواستنەوەی بانکی',
        duration: '',
        exchange_rate: ''
      }]);
      // Auto-select bank transfer
      setWizardData(p => ({ ...p, method: 'bank_transfer_other' }));
      return;
    }
    const country = countries.find(c => c.country_code === wizardData.country);
    setMethods(country?.transfer_methods || []);
  }, [wizardData.country, countries]);

  // Set default receiver currency when method changes
  useEffect(() => {
    if (wizardData.method && wizardData.country) {
      const isBankType = wizardData.method.toLowerCase().includes('bank');
      const country = countries.find(c => c.country_code === wizardData.country);

      if (!isBankType && country?.currency) {
        // For non-bank, auto-set to local currency
        setWizardData(p => ({ ...p, receiverCurrency: country.currency }));
      } else if (isBankType && !wizardData.receiverCurrency) {
        // For bank, default to local currency if available, otherwise fallback to USD
        setWizardData(p => ({ ...p, receiverCurrency: country?.currency || 'USD' }));
      }
    }
  }, [wizardData.method, wizardData.country, countries]);

  const filteredCountries = countries.filter(c =>
    c.name_ar.includes(searchQuery) ||
    c.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.name_ku && c.name_ku.includes(searchQuery))
  );

  // "Other Countries" pseudo-country object
  const otherCountryCard = {
    country_code: 'OTHER',
    name_ar: 'دول أخرى',
    name_en: 'Other Countries',
    name_ku: 'وڵاتی تر',
    flag: null
  };

  const selectedCountry = wizardData.country === 'OTHER'
    ? otherCountryCard
    : countries.find(c => c.country_code === wizardData.country);
  const selectedMethod = methods.find(m => m.method_id === wizardData.method);

  // Formulas match CurrencyConverterSection.js
  const effectiveCurrency = wizardData.receiverCurrency || selectedCountry?.currency;

  const usdRateObj = exchangeRates['USD'] ?? null;
  const receiverRateObj = effectiveCurrency ? (exchangeRates[effectiveCurrency] ?? null) : null;

  // Has rate only when BOTH USD rate and receiver currency rate exist in admin panel
  const hasRateForCurrency = usdRateObj !== null && receiverRateObj !== null;

  // Evaluate the IQD conversion step using the "sell" rate logic
  // crossRate represents how many target currency units for 1 USD
  const crossRate = hasRateForCurrency
    ? (effectiveCurrency === 'USD' ? 1 : parseFloat((usdRateObj.sell_rate / receiverRateObj.sell_rate).toFixed(4)))
    : null;

  const calculateReceiveAmount = () => {
    if (!wizardData.amount || !hasRateForCurrency || !crossRate) return 0;
    // (Amount in USD * USD_to_IQD) / IQD_to_Target
    const iqdAmount = parseFloat(wizardData.amount) * usdRateObj.sell_rate;
    const finalAmount = iqdAmount / receiverRateObj.sell_rate;
    return parseFloat(finalAmount.toFixed(2));
  };

  const calculateIQD = () => {
    if (!wizardData.amount || !usdRateObj) return 0;
    return Math.round(parseFloat(wizardData.amount) * usdRateObj.sell_rate);
  };

  const calculateFee = () => {
    return Math.round(calculateIQD() * 0.02); // 2% service fee
  };

  const calculateTotal = () => {
    return calculateIQD() + calculateFee();
  };

  const handleNext = () => {
    // Step 1: Select Country
    if (step === 1 && !wizardData.country) {
      setErrors({ country: t('اختر الدولة', 'Select country', 'وڵات هەڵبژێرە') });
      return;
    }
    // Step 2: Select Method
    if (step === 2 && !wizardData.method) {
      setErrors({ method: t('اختر الطريقة', 'Select method', 'شێواز هەڵبژێرە') });
      return;
    }
    // Step 3: Enter Amount and Info - validated in submit
    setErrors({});
    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setStep(s => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    const newErrors = {};
    if (!wizardData.amount || parseFloat(wizardData.amount) <= 0) newErrors.amount = t('أدخل المبلغ', 'Enter amount', 'بڕی پارە بنووسە');
    if (!wizardData.senderName.trim()) newErrors.senderName = t('مطلوب', 'Required', 'پێویستە');
    if (!wizardData.receiverName.trim()) newErrors.receiverName = t('مطلوب', 'Required', 'پێویستە');
    if (!wizardData.senderPhone.trim()) newErrors.senderPhone = t('مطلوب', 'Required', 'پێویستە');
    if (!wizardData.receiverPhone.trim()) newErrors.receiverPhone = t('مطلوب', 'Required', 'پێویستە');
    if (isOtherCountry && !wizardData.customCurrencyName.trim()) newErrors.customCurrencyName = t('أدخل اسم العملة', 'Enter currency name', 'ناوی دراو بنووسە');
    if (isOtherCountry && !wizardData.customCountryName.trim()) newErrors.customCountryName = t('أدخل اسم الدولة', 'Enter country name', 'ناوی وڵات بنووسە');
    if (!isOtherCountry && isBankTransfer && !wizardData.receiverCurrency) newErrors.receiverCurrency = t('اختر عملة المستلم', 'Select receiver currency', 'دراوی وەرگر هەڵبژێرە');
    if (!wizardData.purpose) newErrors.purpose = t('مطلوب', 'Required', 'پێویستە');

    // Add dynamic field validation
    if (selectedMethod?.fields && selectedMethod.fields.length > 0) {
      selectedMethod.fields.forEach(f => {
        // Only validate if explicitly required or if not specified (default to required if field doesn't have the property)
        const isRequired = f.required !== false;
        if (isRequired && !wizardData.customFields[f.field_id]?.toString().trim()) {
          newErrors[f.field_id] = t('مطلوب', 'Required', 'پێویستە');
        }
      });
    } else if (!wizardData.customFields.generic_account?.trim()) {
      // Only require generic if no custom fields are defined
      newErrors.generic_account = t('مطلوب', 'Required', 'پێویستە');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      // 1. Perform Block Check for better UX
      const blockRes = await fetch(`${API_URL}/api/blocklist/check?full_name=${encodeURIComponent(wizardData.senderName)}&phone=${encodeURIComponent(wizardData.senderPhone)}`);
      if (blockRes.ok) {
        const blockData = await blockRes.json();
        if (blockData.blocked) {
          toast.error(blockData.message || t('عذراً، لا يمكن إتمام طلبك حالياً.', 'Sorry, your request cannot be processed at this time.', 'ببوورە، داواکارییەکەت لە ئێستادا جێبەجێ ناکرێت.'));
          setLoading(false);
          return;
        }
      }

      // 2. Submit Order
      const orderData = {
        order_type: 'country_based',
        customer: {
          full_name: wizardData.senderName,
          phone: wizardData.senderPhone
        },
        details: {
          amount: wizardData.amount,
          senderName: wizardData.senderName,
          receiverName: wizardData.receiverName,
          senderPhone: wizardData.senderPhone,
          receiverPhone: wizardData.receiverPhone,
          countryCode: wizardData.country,
          countryName: isOtherCountry
            ? wizardData.customCountryName
            : (selectedCountry ? (isArabic ? selectedCountry.name_ar : selectedCountry.name_en) : ''),
          methodId: wizardData.method,
          methodName: selectedMethod ? t(selectedMethod.name_ar, selectedMethod.name_en, selectedMethod.name_ku) : '',
          receiverCurrency: isOtherCountry ? '' : wizardData.receiverCurrency,
          customCurrencyName: isOtherCountry ? wizardData.customCurrencyName : '',
          receiveAmount: isOtherCountry ? '' : calculateReceiveAmount(),
          amountIQD: calculateIQD(),
          serviceFee: calculateFee(),
          total: calculateTotal(),
          purpose: selectedCountry?.country_code?.toUpperCase() === 'CN' ? 'trade' : wizardData.purpose,
          customFields: wizardData.customFields
        }
      };

      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (res.ok) {
        const order = await res.json();
        const selectedCurrency = getAvailableCurrencies().find(c => c.code === wizardData.receiverCurrency);

        navigate('/transfers/success', {
          state: {
            orderData: {
              ...orderData.details,
              type: 'country_based',
              currency: 'USD',
              receiverCurrencyName: isOtherCountry
                ? wizardData.customCurrencyName
                : (selectedCurrency ? (isArabic ? selectedCurrency.nameAr : selectedCurrency.nameEn) : ''),
              orderId: order.order_id
            }
          }
        });
      } else {
        const err = await res.json();
        toast.error(err.detail || t('حدث خطأ أثناء إرسال الطلب', 'Error submitting order', 'کێشەیەک لە ناردنی داواکارییەکەدا هەیە'));
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error(t('حدث خطأ في الاتصال', 'Connection error', 'کێشەی پەیوەندیکردن هەیە'));
    } finally {
      setLoading(false);
    }
  };

  const handleDynamicFileUpload = async (fieldId, file) => {
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t('حجم الملف كبير جداً (الأقصى 5 ميجابايت)', 'File too large (max 5MB)', 'قەبارەی فایلەکە زۆر گەورەیە'));
      return;
    }

    setWizardData(p => ({
      ...p,
      fieldUploads: { ...p.fieldUploads, [fieldId]: { loading: true } }
    }));

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('order_type', 'country_based');
      formData.append('doc_type', fieldId);

      const res = await fetch(`${API_URL}/api/orders/upload-document`, {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setWizardData(p => ({
          ...p,
          customFields: { ...p.customFields, [fieldId]: data.file_url },
          fieldUploads: { ...p.fieldUploads, [fieldId]: { loading: false, success: true, fileName: file.name } }
        }));
        toast.success(t('تم رفع الصورة بنجاح', 'Image uploaded successfully', 'وێنەکە بە سەرکەوتوویی بارکرا'));
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      console.error('Field upload error:', err);
      setWizardData(p => ({
        ...p,
        fieldUploads: { ...p.fieldUploads, [fieldId]: { loading: false, error: true } }
      }));
      toast.error(t('فشل رفع الصورة', 'Image upload failed', 'بارکردنی وێنەکە سەرکەوتوو نەبوو'));
    }
  };

  const removeDynamicFile = (fieldId) => {
    setWizardData(p => {
      const newFields = { ...p.customFields };
      delete newFields[fieldId];
      const newUploads = { ...p.fieldUploads };
      delete newUploads[fieldId];
      return { ...p, customFields: newFields, fieldUploads: newUploads };
    });
  };

  // Step indicator - Now 4 steps: Country -> Method -> Summary -> Amount & Info
  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[1, 2, 3, 4].map(s => (
        <React.Fragment key={s}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${s < step ? 'bg-[#D4AF37] text-white' : s === step ? 'bg-[#D4AF37] text-white shadow-lg' : isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-500'
            }`}>
            {s < step ? <CheckCircle className="w-5 h-5" /> : s}
          </div>
          {s < 4 && <div className={`w-8 h-1 rounded ${s < step ? 'bg-[#D4AF37]' : isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />}
        </React.Fragment>
      ))}
    </div>
  );

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
            onClick={() => step === 1 ? navigate('/transfers/international') : handleBack()}
            className={`flex items-center gap-2 mb-8 group ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            {t('رجوع', 'Back', 'گەڕانەوە')}
          </motion.button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Globe className="w-10 h-10 text-white" />
            </div>
            <h1 className={`text-3xl md:text-4xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t('تحويل حسب الدولة', 'Country-based Transfer', 'گواستنەوە بەپێی وڵات')}
            </h1>
          </motion.div>

          <StepIndicator />

          <div className="max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
              {/* Step 1: Select Country */}
              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
                  className={`rounded-3xl border-2 shadow-xl p-8 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
                    }`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                      <Globe className="w-6 h-6 text-blue-600" />
                    </div>
                    <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('اختر الدولة', 'Select Country', 'وڵات هەڵبژێرە')}</h2>
                  </div>
                  <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                      className={`h-12 pl-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : ''}`}
                      placeholder={t('ابحث...', 'Search...', 'گەڕان...')} />
                  </div>

                  <style>
                    {`
                      .custom-scrollbar::-webkit-scrollbar {
                        width: 6px;
                      }
                      .custom-scrollbar::-webkit-scrollbar-track {
                        background: transparent;
                      }
                      .custom-scrollbar::-webkit-scrollbar-thumb {
                        background-color: ${isDark ? '#475569' : '#cbd5e1'};
                        border-radius: 20px;
                      }
                      @media (max-width: 639px) {
                        .custom-scrollbar::-webkit-scrollbar {
                          display: none;
                        }
                        .custom-scrollbar {
                          -ms-overflow-style: none;
                          scrollbar-width: none;
                        }
                      }
                    `}
                  </style>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[360px] overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar">
                    {filteredCountries.map(c => (
                      <motion.button key={c.country_code} type="button" whileHover={{ scale: 1.05 }}
                        onClick={() => setWizardData(p => ({ ...p, country: c.country_code, method: null, customCurrencyName: '' }))}
                        className={`p-4 rounded-2xl border-2 text-center transition-colors ${wizardData.country === c.country_code
                          ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                          : isDark ? 'border-slate-600 hover:border-slate-500' : 'border-slate-200 hover:border-slate-300'
                          }`}>
                        <div className="flex justify-center mb-2">
                          <div className={`w-12 h-10 flex items-center justify-center ${isDark ? 'bg-white/5' : 'bg-slate-100'} rounded-lg overflow-hidden border ${isDark ? 'border-slate-700' : 'border-slate-100 shadow-sm'}`}>
                            <img
                              src={c.flag && c.flag.startsWith('http') ? c.flag : `https://flagcdn.com/w80/${c.country_code.toLowerCase()}.png`}
                              alt={c.country_code}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.src = 'https://flagcdn.com/w80/un.png'; }}
                            />
                          </div>
                        </div>
                        <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {t(c.name_ar, c.name_en, c.name_ku)}
                        </span>
                      </motion.button>
                    ))}

                    {/* "Other Countries" card - always visible */}
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setWizardData(p => ({ ...p, country: 'OTHER', method: null, customCurrencyName: '' }))}
                      className={`p-4 rounded-2xl border-2 text-center transition-colors ${wizardData.country === 'OTHER'
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                        : isDark ? 'border-indigo-600/60 hover:border-indigo-500 bg-indigo-900/10' : 'border-indigo-300 hover:border-indigo-400 bg-indigo-50/50'
                        }`}
                    >
                      <div className="flex justify-center mb-2">
                        <div className={`w-12 h-10 flex items-center justify-center rounded-lg border text-xl ${isDark ? 'bg-indigo-900/30 border-indigo-700/50' : 'bg-indigo-100 border-indigo-200'
                          }`}>
                          🌐
                        </div>
                      </div>
                      <span className={`text-sm font-medium ${isDark ? 'text-indigo-300' : 'text-indigo-700'
                        }`}>
                        {t('دول أخرى', 'Other Countries', 'وڵاتی تر')}
                      </span>
                    </motion.button>
                  </div>
                  {errors.country && <p className="text-red-500 mt-4"><AlertCircle className="w-4 h-4 inline" /> {errors.country}</p>}
                  <motion.button onClick={handleNext} whileHover={{ scale: 1.02 }}
                    className={`w-full mt-8 py-4 font-bold rounded-2xl flex items-center justify-center gap-2 ${isDark ? 'bg-[#D4AF37] text-slate-900 hover:bg-[#FCD34D]' : 'bg-slate-900 text-white hover:bg-slate-800'
                      }`}>
                    {t('التالي', 'Next', 'داهاتوو')} <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              )}

              {/* Step 2: Select Method */}
              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
                  className={`rounded-3xl border-2 shadow-xl p-8 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
                    }`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                      <CreditCard className="w-6 h-6 text-purple-600" />
                    </div>
                    <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('اختر طريقة التحويل', 'Select Method', 'شێوازی گواستنەوە هەڵبژێرە')}</h2>
                  </div>
                  <div className="space-y-4">
                    {methods.map(m => (
                      <motion.button key={m.method_id} type="button" whileHover={{ scale: 1.02 }}
                        onClick={() => setWizardData(p => ({ ...p, method: m.method_id }))}
                        className={`w-full p-6 rounded-2xl border-2 text-left relative transition-colors ${wizardData.method === m.method_id
                          ? 'border-[#D4AF37] bg-[#D4AF37]/5'
                          : isDark ? 'border-slate-600 hover:border-slate-500' : 'border-slate-200 hover:border-slate-300'
                          }`}>
                        <div className="flex items-center justify-between">
                          <div className={isArabic ? 'text-right' : 'text-left'}>
                            <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              {t(m.name_ar, m.name_en, m.name_ku)}
                            </h3>
                            <p className={`text-sm flex items-center gap-1 mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                              <Clock className="w-4 h-4" />
                              {m.duration}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('السعر', 'Rate', 'نرخ')}</p>
                            <p className="font-bold text-[#D4AF37]">{m.exchange_rate}</p>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                  {errors.method && <p className="text-red-500 mt-4"><AlertCircle className="w-4 h-4 inline" /> {errors.method}</p>}
                  <motion.button onClick={handleNext} whileHover={{ scale: 1.02 }}
                    className={`w-full mt-8 py-4 font-bold rounded-2xl flex items-center justify-center gap-2 ${isDark ? 'bg-[#D4AF37] text-slate-900 hover:bg-[#FCD34D]' : 'bg-slate-900 text-white hover:bg-slate-800'
                      }`}>
                    {t('التالي', 'Next', 'داهاتوو')} <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              )}

              {/* Step 3: Summary */}
              {step === 3 && selectedCountry && (selectedMethod || isOtherCountry) && (
                <motion.div key="s3" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
                  className={`rounded-3xl border-2 shadow-xl p-8 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
                    }`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-amber-500/20' : 'bg-amber-100'}`}>
                      <Star className="w-6 h-6 text-amber-600" />
                    </div>
                    <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('اختيارك', 'Your Selection', 'هەڵبژاردەکەت')}</h2>
                  </div>
                  <div className={`rounded-2xl p-6 space-y-4 ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                    <div className={`flex justify-between pb-4 border-b ${isDark ? 'border-slate-600' : 'border-slate-200'}`}>
                      <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{t('الدولة', 'Country', 'وڵات')}</span>
                      <span className={`font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        <div className="w-8 h-6 flex items-center justify-center bg-white/10 rounded overflow-hidden border border-white/20">
                          <img
                            src={selectedCountry.flag && selectedCountry.flag.startsWith('http') ? selectedCountry.flag : `https://flagcdn.com/w40/${selectedCountry.country_code.toLowerCase()}.png`}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = 'https://flagcdn.com/w40/un.png'; }}
                          />
                        </div>
                        {t(selectedCountry.name_ar, selectedCountry.name_en, selectedCountry.name_ku)}
                      </span>
                    </div>
                    <div className={`flex justify-between pb-4 border-b ${isDark ? 'border-slate-600' : 'border-slate-200'}`}>
                      <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{t('الطريقة', 'Method', 'شێواز')}</span>
                      <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {t(selectedMethod.name_ar, selectedMethod.name_en, selectedMethod.name_ku)}
                      </span>
                    </div>
                    {!isOtherCountry && (
                      <div className="flex justify-between">
                        <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{t('سعر الصرف', 'Exchange Rate', 'نرخی ئاڵوگۆڕ')}</span>
                        {hasRateForCurrency
                          ? <span dir="ltr" className="font-bold text-[#D4AF37]">1 USD = {crossRate} {effectiveCurrency}</span>
                          : <span className="font-bold text-red-500">{t('غير متوفر', 'Not available', 'بەردەست نییە')}</span>
                        }
                      </div>
                    )}

                    {/* No-rate warning - only for regular countries */}
                    {!isOtherCountry && !hasRateForCurrency && (
                      <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-red-700 font-semibold text-sm">
                            {!usdRateObj
                              ? t('سعر صرف الدولار غير موجود في لوحة التحكم', 'USD exchange rate is missing in admin panel', 'نرخی دۆلار لە پانێلی کۆنترۆڵدا نییە')
                              : t(
                                `سعر الصرف لعملة ${effectiveCurrency} غير متوفر في لوحة التحكم`,
                                `Exchange rate for ${effectiveCurrency} is not set in the admin panel`,
                                `نرخی ${effectiveCurrency} لە پانێلی کۆنترۆڵدا دانەنراوە`
                              )
                            }
                          </p>
                          <p className="text-red-600 text-xs mt-1">
                            {t(
                              'يرجى التواصل مع الإدارة لإضافة سعر هذه العملة.',
                              'Please contact the admin to add this currency rate.',
                              'تکایە پەیوەندی بە ئەدمینەوە بکە بۆ زیادکردنی نرخی ئەم دراوە.'
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                    {/* Info note for "Other Countries" */}
                    {isOtherCountry && (
                      <div className="mt-4 p-4 rounded-xl bg-indigo-50 border border-indigo-200 flex items-start gap-3">
                        <Globe className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                        <p className="text-indigo-700 text-sm">
                          {t(
                            'طريقة التحويل: تحويل بنكي فقط. سيتم تحديد العملة والسعر عند التواصل معك.',
                            'Transfer method: Bank transfer only. Currency and rate will be specified when we contact you.',
                            'ڕێگای گواستنەوە: گواستنەوەی بانکی تەنها. دراو و نرخ لە کاتی پەیوەندиکردنەوە دیاری دەکرێت.'
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                  <motion.button
                    onClick={(isOtherCountry || hasRateForCurrency) ? handleNext : undefined}
                    disabled={!isOtherCountry && !hasRateForCurrency}
                    whileHover={(isOtherCountry || hasRateForCurrency) ? { scale: 1.02 } : {}}
                    className={`w-full mt-8 py-4 font-bold rounded-2xl flex items-center justify-center gap-2 transition-opacity ${(isOtherCountry || hasRateForCurrency)
                      ? isDark ? 'bg-[#D4AF37] text-slate-900 hover:bg-[#FCD34D]' : 'bg-slate-900 text-white hover:bg-slate-800'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
                      }`}>
                    {t('المتابعة', 'Continue', 'بەردەوام بە')} <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              )}

              {/* Step 4: Amount and Transfer Info Combined */}
              {step === 4 && (
                <motion.div key="s4" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
                  className={`rounded-3xl border-2 shadow-xl p-8 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
                    }`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                      <DollarSign className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('المبلغ والمعلومات', 'Amount & Info', 'بڕ و زانیاری')}</h2>
                  </div>

                  {/* Amount Section */}
                  <div className={`rounded-2xl p-6 mb-6 ${isDark ? 'bg-emerald-900/20 border border-emerald-700/50' : 'bg-emerald-50 border border-emerald-200'}`}>
                    <Label className={`text-lg font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>{t('المبلغ بالدولار ($)', 'Amount in USD ($)', 'بڕ بە دۆلار ($)')}</Label>
                    <Input type="number" value={wizardData.amount}
                      onWheel={(e) => e.target.blur()}
                      onChange={e => setWizardData(p => ({ ...p, amount: e.target.value }))}
                      className={`h-16 text-3xl font-bold mt-2 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : ''}`}
                      placeholder="100" min="1" />
                    {errors.amount && <p className="text-red-500 mt-2"><AlertCircle className="w-4 h-4 inline" /> {errors.amount}</p>}

                    {wizardData.amount && selectedMethod && (
                      <div className={`mt-4 p-4 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-white'}`}>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{t('المستلم سيحصل على', 'Receiver will get', 'وەرگر دەستیدەکەوێت')}</p>
                        <p className="text-2xl font-bold text-[#D4AF37]">{calculateReceiveAmount().toLocaleString()} {wizardData.receiverCurrency}</p>
                      </div>
                    )}
                  </div>


                  {/* Country and Currency Name Fields - For "Other Countries" */}
                  {isOtherCountry && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className={`rounded-2xl p-6 ${isDark ? 'bg-indigo-900/20 border border-indigo-700/50' : 'bg-indigo-50 border border-indigo-200'}`}>
                        <Label className={`text-lg font-bold mb-2 block ${isDark ? 'text-indigo-400' : 'text-indigo-700'}`}>
                          {t('اسم الدولة', 'Country Name', 'ناوی وڵات')} *
                        </Label>
                        <Input
                          value={wizardData.customCountryName}
                          onChange={e => setWizardData(p => ({ ...p, customCountryName: e.target.value }))}
                          className={`h-12 mt-1 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : ''}`}
                          placeholder={t('مثال: كندا، السويد...', 'e.g. Canada, Sweden...', 'بۆ نموونە: کەنەدا، سوید...')}
                        />
                        {errors.customCountryName && <p className="text-red-500 mt-2"><AlertCircle className="w-4 h-4 inline" /> {errors.customCountryName}</p>}
                      </div>

                      <div className={`rounded-2xl p-6 ${isDark ? 'bg-indigo-900/20 border border-indigo-700/50' : 'bg-indigo-50 border border-indigo-200'}`}>
                        <Label className={`text-lg font-bold mb-2 block ${isDark ? 'text-indigo-400' : 'text-indigo-700'}`}>
                          {t('اسم العملة', 'Currency Name', 'ناوی دراو')} *
                        </Label>
                        <Input
                          value={wizardData.customCurrencyName}
                          onChange={e => setWizardData(p => ({ ...p, customCurrencyName: e.target.value }))}
                          className={`h-12 mt-1 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : ''}`}
                          placeholder={t('مثال: يورو، ريال سعودي...', 'e.g. Euro, SAR...', 'بۆ نموونە: یۆرۆ، دۆلار...')}
                        />
                        {errors.customCurrencyName && <p className="text-red-500 mt-2"><AlertCircle className="w-4 h-4 inline" /> {errors.customCurrencyName}</p>}
                      </div>
                    </div>
                  )}

                  {/* Receiver Currency Selection - For Bank Transfers of regular countries */}
                  {isBankTransfer && !isOtherCountry && (
                    <div className={`rounded-2xl p-6 mb-6 ${isDark ? 'bg-blue-900/20 border border-blue-700/50' : 'bg-blue-50 border border-blue-200'}`}>
                      <Label className={`text-lg font-bold mb-4 block ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>
                        {t('عملة المستلم', 'Receiver Currency', 'دراوی وەرگر')} *
                      </Label>
                      <div className="grid grid-cols-3 gap-3">
                        {getAvailableCurrencies().map(currency => (
                          <motion.button
                            key={currency.code}
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setWizardData(p => ({ ...p, receiverCurrency: currency.code }))}
                            className={`p-4 rounded-xl border-2 text-center transition-colors ${wizardData.receiverCurrency === currency.code
                              ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                              : isDark ? 'border-slate-600 hover:border-slate-500' : 'border-slate-200 hover:border-slate-300'
                              }`}
                          >
                            <span className={`text-lg font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>{currency.code}</span>
                            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{t(currency.nameAr, currency.nameEn, currency.nameKu)}</span>
                          </motion.button>
                        ))}
                      </div>
                      {errors.receiverCurrency && <p className="text-red-500 mt-2"><AlertCircle className="w-4 h-4 inline" /> {errors.receiverCurrency}</p>}
                    </div>
                  )}

                  {/* Non-Bank: Show fixed currency info */}
                  {!isBankTransfer && !isOtherCountry && wizardData.country && (
                    <div className={`rounded-2xl p-4 mb-6 ${isDark ? 'bg-amber-900/20 border border-amber-700/50' : 'bg-amber-50 border border-amber-200'}`}>
                      <p className={`text-sm ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>
                        <AlertCircle className="w-4 h-4 inline ml-1" />
                        {isArabic
                          ? `سيتم استلام المبلغ بالعملة المحلية (${selectedCountry.currency})`
                          : (currentLanguage === 'ku'
                            ? `بڕەکە بە دراوی ناوخۆیی (${selectedCountry.currency}) وەردەگیرێت`
                            : `Amount will be received in local currency (${selectedCountry.currency})`)}
                      </p>
                    </div>
                  )}

                  {/* Transfer Info */}
                  <div className="space-y-5">
                    <div>
                      <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>{t('اسم المرسل', 'Sender Name', 'ناوی نێرەر')} *</Label>
                      <Input value={wizardData.senderName} onChange={e => setWizardData(p => ({ ...p, senderName: e.target.value }))}
                        className={`h-12 mt-2 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : ''}`} />
                      {errors.senderName && <p className="text-red-500 text-sm mt-1">{errors.senderName}</p>}
                    </div>
                    <div>
                      <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>{t('اسم المستلم', 'Receiver Name', 'ناوی وەرگر')} *</Label>
                      <Input value={wizardData.receiverName} onChange={e => setWizardData(p => ({ ...p, receiverName: e.target.value }))}
                        className={`h-12 mt-2 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : ''}`} />
                      {errors.receiverName && <p className="text-red-500 text-sm mt-1">{errors.receiverName}</p>}
                      {isBankTransfer && (
                        <p className={`text-xs mt-2 ${isDark ? 'text-amber-400/80' : 'text-amber-600'} font-medium flex items-center gap-1`}>
                          <AlertCircle className="w-3 h-3" />
                          {t('يجب ان يكون المستلم صاحب الحساب نفسه', 'Receiver must be the account holder', 'پێویستە وەرگر خاوەنی هەژمارەکە بێت')}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>{t('رقم هاتف المرسل', 'Sender Phone', 'مۆبایلی نێرەر')} *</Label>
                        <Input value={wizardData.senderPhone} onChange={e => setWizardData(p => ({ ...p, senderPhone: e.target.value }))}
                          className={`h-12 mt-2 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : ''}`} placeholder="+964" />
                        {errors.senderPhone && <p className="text-red-500 text-sm mt-1">{errors.senderPhone}</p>}
                      </div>
                      <div>
                        <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>{t('رقم هاتف المستلم', 'Receiver Phone', 'مۆبایلی وەرگرەر')} *</Label>
                        <Input value={wizardData.receiverPhone} onChange={e => setWizardData(p => ({ ...p, receiverPhone: e.target.value }))}
                          className={`h-12 mt-2 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : ''}`} placeholder="+964" />
                        {errors.receiverPhone && <p className="text-red-500 text-sm mt-1">{errors.receiverPhone}</p>}
                      </div>
                    </div>

                    {/* Purpose Selection */}
                    <div>
                      <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                        {t('الغرض من التحويل', 'Transfer Purpose', 'مەبەستی گواستنەوە')} {selectedCountry?.country_code?.toUpperCase() === 'CN' ? '*' : '*'}
                      </Label>
                      <select
                        value={selectedCountry?.country_code?.toUpperCase() === 'CN' ? 'trade' : wizardData.purpose}
                        onChange={e => setWizardData(p => ({ ...p, purpose: e.target.value }))}
                        disabled={selectedCountry?.country_code?.toUpperCase() === 'CN'}
                        className={`w-full h-12 mt-2 px-3 rounded-md border text-sm appearance-none ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-200 text-slate-900'
                          } disabled:opacity-50`}
                      >
                        {selectedCountry?.country_code?.toUpperCase() !== 'CN' && (
                          <option value="">{t('اختر الغرض', 'Select Purpose', 'مەبەست هەڵبژێرە')}</option>
                        )}
                        <option value="trade">{t('تجارة', 'Trade', 'بازرگانی')}</option>
                        {selectedCountry?.country_code?.toUpperCase() !== 'CN' && (
                          <>
                            <option value="family_expenses">{t('نفقات الأسرة', 'Family Expenses', 'خەرجی خێزان')}</option>
                            <option value="medical">{t('علاج', 'Medical Treatment', 'چاره‌سەری پزیشکی')}</option>
                          </>
                        )}
                      </select>
                      {errors.purpose && <p className="text-red-500 text-sm mt-1">{errors.purpose}</p>}
                    </div>
                    {/* Dynamic Custom Fields */}
                    {selectedMethod?.fields && selectedMethod.fields.length > 0 ? (
                      selectedMethod.fields.map(field => (
                        <div key={field.field_id}>
                          <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                            {t(field.name_ar, field.name_en, field.name_ku)} {field.required !== false && '*'}
                          </Label>

                          {field.field_type === 'select' ? (
                            <select
                              value={wizardData.customFields[field.field_id] || ''}
                              onChange={e => setWizardData(p => ({
                                ...p,
                                customFields: { ...p.customFields, [field.field_id]: e.target.value }
                              }))}
                              className={`w-full h-12 mt-2 px-3 rounded-md border text-sm appearance-none ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-200 text-slate-900'
                                }`}
                            >
                              <option value="">{t('اختر...', 'Select...', 'هەڵبژێرە...')}</option>
                              {field.options?.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          ) : field.field_type === 'file' ? (
                            <div className="mt-2">
                              {!wizardData.customFields[field.field_id] ? (
                                <label className={`block border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer ${isDark ? 'border-slate-600 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10' : 'border-slate-300 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5'}`}>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={e => handleDynamicFileUpload(field.field_id, e.target.files[0])}
                                    className="hidden"
                                    disabled={wizardData.fieldUploads[field.field_id]?.loading}
                                  />
                                  <div className="text-center">
                                    {wizardData.fieldUploads[field.field_id]?.loading ? (
                                      <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                                    ) : (
                                      <Upload className={`w-8 h-8 mx-auto mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                                    )}
                                    <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                      {wizardData.fieldUploads[field.field_id]?.loading
                                        ? t('جارٍ الرفع...', 'Uploading...', 'بارکردن...')
                                        : t('اضغط لرفع الصورة', 'Click to upload image', 'بۆ بارکردنی وێنە لێرە بدە')}
                                    </p>
                                  </div>
                                </label>
                              ) : (
                                <div className={`border-2 rounded-2xl p-3 flex items-center justify-between ${isDark ? 'bg-emerald-900/20 border-emerald-700/50' : 'bg-emerald-50 border-emerald-200'}`}>
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 overflow-hidden">
                                      <img
                                        src={wizardData.customFields[field.field_id]}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="overflow-hidden">
                                      <p className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        {wizardData.fieldUploads[field.field_id]?.fileName || t('صورة مرفوعة', 'Uploaded Image', 'وێنەی بارکراو')}
                                      </p>
                                      <p className="text-[10px] text-green-500 flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" />
                                        {t('جاهز', 'Ready', 'ئامادەیە')}
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeDynamicFile(field.field_id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                            </div>
                          ) : (
                            <Input
                              type={field.field_type || 'text'}
                              value={wizardData.customFields[field.field_id] || ''}
                              onChange={e => setWizardData(p => ({
                                ...p,
                                customFields: { ...p.customFields, [field.field_id]: e.target.value }
                              }))}
                              className={`h-12 mt-2 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : ''}`}
                              placeholder={t(field.placeholder_ar, field.placeholder_en, field.placeholder_ku)}
                            />
                          )}
                          {errors[field.field_id] && <p className="text-red-500 text-sm mt-1">{errors[field.field_id]}</p>}
                        </div>
                      ))
                    ) : (
                      /* Fallback to generic account number if no custom fields defined */
                      <div>
                        <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                          {t('رقم الحساب أو المعرف', 'Account or ID', 'ژمارەی ئەژمار یان ناسێنەر')} *
                        </Label>
                        <Input
                          value={wizardData.customFields.generic_account || ''}
                          onChange={e => setWizardData(p => ({
                            ...p,
                            customFields: { ...p.customFields, generic_account: e.target.value }
                          }))}
                          className={`h-12 mt-2 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : ''}`}
                        />
                      </div>
                    )}
                  </div>

                  {/* Summary Block - shown last before submit */}
                  {wizardData.amount && parseFloat(wizardData.amount) > 0 && usdRateObj && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className={`mt-6 p-6 rounded-2xl ${isDark ? 'bg-teal-900/20 border border-teal-700/50' : 'bg-teal-50 border border-teal-200'}`}
                    >
                      <h4 className={`font-bold mb-4 ${isDark ? 'text-teal-400' : 'text-teal-800'}`}>
                        {t('ملخص الطلب', 'Order Summary', 'پوختەی داواکاری')}
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>{t('المبلغ', 'Amount', 'بڕ')} (USD)</span>
                          <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            ${parseFloat(wizardData.amount).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>{t('سعر الصرف', 'Exchange Rate', 'نرخی ئاڵوگۆڕ')}</span>
                          <span dir="ltr" className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            1 USD = {usdRateObj.sell_rate.toLocaleString()} IQD
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>{t('المقابل بالدينار', 'Amount in IQD', 'بڕ بە دینار')}</span>
                          <span dir="ltr" className={`font-semibold ${isDark ? 'text-white' : ''}`}>
                            {calculateIQD().toLocaleString()} IQD
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>{t('رسوم الخدمة (2%)', 'Service Fee (2%)', 'رسوومى خزمەتگوزاری (2%)')}</span>
                          <span dir="ltr" className="font-semibold text-amber-500">
                            {calculateFee().toLocaleString()} IQD
                          </span>
                        </div>
                        <div className={`border-t pt-3 mt-3 ${isDark ? 'border-teal-700/50' : 'border-teal-200'}`}>
                          <div className="flex justify-between items-center">
                            <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('الإجمالي للدفع', 'Total to Pay', 'تێکڕای پارەدان')}</span>
                            <span dir="ltr" className="font-bold text-lg text-teal-500">
                              {calculateTotal().toLocaleString()} IQD
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <motion.button onClick={handleSubmit} disabled={loading} whileHover={{ scale: 1.02 }}
                    className="w-full mt-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50">
                    {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><CheckCircle className="w-5 h-5" />{t('تسجيل الطلب', 'Submit Order', 'تۆمارکردنی داواکاری')}</>}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer3D />
    </div>
  );
};

export default CountryWizard;
