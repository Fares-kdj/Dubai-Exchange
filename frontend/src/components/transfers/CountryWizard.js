import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, DollarSign, Globe, CreditCard, CheckCircle, AlertCircle, Search, Clock, User, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ReactCountryFlag from 'react-country-flag';
import Header from '../home/Header';
import Footer from '../home/Footer';

const CountryWizard = () => {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const isArabic = currentLanguage === 'ar';
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [countries, setCountries] = useState([]);
  const [methods, setMethods] = useState([]);

  const [wizardData, setWizardData] = useState({
    amount: '',
    country: null,
    method: null,
    senderName: '',
    receiverName: '',
    phone: '',
    accountNumber: ''
  });

  // Load countries data on mount
  useEffect(() => {
    setCountries([
      { code: 'dz', countryCode: 'DZ', nameAr: 'الجزائر', nameEn: 'Algeria' },
      { code: 'eg', countryCode: 'EG', nameAr: 'مصر', nameEn: 'Egypt' },
      { code: 'tr', countryCode: 'TR', nameAr: 'تركيا', nameEn: 'Turkey' },
      { code: 'jo', countryCode: 'JO', nameAr: 'الأردن', nameEn: 'Jordan' },
      { code: 'in', countryCode: 'IN', nameAr: 'الهند', nameEn: 'India' },
      { code: 'pk', countryCode: 'PK', nameAr: 'باكستان', nameEn: 'Pakistan' },
      { code: 'ae', countryCode: 'AE', nameAr: 'الإمارات', nameEn: 'UAE' },
      { code: 'sa', countryCode: 'SA', nameAr: 'السعودية', nameEn: 'Saudi Arabia' },
      { code: 'lb', countryCode: 'LB', nameAr: 'لبنان', nameEn: 'Lebanon' },
      { code: 'sy', countryCode: 'SY', nameAr: 'سوريا', nameEn: 'Syria' }
    ]);
  }, []);

  // Load methods when country changes
  useEffect(() => {
    if (!wizardData.country) {
      setMethods([]);
      return;
    }
    
    const methodsMap = {
      'dz': [
        { id: 'baridimob', nameAr: 'بريدي موب', nameEn: 'Baridi Mob', rate: 140, duration: '1-2h', badge: 'fastest' },
        { id: 'bank', nameAr: 'تحويل بنكي', nameEn: 'Bank Transfer', rate: 136, duration: '2-5d' }
      ],
      'eg': [
        { id: 'vodafone', nameAr: 'فودافون كاش', nameEn: 'Vodafone Cash', rate: 50, duration: 'Instant', badge: 'popular' },
        { id: 'bank', nameAr: 'تحويل بنكي', nameEn: 'Bank Transfer', rate: 48, duration: '2-3d' }
      ],
      'tr': [
        { id: 'papara', nameAr: 'باباره', nameEn: 'Papara', rate: 34, duration: 'Instant', badge: 'fastest' },
        { id: 'bank', nameAr: 'تحويل بنكي', nameEn: 'Bank Transfer', rate: 33, duration: '1-3d' }
      ],
      'jo': [
        { id: 'cliq', nameAr: 'كليك', nameEn: 'CliQ', rate: 2110, duration: '1-2h', badge: 'popular' },
        { id: 'bank', nameAr: 'تحويل بنكي', nameEn: 'Bank Transfer', rate: 2100, duration: '2-3d' }
      ],
      'in': [
        { id: 'upi', nameAr: 'UPI', nameEn: 'UPI', rate: 83, duration: 'Instant', badge: 'fastest' },
        { id: 'bank', nameAr: 'تحويل بنكي', nameEn: 'Bank Transfer', rate: 82, duration: '1-3d' }
      ],
      'pk': [
        { id: 'jazzcash', nameAr: 'جاز كاش', nameEn: 'JazzCash', rate: 278, duration: 'Instant', badge: 'popular' },
        { id: 'bank', nameAr: 'تحويل بنكي', nameEn: 'Bank Transfer', rate: 276, duration: '2-3d' }
      ],
      'ae': [
        { id: 'bank', nameAr: 'تحويل بنكي', nameEn: 'Bank Transfer', rate: 400, duration: '1-2d', badge: 'popular' }
      ],
      'sa': [
        { id: 'stcpay', nameAr: 'STC Pay', nameEn: 'STC Pay', rate: 390, duration: 'Instant', badge: 'fastest' },
        { id: 'bank', nameAr: 'تحويل بنكي', nameEn: 'Bank Transfer', rate: 388, duration: '1-2d' }
      ],
      'lb': [
        { id: 'bank', nameAr: 'تحويل بنكي', nameEn: 'Bank Transfer', rate: 89000, duration: '2-3d' }
      ],
      'sy': [
        { id: 'hawala', nameAr: 'حوالة', nameEn: 'Hawala', rate: 14000, duration: '1-2d', badge: 'popular' }
      ]
    };
    
    setMethods(methodsMap[wizardData.country] || []);
  }, [wizardData.country]);

  const filteredCountries = countries.filter(c => 
    c.nameAr.includes(searchQuery) || c.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCountry = countries.find(c => c.code === wizardData.country);
  const selectedMethod = methods.find(m => m.id === wizardData.method);

  const calculateReceiveAmount = () => {
    if (!wizardData.amount || !selectedMethod) return 0;
    return Math.round(parseFloat(wizardData.amount) * selectedMethod.rate);
  };

  const handleNext = () => {
    if (step === 1 && (!wizardData.amount || parseFloat(wizardData.amount) <= 0)) {
      setErrors({ amount: isArabic ? 'أدخل المبلغ' : 'Enter amount' });
      return;
    }
    if (step === 2 && !wizardData.country) {
      setErrors({ country: isArabic ? 'اختر الدولة' : 'Select country' });
      return;
    }
    if (step === 3 && !wizardData.method) {
      setErrors({ method: isArabic ? 'اختر الطريقة' : 'Select method' });
      return;
    }
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
    if (!wizardData.senderName.trim()) newErrors.senderName = isArabic ? 'مطلوب' : 'Required';
    if (!wizardData.receiverName.trim()) newErrors.receiverName = isArabic ? 'مطلوب' : 'Required';
    if (!wizardData.phone.trim()) newErrors.phone = isArabic ? 'مطلوب' : 'Required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    navigate('/transfers/success', { 
      state: { 
        orderData: {
          amount: wizardData.amount,
          senderName: wizardData.senderName,
          receiverName: wizardData.receiverName,
          phone: wizardData.phone,
          type: 'country_based',
          countryName: selectedCountry ? (isArabic ? selectedCountry.nameAr : selectedCountry.nameEn) : '',
          methodName: selectedMethod ? (isArabic ? selectedMethod.nameAr : selectedMethod.nameEn) : '',
          receiveAmount: calculateReceiveAmount(),
          orderId: 'CB-' + Date.now().toString().slice(-8)
        }
      }
    });
  };

  // Step indicator
  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[1, 2, 3, 4, 5].map(s => (
        <React.Fragment key={s}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
            s < step ? 'bg-green-500 text-white' : s === step ? 'bg-[#D4AF37] text-white shadow-lg' : 'bg-slate-200 text-slate-500'
          }`}>
            {s < step ? <CheckCircle className="w-5 h-5" /> : s}
          </div>
          {s < 5 && <div className={`w-8 h-1 rounded ${s < step ? 'bg-green-500' : 'bg-slate-200'}`} />}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <Header />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => step === 1 ? navigate('/transfers/international') : handleBack()}
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

          <StepIndicator />

          <div className="max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
              {/* Step 1 */}
              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
                  className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">{isArabic ? 'أدخل المبلغ' : 'Enter Amount'}</h2>
                  </div>
                  <div className="space-y-4">
                    <Label className="text-lg">{isArabic ? 'المبلغ ($)' : 'Amount ($)'}</Label>
                    <Input type="number" value={wizardData.amount}
                      onChange={e => setWizardData(p => ({ ...p, amount: e.target.value }))}
                      className="h-16 text-3xl font-bold" placeholder="100" min="1" />
                    {errors.amount && <p className="text-red-600"><AlertCircle className="w-4 h-4 inline" /> {errors.amount}</p>}
                  </div>
                  <motion.button onClick={handleNext} whileHover={{ scale: 1.02 }}
                    className="w-full mt-8 py-4 bg-slate-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2">
                    {isArabic ? 'التالي' : 'Next'} <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
                  className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                      <Globe className="w-6 h-6 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">{isArabic ? 'اختر الدولة' : 'Select Country'}</h2>
                  </div>
                  <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                      className="h-12 pl-12" placeholder={isArabic ? 'ابحث...' : 'Search...'} />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {filteredCountries.map(c => (
                      <motion.button key={c.code} type="button" whileHover={{ scale: 1.05 }}
                        onClick={() => setWizardData(p => ({ ...p, country: c.code, method: null }))}
                        className={`p-4 rounded-2xl border-2 text-center ${wizardData.country === c.code ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-slate-200'}`}>
                        <div className="flex justify-center mb-2">
                          <ReactCountryFlag
                            countryCode={c.countryCode}
                            svg
                            style={{
                              width: '48px',
                              height: '36px',
                              borderRadius: '4px',
                              objectFit: 'cover',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium">{isArabic ? c.nameAr : c.nameEn}</span>
                      </motion.button>
                    ))}
                  </div>
                  {errors.country && <p className="text-red-600 mt-4"><AlertCircle className="w-4 h-4 inline" /> {errors.country}</p>}
                  <motion.button onClick={handleNext} whileHover={{ scale: 1.02 }}
                    className="w-full mt-8 py-4 bg-slate-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2">
                    {isArabic ? 'التالي' : 'Next'} <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
                  className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-purple-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">{isArabic ? 'اختر الطريقة' : 'Select Method'}</h2>
                  </div>
                  <div className="space-y-4">
                    {methods.map(m => (
                      <motion.button key={m.id} type="button" whileHover={{ scale: 1.02 }}
                        onClick={() => setWizardData(p => ({ ...p, method: m.id }))}
                        className={`w-full p-6 rounded-2xl border-2 text-left relative ${wizardData.method === m.id ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-slate-200'}`}>
                        {m.badge && <span className="absolute -top-2 right-4 px-3 py-1 bg-[#D4AF37] rounded-full text-xs font-bold">{m.badge === 'fastest' ? (isArabic ? 'الأسرع' : 'Fastest') : (isArabic ? 'شائع' : 'Popular')}</span>}
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-lg">{isArabic ? m.nameAr : m.nameEn}</h3>
                            <p className="text-sm text-slate-600 flex items-center gap-1 mt-1"><Clock className="w-4 h-4" />{m.duration}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-500">{isArabic ? 'السعر' : 'Rate'}</p>
                            <p className="font-bold text-emerald-600">{m.rate}</p>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                  {errors.method && <p className="text-red-600 mt-4"><AlertCircle className="w-4 h-4 inline" /> {errors.method}</p>}
                  <motion.button onClick={handleNext} whileHover={{ scale: 1.02 }}
                    className="w-full mt-8 py-4 bg-slate-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2">
                    {isArabic ? 'التالي' : 'Next'} <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              )}

              {/* Step 4 */}
              {step === 4 && selectedCountry && selectedMethod && (
                <motion.div key="s4" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
                  className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
                      <Star className="w-6 h-6 text-amber-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">{isArabic ? 'ملخص' : 'Summary'}</h2>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
                    <div className="flex justify-between pb-4 border-b">
                      <span>{isArabic ? 'الدولة' : 'Country'}</span>
                      <span className="font-bold flex items-center gap-2">
                        <ReactCountryFlag
                          countryCode={selectedCountry.countryCode}
                          svg
                          style={{ width: '24px', height: '18px', borderRadius: '2px' }}
                        />
                        {isArabic ? selectedCountry.nameAr : selectedCountry.nameEn}
                      </span>
                    </div>
                    <div className="flex justify-between pb-4 border-b">
                      <span>{isArabic ? 'الطريقة' : 'Method'}</span>
                      <span className="font-bold">{isArabic ? selectedMethod.nameAr : selectedMethod.nameEn}</span>
                    </div>
                    <div className="flex justify-between pb-4 border-b">
                      <span>{isArabic ? 'المبلغ' : 'Amount'}</span>
                      <span className="font-bold">${wizardData.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{isArabic ? 'المستلم' : 'Receive'}</span>
                      <span className="font-bold text-2xl text-emerald-600">{calculateReceiveAmount().toLocaleString()}</span>
                    </div>
                  </div>
                  <motion.button onClick={handleNext} whileHover={{ scale: 1.02 }}
                    className="w-full mt-8 py-4 bg-slate-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2">
                    {isArabic ? 'المتابعة' : 'Continue'} <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              )}

              {/* Step 5 */}
              {step === 5 && (
                <motion.div key="s5" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
                  className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">{isArabic ? 'معلومات التحويل' : 'Transfer Info'}</h2>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <Label>{isArabic ? 'اسم المرسل' : 'Sender Name'} *</Label>
                      <Input value={wizardData.senderName} onChange={e => setWizardData(p => ({ ...p, senderName: e.target.value }))} className="h-12 mt-2" />
                      {errors.senderName && <p className="text-red-600 text-sm mt-1">{errors.senderName}</p>}
                    </div>
                    <div>
                      <Label>{isArabic ? 'اسم المستلم' : 'Receiver Name'} *</Label>
                      <Input value={wizardData.receiverName} onChange={e => setWizardData(p => ({ ...p, receiverName: e.target.value }))} className="h-12 mt-2" />
                      {errors.receiverName && <p className="text-red-600 text-sm mt-1">{errors.receiverName}</p>}
                    </div>
                    <div>
                      <Label>{isArabic ? 'رقم الهاتف' : 'Phone'} *</Label>
                      <Input value={wizardData.phone} onChange={e => setWizardData(p => ({ ...p, phone: e.target.value }))} className="h-12 mt-2" placeholder="+964" />
                      {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                    </div>
                    <div>
                      <Label>{isArabic ? 'رقم الحساب (اختياري)' : 'Account (optional)'}</Label>
                      <Input value={wizardData.accountNumber} onChange={e => setWizardData(p => ({ ...p, accountNumber: e.target.value }))} className="h-12 mt-2" />
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
