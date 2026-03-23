import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';
import { useTheme } from '@/context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, User, Phone, DollarSign, CheckCircle, AlertCircle, ArrowLeft, Copy, Network, Link2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CountryPhoneSelect from '@/components/ui/CountryPhoneSelect';
import Header3D from '../landing/Header3D';
import Footer3D from '../landing/Footer3D';
import { PAYMENT_METHODS, SERVICE_FEES } from '@/config/payments';

const USDTRecharge = () => {
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
  const [copied, setCopied] = useState(false);
  const [hoveredMethod, setHoveredMethod] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    network: '',
    walletAddress: '',
    amount: '',
    paymentMethod: ''
  });

  // Crypto Networks
  const networks = [
    {
      value: 'trc20',
      labelAr: 'TRC20 (ترون)',
      labelEn: 'TRC20 (Tron)',
      icon: '🔴',
      labelKu: 'TRC20 (ترۆن)',
      icon: '🔴',
      description: t('الأسرع والأرخص', 'Fastest & Cheapest', 'خێراترین و هەڵەترین'),
      fee: '1 USDT',
      color: 'from-red-500 to-red-600'
    },
    {
      value: 'erc20',
      labelAr: 'ERC20 (إيثريوم)',
      labelEn: 'ERC20 (Ethereum)',
      icon: '🔵',
      labelKu: 'ERC20 (ئیسێریۆم)',
      icon: '🔵',
      description: t('الأكثر استخداماً', 'Most Used', 'زۆرترین بەکارهێنان'),
      fee: '5-20 USDT',
      color: 'from-blue-500 to-blue-600'
    },
    {
      value: 'bep20',
      labelAr: 'BEP20 (بينانس)',
      labelEn: 'BEP20 (BSC)',
      icon: '🟡',
      labelKu: 'BEP20 (باینانس)',
      icon: '🟡',
      description: t('شبكة بينانس', 'Binance Smart Chain', 'تۆڕی باینانس'),
      fee: '0.5 USDT',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      value: 'polygon',
      labelAr: 'Polygon',
      labelEn: 'Polygon (MATIC)',
      icon: '🟣',
      labelKu: 'Polygon',
      icon: '🟣',
      description: t('رسوم منخفضة', 'Low Fees', 'رسوومی کەم'),
      fee: '0.1 USDT',
      color: 'from-purple-500 to-purple-600'
    },
    {
      value: 'sol',
      labelAr: 'Solana',
      labelEn: 'Solana (SOL)',
      icon: '🟢',
      labelKu: 'Solana',
      icon: '🟢',
      description: t('سريعة جداً', 'Very Fast', 'زۆر خێرا'),
      fee: '0.01 USDT',
      color: 'from-teal-500 to-emerald-500'
    },
    {
      value: 'arbitrum',
      labelAr: 'Arbitrum',
      labelEn: 'Arbitrum One',
      icon: '🔵',
      labelKu: 'Arbitrum',
      icon: '🔵',
      description: t('Layer 2 إيثريوم', 'Ethereum Layer 2', 'Layer 2 ئیسێریۆم'),
      fee: '0.5 USDT',
      color: 'from-sky-500 to-sky-600'
    }
  ];

  const paymentMethods = PAYMENT_METHODS.filter(m => m.active);

  const [usdtToIQD, setUsdtToIQD] = useState(1480);

  // Fetch exchange rate on mount
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/rates?active_only=true`);
        if (response.ok) {
          const ratesData = await response.json();
          const usdData = ratesData.find(r => r.currency_code === 'USD');
          if (usdData && usdData.sell_rate) {
            setUsdtToIQD(usdData.sell_rate);
          }
        }
      } catch (err) {
        console.error('Failed to fetch exchange rate:', err);
      }
    };
    fetchRate();
  }, []);
  const serviceFeePercent = SERVICE_FEES.usdt_recharge; // 2%

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const calculateIQD = () => {
    if (!formData.amount) return 0;
    return Math.round(parseFloat(formData.amount) * usdtToIQD);
  };

  const calculateFee = () => {
    return Math.round(calculateIQD() * serviceFeePercent / 100);
  };

  const calculateTotal = () => {
    return calculateIQD() + calculateFee();
  };

  const validateWalletAddress = (address, network) => {
    if (!address) return false;
    // Basic validation by network
    if (network === 'trc20' && !address.startsWith('T')) return false;
    if (network === 'erc20' && !address.startsWith('0x')) return false;
    if (network === 'bep20' && !address.startsWith('0x')) return false;
    if (network === 'polygon' && !address.startsWith('0x')) return false;
    if (network === 'arbitrum' && !address.startsWith('0x')) return false;
    return address.length >= 30;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = t('الاسم مطلوب', 'Name required', 'ناو پێویستە');
    if (!formData.phone.trim()) newErrors.phone = t('الهاتف مطلوب', 'Phone required', 'مۆبایل پێویستە');
    if (!formData.network) newErrors.network = t('اختر الشبكة', 'Select network', 'تۆڕ هەڵبژێرە');
    if (!formData.walletAddress.trim()) {
      newErrors.walletAddress = t('عنوان المحفظة مطلوب', 'Wallet address required', 'ناونیشانی وێڵێت پێویستە');
    } else if (!validateWalletAddress(formData.walletAddress, formData.network)) {
      newErrors.walletAddress = t('عنوان غير صالح لهذه الشبكة', 'Invalid address for this network', 'ناونیشانی نادروست بۆ ئەم تۆڕە');
    }
    if (!formData.amount || parseFloat(formData.amount) < 10) {
      newErrors.amount = t('الحد الأدنى 10 USDT', 'Minimum 10 USDT', 'کەمترین ١٠ USDT');
    }
    if (!formData.paymentMethod) newErrors.paymentMethod = t('طريقة الدفع مطلوبة', 'Payment method required', 'شێوازی پارەدان پێویستە');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(formData.walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
      const selectedNetwork = networks.find(n => n.value === formData.network);
      const orderData = {
        order_type: 'usdt_recharge',
        customer: { full_name: formData.fullName, phone: formData.phone },
        details: {
          network: formData.network,
          networkName: selectedNetwork ? (currentLanguage === 'ar' ? selectedNetwork.labelAr : selectedNetwork.labelEn) : '',
          walletAddress: formData.walletAddress,
          amount: formData.amount,
          amountIQD: calculateIQD(),
          serviceFee: calculateFee(),
          total: calculateTotal(),
          paymentMethod: formData.paymentMethod
        }
      };

      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const order = await response.json();
        navigate('/services/usdt/success', {
          state: {
            orderData: {
              ...formData,
              type: 'usdt_recharge',
              currency: 'USDT',
              networkName: selectedNetwork ? t(selectedNetwork.labelAr, selectedNetwork.labelEn, selectedNetwork.labelKu) : '',
              amountIQD: calculateIQD(),
              serviceFee: calculateFee(),
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
      toast.error(t('حدث خطأ', 'Error occurred', 'هەڵەیەک ڕوویدا'));
    }

    setLoading(false);
  };

  const selectedNetwork = networks.find(n => n.value === formData.network);

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
            onClick={() => navigate('/')}
            className={`flex items-center gap-2 mb-8 group ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            {t('العودة للرئيسية', 'Back to Home', 'گەڕانەوە بۆ سەرەکی')}
          </motion.button>

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Wallet className="w-10 h-10 text-white" />
            </div>
            <h1 className={`text-3xl md:text-4xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t('شحن USDT', 'USDT Recharge', 'تێکردنەوەی USDT')}
            </h1>
            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              {t('شحن محفظتك بالعملات المشفرة', 'Recharge your crypto wallet', 'تێکردنەوەی وێڵێتەکەت بە دراوی کریپتۆ')}
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="max-w-3xl mx-auto"
            data-testid="usdt-recharge-form"
          >
            {/* Personal Info */}
            <div className={`rounded-3xl border-2 shadow-xl p-8 mb-6 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
              }`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                  <User className="w-6 h-6 text-blue-500" />
                </div>
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {t('البيانات الشخصية', 'Personal Info', 'زانیارییە کەسییەکان')}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    {t('الاسم الكامل', 'Full Name', 'ناوی تەواو')} *
                  </Label>
                  <Input
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className={`h-12 !text-white ${isDark ? 'bg-slate-700 border-slate-600' : 'border-slate-300 !text-slate-900'}`}
                    data-testid="full-name-input"
                    placeholder={t('أدخل الاسم الكامل', 'Enter full name', 'ناوی تەواو بنووسە')}
                  />
                  {errors.fullName && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.fullName}</p>}
                </div>

                <div className="space-y-2">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    {t('رقم الهاتف', 'Phone', 'مۆبایل')} *
                  </Label>
                  <CountryPhoneSelect
                    value={formData.phone}
                    onChange={(val) => handleInputChange('phone', val)}
                    isDark={isDark}
                    data-testid="phone-input"
                  />
                  {errors.phone && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Network Selection */}
            <div className={`rounded-3xl border-2 shadow-xl p-8 mb-6 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
              }`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                  <Network className="w-6 h-6 text-purple-500" />
                </div>
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {t('اختر الشبكة', 'Select Network', 'تۆڕ هەڵبژێرە')}
                </h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {networks.map(network => (
                  <motion.button
                    key={network.value}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleInputChange('network', network.value)}
                    className={`p-4 rounded-2xl border-2 text-right transition-all ${formData.network === network.value
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                      : isDark ? 'border-slate-600 hover:border-slate-500' : 'border-slate-200 hover:border-slate-300'
                      }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{network.icon}</span>
                      <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {t(network.labelAr, network.labelEn, network.labelKu)}
                      </span>
                    </div>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{network.description}</p>
                    <p className="text-xs text-amber-500 mt-1">{t('الرسوم:', 'Fee:', 'رسووم:')} {network.fee}</p>
                  </motion.button>
                ))}
              </div>
              {errors.network && <p className="text-sm text-red-500 flex items-center gap-1 mb-4"><AlertCircle className="w-4 h-4" />{errors.network}</p>}

              {/* Wallet Address */}
              <div className="space-y-2">
                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  <Link2 className="w-4 h-4 inline ml-1" />
                  {t('عنوان المحفظة', 'Wallet Address', 'ناونیشانی وێڵێت')} *
                </Label>
                <div className="relative">
                  <Input
                    value={formData.walletAddress}
                    onChange={(e) => handleInputChange('walletAddress', e.target.value)}
                    className={`h-12 font-mono text-sm !text-white ${isDark ? 'bg-slate-700 border-slate-600' : 'border-slate-300 !text-slate-900'}`}
                    placeholder={selectedNetwork ?
                      (formData.network === 'trc20' ? 'TXyz...' : '0x...') :
                      (t('اختر الشبكة أولاً', 'Select network first', 'سەرەتا تۆڕ هەڵبژێرە'))
                    }
                    dir="ltr"
                    data-testid="wallet-address-input"
                  />
                  {formData.walletAddress && (
                    <button
                      type="button"
                      onClick={copyAddress}
                      className={`absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-lg ${isDark ? 'hover:bg-slate-600' : 'hover:bg-slate-100'
                        }`}
                    >
                      <Copy className={`w-4 h-4 ${copied ? 'text-green-500' : isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                    </button>
                  )}
                </div>
                {errors.walletAddress && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.walletAddress}</p>}

                {selectedNetwork && (
                  <p className={`text-xs ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                    ⚠️ {t(
                      `تأكد من أن العنوان يدعم شبكة ${selectedNetwork.labelAr}`,
                      `Make sure the address supports ${selectedNetwork.labelEn} network`,
                      `دڵنیابەرەوە کە ناونیشانەکە پشتگیری تۆڕی ${selectedNetwork.labelKu} دەکات`
                    )}
                  </p>
                )}
              </div>
            </div>

            {/* Amount */}
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

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    {t('المبلغ (USDT)', 'Amount (USDT)', 'بڕی (USDT)')} *
                  </Label>
                  <Input
                    type="number"
                    value={formData.amount}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    className={`h-14 text-xl font-bold !text-white ${isDark ? 'bg-slate-700 border-slate-600' : 'border-slate-300 !text-slate-900'}`}
                    placeholder="100"
                    min="10"
                    data-testid="amount-input"
                  />
                  {errors.amount && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.amount}</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-4">
                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                      {t('طريقة الدفع', 'Payment Method', 'شێوازى پارەدان')} *
                    </Label>
                    <span className="text-red-500 text-sm font-bold">
                      {t('حدد كيف تدفع لنا', 'Select how you pay us', 'چۆنێتی پارەدانەکەمان بۆ دیاری بکە')}
                    </span>
                  </div>
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
                          className={`p-4 rounded-xl border-2 text-center transition-all relative overflow-hidden ${formData.paymentMethod === m.value
                            ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                            : hoveredMethod === m.value
                              ? 'border-emerald-400/50'
                              : isDark ? 'border-slate-600' : 'border-slate-200'
                            }`}
                        >
                          <AnimatePresence>
                            {formData.paymentMethod === m.value && (
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                className="absolute top-2 right-2 z-10"
                              >
                                <CheckCircle className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
                              </motion.div>
                            )}
                          </AnimatePresence>

                          <span className={`font-bold block text-sm relative z-0 ${formData.paymentMethod === m.value
                            ? 'text-emerald-600'
                            : isDark ? 'text-white' : 'text-slate-900'
                            }`}>
                            {t(m.labelAr, m.labelEn, m.labelKu)}
                          </span>

                          {formData.paymentMethod === m.value && (
                            <motion.div
                              layoutId="activeGlow"
                              className="absolute inset-0 bg-emerald-500/5"
                              initial={false}
                              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  {errors.paymentMethod && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.paymentMethod}</p>}
                </div>
              </div>

              {/* Summary */}
              {formData.amount && parseFloat(formData.amount) >= 10 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`mt-6 p-6 rounded-2xl ${isDark ? 'bg-teal-900/20 border border-teal-700/50' : 'bg-teal-50 border border-teal-200'}`}
                >
                  <h4 className={`font-bold mb-4 ${isDark ? 'text-teal-400' : 'text-teal-800'}`}>
                    {t('ملخص الطلب', 'Order Summary', 'پوختەی داواکاری')}
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>{t('المبلغ USDT', 'USDT Amount', 'بڕی USDT')}</span>
                      <span dir="ltr" className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{formData.amount} USDT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>{t('سعر الصرف', 'Exchange Rate', 'نرخی ئاڵوگۆڕ')}</span>
                      <span dir="ltr" className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>1 USDT = {usdtToIQD.toLocaleString()} IQD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>{t('المقابل بالدينار', 'Amount in IQD', 'بڕ بە دینار')}</span>
                      <span dir="ltr" className={`font-semibold ${isDark ? 'text-white' : ''}`}>{calculateIQD().toLocaleString()} IQD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>{t(`رسوم (${serviceFeePercent}%)`, `Fee (${serviceFeePercent}%)`, `رسووم (${serviceFeePercent}%)`)}</span>
                      <span dir="ltr" className="font-semibold text-amber-500">{calculateFee().toLocaleString()} IQD</span>
                    </div>
                    <div className={`border-t pt-3 mt-3 ${isDark ? 'border-teal-700/50' : 'border-teal-200'}`}>
                      <div className="flex justify-between items-center">
                        <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('الإجمالي للدفع', 'Total to Pay', 'تێکڕای پارەدان')}</span>
                        <span dir="ltr" className="font-bold text-2xl text-teal-500">{calculateTotal().toLocaleString()} IQD</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Warning */}
            <div className={`rounded-2xl p-4 mb-6 ${isDark ? 'bg-amber-900/20 border border-amber-700/50' : 'bg-amber-50 border border-amber-200'}`}>
              <p className={`text-sm ${isDark ? 'text-amber-400' : 'text-amber-800'}`}>
                ⚠️ {t(
                  'تأكد من صحة عنوان المحفظة والشبكة. إرسال USDT إلى عنوان خاطئ قد يؤدي إلى فقدان الأموال بشكل دائم.',
                  'Verify wallet address and network. Sending USDT to wrong address may result in permanent loss of funds.',
                  'دڵنیابەرەوە لە دروستی ناونیشانی وێڵێت و تۆڕەکە. ناردنی USDT بۆ ناونیشانێکی هەڵە دەبێتە هۆی لەدەستدانی پارەکانت بە هەمیشەیی.'
                )}
              </p>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              data-testid="submit-usdt-recharge"
              className="w-full py-5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t('جارٍ التسجيل...', 'Submitting...', 'تۆمارکردن...')}
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  {t('تأكيد طلب الشحن', 'Confirm Recharge Request', 'دڵنیابوونەوە لە داواکاری شحن')}
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

export default USDTRecharge;
