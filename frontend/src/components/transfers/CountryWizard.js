import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, DollarSign, Globe, CreditCard, CheckCircle, AlertCircle, Search, Clock, User, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Header from '../home/Header';
import Footer from '../home/Footer';

// Helper function to get country by code
const getCountryByCode = (code, countries) => {
  for (let i = 0; i < countries.length; i++) {
    if (countries[i].code === code) return countries[i];
  }
  return null;
};

// Helper function to get method by id
const getMethodById = (id, methods) => {
  if (!methods) return null;
  for (let i = 0; i < methods.length; i++) {
    if (methods[i].id === id) return methods[i];
  }
  return null;
};

const CountryWizard = () => {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const isArabic = currentLanguage === 'ar';
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const [wizardData, setWizardData] = useState({
    amount: '',
    country: null,
    method: null,
    senderName: '',
    receiverName: '',
    phone: '',
    accountNumber: ''
  });

  // Countries data as constant
  const countriesData = [
    { code: 'dz', nameAr: 'الجزائر', nameEn: 'Algeria', flag: '🇩🇿',
      methods: [
        { id: 'baridimob', nameAr: 'بريدي موب', nameEn: 'Baridi Mob', rate: 140, duration: '1-2 hours', badge: 'fastest' },
        { id: 'bank', nameAr: 'تحويل بنكي', nameEn: 'Bank Transfer', rate: 136, duration: '2-5 days' }
      ]
    },
    { code: 'eg', nameAr: 'مصر', nameEn: 'Egypt', flag: '🇪🇬',
      methods: [
        { id: 'vodafone', nameAr: 'فودافون كاش', nameEn: 'Vodafone Cash', rate: 50, duration: 'Instant', badge: 'popular' },
        { id: 'bank', nameAr: 'تحويل بنكي', nameEn: 'Bank Transfer', rate: 48, duration: '2-3 days' }
      ]
    },
    { code: 'tr', nameAr: 'تركيا', nameEn: 'Turkey', flag: '🇹🇷',
      methods: [
        { id: 'papara', nameAr: 'باباره', nameEn: 'Papara', rate: 34, duration: 'Instant', badge: 'fastest' },
        { id: 'bank', nameAr: 'تحويل بنكي', nameEn: 'Bank Transfer', rate: 33, duration: '1-3 days' }
      ]
    },
    { code: 'jo', nameAr: 'الأردن', nameEn: 'Jordan', flag: '🇯🇴',
      methods: [
        { id: 'cliq', nameAr: 'كليك', nameEn: 'CliQ', rate: 2110, duration: '1-2 hours', badge: 'popular' },
        { id: 'bank', nameAr: 'تحويل بنكي', nameEn: 'Bank Transfer', rate: 2100, duration: '2-3 days' }
      ]
    },
    { code: 'in', nameAr: 'الهند', nameEn: 'India', flag: '🇮🇳',
      methods: [
        { id: 'upi', nameAr: 'UPI', nameEn: 'UPI', rate: 83, duration: 'Instant', badge: 'fastest' },
        { id: 'bank', nameAr: 'تحويل بنكي', nameEn: 'Bank Transfer', rate: 82, duration: '1-3 days' }
      ]
    },
    { code: 'pk', nameAr: 'باكستان', nameEn: 'Pakistan', flag: '🇵🇰',
      methods: [
        { id: 'jazzcash', nameAr: 'جاز كاش', nameEn: 'JazzCash', rate: 278, duration: 'Instant', badge: 'popular' },
        { id: 'bank', nameAr: 'تحويل بنكي', nameEn: 'Bank Transfer', rate: 276, duration: '2-3 days' }
      ]
    }
  ];

  const filteredCountries = countriesData.filter(function(c) {
    return c.nameAr.includes(searchQuery) || c.nameEn.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const selectedCountry = getCountryByCode(wizardData.country, countriesData);
  const selectedMethod = selectedCountry ? getMethodById(wizardData.method, selectedCountry.methods) : null;

  const calculateReceiveAmount = function() {
    if (!wizardData.amount || !selectedMethod) return 0;
    return Math.round(parseFloat(wizardData.amount) * selectedMethod.rate);
  };

  const handleNext = function() {
    if (step === 1 && (!wizardData.amount || parseFloat(wizardData.amount) <= 0)) {
      setErrors({ amount: isArabic ? 'أدخل المبلغ' : 'Enter amount' });
      return;
    }
    if (step === 2 && !wizardData.country) {
      setErrors({ country: isArabic ? 'اختر الدولة' : 'Select country' });
      return;
    }
    if (step === 3 && !wizardData.method) {
      setErrors({ method: isArabic ? 'اختر طريقة التحويل' : 'Select method' });
      return;
    }
    setErrors({});
    setStep(function(s) { return s + 1; });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = function() {
    setStep(function(s) { return s - 1; });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async function() {
    const newErrors = {};
    if (!wizardData.senderName.trim()) newErrors.senderName = isArabic ? 'مطلوب' : 'Required';
    if (!wizardData.receiverName.trim()) newErrors.receiverName = isArabic ? 'مطلوب' : 'Required';
    if (!wizardData.phone.trim()) newErrors.phone = isArabic ? 'مطلوب' : 'Required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    await new Promise(function(resolve) { setTimeout(resolve, 2000); });
    
    const countryName = selectedCountry ? (isArabic ? selectedCountry.nameAr : selectedCountry.nameEn) : '';
    const methodName = selectedMethod ? (isArabic ? selectedMethod.nameAr : selectedMethod.nameEn) : '';
    
    navigate('/transfers/success', { 
      state: { 
        orderData: {
          amount: wizardData.amount,
          senderName: wizardData.senderName,
          receiverName: wizardData.receiverName,
          phone: wizardData.phone,
          type: 'country_based',
          countryName: countryName,
          methodName: methodName,
          receiveAmount: calculateReceiveAmount(),
          orderId: 'CB-' + Date.now().toString().slice(-8)
        }
      }
    });
  };

  const updateAmount = function(e) {
    setWizardData(function(prev) { return { ...prev, amount: e.target.value }; });
  };

  const selectCountry = function(code) {
    setWizardData(function(prev) { return { ...prev, country: code, method: null }; });
  };

  const selectMethod = function(id) {
    setWizardData(function(prev) { return { ...prev, method: id }; });
  };

  const updateField = function(field, value) {
    setWizardData(function(prev) { 
      const newData = { ...prev };
      newData[field] = value;
      return newData;
    });
  };

  // Step Indicator
  const renderSteps = function() {
    const steps = [1, 2, 3, 4, 5];
    return (
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map(function(s) {
          let className = 'w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ';
          if (s < step) {
            className += 'bg-green-500 text-white';
          } else if (s === step) {
            className += 'bg-[#D4AF37] text-white shadow-lg';
          } else {
            className += 'bg-slate-200 text-slate-500';
          }
          
          return (
            <React.Fragment key={s}>
              <div className={className}>
                {s < step ? <CheckCircle className="w-5 h-5" /> : s}
              </div>
              {s < 5 && <div className={'w-8 h-1 rounded ' + (s < step ? 'bg-green-500' : 'bg-slate-200')} />}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <Header />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={function() { step === 1 ? navigate('/transfers/international') : handleBack(); }}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            {isArabic ? 'رجوع' : 'Back'}
          </motion.button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Globe className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              {isArabic ? 'تحويل حسب الدولة' : 'Country-based Transfer'}
            </h1>
          </motion.div>

          {renderSteps()}

          <div className="max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
                  className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">{isArabic ? 'أدخل المبلغ' : 'Enter Amount'}</h2>
                  </div>
                  <div className="space-y-4">
                    <Label className="text-lg font-medium">{isArabic ? 'المبلغ بالدولار' : 'Amount in USD'}</Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">$</span>
                      <Input type="number" value={wizardData.amount} onChange={updateAmount}
                        className="h-16 text-3xl font-bold pl-12 border-2" placeholder="100" min="1" />
                    </div>
                    {errors.amount && <p className="text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.amount}</p>}
                  </div>
                  <motion.button onClick={handleNext} whileHover={{ scale: 1.02 }}
                    className="w-full mt-8 py-4 bg-slate-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2">
                    {isArabic ? 'التالي' : 'Next'} <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
                  className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                      <Globe className="w-6 h-6 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">{isArabic ? 'اختر الدولة' : 'Select Country'}</h2>
                  </div>
                  <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input value={searchQuery} onChange={function(e) { setSearchQuery(e.target.value); }} className="h-12 pl-12" placeholder={isArabic ? 'ابحث...' : 'Search...'} />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto">
                    {filteredCountries.map(function(country) {
                      const isSelected = wizardData.country === country.code;
                      return (
                        <motion.button key={country.code} type="button" onClick={function() { selectCountry(country.code); }}
                          whileHover={{ scale: 1.05 }}
                          className={'p-4 rounded-2xl border-2 transition-all text-center ' + (isSelected ? 'border-[#D4AF37] bg-[#D4AF37]/10 shadow-lg' : 'border-slate-200 hover:border-slate-300')}>
                          <span className="text-4xl mb-2 block">{country.flag}</span>
                          <span className="font-medium text-slate-900 text-sm">{isArabic ? country.nameAr : country.nameEn}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                  {errors.country && <p className="text-red-600 flex items-center gap-1 mt-4"><AlertCircle className="w-4 h-4" />{errors.country}</p>}
                  <motion.button onClick={handleNext} whileHover={{ scale: 1.02 }}
                    className="w-full mt-8 py-4 bg-slate-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2">
                    {isArabic ? 'التالي' : 'Next'} <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              )}

              {step === 3 && selectedCountry && (
                <motion.div key="step3" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
                  className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-purple-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">{isArabic ? 'اختر الطريقة' : 'Select Method'}</h2>
                  </div>
                  <div className="space-y-4">
                    {selectedCountry.methods.map(function(method) {
                      const isSelected = wizardData.method === method.id;
                      return (
                        <motion.button key={method.id} type="button" onClick={function() { selectMethod(method.id); }} whileHover={{ scale: 1.02 }}
                          className={'w-full p-6 rounded-2xl border-2 transition-all text-left relative ' + (isSelected ? 'border-[#D4AF37] bg-[#D4AF37]/5 shadow-lg' : 'border-slate-200 hover:border-slate-300')}>
                          {method.badge && (
                            <span className="absolute -top-2 right-4 px-3 py-1 bg-gradient-to-r from-[#D4AF37] to-[#FCD34D] rounded-full text-xs font-bold">
                              {method.badge === 'fastest' ? (isArabic ? 'الأسرع' : 'Fastest') : (isArabic ? 'شائع' : 'Popular')}
                            </span>
                          )}
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-bold text-lg">{isArabic ? method.nameAr : method.nameEn}</h3>
                              <div className="flex items-center gap-2 mt-2 text-sm text-slate-600">
                                <Clock className="w-4 h-4" />{method.duration}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-slate-500">{isArabic ? 'السعر' : 'Rate'}</p>
                              <p className="font-bold text-lg text-emerald-600">{method.rate}</p>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                  {errors.method && <p className="text-red-600 flex items-center gap-1 mt-4"><AlertCircle className="w-4 h-4" />{errors.method}</p>}
                  <motion.button onClick={handleNext} whileHover={{ scale: 1.02 }}
                    className="w-full mt-8 py-4 bg-slate-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2">
                    {isArabic ? 'التالي' : 'Next'} <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              )}

              {step === 4 && selectedCountry && selectedMethod && (
                <motion.div key="step4" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
                  className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
                      <Star className="w-6 h-6 text-amber-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">{isArabic ? 'ملخص' : 'Summary'}</h2>
                  </div>
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                      <span className="text-slate-600">{isArabic ? 'الدولة' : 'Country'}</span>
                      <span className="font-bold text-lg flex items-center gap-2">
                        {selectedCountry.flag} {isArabic ? selectedCountry.nameAr : selectedCountry.nameEn}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                      <span className="text-slate-600">{isArabic ? 'الطريقة' : 'Method'}</span>
                      <span className="font-bold">{isArabic ? selectedMethod.nameAr : selectedMethod.nameEn}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                      <span className="text-slate-600">{isArabic ? 'المبلغ' : 'Amount'}</span>
                      <span className="font-bold text-lg">${wizardData.amount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">{isArabic ? 'المستلم' : 'Receive'}</span>
                      <span className="font-bold text-2xl text-emerald-600">{calculateReceiveAmount().toLocaleString()}</span>
                    </div>
                  </div>
                  <motion.button onClick={handleNext} whileHover={{ scale: 1.02 }}
                    className="w-full mt-8 py-4 bg-slate-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2">
                    {isArabic ? 'المتابعة' : 'Continue'} <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div key="step5" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
                  className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">{isArabic ? 'معلومات التحويل' : 'Transfer Info'}</h2>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>{isArabic ? 'اسم المرسل' : 'Sender Name'} *</Label>
                      <Input value={wizardData.senderName} onChange={function(e) { updateField('senderName', e.target.value); }} className="h-12" />
                      {errors.senderName && <p className="text-sm text-red-600">{errors.senderName}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>{isArabic ? 'اسم المستلم' : 'Receiver Name'} *</Label>
                      <Input value={wizardData.receiverName} onChange={function(e) { updateField('receiverName', e.target.value); }} className="h-12" />
                      {errors.receiverName && <p className="text-sm text-red-600">{errors.receiverName}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>{isArabic ? 'رقم الهاتف' : 'Phone'} *</Label>
                      <Input value={wizardData.phone} onChange={function(e) { updateField('phone', e.target.value); }} className="h-12" placeholder="+964 7XX XXX XXXX" />
                      {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>{isArabic ? 'رقم الحساب (اختياري)' : 'Account (optional)'}</Label>
                      <Input value={wizardData.accountNumber} onChange={function(e) { updateField('accountNumber', e.target.value); }} className="h-12" />
                    </div>
                  </div>
                  <motion.button onClick={handleSubmit} disabled={loading} whileHover={{ scale: 1.02 }}
                    className="w-full mt-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50">
                    {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><CheckCircle className="w-5 h-5" />{isArabic ? 'تسجيل الطلب' : 'Submit'}</>}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CountryWizard;
