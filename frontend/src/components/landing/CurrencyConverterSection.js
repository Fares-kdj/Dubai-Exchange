import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { ArrowRightLeft, TrendingUp, RefreshCw, Sparkles } from 'lucide-react';
import ReactCountryFlag from 'react-country-flag';
import axios from 'axios';

const API = process.env.REACT_APP_BACKEND_URL;

const currencies = [
  { code: 'USD', name: 'دولار أمريكي', nameEn: 'US Dollar', nameKu: 'دۆلاری ئەمریکی', countryCode: 'US' },
  { code: 'IQD', name: 'دينار عراقي', nameEn: 'Iraqi Dinar', nameKu: 'دینار عێراقی', countryCode: 'IQ' },
  { code: 'EUR', name: 'يورو', nameEn: 'Euro', nameKu: 'یۆرۆ', countryCode: 'EU' },
  { code: 'GBP', name: 'جنيه إسترليني', nameEn: 'British Pound', nameKu: 'پاوندی بەریتانی', countryCode: 'GB' },
  { code: 'TRY', name: 'ليرة تركية', nameEn: 'Turkish Lira', nameKu: 'لیرەی تورکی', countryCode: 'TR' },
  { code: 'AED', name: 'درهم إماراتي', nameEn: 'UAE Dirham', nameKu: 'درهمی ئیماراتی', countryCode: 'AE' },
  { code: 'SAR', name: 'ريال سعودي', nameEn: 'Saudi Riyal', nameKu: 'ڕیالی سعودی', countryCode: 'SA' }
];

export const CurrencyConverterSection = () => {
  const { currentLanguage } = useLanguage();
  const { isDark } = useTheme();
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('IQD');
  const [amount, setAmount] = useState('100');
  const [result, setResult] = useState('150,000');
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date().toISOString());
  const [showSparkle, setShowSparkle] = useState(false);
  const inputRef = useRef(null);

  const isArabic = currentLanguage === 'ar';
  const isKurdish = currentLanguage === 'ku';

  const text = {
    ar: {
      title: 'محول العملات',
      subtitle: 'احسب قيمة عملتك بدقة وسرعة',
      from: 'من',
      to: 'إلى',
      convert: 'تحويل',
      converting: 'جارٍ التحويل...',
      lastUpdate: 'آخر تحديث',
      note: 'الأسعار استرشادية وقابلة للتغيير حسب السوق'
    },
    en: {
      title: 'Currency Converter',
      subtitle: 'Calculate your currency value accurately and quickly',
      from: 'From',
      to: 'To',
      convert: 'Convert',
      converting: 'Converting...',
      lastUpdate: 'Last update',
      note: 'Rates are indicative and subject to market changes'
    },
    ku: {
      title: 'گۆڕینەوەی دراو',
      subtitle: 'بەهای دراوەکەت بە وردی و خێرایی حیساب بکە',
      from: 'لە',
      to: 'بۆ',
      convert: 'گۆڕین',
      converting: 'گۆڕین...',
      lastUpdate: 'دوایین نوێکردنەوە',
      note: 'نرخەکان ڕێنوێنن و دەگۆڕدرێن بەپێی بازاڕ'
    }
  };

  const t = text[currentLanguage] || text.ar;

  const getCurrencyName = (currency) => {
    if (isKurdish) return currency.nameKu;
    if (isArabic) return currency.name;
    return currency.nameEn;
  };

  const handleConvert = async (from = fromCurrency, to = toCurrency) => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    setLoading(true);
    setShowSparkle(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      const response = await axios.post(`${API}/api/convert`, null, {
        params: { from_currency: from, to_currency: to, amount: parseFloat(amount) }
      });
      setResult(response.data.result.toLocaleString());
      setLastUpdated(response.data.last_updated);
    } catch (error) {
      const fallbackRates = {
        'USD_IQD': 1500, 'IQD_USD': 0.00067,
        'EUR_IQD': 1620, 'IQD_EUR': 0.00062,
        'GBP_IQD': 1890, 'IQD_GBP': 0.00053,
        'USD_EUR': 0.92, 'EUR_USD': 1.08,
        'TRY_IQD': 45, 'IQD_TRY': 0.022,
        'AED_IQD': 408, 'SAR_IQD': 400
      };
      const rateKey = `${from}_${to}`;
      const rate = fallbackRates[rateKey] || 1;
      const calculatedResult = parseFloat(amount) * rate;
      setResult(calculatedResult.toLocaleString());
    } finally {
      setLoading(false);
      setTimeout(() => setShowSparkle(false), 500);
    }
  };

  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      const timer = setTimeout(() => handleConvert(fromCurrency, toCurrency), 300);
      return () => clearTimeout(timer);
    }
  }, [fromCurrency, toCurrency, amount]);

  const swapCurrencies = () => {
    const newFrom = toCurrency;
    const newTo = fromCurrency;
    setFromCurrency(newFrom);
    setToCurrency(newTo);
  };

  return (
    <section className={`py-20 md:py-32 relative overflow-hidden transition-colors duration-500 ${
      isDark 
        ? 'bg-gradient-to-b from-slate-800 via-slate-900 to-slate-800'
        : 'bg-gradient-to-b from-slate-50 via-white to-slate-50'
    }`} id="converter">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          className={`absolute top-20 right-10 w-64 h-64 rounded-full blur-3xl ${isDark ? 'bg-[#D4AF37]/10' : 'bg-[#D4AF37]/20'}`}
          animate={{ scale: [1, 1.2, 1], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className={`absolute bottom-20 left-10 w-80 h-80 rounded-full blur-3xl ${isDark ? 'bg-blue-500/10' : 'bg-blue-500/15'}`}
          animate={{ scale: [1, 1.3, 1], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ background: isDark ? 'rgba(212,175,55,0.2)' : 'rgba(212,175,55,0.1)' }}
          >
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span className={`text-sm font-medium ${isDark ? 'text-[#FCD34D]' : 'text-[#B8860B]'}`}>
              {t.title}
            </span>
          </motion.div>
          
          <h2 className={`text-3xl sm:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {t.title}
          </h2>
          <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {t.subtitle}
          </p>
        </motion.div>

        {/* Converter Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className={`relative backdrop-blur-2xl rounded-3xl p-8 md:p-10 shadow-2xl overflow-hidden ${
            isDark 
              ? 'bg-slate-800/70 border border-slate-700/60'
              : 'bg-white/80 border border-slate-200/60'
          }`}>
            {/* Sparkle Effect */}
            <AnimatePresence>
              {showSparkle && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 pointer-events-none"
                >
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-[#D4AF37] rounded-full"
                      initial={{ 
                        x: '50%', 
                        y: '50%',
                        scale: 0 
                      }}
                      animate={{ 
                        x: `${Math.random() * 100}%`, 
                        y: `${Math.random() * 100}%`,
                        scale: [0, 1, 0]
                      }}
                      transition={{ duration: 1, delay: i * 0.05 }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative z-10">
              {/* Currency Inputs */}
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 mb-8">
                {/* From Currency */}
                <motion.div 
                  className="space-y-3"
                  whileHover={{ scale: 1.01 }}
                >
                  <label className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {t.from}
                  </label>
                  <div className={`rounded-2xl p-5 border-2 transition-all ${
                    isDark 
                      ? 'bg-slate-700 border-slate-600 hover:border-[#D4AF37]/50'
                      : 'bg-white border-slate-200 hover:border-[#D4AF37]/50'
                  }`}>
                    <div className="flex items-center gap-3 mb-4">
                      <motion.div
                        key={fromCurrency}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", duration: 0.5 }}
                      >
                        <ReactCountryFlag
                          countryCode={currencies.find(c => c.code === fromCurrency)?.countryCode || 'US'}
                          svg
                          style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                        />
                      </motion.div>
                      <select 
                        value={fromCurrency}
                        onChange={(e) => setFromCurrency(e.target.value)}
                        className={`flex-1 bg-transparent font-medium text-lg border-0 outline-none ${isDark ? 'text-white' : 'text-slate-900'}`}
                      >
                        {currencies.map((c) => (
                          <option key={c.code} value={c.code} className="bg-slate-800 text-white">
                            {c.code} - {getCurrencyName(c)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <input
                      ref={inputRef}
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className={`w-full bg-transparent text-3xl font-bold border-0 outline-none ${isDark ? 'text-white' : 'text-slate-900'}`}
                      placeholder="0.00"
                    />
                  </div>
                </motion.div>

                {/* Swap Button */}
                <div className="flex items-center justify-center">
                  <motion.button
                    onClick={swapCurrencies}
                    whileHover={{ scale: 1.15, rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-4 bg-gradient-to-br from-[#D4AF37] to-[#FCD34D] rounded-full shadow-xl hover:shadow-2xl transition-shadow"
                  >
                    <ArrowRightLeft className="w-6 h-6 text-white" />
                  </motion.button>
                </div>

                {/* To Currency */}
                <motion.div 
                  className="space-y-3"
                  whileHover={{ scale: 1.01 }}
                >
                  <label className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {t.to}
                  </label>
                  <div className={`rounded-2xl p-5 border-2 transition-all ${
                    isDark 
                      ? 'bg-gradient-to-br from-slate-700 to-slate-800 border-slate-600'
                      : 'bg-gradient-to-br from-slate-50 to-white border-slate-200'
                  }`}>
                    <div className="flex items-center gap-3 mb-4">
                      <motion.div
                        key={toCurrency}
                        initial={{ scale: 0, rotate: 180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", duration: 0.5 }}
                      >
                        <ReactCountryFlag
                          countryCode={currencies.find(c => c.code === toCurrency)?.countryCode || 'IQ'}
                          svg
                          style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                        />
                      </motion.div>
                      <select 
                        value={toCurrency}
                        onChange={(e) => setToCurrency(e.target.value)}
                        className={`flex-1 bg-transparent font-medium text-lg border-0 outline-none ${isDark ? 'text-white' : 'text-slate-900'}`}
                      >
                        {currencies.map((c) => (
                          <option key={c.code} value={c.code} className="bg-slate-800 text-white">
                            {c.code} - {getCurrencyName(c)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={result}
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.9 }}
                        className="text-3xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#FCD34D] bg-clip-text text-transparent"
                      >
                        {result}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>

              {/* Convert Button */}
              <motion.button
                onClick={() => handleConvert()}
                disabled={loading}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-5 font-bold rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 ${
                  isDark 
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#FCD34D] text-slate-900'
                    : 'bg-gradient-to-r from-slate-900 to-slate-700 text-white'
                }`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    {t.converting}
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-5 h-5" />
                    {t.convert}
                  </>
                )}
              </motion.button>

              {/* Last Update */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`mt-6 text-center text-xs flex items-center justify-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
              >
                <RefreshCw className="w-3 h-3" />
                {t.lastUpdate}: {new Date(lastUpdated).toLocaleString(isArabic ? 'ar-IQ' : isKurdish ? 'ku' : 'en-US')}
              </motion.div>
            </div>
          </div>

          {/* Note */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className={`mt-6 text-center text-sm rounded-xl p-4 ${
              isDark ? 'bg-blue-900/30 border border-blue-800 text-blue-300' : 'bg-blue-50 border border-blue-100 text-slate-600'
            }`}
          >
            💡 {t.note}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CurrencyConverterSection;
