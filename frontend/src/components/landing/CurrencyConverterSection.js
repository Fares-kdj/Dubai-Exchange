import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { ArrowDownUp, RefreshCw } from 'lucide-react';

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
  const [amount, setAmount] = useState('1000');
  const [result, setResult] = useState(null);
  const [source, setSource] = useState('manual');

  const text = {
    ar: {
      badge: 'محول العملات',
      title: 'احسب سعر الصرف',
      subtitle: 'أسعار صرف محدثة لجميع العملات',
      from: 'من',
      to: 'إلى',
      amount: 'المبلغ',
      result: 'النتيجة',
      swap: 'تبديل',
      rate: 'سعر الصرف',
      iqd: 'دينار عراقي',
      lastUpdate: 'آخر تحديث',
      live: 'أسعار حية',
      manual: 'أسعار محدثة يدوياً'
    },
    en: {
      badge: 'Currency Converter',
      title: 'Calculate Exchange Rate',
      subtitle: 'Updated exchange rates for all currencies',
      from: 'From',
      to: 'To',
      amount: 'Amount',
      result: 'Result',
      swap: 'Swap',
      rate: 'Exchange Rate',
      iqd: 'Iraqi Dinar',
      lastUpdate: 'Last Update',
      live: 'Live Rates',
      manual: 'Manually Updated'
    },
    ku: {
      badge: 'گۆڕینەوەی دراو',
      title: 'نرخی ئاڵوگۆڕ بژمێرە',
      subtitle: 'نرخی ئاڵوگۆڕی نوێکراوە بۆ هەموو دراوەکان',
      from: 'لە',
      to: 'بۆ',
      amount: 'بڕ',
      result: 'ئەنجام',
      swap: 'ئاڵوگۆڕ',
      rate: 'نرخی ئاڵوگۆڕ',
      iqd: 'دیناری عێراقی',
      lastUpdate: 'کۆتا نوێکردنەوە',
      live: 'نرخە زیندووەکان',
      manual: 'نوێکراوەتەوە بەدەستی'
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
      const response = await fetch(`${API_URL}/api/rates/live/fetch`);
      const data = await response.json();
      setRates(data.rates || []);
      setSource(data.source || 'manual');
    } catch (error) {
      console.error('Failed to fetch rates:', error);
      // Fallback to stored rates
      try {
        const fallback = await fetch(`${API_URL}/api/rates`);
        const fallbackData = await fallback.json();
        setRates(fallbackData || []);
        setSource('manual');
      } catch (e) {
        console.error('Fallback failed:', e);
      }
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
      // Converting from IQD to foreign currency
      const toRate = rates.find(r => r.currency_code === toCurrency);
      if (toRate) {
        // User buys foreign currency with IQD - use sell_rate
        setResult((numAmount / toRate.sell_rate).toFixed(2));
      }
    } else if (fromCurrency !== 'IQD' && toCurrency === 'IQD') {
      // Converting from foreign currency to IQD
      const fromRate = rates.find(r => r.currency_code === fromCurrency);
      if (fromRate) {
        // User sells foreign currency for IQD - use buy_rate
        setResult((numAmount * fromRate.buy_rate).toFixed(0));
      }
    } else if (fromCurrency !== 'IQD' && toCurrency !== 'IQD') {
      // Cross currency conversion via IQD
      const fromRate = rates.find(r => r.currency_code === fromCurrency);
      const toRate = rates.find(r => r.currency_code === toCurrency);
      if (fromRate && toRate) {
        const iqd = numAmount * fromRate.buy_rate;
        setResult((iqd / toRate.sell_rate).toFixed(2));
      }
    } else {
      // Same currency
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

  const getCurrencyFlag = (code) => {
    if (code === 'IQD') return '🇮🇶';
    const rate = rates.find(r => r.currency_code === code);
    return rate?.flag || '💱';
  };

  const allCurrencies = [
    { code: 'IQD', name: t.iqd, flag: '🇮🇶' },
    ...rates.map(r => ({
      code: r.currency_code,
      name: isKurdish ? (r.currency_name_ku || r.currency_name_ar) : isArabic ? r.currency_name_ar : r.currency_name_en,
      flag: r.flag
    }))
  ];

  return (
    <section 
      ref={sectionRef}
      className={`relative py-24 md:py-32 overflow-hidden transition-colors duration-500 ${
        isDark 
          ? 'bg-gradient-to-b from-slate-800 via-slate-900 to-slate-800'
          : 'bg-gradient-to-b from-blue-50 via-white to-blue-50'
      }`}
      id="converter"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className={`absolute top-20 right-20 w-80 h-80 rounded-full blur-3xl ${isDark ? 'bg-[#D4AF37]/10' : 'bg-[#D4AF37]/20'}`} />
        <div className={`absolute bottom-20 left-20 w-80 h-80 rounded-full blur-3xl ${isDark ? 'bg-blue-500/10' : 'bg-blue-500/20'}`} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
            className={`inline-block px-4 py-2 mb-6 rounded-full text-sm font-medium ${
              isDark 
                ? 'bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#FCD34D]'
                : 'bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#B8860B]'
            }`}
          >
            {t.badge}
          </motion.span>
          
          <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {t.title}
          </h2>
          
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {t.subtitle}
          </p>
        </motion.div>

        {/* Converter Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <div className={`backdrop-blur-xl border rounded-3xl p-6 md:p-8 ${
            isDark 
              ? 'bg-white/5 border-white/10'
              : 'bg-white border-slate-200 shadow-xl'
          }`}>
            {/* Source Badge */}
            <div className="flex justify-between items-center mb-6">
              <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <div className={`w-2 h-2 rounded-full ${source === 'live' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <span>{source === 'live' ? t.live : t.manual}</span>
              </div>
              <button
                onClick={fetchRates}
                disabled={loading}
                className={`p-2 rounded-lg transition-colors ${
                  isDark ? 'hover:bg-white/10' : 'hover:bg-slate-100'
                }`}
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''} ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Amount Input */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {t.amount}
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border text-lg font-semibold transition-colors ${
                    isDark 
                      ? 'bg-white/5 border-white/20 text-white focus:border-[#D4AF37]'
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[#D4AF37]'
                  } outline-none`}
                  placeholder="1000"
                  data-testid="converter-amount"
                />
              </div>

              {/* Currency Selection */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-end">
                {/* From Currency */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {t.from}
                  </label>
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border transition-colors cursor-pointer ${
                      isDark 
                        ? 'bg-white/5 border-white/20 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    } outline-none`}
                    data-testid="converter-from"
                  >
                    {allCurrencies.map((c) => (
                      <option key={c.code} value={c.code} className="bg-slate-800 text-white">
                        {c.flag} {c.code} - {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Swap Button */}
                <motion.button
                  onClick={handleSwap}
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-0 md:mb-0 mx-auto ${
                    isDark 
                      ? 'bg-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/30'
                      : 'bg-[#D4AF37]/10 text-[#B8860B] hover:bg-[#D4AF37]/20'
                  }`}
                  data-testid="converter-swap"
                >
                  <ArrowDownUp className="w-5 h-5" />
                </motion.button>

                {/* To Currency */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {t.to}
                  </label>
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border transition-colors cursor-pointer ${
                      isDark 
                        ? 'bg-white/5 border-white/20 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    } outline-none`}
                    data-testid="converter-to"
                  >
                    {allCurrencies.map((c) => (
                      <option key={c.code} value={c.code} className="bg-slate-800 text-white">
                        {c.flag} {c.code} - {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Result */}
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-6 rounded-2xl ${
                    isDark ? 'bg-white/10' : 'bg-gradient-to-r from-[#D4AF37]/10 to-[#FCD34D]/10'
                  }`}
                >
                  <div className={`text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {t.result}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{getCurrencyFlag(toCurrency)}</span>
                    <div>
                      <div className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`} data-testid="converter-result">
                        {parseFloat(result).toLocaleString()} <span className="text-xl">{toCurrency}</span>
                      </div>
                      <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {parseFloat(amount).toLocaleString()} {fromCurrency} = {parseFloat(result).toLocaleString()} {toCurrency}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Rate Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          {rates.slice(0, 6).map((rate, index) => (
            <motion.div
              key={rate.currency_code}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 * index }}
              className={`p-4 rounded-2xl border text-center ${
                isDark 
                  ? 'bg-white/5 border-white/10 hover:bg-white/10'
                  : 'bg-white border-slate-200 hover:shadow-lg'
              } transition-all cursor-pointer`}
              onClick={() => {
                setFromCurrency(rate.currency_code);
                setToCurrency('IQD');
              }}
            >
              <div className="text-2xl mb-2">{rate.flag}</div>
              <div className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {rate.currency_code}
              </div>
              <div className={`text-sm ${isDark ? 'text-[#D4AF37]' : 'text-[#B8860B]'}`}>
                {rate.buy_rate.toLocaleString()} IQD
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CurrencyConverterSection;
