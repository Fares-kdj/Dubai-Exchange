import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { ArrowDownUp, RefreshCw, TrendingUp, TrendingDown, Sparkles, Coins, ChevronDown } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export const CurrencyConverterSection = () => {
  const { currentLanguage } = useLanguage();
  const { isDark } = useTheme();
  const isArabic = currentLanguage === 'ar';
  const isKurdish = currentLanguage === 'ku';
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('IQD');
  const [amount, setAmount] = useState('1');
  const [result, setResult] = useState(null);
  const [source, setSource] = useState('manual');
  const [fromDropdownOpen, setFromDropdownOpen] = useState(false);
  const [toDropdownOpen, setToDropdownOpen] = useState(false);

  const text = {
    ar: {
      badge: 'أسعار الصرف الحية',
      title: 'محول العملات',
      subtitle: 'احسب سعر الصرف بدقة عالية مع أسعار محدثة لحظياً',
      from: 'من',
      to: 'إلى',
      amount: 'المبلغ',
      result: 'تحصل على',
      swap: 'تبديل',
      rate: 'سعر الصرف',
      iqd: 'دينار عراقي',
      lastUpdate: 'آخر تحديث',
      live: 'أسعار حية',
      manual: 'أسعار محدثة',
      buyRate: 'سعر الشراء',
      sellRate: 'سعر البيع',
      popularRates: 'العملات الشائعة'
    },
    en: {
      badge: 'Live Exchange Rates',
      title: 'Currency Converter',
      subtitle: 'Calculate exchange rates with precision using real-time updates',
      from: 'From',
      to: 'To',
      amount: 'Amount',
      result: 'You Get',
      swap: 'Swap',
      rate: 'Exchange Rate',
      iqd: 'Iraqi Dinar',
      lastUpdate: 'Last Update',
      live: 'Live Rates',
      manual: 'Updated Rates',
      buyRate: 'Buy Rate',
      sellRate: 'Sell Rate',
      popularRates: 'Popular Currencies'
    },
    ku: {
      badge: 'نرخی ئاڵوگۆڕی زیندوو',
      title: 'گۆڕینەوەی دراو',
      subtitle: 'نرخی ئاڵوگۆڕ بژمێرە بە وردی بەرز لەگەڵ نوێکردنەوەی کاتی',
      from: 'لە',
      to: 'بۆ',
      amount: 'بڕ',
      result: 'وەردەگریت',
      swap: 'ئاڵوگۆڕ',
      rate: 'نرخی ئاڵوگۆڕ',
      iqd: 'دیناری عێراقی',
      lastUpdate: 'کۆتا نوێکردنەوە',
      live: 'نرخە زیندووەکان',
      manual: 'نرخە نوێکراوەکان',
      buyRate: 'نرخی کڕین',
      sellRate: 'نرخی فرۆشتن',
      popularRates: 'دراوە باوەکان'
    }
  };

  const t = text[currentLanguage] || text.ar;

  useEffect(() => {
    fetchRates();
  }, []);

  useEffect(() => {
    calculateResult();
  }, [amount, fromCurrency, toCurrency, rates]);

  const fetchRates = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/rates?active_only=true`);
      const data = await response.json();
      setRates(data || []);
      
      const hasLiveSync = data.some(r => r.updated_by === 'Live Sync');
      setSource(hasLiveSync ? 'live' : 'manual');
    } catch (error) {
      console.error('Failed to fetch rates:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateResult = () => {
    if (!amount || isNaN(parseFloat(amount))) {
      setResult(null);
      return;
    }

    const numAmount = parseFloat(amount);

    if (fromCurrency === 'IQD' && toCurrency !== 'IQD') {
      const toRate = rates.find(r => r.currency_code === toCurrency);
      if (toRate) {
        setResult((numAmount / toRate.sell_rate).toFixed(2));
      }
    } else if (fromCurrency !== 'IQD' && toCurrency === 'IQD') {
      const fromRate = rates.find(r => r.currency_code === fromCurrency);
      if (fromRate) {
        // Convert to IQD using selling price
        setResult((numAmount * fromRate.sell_rate).toFixed(2));
      }
    } else if (fromCurrency !== 'IQD' && toCurrency !== 'IQD') {
      const fromRate = rates.find(r => r.currency_code === fromCurrency);
      const toRate = rates.find(r => r.currency_code === toCurrency);
      if (fromRate && toRate) {
        // 1. Convert initial amount to IQD using FROM currency's selling rate
        const iqd = numAmount * fromRate.sell_rate;
        // 2. Convert IQD to target currency using TO currency's selling rate
        setResult((iqd / toRate.sell_rate).toFixed(2));
      }
    } else {
      setResult(numAmount.toFixed(2));
    }
  };

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const getCurrencyName = (code) => {
    if (code === 'IQD') return t.iqd;
    const rate = rates.find(r => r.currency_code === code);
    if (!rate) return code;
    return isKurdish ? (rate.currency_name_ku || rate.currency_name_ar)
      : isArabic ? rate.currency_name_ar
        : rate.currency_name_en;
  };

  const getLocalizedCurrency = (code) => {
    const currencyMappings = {
      'USD': { ar: 'دولار', en: 'USD', ku: 'دۆلار' },
      'IQD': { ar: 'د.ع', en: 'IQD', ku: 'د.ع' },
      'EUR': { ar: 'يورو', en: 'EUR', ku: 'يۆرۆ' },
      'TRY': { ar: 'ليرة', en: 'TRY', ku: 'لیرە' },
      'GBP': { ar: 'جنيه', en: 'GBP', ku: 'پاوەند' },
      'AED': { ar: 'درهم', en: 'AED', ku: 'درهەم' },
      'SAR': { ar: 'ريال', en: 'SAR', ku: 'ڕیاڵ' },
      'JOD': { ar: 'دينار', en: 'JOD', ku: 'دینار' },
      'LBP': { ar: 'ليرة', en: 'LBP', ku: 'لیرە' }
    };

    const mapping = currencyMappings[code];
    if (mapping) {
      if (isKurdish) return mapping.ku || mapping.en;
      if (isArabic) return mapping.ar;
      return mapping.en;
    }
    return code;
  };

  const getCurrencyFlag = (code) => {
    const codeMap = {
      'USD': 'us',
      'EUR': 'eu',
      'GBP': 'gb',
      'TRY': 'tr',
      'AED': 'ae',
      'SAR': 'sa',
      'JOD': 'jo',
      'LBP': 'lb',
      'KWD': 'kw',
      'BHD': 'bh',
      'QAR': 'qa',
      'OMR': 'om',
      'EGP': 'eg',
      'IRR': 'ir',
      'IQD': 'iq'
    };
    if (codeMap[code]) return codeMap[code];
    const rate = rates.find(r => r.currency_code === code);
    return rate?.flag?.toLowerCase() || code?.toLowerCase()?.substring(0, 2) || 'un';
  };

  const allCurrencies = [
    { code: 'IQD', name: t.iqd, flag: 'iq' },
    ...rates.map(r => ({
      code: r.currency_code,
      name: isKurdish ? (r.currency_name_ku || r.currency_name_ar) : isArabic ? r.currency_name_ar : r.currency_name_en,
      flag: getCurrencyFlag(r.currency_code)
    }))
  ];

  // Custom Currency Dropdown Component
  const CurrencyDropdown = ({ value, onChange, label, isOpen, setIsOpen, testId }) => {
    const selected = allCurrencies.find(c => c.code === value) || allCurrencies[0];

    return (
      <div className="relative">
        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          {label}
        </label>
        <motion.button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full px-4 py-4 rounded-2xl border-2 flex items-center justify-between gap-3 transition-all ${isDark
            ? 'bg-slate-800/80 border-slate-700 hover:border-[#D4AF37]/50 text-white'
            : 'bg-white border-slate-200 hover:border-[#D4AF37]/50 text-slate-900 shadow-sm'
            } ${isOpen ? (isDark ? 'border-[#D4AF37]' : 'border-[#D4AF37]') : ''}`}
          data-testid={testId}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-8 flex items-center justify-center bg-slate-100 rounded overflow-hidden border border-slate-200">
              <img
                src={`https://flagcdn.com/w80/${selected.flag?.toLowerCase()}.png`}
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = 'https://flagcdn.com/w80/un.png'; }}
              />
            </div>
            <div className={isArabic || isKurdish ? "text-right" : "text-left"}>
              <div className="font-bold text-lg">{selected.code}</div>
              <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{selected.name}</div>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`absolute z-50 w-full mt-2 rounded-2xl border-2 shadow-2xl overflow-hidden max-h-64 overflow-y-auto ${isDark
                ? 'bg-slate-800 border-slate-700'
                : 'bg-white border-slate-200'
                }`}
            >
              {allCurrencies.map((currency, index) => (
                <motion.button
                  key={currency.code}
                  type="button"
                  onClick={() => {
                    onChange(currency.code);
                    setIsOpen(false);
                  }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  whileHover={{ backgroundColor: isDark ? 'rgba(212, 175, 55, 0.1)' : 'rgba(212, 175, 55, 0.05)' }}
                  className={`w-full px-4 py-3 flex items-center gap-3 transition-colors ${value === currency.code
                    ? (isDark ? 'bg-[#D4AF37]/20' : 'bg-[#D4AF37]/10')
                    : ''
                    }`}
                >
                  <div className="w-8 h-6 flex items-center justify-center bg-slate-100 rounded overflow-hidden border border-slate-200">
                    <img
                      src={`https://flagcdn.com/w40/${currency.flag?.toLowerCase()}.png`}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = 'https://flagcdn.com/w40/un.png'; }}
                    />
                  </div>
                  <div className={`flex-1 ${isArabic || isKurdish ? "text-right" : "text-left"}`}>
                    <div className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{currency.code}</div>
                    <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{currency.name}</div>
                  </div>
                  {value === currency.code && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 rounded-full bg-[#D4AF37]"
                    />
                  )}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <section
      ref={sectionRef}
      className={`relative py-24 md:py-32 overflow-hidden transition-colors duration-500 ${isDark
        ? 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900'
        : 'bg-gradient-to-b from-amber-50/30 via-white to-amber-50/30'
        }`}
      id="converter"
    >
      {/* Premium Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Gradient Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className={`absolute top-20 right-1/4 w-96 h-96 rounded-full blur-3xl ${isDark ? 'bg-[#D4AF37]/20' : 'bg-[#D4AF37]/30'
            }`}
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className={`absolute bottom-20 left-1/4 w-80 h-80 rounded-full blur-3xl ${isDark ? 'bg-blue-500/15' : 'bg-blue-400/20'
            }`}
        />

        {/* Grid Pattern */}
        <div className={`absolute inset-0 ${isDark ? 'opacity-5' : 'opacity-10'}`}
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${isDark ? '#D4AF37' : '#B8860B'} 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
            className={`inline-flex items-center gap-2 px-5 py-2.5 mb-6 rounded-full border ${isDark
              ? 'bg-[#D4AF37]/10 border-[#D4AF37]/30'
              : 'bg-gradient-to-r from-[#D4AF37]/10 to-amber-100/50 border-[#D4AF37]/20'
              }`}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            </motion.div>
            <span className={`text-sm font-semibold ${isDark ? 'text-[#D4AF37]' : 'text-[#B8860B]'}`}>
              {t.badge}
            </span>
            <div className={`w-2 h-2 rounded-full ${source === 'live' ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`} />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}
          >
            {t.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
          >
            {t.subtitle}
          </motion.p>
        </motion.div>

        {/* Premium Converter Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-3xl mx-auto"
        >
          <div className={`relative backdrop-blur-xl rounded-[2rem] p-8 md:p-10 ${isDark
            ? 'bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/50 shadow-2xl shadow-[#D4AF37]/5'
            : 'bg-white/90 border border-slate-200 shadow-2xl shadow-slate-200/50'
            }`}>
            {/* Card Inner Glow */}
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 rounded-full ${isDark ? 'bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent' : 'bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent'
              }`} />

            {/* Refresh Button */}
            <div className="flex justify-end mb-6">
              <motion.button
                onClick={fetchRates}
                disabled={loading}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`p-3 rounded-xl transition-all ${isDark
                  ? 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-[#D4AF37]'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-[#B8860B]'
                  }`}
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </motion.button>
            </div>

            <div className="space-y-8">
              {/* Amount Input - Premium Style */}
              <div>
                <label className={`block text-sm font-medium mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {t.amount}
                </label>
                <div className="relative">
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    className={`relative rounded-2xl overflow-hidden ${isDark ? 'bg-slate-800/80' : 'bg-slate-50'
                      }`}
                  >
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className={`w-full ${isArabic || isKurdish ? 'pl-28 pr-6' : 'pr-28 pl-6'} py-5 text-2xl font-bold transition-all outline-none ${isDark
                        ? 'bg-transparent text-white placeholder-slate-500'
                        : 'bg-transparent text-slate-900 placeholder-slate-400'
                        }`}
                      placeholder="1"
                      data-testid="converter-amount"
                    />
                    <div className={`absolute ${isArabic || isKurdish ? 'left-6' : 'right-6'} top-1/2 -translate-y-1/2 flex items-center gap-2 ${isDark ? 'text-slate-500' : 'text-slate-400'
                      }`}>
                      <div className="w-8 h-6 flex items-center justify-center bg-slate-100 rounded overflow-hidden border border-slate-200">
                        <img
                          src={`https://flagcdn.com/w40/${getCurrencyFlag(fromCurrency)}.png`}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = 'https://flagcdn.com/w40/un.png'; }}
                        />
                      </div>
                      <span className="text-lg font-semibold">{getLocalizedCurrency(fromCurrency)}</span>
                    </div>
                  </motion.div>
                  {/* Border Glow Effect */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    animate={{ boxShadow: ['0 0 0 2px transparent', '0 0 0 2px rgba(212, 175, 55, 0.3)', '0 0 0 2px transparent'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </div>

              {/* Currency Selection Row */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-6 items-end">
                {/* From Currency */}
                <CurrencyDropdown
                  value={fromCurrency}
                  onChange={setFromCurrency}
                  label={t.from}
                  isOpen={fromDropdownOpen}
                  setIsOpen={(val) => {
                    setFromDropdownOpen(val);
                    if (val) setToDropdownOpen(false);
                  }}
                  testId="converter-from"
                />

                {/* Animated Swap Button */}
                <motion.button
                  onClick={handleSwap}
                  whileHover={{
                    scale: 1.15,
                    rotate: 180,
                    boxShadow: isDark ? '0 0 30px rgba(212, 175, 55, 0.4)' : '0 0 30px rgba(212, 175, 55, 0.3)'
                  }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-0 ${isDark
                    ? 'bg-gradient-to-br from-[#D4AF37] to-[#B8860B] text-slate-900 shadow-lg shadow-[#D4AF37]/30'
                    : 'bg-gradient-to-br from-[#D4AF37] to-[#B8860B] text-white shadow-lg shadow-[#D4AF37]/30'
                    }`}
                  data-testid="converter-swap"
                >
                  <ArrowDownUp className="w-6 h-6" />
                </motion.button>

                {/* To Currency */}
                <CurrencyDropdown
                  value={toCurrency}
                  onChange={setToCurrency}
                  label={t.to}
                  isOpen={toDropdownOpen}
                  setIsOpen={(val) => {
                    setToDropdownOpen(val);
                    if (val) setFromDropdownOpen(false);
                  }}
                  testId="converter-to"
                />
              </div>

              {/* Result Display - Premium Style */}
              <AnimatePresence>
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className={`relative p-8 rounded-2xl overflow-hidden ${isDark
                      ? 'bg-gradient-to-br from-[#D4AF37]/10 to-amber-900/20 border border-[#D4AF37]/20'
                      : 'bg-gradient-to-br from-[#D4AF37]/5 to-amber-50 border border-[#D4AF37]/20'
                      }`}
                  >
                    {/* Animated Background */}
                    <motion.div
                      animate={{
                        backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
                      }}
                      transition={{ duration: 10, repeat: Infinity }}
                      className="absolute inset-0 opacity-30"
                      style={{
                        background: `radial-gradient(circle at 30% 30%, ${isDark ? '#D4AF37' : '#FCD34D'}20 0%, transparent 50%)`
                      }}
                    />

                    <div className="relative z-10">
                      <div className={`text-sm font-medium mb-3 flex items-center gap-2 ${isDark ? 'text-[#D4AF37]' : 'text-[#B8860B]'}`}>
                        <Coins className="w-4 h-4" />
                        {t.result}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 flex items-center justify-center bg-slate-100 rounded-lg overflow-hidden border-2 border-slate-200 shadow-sm">
                          <img
                            src={`https://flagcdn.com/w80/${getCurrencyFlag(toCurrency)}.png`}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = 'https://flagcdn.com/w80/un.png'; }}
                          />
                        </div>
                        <div>
                          <motion.div
                            className={`text-4xl md:text-5xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}
                            data-testid="converter-result"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            key={result}
                          >
                            {parseFloat(result).toLocaleString()}
                            <span className={`text-2xl ${isDark ? 'text-slate-400' : 'text-slate-500'}`}> {getLocalizedCurrency(toCurrency)}</span>
                          </motion.div>
                          <div className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {parseFloat(amount).toLocaleString()} {getLocalizedCurrency(fromCurrency)} = {parseFloat(result).toLocaleString()} {getLocalizedCurrency(toCurrency)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Popular Rate Cards - Premium Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16"
        >
          <div className={`text-center mb-8 text-sm font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {t.popularRates}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {rates.slice(0, 6).map((rate, index) => (
              <motion.div
                key={rate.currency_code}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ delay: 0.1 * index, type: "spring" }}
                whileHover={{
                  y: -8,
                  scale: 1.05,
                  transition: { type: "spring", stiffness: 400 }
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setFromCurrency(rate.currency_code);
                  setToCurrency('IQD');
                }}
                className={`relative p-5 rounded-2xl border cursor-pointer group overflow-hidden ${isDark
                  ? 'bg-slate-800/50 border-slate-700/50 hover:border-[#D4AF37]/50'
                  : 'bg-white border-slate-200 hover:border-[#D4AF37]/50 shadow-sm hover:shadow-xl'
                  }`}
              >
                {/* Hover Glow */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isDark ? 'bg-[#D4AF37]/5' : 'bg-[#D4AF37]/5'
                  }`} />

                <div className="relative z-10 text-center">
                  <motion.div
                    className="w-12 h-9 flex items-center justify-center bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shadow-sm mx-auto mb-3"
                    whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={`https://flagcdn.com/w80/${getCurrencyFlag(rate.currency_code)}.png`}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = 'https://flagcdn.com/w80/un.png'; }}
                    />
                  </motion.div>
                  <div className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {rate.currency_code}
                  </div>
                  <div className={`text-sm font-semibold mt-1 ${isDark ? 'text-[#D4AF37]' : 'text-[#B8860B]'}`}>
                    {rate.buy_rate?.toLocaleString()} IQD
                  </div>
                  <div className={`flex items-center justify-center gap-1 mt-2 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'
                    }`}>
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span>{t.buyRate}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CurrencyConverterSection;
